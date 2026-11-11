/* Definizione del questionario (VT-1.0) */
window.SURVEY = {
 "version": "VT-1.0",
 "title": "Il bucato nella tua quotidianità",
 "territory": "Valsugana e Trento città",
 "concept": "Stiamo valutando un servizio per privati: ritiro del bucato a casa, lavaggio, asciugatura e riconsegna, con o senza stiratura. Il prezzo sarebbe calcolato sul peso del bucato asciutto prima del lavaggio. Il servizio non è ancora attivo: prezzi, zona coperta e condizioni sono da decidere.",
 "priceContext": "Per confrontare le risposte, immagina un ordine di 5 kg di bucato asciutto: capi comuni lavabili in acqua e asciugabili a macchina. Riconsegna entro 72 ore. Il peso di 5 kg e le 72 ore sono riferimenti per questa domanda, non condizioni già decise. Indica prezzi finali, IVA inclusa, per la sola lavorazione: ritiro e consegna si valutano a parte. Delicati, lavaggio a secco, piumoni, tappeti e capi speciali sono esclusi dalla tariffa standard e richiederebbero un preventivo.",
 "plans": {
  "A": "Lavaggio, asciugatura e piegatura, senza stiratura",
  "B": "Lavaggio, asciugatura e stiratura dei capi compatibili"
 },
 "sections": [
  {
   "id": "territorio",
   "title": "Partiamo dalla tua zona",
   "description": "L'indagine è rivolta a persone maggiorenni. Rispondi una sola volta, pensando al tuo nucleo familiare."
  },
  {
   "id": "abitudini",
   "title": "Come gestisci oggi il bucato",
   "description": "Pensa a una settimana normale, non a un periodo eccezionale."
  },
  {
   "id": "bisogni",
   "title": "Che cosa ti pesa di più",
   "description": "Vanno bene anche risposte negative: ci aiutano a capire se un servizio serve davvero."
  },
  {
   "id": "servizio",
   "title": "Un possibile servizio",
   "description": "Valuta l'idea con le informazioni disponibili, senza considerarla un'offerta commerciale."
  },
  {
   "id": "prezzo",
   "title": "Parliamo di prezzo",
   "description": "Non c'è una risposta giusta. Se non sai valutare il prezzo, puoi indicarlo."
  },
  {
   "id": "intenzione",
   "title": "Lo useresti davvero?",
   "description": "Distingui l'interesse per l'idea dalla possibilità concreta di pagare e usarla."
  },
  {
   "id": "profilo",
   "title": "Le ultime informazioni",
   "description": "Servono solo a confrontare gruppi ampi. Puoi scegliere di non rispondere."
  }
 ],
 "questions": [
  {
   "id": "zone",
   "section": "territorio",
   "text": "In quale zona vivi abitualmente?",
   "type": "single",
   "required": true,
   "options": [
    "Trento città",
    "Pergine Valsugana (comune)",
    "Alta Valsugana, esclusa Pergine (es. Levico, Caldonazzo)",
    "Bassa Valsugana (es. Borgo, Castelnuovo, Grigno)",
    "Valsugana, ma non so indicare la zona",
    "Fuori da queste zone"
   ],
   "help": "Scegli la zona generale, senza indicare indirizzo o frazione. Se vivi fuori dall'area, il questionario termina senza salvare risposte."
  },
  {
   "id": "laundry_owner",
   "section": "abitudini",
   "text": "Chi si occupa principalmente del bucato nel tuo nucleo?",
   "type": "single",
   "required": true,
   "options": [
    "Principalmente io",
    "Lo dividiamo tra più persone",
    "Principalmente un'altra persona del nucleo",
    "Principalmente una persona o un servizio esterno",
    "Non so"
   ]
  },
  {
   "id": "loads_week",
   "section": "abitudini",
   "text": "Quante lavatrici fate in una settimana normale?",
   "type": "single",
   "required": true,
   "options": [
    "Nessuna",
    "1–2",
    "3–4",
    "5–6",
    "7 o più",
    "Non so"
   ],
   "help": "Non serve conoscere i chilogrammi. Conta i cicli di lavaggio, anche se la lavatrice non è piena."
  },
  {
   "id": "active_time",
   "section": "abitudini",
   "text": "Quanto tempo dedicate complessivamente al bucato ogni settimana?",
   "type": "single",
   "required": true,
   "options": [
    "Meno di 1 ora",
    "Da 1 a meno di 2 ore",
    "Da 2 a meno di 4 ore",
    "4 ore o più",
    "Non so"
   ],
   "help": "Somma il tempo delle persone per preparare, stendere, piegare e stirare. Escludi il tempo in cui le macchine lavorano da sole."
  },
  {
   "id": "ironing",
   "section": "abitudini",
   "text": "Quanto spesso stirate?",
   "type": "single",
   "required": true,
   "options": [
    "Mai",
    "Meno di una volta a settimana",
    "Una volta a settimana",
    "Due o più volte a settimana",
    "Non so"
   ]
  },
  {
   "id": "laundry_use",
   "section": "abitudini",
   "text": "Negli ultimi 3 mesi quante volte avete usato una lavanderia?",
   "type": "single",
   "required": true,
   "options": [
    "Mai",
    "Una volta",
    "2–3 volte",
    "4 o più volte",
    "Non so"
   ],
   "help": "Considera lavanderie tradizionali, self-service e servizi a domicilio."
  },
  {
   "id": "laundry_type",
   "section": "abitudini",
   "text": "Quali tipi di lavanderia avete usato negli ultimi 3 mesi?",
   "type": "multi",
   "required": true,
   "options": [
    "Tradizionale / tintoria",
    "Self-service",
    "Ritiro o consegna a domicilio",
    "Non so"
   ],
   "exclusive": [
    "Non so"
   ],
   "condition": {
    "field": "laundry_use",
    "notIn": [
     "Mai",
     "Non so"
    ]
   }
  },
  {
   "id": "laundry_spend",
   "section": "abitudini",
   "text": "Quanto avete speso in lavanderia negli ultimi 30 giorni?",
   "type": "single",
   "required": true,
   "options": [
    "0 €",
    "Più di 0 e meno di 20 €",
    "Da 20 a meno di 40 €",
    "Da 40 a meno di 80 €",
    "80 € o più",
    "Non so / preferisco non rispondere"
   ],
   "condition": {
    "field": "laundry_use",
    "notIn": [
     "Mai",
     "Non so"
    ]
   }
  },
  {
   "id": "problems",
   "section": "bisogni",
   "text": "Quanto sono impegnative per voi queste attività?",
   "type": "matrix",
   "required": true,
   "rows": [
    {
     "id": "problem_wash",
     "label": "Lavare"
    },
    {
     "id": "problem_dry",
     "label": "Asciugare"
    },
    {
     "id": "problem_iron",
     "label": "Stirare"
    },
    {
     "id": "problem_bulk",
     "label": "Gestire capi voluminosi"
    },
    {
     "id": "problem_time",
     "label": "Trovare tempo per il bucato"
    },
    {
     "id": "problem_travel",
     "label": "Portare e ritirare capi in lavanderia"
    }
   ],
   "options": [
    "Per nulla",
    "Poco",
    "Abbastanza",
    "Molto",
    "Non pertinente / non so"
   ]
  },
  {
   "id": "interest",
   "section": "servizio",
   "text": "Quale frase descrive meglio la tua prima reazione?",
   "type": "single",
   "required": true,
   "options": [
    "Non mi interessa",
    "Mi incuriosisce, ma non penso di usarlo",
    "Mi interessa, ma non so se lo userei",
    "Lo prenderei concretamente in considerazione",
    "Non so"
   ]
  },
  {
   "id": "preferred_plan",
   "section": "servizio",
   "text": "Quale formula valuteresti più volentieri?",
   "type": "single",
   "required": true,
   "options": [
    "Solo lavaggio, senza asciugatura",
    "Lavaggio, asciugatura e piegatura",
    "Lavaggio, asciugatura e stiratura",
    "Solo stiratura",
    "Nessuna",
    "Non so"
   ]
  },
  {
   "id": "situations",
   "section": "servizio",
   "text": "In quali occasioni potresti valutarlo?",
   "type": "multi",
   "required": true,
   "max": 2,
   "options": [
    "Per il bucato ordinario",
    "Nei periodi con poco tempo",
    "Quando non riesco ad asciugare a casa",
    "In caso di guasto della lavatrice",
    "In occasioni particolari / al rientro da viaggi",
    "In nessuna occasione",
    "Non so"
   ],
   "exclusive": [
    "In nessuna occasione",
    "Non so"
   ]
  },
  {
   "id": "delivery_importance",
   "section": "servizio",
   "text": "Quanto conta poter avere ritiro e riconsegna a casa?",
   "type": "single",
   "required": true,
   "options": [
    "È indispensabile",
    "È utile, ma potrei portare io il bucato",
    "Non mi serve",
    "Non so"
   ]
  },
  {
   "id": "turnaround",
   "section": "servizio",
   "text": "Qual è il tempo massimo di riconsegna che accetteresti di solito?",
   "type": "single",
   "required": true,
   "options": [
    "Entro 24 ore",
    "Entro 48 ore",
    "Entro 72 ore",
    "Da 4 a 7 giorni",
    "Anche più di 7 giorni",
    "Non userei il servizio",
    "Non so"
   ]
  },
  {
   "id": "minimum_kg",
   "section": "servizio",
   "text": "Qual è il minimo d'ordine più alto che accetteresti?",
   "type": "single",
   "required": true,
   "options": [
    "Solo senza minimo",
    "3 kg",
    "5 kg",
    "8 kg",
    "10 kg",
    "Non userei il servizio",
    "Non so"
   ],
   "help": "Scegli il peso minimo massimo che riusciresti a raggiungere senza rinunciare al servizio. Non è la quantità che devi necessariamente ordinare."
  },
  {
   "id": "subscription",
   "section": "servizio",
   "text": "Quale modalità di acquisto preferiresti?",
   "type": "single",
   "required": true,
   "options": [
    "Singoli ordini, senza impegno",
    "Abbonamento, soltanto con un risparmio chiaro",
    "Abbonamento anche senza sconto, per avere ritiri programmati",
    "Non userei il servizio",
    "Non so"
   ]
  },
  {
   "id": "special_items",
   "section": "servizio",
   "text": "Come valuteresti delicati, piumoni, tappeti o capi speciali fuori dalla tariffa standard?",
   "type": "single",
   "required": true,
   "options": [
    "Li escluderei dall'ordine e li gestirei a parte",
    "Li affiderei al servizio con un preventivo dedicato accettato prima",
    "Valuterei solo un servizio che li includa nella stessa tariffa al kg",
    "Non so"
   ]
  },
  {
   "id": "price_ability",
   "section": "prezzo",
   "text": "Riesci a indicare dei prezzi per la formula mostrata qui sotto?",
   "type": "single",
   "required": true,
   "options": [
    "Sì, posso fare una stima",
    "Non so valutare questi prezzi",
    "Non la userei a nessun prezzo"
   ],
   "help": "La formula viene scelta casualmente per il test. Non è necessariamente quella che hai preferito prima."
  },
  {
   "id": "price_thresholds",
   "section": "prezzo",
   "text": "Quali prezzi assoceresti a questo ordine di 5 kg?",
   "type": "prices",
   "required": true,
   "condition": {
    "field": "price_ability",
    "in": [
     "Sì, posso fare una stima"
    ]
   },
   "rows": [
    {
     "id": "price_too_cheap",
     "label": "Così basso da farti dubitare della qualità"
    },
    {
     "id": "price_bargain",
     "label": "Conveniente, con una qualità credibile"
    },
    {
     "id": "price_expensive",
     "label": "Caro, ma ancora da prendere in considerazione"
    },
    {
     "id": "price_too_expensive",
     "label": "Troppo caro: non lo prenderesti in considerazione"
    }
   ],
   "help": "Importo totale in euro per 5 kg, IVA inclusa. Ritiro e riconsegna esclusi. Non serve conoscere un listino: indica la tua percezione. Puoi tornare sopra e scegliere «Non so valutare»."
  },
  {
   "id": "delivery_fee",
   "section": "prezzo",
   "text": "Quanto pagheresti al massimo in più, complessivamente, per ritiro e riconsegna?",
   "type": "moneyChoice",
   "required": true,
   "options": [
    "0 €: non pagherei un supplemento",
    "Posso indicare un importo massimo",
    "Non so",
    "Non mi serve il ritiro a casa"
   ],
   "help": "Un solo importo per entrambi i passaggi, per un ordine di 5 kg. IVA inclusa. Non indicare un importo per ciascun viaggio."
  },
  {
   "id": "intent_30d",
   "section": "intenzione",
   "text": "Se il servizio partisse nella tua zona, quanto è probabile che tu faccia un ordine nei primi 30 giorni?",
   "type": "single",
   "required": true,
   "options": [
    "Certamente no",
    "Probabilmente no",
    "Forse sì, forse no",
    "Probabilmente sì",
    "Certamente sì",
    "Non so"
   ],
   "help": "Pensa a una formula di tuo interesse, a un prezzo per te accettabile e al costo complessivo, incluso l'eventuale trasporto. Non è una prenotazione."
  },
  {
   "id": "frequency",
   "section": "intenzione",
   "text": "A queste condizioni, con quale frequenza pensi realisticamente di usarlo?",
   "type": "single",
   "required": true,
   "options": [
    "Mai",
    "Meno di una volta al mese",
    "Una volta al mese",
    "Due volte al mese",
    "3–4 volte al mese",
    "5 o più volte al mese",
    "Non so"
   ],
   "condition": {
    "field": "intent_30d",
    "notIn": [
     "Certamente no"
    ]
   }
  },
  {
   "id": "barriers",
   "section": "intenzione",
   "text": "Quali sarebbero i principali motivi per non usarlo?",
   "type": "multi",
   "required": true,
   "max": 3,
   "options": [
    "Costo complessivo",
    "Timore di danni o smarrimento",
    "Dubbi sull'igiene",
    "Fiducia nell'operatore",
    "Tempi di riconsegna",
    "Organizzazione di ritiro e consegna",
    "Preferisco lavare a casa",
    "Sono soddisfatto del servizio che uso già",
    "Non ne ho bisogno",
    "Altro motivo",
    "Nessun ostacolo particolare",
    "Non so"
   ],
   "exclusive": [
    "Nessun ostacolo particolare",
    "Non so"
   ]
  },
  {
   "id": "requirements",
   "section": "intenzione",
   "text": "Quali condizioni sarebbero indispensabili per te?",
   "type": "multi",
   "required": true,
   "max": 3,
   "options": [
    "Bucato separato da quello di altri clienti",
    "Rispetto delle etichette dei capi",
    "Regole chiare in caso di danni o smarrimento",
    "Fasce orarie di ritiro affidabili",
    "Prezzo totale noto prima del trattamento",
    "Possibilità di scegliere detergente o assenza di profumo",
    "Nessuna condizione particolare",
    "Non so"
   ],
   "exclusive": [
    "Nessuna condizione particolare",
    "Non so"
   ]
  },
  {
   "id": "age",
   "section": "profilo",
   "text": "Qual è la tua fascia di età?",
   "type": "single",
   "required": false,
   "options": [
    "18–24 anni",
    "25–34 anni",
    "35–44 anni",
    "45–54 anni",
    "55–64 anni",
    "65 anni o più",
    "Preferisco non rispondere"
   ]
  },
  {
   "id": "household_size",
   "section": "profilo",
   "text": "Quante persone vivono nel tuo nucleo, inclusa te?",
   "type": "single",
   "required": false,
   "options": [
    "1",
    "2",
    "3",
    "4",
    "5 o più",
    "Preferisco non rispondere"
   ]
  },
  {
   "id": "household_type",
   "section": "profilo",
   "text": "Quale descrizione rappresenta meglio il tuo nucleo?",
   "type": "single",
   "required": false,
   "options": [
    "Persona sola",
    "Coppia senza figli conviventi",
    "Nucleo con figli conviventi",
    "Condivisione tra adulti",
    "Altra situazione",
    "Preferisco non rispondere"
   ]
  },
  {
   "id": "work",
   "section": "profilo",
   "text": "Qual è la tua situazione prevalente?",
   "type": "single",
   "required": false,
   "options": [
    "Lavoro dipendente o autonomo",
    "Studio",
    "Pensione",
    "Mi occupo prevalentemente della casa",
    "Attualmente non lavoro",
    "Altra situazione",
    "Preferisco non rispondere"
   ]
  },
  {
   "id": "comment",
   "section": "profilo",
   "text": "Vuoi aggiungere un dubbio, un suggerimento o una condizione importante?",
   "type": "text",
   "required": false,
   "maxLength": 300,
   "help": "Facoltativo. Non inserire nomi, contatti, indirizzi, informazioni sulla salute o altri dati personali tuoi o altrui."
  }
 ],
 "labels": {
  "zone": "Zona",
  "laundry_owner": "Chi si occupa del bucato",
  "loads_week": "Lavatrici a settimana",
  "active_time": "Tempo settimanale per il bucato",
  "ironing": "Frequenza stiratura",
  "laundry_use": "Uso lavanderia (ultimi 3 mesi)",
  "laundry_type": "Tipi di lavanderia usati",
  "laundry_spend": "Spesa in lavanderia (ultimi 30 giorni)",
  "problem_wash": "Impegno: Lavare",
  "problem_dry": "Impegno: Asciugare",
  "problem_iron": "Impegno: Stirare",
  "problem_bulk": "Impegno: Capi voluminosi",
  "problem_time": "Impegno: Trovare tempo",
  "problem_travel": "Impegno: Portare/ritirare in lavanderia",
  "interest": "Prima reazione all'idea",
  "preferred_plan": "Formula preferita",
  "situations": "Occasioni d'uso (max 2)",
  "delivery_importance": "Importanza ritiro e riconsegna a casa",
  "turnaround": "Tempo massimo di riconsegna",
  "minimum_kg": "Minimo d'ordine accettato",
  "subscription": "Modalità di acquisto preferita",
  "special_items": "Capi speciali fuori tariffa",
  "price_ability": "Sa indicare i prezzi",
  "price_too_cheap": "Prezzo troppo basso (€ / 5 kg)",
  "price_bargain": "Prezzo conveniente (€ / 5 kg)",
  "price_expensive": "Prezzo caro ma accettabile (€ / 5 kg)",
  "price_too_expensive": "Prezzo troppo caro (€ / 5 kg)",
  "delivery_fee": "Supplemento ritiro e riconsegna",
  "delivery_fee_amount": "Supplemento massimo (€)",
  "intent_30d": "Probabilità ordine nei primi 30 giorni",
  "frequency": "Frequenza d'uso realistica",
  "barriers": "Motivi per non usarlo (max 3)",
  "requirements": "Condizioni indispensabili (max 3)",
  "age": "Fascia d'età",
  "household_size": "Persone nel nucleo",
  "household_type": "Tipo di nucleo",
  "work": "Situazione prevalente",
  "comment": "Commento"
 }
};
