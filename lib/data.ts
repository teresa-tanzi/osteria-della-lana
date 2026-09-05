// ============================================================================
//  OGGETTO DATI CENTRALIZZATO
//  Tutti i testi, gli alt delle immagini, le aria-label e i percorsi delle
//  immagini del sito. Modifica QUI per aggiornare i contenuti.
// ============================================================================

export const site = {
  brand: 'Osteria della Lana',
  kicker: 'Valsassina · Lana · Mani · Relazioni',
  nav: [
    ['Le Beetoneghe', '#beetoneghe'],
    ['Dalla pecora alle nostre mani', '#filo'],
    ['I colori', '#colori'],
    ['Le creazioni', '#creazioni'],
    ["L'Osteria", '#osteria'],
  ],
  header: {
    openMenuAria: 'Apri menu',
    closeMenuAria: 'Chiudi menu',
  },
  hero: {
    title: 'Osteria della Lana',
    text: 'Siamo le Beetoneghe. Lavoriamo la lana delle nostre pecore e la trasformiamo interamente con le nostre mani. E mentre intrecciamo fili, intrecciamo relazioni.',
    image: '/images/hero.jpeg',
    imageAlt: 'Lavorazione artigianale della lana',
    logo: '/images/logo-mark.png',
    scrollAria: 'Scopri la storia',
  },
  intro: {
    eyebrow: 'Le Beetoneghe', title: 'Una storia fatta di mani, lana e parole.',
    paragraphs: ["Beetoneghe è una parola del nostro dialetto. Viene da ‘bee’, pecora, e si usa con affetto per indicare donne chiacchierone, curiose, sempre pronte a fare comunità.", 'Siamo partite dalle nostre pecore, dalla voglia di tornare a fare con calma e dal desiderio di aprire una porta. Oggi quella porta dà su un laboratorio, un piccolo emporio e una tavola imbandita.'],
    quote: 'Intrecciamo filati, saperi, storie e relazioni.'
  },
  story: {
    eyebrow: 'La filiera', title: 'Dalla pecora alle nostre mani',
    text: 'Ogni fibra racconta il luogo da cui proviene. Tosiamo con cura, laviamo la lana nelle acque della valle, la cardiamo e la filiamo a mano. Poi arrivano i colori: piante, fiori, cortecce e bacche raccolti nei dintorni. Infine tessiamo e lavoriamo ogni pezzo lentamente, uno alla volta.',
    image: '/images/story.jpeg',
    imageAlt: 'Mani che filano la lana',
    linkText: 'Guarda le creazioni',
  },
  process: {
    eyebrow: 'Il gesto', title: 'Il viaggio della nostra lana.',
    intro: 'Ogni passaggio conserva il carattere della materia e il gesto di chi la lavora. È un percorso lento, concreto, fatto di esperienza, pazienza e attenzione.',
    items: [
      { title: 'Tosatura e lavaggio', text: 'Dopo la tosatura, la lana delle nostre pecore è la materia da cui parte tutto.', image: '/images/process-1.jpeg' },
      { title: 'Cardatura', text: 'Prepariamo le fibre alla filatura, lavorandole con le carde fino a renderle pronte per diventare filo.', image: '/images/process-2.jpeg' },
      { title: 'Filatura a mano', text: 'La fibra passa attraverso le nostre mani e diventa il filato con cui daremo forma alle creazioni.', image: '/images/process-3.jpeg' },
    ],
  },
  colors: {
    eyebrow: 'Botanica locale', title: 'I colori della Valsassina',
    text: 'Prepariamo tinture naturali utilizzando colori ricavati dalle piante. Raccogliamo, prepariamo, estraiamo il colore e sperimentiamo sulle nostre lane.\n' +
        '\n\n' +
        'Il risultato non è mai completamente prevedibile: cambiano le piante, i bagni di colore e le fibre, e con loro cambiano le sfumature. È proprio questa variabilità a rendere ogni filato diverso.',
    image: '/images/colors.jpeg',
    imageAlt: 'Fiori e piante per la tintura naturale',
    swatches: ['#c4bd4e', '#67678a', '#893a1b'],
  },
  creations: {
    eyebrow: 'Fatte qui', title: 'Le creazioni',
    intro: 'Tessiamo, lavoriamo a maglia, infeltriamo e sperimentiamo. Nascono così borse, tappeti, arazzi, cappelli e coloratissime palle di lana: pezzi unici, realizzati a mano.',
    items: [
      ['Coperte', '/images/creations-1.jpeg'],
      ['Maglie', '/images/creations-2.jpeg'],
      ['Sciarpe', '/images/creations-3.jpeg'],
      ['Accessori', '/images/creations-4.jpeg'],
      ['Arazzi', '/images/creations-5.jpeg'],
    ] as [string, string][],
  },
  osteria: {
    eyebrow: 'Il nostro posto', title: "L’Osteria",
    text: 'Un luogo per fermarsi. Qui la lana incontra il pane, il lavoro incontra la festa e ogni persona può sedersi al tavolo. Passa a trovarci in Valsassina: il laboratorio è aperto, il caffè è già sul fuoco.',
    image: '/images/osteria.jpeg',
    imageAlt: "L'Osteria",
  },
  values: {
    eyebrow: 'Quello in cui crediamo', title: 'Il filo che ci tiene insieme.',
    items: [
      { num: '1', label: 'Filiera a km zero e sostenibile', text: 'Le pecore, i prati della Valsassina, le piante e l’osteria: il nostro lavoro nasce da un luogo preciso e ne porta con sé il carattere.' },
      { num: '2', label: 'Saperi tradizionali e fatti a mano', text: 'Tosatura, cardatura, filatura, tintura, tessitura, maglia e feltro: il processo non viene semplicemente seguito, viene fatto da noi.' },
      { num: '3', label: 'Comunità, cura e accoglienza', text: 'La lana ci riunisce intorno allo stesso tavolo. Un sapere passa da una donna all’altra, una chiacchiera diventa un’idea, un filo diventa legame.' },
    ],
  },
  cta: {
    eyebrow: 'Vieni a trovarci', title: 'Tieni un filo con noi.',
    text: 'Scrivici per visitare il laboratorio, conoscere le pecore o scegliere una creazione fatta a mano.',
    linkText: 'Scrivici',
    email: 'osteriadellalana@gmail.com',
    logo: '/images/logo-full.png',
  },
  footer: {
    location: 'Valsassina, Lecco · Italia',
    backToTopText: 'Torna su',
    instagramAria: 'Instagram',
  },
}
