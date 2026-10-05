// ============================================================================
//  OGGETTO DATI CENTRALIZZATO
//  Tutti i testi, gli alt delle immagini, le aria-label e i percorsi delle
//  immagini del sito. Modifica QUI per aggiornare i contenuti.
// ============================================================================

export const site = {
  brand: 'Osteria della Lana',
  kicker: 'Valsassina · Lana · Mani · Relazioni',
  // Etichette del menu per sezione: il menu segue l'ordine scelto nel backoffice.
  nav: {
    intro: 'Le Beetoneghe',
    story: 'Dalla pecora alle nostre mani',
    colors: 'I colori',
    creations: 'Le creazioni',
    osteria: "L'Osteria",
    events: 'Eventi',
  } as Record<string, string>,
  // Ordine delle sezioni tra la prima schermata e i contatti. Il layout (foto a sinistra/destra,
  // sfondo chiaro/scuro) dipende dalla posizione, non dalla sezione.
  order: ['intro', 'story', 'process', 'colors', 'creations', 'osteria', 'events', 'values'],
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
    eyebrow: 'Chi siamo', title: 'Siamo le Beetoneghe.',
    paragraphs: ["Il nostro nome nasce dal dialetto: 'bee' significa pecora, una parola onomatopeica che ne richiama il belato; le betoneghe sono invece le pettegole, le impiccione, le chiacchierone, detto con quell’accezione affettuosa che parla di curiosità, condivisione e voglia di stare insieme.", 'Mentre le mani lavorano, le parole circolano. Ci raccontiamo, ci confrontiamo, impariamo le une dalle altre e ci scambiamo idee, esperienze e saperi.'],
    quote: 'Intrecciamo filati, saperi, storie e relazioni.'
  },
  story: {
    eyebrow: 'La filiera', title: 'Dalla pecora alle nostre mani',
    text: ['Tutto comincia dalle nostre pecore, che pascolano nei prati della Valsassina.', 'Non acquistiamo filati già pronti. La lana viene tosata, cardata e filata da noi. Poi la tingiamo con colori ricavati dalle piante e la trasformiamo attraverso la tessitura, la maglia e il feltro.', 'Dalla pecora al filo, dal filo all’oggetto finito: ogni lavorazione è fatta da noi.'],
    image: '/images/story.jpeg',
    imageAlt: 'Mani che filano la lana',
    linkText: 'Guarda le creazioni',
  },
  process: {
    eyebrow: 'Dalla pecora alla lana', title: 'Il viaggio della nostra lana.',
    intro: 'Ogni passaggio conserva il carattere della materia e il gesto di chi la lavora. È un percorso lento, concreto, fatto di esperienza, pazienza e attenzione.',
    items: [
      { title: 'La lana', text: 'Dopo la tosatura, la lana delle nostre pecore è la materia da cui parte tutto.', image: '/images/process-1.jpeg' },
      { title: 'Cardatura', text: 'Prepariamo le fibre alla filatura, lavorandole con le carde fino a renderle pronte per diventare filo.', image: '/images/process-2.jpeg' },
      { title: 'Filatura a mano', text: 'La fibra passa attraverso le nostre mani e diventa il filato con cui daremo forma alle creazioni.', image: '/images/process-3.jpeg' },
    ],
  },
  colors: {
    eyebrow: 'I colori delle piante', title: 'La natura entra nel filo.',
    text: [
      'Prepariamo tinture naturali utilizzando colori ricavati dalle piante. Raccogliamo, prepariamo, estraiamo il colore e sperimentiamo sulle nostre lane.',
      'Il risultato non è mai completamente prevedibile: cambiano le piante, i bagni di colore e le fibre, e con loro cambiano le sfumature. È proprio questa variabilità a rendere ogni filato diverso.',
    ],
    quote: 'I colori delle nostre creazioni cominciano nella natura.',
    image: '/images/colors.jpeg',
    imageAlt: 'Fiori e piante per la tintura naturale',
    swatches: ['#c4bd4e', '#67678a', '#893a1b'],
  },
  creations: {
    eyebrow: 'Le nostre creazioni', title: 'Dal filo all\'idea',
    intro: 'Tessiamo, lavoriamo a maglia, infeltriamo e sperimentiamo. Nascono così borse, tappeti, arazzi, cappelli e coloratissime palle di lana: pezzi unici, realizzati a mano.',
    items: [
      { title: 'Coperte', image: '/images/creations-1.jpeg' },
      { title: 'Maglie', image: '/images/creations-2.jpeg' },
      { title: 'Sciarpe', image: '/images/creations-3.jpeg' },
      { title: 'Accessori', image: '/images/creations-4.jpeg' },
      { title: 'Arazzi', image: '/images/creations-5.jpeg' },
    ],
  },
  osteria: {
    eyebrow: 'Dove ci troviamo', title: "L’Antica Osteria",
    text: [
      'Ci ritroviamo in una vecchia osteria della Valsassina, un luogo antico e bellissimo che conserva gli arredi e l’atmosfera di una volta.',
      'È qui che arrivano lane, fusi, telai, ferri, piante, colori e idee. Qui lavoriamo, sperimentiamo, impariamo, raccontiamo e ridiamo. E naturalmente facciamo un po’ le Beetoneghe.',
      'Gli oggetti e gli ambienti raccontano il passato; quello che facciamo insieme continua quella storia senza copiarla.',
    ],
    image: '/images/osteria.jpeg',
    imageAlt: "L'Osteria",
  },
  events: {
    eyebrow: 'Appuntamenti', title: 'I prossimi eventi',
    intro: '',
    // Vuota di proposito: la sezione compare sul sito solo quando c'è almeno un evento.
    items: [] as { title: string; date: string; place: string; text: string; image: string; imageAlt: string }[],
  },
  values: {
    eyebrow: 'Il nostro filo', title: 'Natura, saperi, relazioni.',
    items: [
      { num: '1', label: 'Territorio', text: 'Le pecore, i prati della Valsassina, le piante e l’osteria: il nostro lavoro nasce da un luogo preciso e ne porta con sé il carattere.' },
      { num: '2', label: 'Mani', text: 'Tosatura, cardatura, filatura, tintura, tessitura, maglia e feltro: il processo non viene semplicemente seguito, viene fatto da noi.' },
      { num: '3', label: 'Relazioni', text: 'La lana ci riunisce intorno allo stesso tavolo. Un sapere passa da una donna all’altra, una chiacchiera diventa un’idea, un filo diventa legame.' },
    ],
  },
  cta: {
    eyebrow: 'Osteria della lana', title: 'Un filo che unisce.',
    text: 'Dalla pecora al filo. Dal filo alle nostre creazioni. E, sempre, da una persona all’altra.',
    linkText: 'Scrivici',
    email: 'osteriadellalana@gmail.com',
  },
  logoSection: {
    image: '/images/logo-full.png',
  },
  footer: {
    location: 'Valsassina, Lecco · Italia',
    backToTopText: 'Torna su',
    // Indirizzi dei profili social: vuoti = icona nascosta.
    facebook: 'https://www.facebook.com/osteriadellalana',
    instagram: 'https://www.instagram.com/osteriadellalana/',
  },
}
