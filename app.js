/* Questionario "Il bucato nella tua quotidianità" – versione statica (GitHub Pages + Google Sheets) */
(function () {
  "use strict";
  var S = window.SURVEY;
  var CFG = window.SURVEY_CONFIG || {};
  var LS_PLAN = "indagineBucato.plan";
  var LS_DONE = "indagineBucato.done";
  var main = document.getElementById("main");

  // ---------- utilità ----------
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function rnd() {
    if (window.crypto && crypto.getRandomValues) return crypto.getRandomValues(new Uint8Array(1))[0];
    return Math.floor(Math.random() * 256);
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16);
    for (var i = 0; i < 16; i++) b[i] = rnd();
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join("");
    return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "className") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), v);
      else if (v === true) n.setAttribute(k, "");
      else n.setAttribute(k, v);
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }

  // ---------- ?reset per i test: azzera formula e "già risposto" ----------
  if (/[?&]reset\b/.test(location.search)) { lsDel(LS_PLAN); lsDel(LS_DONE); history.replaceState(null, "", location.pathname); }

  // ---------- stato ----------
  var plan = lsGet(LS_PLAN);
  if (plan !== "A" && plan !== "B") { plan = rnd() < 128 ? "A" : "B"; lsSet(LS_PLAN, plan); }
  var state = {
    step: -1,               // -1 = introduzione, 0..6 = sezioni
    answers: {},
    adult: false,
    responseId: uuid(),
    error: "",
    busy: false,
    finish: lsGet(LS_DONE) ? "already" : ""   // "sent" | "outside" | "already" | ""
  };

  // ---------- logica (identica all'originale) ----------
  function visible(q, a) {
    if (!q.condition) return true;
    if (q.condition.in) return q.condition.in.indexOf(a[q.condition.field]) >= 0;
    return q.condition.notIn.indexOf(a[q.condition.field]) < 0;
  }
  function badMoney(v, min, max) {
    return typeof v !== "number" || !isFinite(v) || (min === 0 ? v < 0 : v <= 0) || v > max || Math.abs(v * 100 - Math.round(v * 100)) > 1e-5;
  }
  function validate(l) {
    var t = {}, n = [];
    S.questions.forEach(function (r) {
      if (!visible(r, l)) return;
      if (r.type === "matrix") {
        r.rows.forEach(function (row) { r.options.indexOf(l[row.id]) >= 0 ? (t[row.id] = l[row.id]) : n.push(row.label); });
      } else if (r.type === "prices") {
        r.rows.forEach(function (row) { var v = l[row.id]; badMoney(v, 0, 99999) ? n.push(row.label) : (t[row.id] = v); });
        var p = r.rows.map(function (row) { return l[row.id]; });
        if (p.every(function (x) { return typeof x === "number"; }) && !(p[0] <= p[1] && p[1] <= p[2] && p[2] < p[3]))
          n.push("Controlla l'ordine dei quattro prezzi: l'ultimo deve essere superiore al precedente.");
      } else if (r.type === "multi") {
        var v = l[r.id];
        var ex = r.exclusive || [];
        if (!Array.isArray(v) || !v.length || v.some(function (x) { return r.options.indexOf(x) < 0; }) ||
            new Set(v).size !== v.length || (r.max && v.length > r.max) ||
            (v.length > 1 && v.some(function (x) { return ex.indexOf(x) >= 0; }))) n.push(r.text);
        else t[r.id] = v;
      } else if (r.type === "text") {
        var s = typeof l[r.id] === "string" ? l[r.id].trim() : "";
        if (s.length > r.maxLength || /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){8,}|https?:\/\//i.test(s))
          n.push("Nel commento non inserire contatti o collegamenti.");
        else if (s) t[r.id] = s;
      } else {
        var a = l[r.id];
        if (r.options && r.options.indexOf(a) >= 0) t[r.id] = a; else if (r.required) n.push(r.text);
        if (r.type === "moneyChoice" && a === "Posso indicare un importo massimo") {
          var m = l.delivery_fee_amount;
          badMoney(m, 0.01, 9999) ? n.push("Indica l'importo complessivo per ritiro e riconsegna.") : (t.delivery_fee_amount = m);
        }
      }
    });
    if (t.zone === "Fuori da queste zone") n.push("L'indagine riguarda Valsugana e Trento città.");
    return { answers: t, errors: n };
  }

  function setAnswer(id, v, rerender) {
    state.answers[id] = v;
    if (rerender !== false) render();
  }
  function toggleMulti(q, opt) {
    var cur = state.answers[q.id] || [];
    var ex = q.exclusive || [];
    var next = cur.indexOf(opt) >= 0 ? cur.filter(function (x) { return x !== opt; })
      : ex.indexOf(opt) >= 0 ? [opt]
      : cur.filter(function (x) { return ex.indexOf(x) < 0; }).concat([opt]);
    if (q.max && next.length > q.max) { render(); return; }  // limite raggiunto: non cambia nulla
    setAnswer(q.id, next);
  }
  function go(step) {
    state.step = step; state.error = "";
    render();
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); }
    setTimeout(function () { main.focus({ preventScroll: true }); }, 30);
  }

  // ---------- invio ----------
  function send(payload) {
    var body = JSON.stringify(payload);
    var url = CFG.endpoint;
    // text/plain = "richiesta semplice": niente preflight CORS verso Google Apps Script
    return fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: body, redirect: "follow" })
      .then(function (res) {
        return res.text().then(function (txt) {
          var data = null; try { data = JSON.parse(txt); } catch (e) {}
          if (data && data.ok) return data;
          if (data && data.error) throw new Error(data.error);
          if (!res.ok) throw new Error("Invio non riuscito (" + res.status + "). Riprova tra poco.");
          return { ok: true };
        });
      }, function () {
        // Risposta non leggibile (rete/CORS): nuovo tentativo "no-cors".
        // Il server ignora i doppioni grazie al codice responseId.
        return fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: body })
          .then(function () { return { ok: true, opaque: true }; }, function () {
            throw new Error("Invio non riuscito: controlla la connessione e riprova.");
          });
      });
  }

  function onSubmit(ev) {
    ev.preventDefault();
    state.error = "";
    var l = state.answers;
    if (l.zone === "Fuori da queste zone") { state.answers = {}; state.finish = "outside"; render(); window.scrollTo(0, 0); return; }
    if (state.step === 4 && l.price_ability === "Sì, posso fare una stima") {
      var p = [l.price_too_cheap, l.price_bargain, l.price_expensive, l.price_too_expensive];
      if (!(p[0] <= p[1] && p[1] <= p[2] && p[2] < p[3])) {
        state.error = "Controlla i quattro prezzi: devono crescere da «troppo basso» a «troppo caro». L'ultimo deve essere superiore al precedente. Se non sai valutarli, scegli «Non so valutare questi prezzi».";
        render(); return;
      }
    }
    if (state.step < S.sections.length - 1) { go(state.step + 1); return; }
    var r = validate(l);
    if (r.errors.length) { state.error = r.errors.join(" · "); render(); return; }
    if (!CFG.endpoint) {
      state.error = "Invio non disponibile: il questionario non è ancora collegato al foglio delle risposte (manca l'indirizzo in config.js). Le tue risposte non sono state salvate.";
      render(); return;
    }
    state.busy = true; render();
    var payload = {
      responseId: state.responseId,
      version: S.version,
      plan: plan,
      adult: state.adult,
      answers: r.answers,
      website: ""
    };
    window.__lastPayload = payload;
    send(payload).then(function () {
      state.busy = false; state.answers = {}; state.finish = "sent";
      lsSet(LS_DONE, new Date().toISOString());
      render(); window.scrollTo(0, 0);
    }, function (e) {
      state.busy = false; state.error = e.message || "Invio non riuscito"; render();
    });
  }

  // ---------- rendering ----------
  function optionsBlock(q, key, opts) {
    var isMulti = q.type === "multi";
    var sel = state.answers[key];
    return el("div", { className: q.type === "matrix" ? "scale" : "options" }, opts.map(function (o, i) {
      var checked = isMulti ? (sel || []).indexOf(o) >= 0 : sel === o;
      var req = q.required && (!isMulti || !(sel || []).length) && i === 0;
      return el("label", { className: "option " + (checked ? "selected" : "") }, [
        el("input", {
          type: isMulti ? "checkbox" : "radio", name: key, value: o, checked: checked, required: req,
          onchange: function () { isMulti ? toggleMulti(q, o) : setAnswer(key, o); }
        }),
        el("span", null, [o])
      ]);
    }));
  }
  function perKg(v) {
    return (Number(v) / 5).toLocaleString("it-IT", { style: "currency", currency: "EUR" }) + " al kg";
  }
  function numVal(v) { return v === "" ? null : Number(v); }

  function question(q) {
    var a = state.answers;
    var kids = [
      el("legend", null, [
        el("span", { className: "qnumber" }, [String(S.questions.indexOf(q) + 1)]),
        q.text,
        !q.required ? el("span", { className: "optional" }, ["Facoltativo"]) : null
      ]),
      q.help ? el("p", { className: "help" }, [q.help]) : null,
      q.max ? el("p", { className: "small" }, ["Scegli al massimo " + q.max + " risposte."]) : null
    ];
    if (["single", "multi", "moneyChoice"].indexOf(q.type) >= 0) kids.push(optionsBlock(q, q.id, q.options));
    if (q.type === "moneyChoice" && a[q.id] === "Posso indicare un importo massimo") {
      var inp = el("input", {
        type: "number", inputmode: "decimal", min: "0.01", max: "9999", step: "0.01", required: true,
        value: a.delivery_fee_amount == null ? "" : String(a.delivery_fee_amount),
        oninput: function (e) { setAnswer("delivery_fee_amount", numVal(e.target.value), false); }
      });
      kids.push(el("label", { className: "money" }, ["Importo totale (€)", inp]));
      if (state._focusMoney) { state._focusMoney = false; setTimeout(function () { inp.focus(); }, 0); }
    }
    if (q.type === "matrix") q.rows.forEach(function (row) {
      kids.push(el("div", { className: "matrixrow" }, [el("h3", null, [row.label]),
        optionsBlock({ type: "single", required: q.required, options: q.options }, row.id, q.options)]));
    });
    if (q.type === "prices") q.rows.forEach(function (row) {
      var small = el("small", null, [typeof a[row.id] === "number" && isFinite(a[row.id]) ? perKg(a[row.id]) : ""]);
      if (!(typeof a[row.id] === "number")) small.style.display = "none";
      kids.push(el("label", { className: "priceinput" }, [
        el("span", null, [row.label]),
        el("div", null, [
          el("input", {
            type: "number", inputmode: "decimal", min: "0", max: "99999", step: "0.01", required: true, name: row.id,
            value: a[row.id] == null ? "" : String(a[row.id]),
            oninput: function (e) {
              var v = numVal(e.target.value); setAnswer(row.id, v, false);
              if (typeof v === "number" && isFinite(v)) { small.textContent = perKg(v); small.style.display = ""; }
              else small.style.display = "none";
            }
          }),
          el("span", null, ["€ / 5 kg"])
        ]),
        small
      ]));
    });
    if (q.type === "text") {
      var counter = el("p", { className: "small" }, [String(a[q.id] || "").length + "/300 caratteri"]);
      var ta = el("textarea", { maxlength: "300", rows: "4", name: q.id,
        oninput: function (e) { setAnswer(q.id, e.target.value, false); counter.textContent = e.target.value.length + "/300 caratteri"; } });
      ta.value = String(a[q.id] || "");
      kids.push(ta, counter);
    }
    return el("fieldset", { className: "question", "data-q": q.id }, kids);
  }

  function finishScreen(kind) {
    var t = {
      sent: ["RISPOSTA REGISTRATA", "Il tuo punto di vista conta.", "Grazie. La risposta è stata salvata e sarà analizzata insieme alle altre. Non è una prenotazione e non riceverai messaggi commerciali."],
      outside: ["GRAZIE PER IL TUO TEMPO", "Questa ricerca riguarda un'altra zona.", "Non abbiamo salvato nessuna delle tue risposte."],
      already: ["HAI GIÀ RISPOSTO", "Grazie, abbiamo già la tua risposta.", "Da questo dispositivo il questionario risulta già compilato. Per l'indagine basta una risposta per nucleo familiare."],
      closed: ["RACCOLTA CONCLUSA", "Grazie per l'interesse.", "Al momento non raccogliamo altre risposte."]
    }[kind];
    return el("section", { className: "finish" }, [
      kind !== "closed" ? el("div", { className: "finishmark", "aria-hidden": "true" }, ["✓"]) : null,
      el("p", { className: "eyebrow" }, [t[0]]),
      el("h1", null, [t[1]]),
      el("p", null, [t[2]])
    ]);
  }

  function introScreen() {
    var frag = document.createDocumentFragment();
    var adult = el("input", { type: "checkbox", required: true, checked: state.adult,
      onchange: function (e) { state.adult = e.target.checked; } });
    frag.appendChild(el("section", { className: "introcopy" }, [
      el("p", { className: "eyebrow" }, ["UN'INDAGINE SUL BUCATO DI TUTTI I GIORNI"]),
      el("h1", { html: "E se il bucato<br>lo gestisse<br><em>qualcun altro?</em>" }),
      el("p", { className: "lead" }, ["Stiamo studiando un possibile servizio di lavanderia a domicilio, con prezzo al chilogrammo. Vorremmo capire se ti servirebbe davvero."]),
      el("div", { className: "introfacts" }, [el("span", null, ["Circa 5 minuti*"]), el("span", null, ["Nessun contatto richiesto"]), el("span", null, ["Anche un «no» è utile"])]),
      el("form", { onsubmit: function (e) { e.preventDefault(); go(0); } }, [
        el("label", { className: "check adult" }, [adult, el("span", null, ["Confermo di avere almeno 18 anni."])]),
        el("button", { className: "button start" }, ["Inizia il questionario ", el("span", { "aria-hidden": "true" }, ["→"])])
      ]),
      el("p", { className: "small" }, ["Partecipazione volontaria. Rispondi una sola volta. Salviamo solo gli invii completi; le risposte in corso restano in questa pagina fino alla sua chiusura. *Durata da verificare nel pilota."])
    ]));
    frag.appendChild(el("aside", { className: "introaside", html:
      '<div class="washer" aria-hidden="true"><div class="washercontrols"><i></i><i></i><b></b></div>' +
      '<div class="washerwindow"><div class="cloth c1"></div><div class="cloth c2"></div><div class="cloth c3"></div></div>' +
      '<div class="washerbase"></div></div><div class="asidenote"><span>01 / ASCOLTARE</span><p>Prima di aprire un servizio,<br>iniziamo dalle tue abitudini.</p></div>' }));
    var contact = CFG.contact ? " Per richieste al promotore: " + esc(CFG.contact) + "." : "";
    frag.appendChild(el("section", { className: "privacy", html:
      "<h2>Prima di cominciare</h2>" +
      "<p>Ricerca esplorativa promossa da Riccardo Morelli, rivolta ai privati della Valsugana e Trento città. Il servizio non è ancora attivo. Non chiediamo nome, email, telefono o indirizzo. Non inserire dati personali nel commento.</p>" +
      "<details><summary>Come vengono gestite le risposte</summary>" +
      "<p>Finalità: valutare bisogni, preferenze e percezioni di prezzo attraverso risultati statistici. Piattaforma: la pagina è pubblicata su GitHub Pages e le risposte sono salvate in un foglio Google del promotore. Il questionario non richiede accesso, non aggiunge analytics né cookie e non salva l'indirizzo IP nelle risposte. Sul dispositivo resta solo un'indicazione locale della formula di prezzo assegnata e dell'avvenuto invio, per evitare risposte doppie. I fornitori possono trattare dati tecnici di navigazione e sicurezza secondo le proprie informative: non promettiamo anonimato assoluto.</p>" +
      "<p>Ogni invio riceve un codice casuale, utile a evitare duplicazioni dovute a ritentativi. Si conservano la data di invio, le risposte e la formula assegnata. Le risposte sono accessibili solo al promotore. Nei risultati pubblici si useranno gruppi aggregati, accorpando quelli piccoli.</p>" +
      "<p>Puoi interrompere prima dell'invio. Dopo l'invio non possiamo riconoscere quale risposta ti appartiene." + contact + "</p>" +
      '<p><a href="https://docs.github.com/it/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">Privacy GitHub</a> · <a href="https://policies.google.com/privacy?hl=it" target="_blank" rel="noreferrer">Privacy Google</a></p>' +
      "</details>" }));
    return frag;
  }

  function sectionScreen() {
    var n = state.step, T = S.sections[n];
    var qs = S.questions.filter(function (q) { return q.section === T.id && visible(q, state.answers); });
    var frag = document.createDocumentFragment();
    frag.appendChild(el("div", { className: "progressmeta" }, [
      el("span", null, [String(n + 1).padStart(2, "0") + " / " + S.sections.length]), el("span", null, [T.title])]));
    var bar = el("span"); bar.style.width = ((n + 1) / S.sections.length * 100) + "%";
    frag.appendChild(el("div", { className: "progress", "aria-label": "Sezione " + (n + 1) + " di " + S.sections.length }, [bar]));
    frag.appendChild(el("header", { className: "sectionhead" }, [
      el("p", { className: "eyebrow" }, [S.territory]), el("h1", null, [T.title]), el("p", null, [T.description])]));
    if (n === 3) frag.appendChild(el("div", { className: "concept" }, [S.concept]));
    if (n === 4) frag.appendChild(el("div", { className: "pricecontext", "data-plan": plan }, [
      el("p", { className: "eyebrow" }, ["FORMULA " + plan + " · ASSEGNATA CASUALMENTE"]),
      el("h2", null, [S.plans[plan]]),
      el("p", null, [S.priceContext])]));
    var last = n === S.sections.length - 1;
    frag.appendChild(el("form", { onsubmit: onSubmit }, qs.map(question).concat([
      state.error ? el("p", { className: "error", role: "alert" }, [state.error]) : null,
      el("div", { className: "navigation" }, [
        el("button", { className: "back", type: "button", disabled: state.busy, onclick: function () { go(n - 1); } }, ["← Indietro"]),
        el("button", { className: "button", disabled: state.busy }, [state.busy ? "Invio…" : last ? "Invia le risposte" : "Continua →"])
      ]),
      el("p", { className: "small" }, [last ? "Controlla prima di inviare. Nessun dato di contatto è richiesto." : "I campi sono obbligatori salvo diversa indicazione. Puoi scegliere «Non so» dove previsto."])
    ])));
    return frag;
  }

  function render() {
    var y = window.scrollY;
    main.className = state.step < 0 || state.finish || CFG.closed ? "intro" : "surveybody";
    main.innerHTML = "";
    if (CFG.closed) main.appendChild(finishScreen("closed"));
    else if (state.finish) main.appendChild(finishScreen(state.finish));
    else if (state.step < 0) main.appendChild(introScreen());
    else main.appendChild(sectionScreen());
    window.scrollTo(0, y);
  }

  // l'importo del supplemento riceve il focus appena compare (come nell'originale)
  document.addEventListener("change", function (e) {
    if (e.target && e.target.name === "delivery_fee" && e.target.value === "Posso indicare un importo massimo") state._focusMoney = true;
  }, true);

  render();
})();
