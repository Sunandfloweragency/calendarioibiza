import { EventData, DJData, PromoterData, ClubData, UserData, UserRole } from './types';

export const APP_NAME = "Sun and Flower Ibiza Calendar";

// Admin User
export const ADMIN_USERNAME = "AdminBassse"; 
export const ADMIN_EMAIL = "admin@sunflower.ibiza";
export const ADMIN_PASSWORD = "admin123"; 
export const ADMIN_USER_ID = "admin001";

export const INITIAL_ADMIN_USER: Omit<UserData, 'id' | 'passwordHash' | 'registrationDate' | 'isBanned' | 'role'> & {password: string} = {
  username: ADMIN_USERNAME, 
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD, // Plain password for initial setup
  name: "Admin Sunflower",
};

// Fix: Add id_placeholder to the type definition for INITIAL_USERS elements
export const INITIAL_USERS: (Omit<UserData, 'id' | 'passwordHash' | 'registrationDate' | 'isBanned' | 'role'> & {password: string, role?: UserRole, id_placeholder?: string})[] = [
  {
    ...INITIAL_ADMIN_USER,
    id_placeholder: ADMIN_USER_ID, // Placeholder for service to assign actual ID
    role: 'admin',
  },
  {
    username: "coco",
    email: "coco@example.com",
    password: "coco123",
    name: "Coco Chanel",
    role: 'user',
    country: "Spain",
    preferredStyles: ["Techno", "House", "Fiesta de Día"],
    userProfileType: "consumer",
  }
];


// User ID for events imported by the system
export const EXTERNAL_IMPORT_USER_ID = "system_importer";

// Helper function to get future dates
const getFutureDate = (daysOffset: number, specificMonth?: number, specificDay?: number): Date => {
  const today = new Date();
  let targetDate = new Date(today);

  if (typeof specificMonth === 'number' && typeof specificDay === 'number') {
    // Months are 0-indexed in JS
    targetDate = new Date(today.getFullYear(), specificMonth, specificDay);
    if (targetDate <= today) { // If this date has passed this year, set for next year
      targetDate.setFullYear(today.getFullYear() + 1);
    }
  } else {
    targetDate.setDate(today.getDate() + daysOffset);
  }
  // targetDate.setHours(0, 0, 0, 0); // Normalize time - not needed if only date matters
  return targetDate;
};


// Initial Data: Ensure they have status 'approved' and submittedBy admin
const defaultEntityMeta = {
  status: 'approved' as const,
  submittedBy: ADMIN_USER_ID,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  socialLinks: [] 
};

export const INITIAL_DJS: Omit<DJData, 'id' | 'slug'>[] = [
  {
    name: "DJ Solaris Ibiza",
    photoUrl: "https://picsum.photos/seed/djsolarisibiza/400/400",
    genres: ["Balearic House", "Melodic Techno", "Deep House"],
    bio: "DJ Solaris trae el icónico sonido de Ibiza con melodías edificantes y ritmos impulsores. Un pilar en la escena de la isla, Solaris ha tocado en superclubs legendarios y fiestas íntimas en la playa, conocido por crear paisajes sonoros eufóricos.",
    description: "Sonido icónico de Ibiza, paisajes sonoros eufóricos.",
    ...defaultEntityMeta,
    socialLinks: [{ platform: "SoundCloud", url: "https://soundcloud.com/djsolarisibiza" }]
  },
  {
    name: "Luna Estrella",
    photoUrl: "https://picsum.photos/seed/lunaestrella/400/400",
    genres: ["Tech House", "Minimal Techno", "Organic House"],
    bio: "Luna Estrella teje intrincadas tapicerías de sonido, mezclando tech house profundo y groovy con texturas orgánicas. Sus sets son un viaje a través de la emoción, perfectos para las famosas sesiones de atardecer de Ibiza y el clubbing nocturno.",
    description: "Tech house intrincado, grooves orgánicos profundos.",
    ...defaultEntityMeta,
    socialLinks: [{ platform: "Mixcloud", url: "https://mixcloud.com/lunaestrella" }]
  },
  {
    name: "Marco Kinetic", 
    photoUrl: "https://picsum.photos/seed/marckinetic/400/400", 
    genres: ["Hard Techno", "Industrial", "Acid Techno"],
    bio: "Marco Kinetic es conocido por sus sets de techno contundentes y de alta energía. Un favorito de la escena underground, sus actuaciones son implacables y llenas de ritmos industriales.",
    description: "Techno contundente y de alta energía.",
    ...defaultEntityMeta
  },
  {
    name: "Marco Carola", 
    photoUrl: "https://picsum.photos/seed/marcoccarola/400/400",
    genres: ["Techno", "Tech House"],
    bio: "Legendario DJ italiano, Marco Carola es el cerebro detrás de Music On, uno de los eventos de techno y tech-house más exitosos a nivel mundial.",
    description: "Fundador de Music On, icono del techno.",
    ...defaultEntityMeta
  },
  {
    name: "Solomun", 
    photoUrl: "https://picsum.photos/seed/solomundj/400/400",
    genres: ["Melodic House & Techno", "Deep House"],
    bio: "Solomun es un DJ y productor bosnio-alemán, conocido por sus emotivos sets de melodic house y techno y su popular residencia Solomun +1 en Pacha Ibiza.",
    description: "Melodic house & techno, residencia Solomun +1.",
    ...defaultEntityMeta
  },
  {
    name: "Bella Groove",
    photoUrl: "https://picsum.photos/seed/bellagroove/400/400",
    genres: ["Disco House", "Funk", "Soulful House"],
    bio: "Bella Groove trae vibraciones disco y funk a la pista de baile. Con una sonrisa contagiosa y una selección impecable, sus sets están llenos de alegría y ritmos bailables.",
    description: "Vibraciones disco y funk contagiosas.",
    ...defaultEntityMeta
  },
  {
    name: "David Guetta",
    photoUrl: "https://picsum.photos/seed/davidguetta/400/400",
    genres: ["EDM", "House", "Progressive House"],
    bio: "DJ y productor francés de fama mundial, David Guetta es una de las figuras más importantes de la música electrónica. Su residencia 'F*** Me I'm Famous' en Pacha Ibiza es legendaria.",
    description: "Rey del EDM mundial, residencia en Pacha Ibiza.",
    ...defaultEntityMeta
  },
  {
    name: "Martin Garrix",
    photoUrl: "https://picsum.photos/seed/martingarrix/400/400",
    genres: ["Big Room House", "Progressive House", "EDM"],
    bio: "DJ y productor holandés, Martin Garrix se convirtió en el DJ más joven en alcanzar el #1 en DJ Mag. Su sello STMPD RCRDS presenta eventos regulares en Ibiza.",
    description: "Joven prodigio del EDM, fundador de STMPD RCRDS.",
    ...defaultEntityMeta
  },
  {
    name: "Calvin Harris",
    photoUrl: "https://picsum.photos/seed/calvinharris/400/400",
    genres: ["Electro House", "Dance Pop", "Funk"],
    bio: "DJ y productor escocés, Calvin Harris es uno de los artistas electrónicos más exitosos comercialmente. Sus sets en Ibiza combinan electro house con toques funk.",
    description: "Éxito comercial global, electro house y funk.",
    ...defaultEntityMeta
  },
  {
    name: "Tiësto",
    photoUrl: "https://picsum.photos/seed/tiesto/400/400",
    genres: ["Trance", "Progressive House", "Big Room"],
    bio: "Leyenda viviente del trance y house progresivo, Tiësto ha sido votado como el DJ #1 del mundo en múltiples ocasiones. Sus sets en Ibiza son épicos.",
    description: "Leyenda del trance, múltiple #1 DJ del mundo.",
    ...defaultEntityMeta
  },
  {
    name: "Tale of Us",
    photoUrl: "https://picsum.photos/seed/taleofus/400/400",
    genres: ["Melodic Techno", "Progressive House", "Organic House"],
    bio: "Dúo italiano de melodic techno, Tale of Us son los fundadores del sello Afterlife. Sus sets combinan emociones profundas con ritmos hipnóticos.",
    description: "Dúo de melodic techno, fundadores de Afterlife.",
    ...defaultEntityMeta
  },
  {
    name: "Jamie Jones",
    photoUrl: "https://picsum.photos/seed/jamiejones/400/400",
    genres: ["Tech House", "House", "Deep House"],
    bio: "DJ y productor británico, Jamie Jones es el fundador de Paradise y Hot Creations. Su sound tech house con influencias tropicales define el sonido moderno de Ibiza.",
    description: "Fundador de Paradise, tech house tropical.",
    ...defaultEntityMeta
  }
];

export const INITIAL_PROMOTERS: Omit<PromoterData, 'id' | 'slug'>[] = [
  {
    name: "Ibiza Cosmic Nights",
    logoUrl: "https://picsum.photos/seed/ibizacosmic/300/200",
    history: "Fundada en 2015, Ibiza Cosmic Nights cura experiencias de música electrónica únicas e inmersivas en la Isla Blanca. Nos enfocamos en sonido de clase mundial, visuales impresionantes y la inconfundible vibra de Ibiza.",
    eventTypeFocus: "Techno, House, Eventos de Balearic Beats",
    description: "Experiencias inmersivas de música electrónica en Ibiza.",
    ...defaultEntityMeta,
    socialLinks: [{ platform: "Instagram", url: "https://instagram.com/ibizacosmicnights" }]
  },
  {
    name: "White Isle Wonders",
    logoUrl: "https://picsum.photos/seed/whiteislewonders/300/200",
    history: "White Isle Wonders ha estado creando fiestas inolvidables en yates y villas privadas desde 2010, ofreciendo un toque exclusivo a la escena de fiesta de Ibiza.",
    eventTypeFocus: "Fiestas en Yates, Eventos en Villas Privadas, House Exclusivo",
    description: "Fiestas exclusivas en yates y villas privadas.",
    ...defaultEntityMeta
  },
  {
    name: "elrow",
    logoUrl: "https://picsum.photos/seed/elrowpromoter/300/200", 
    history: "Conocidos mundialmente por sus fiestas inmersivas y llenas de color, elrow transforma los clubs en mundos de fantasía con confeti, hinchables y personajes extravagantes.",
    eventTypeFocus: "Tech House, House, Fiestas Temáticas, Experiencias Inmersivas",
    description: "Fiestas temáticas coloridas y extravagantes.",
    ...defaultEntityMeta
  },
  {
    name: "Pyramid Ibiza",
    logoUrl: "https://picsum.photos/seed/pyramidibizapromoter/300/200",
    history: "Pyramid es la apuesta de Amnesia por el techno y house de calidad, trayendo line-ups de primer nivel y un enfoque en la experiencia musical pura.",
    eventTypeFocus: "Techno, House",
    description: "Noches de techno y house de calidad en Amnesia.",
    ...defaultEntityMeta
  },
  {
    name: "ANTS Metropolis", 
    logoUrl: "https://picsum.photos/seed/antsibizapromoter/300/200",
    history: "La colonia ANTS ha conquistado Ushuaïa con sus fiestas diurnas de tech-house y una producción impresionante, convirtiéndose en un referente de los sábados en Ibiza.",
    eventTypeFocus: "Tech House, House, Eventos Diurnos",
    description: "La colonia de tech-house de Ushuaïa.",
    ...defaultEntityMeta
  },
  {
    name: "Circoloco",
    logoUrl: "https://picsum.photos/seed/circolocopromoter/300/200",
    history: "Una de las fiestas underground más legendarias de Ibiza, Circoloco en DC-10 es sinónimo de techno y tech-house sin concesiones y un ambiente auténtico.",
    eventTypeFocus: "Techno, Tech House, Minimal",
    description: "Fiesta underground legendaria en DC-10.",
    ...defaultEntityMeta
  },
  {
    name: "Defected Records Ibiza",
    logoUrl: "https://picsum.photos/seed/defectedibizapromoter/300/200",
    history: "El sello Defected Records trae su sonido house característico a Ibiza, con eventos que celebran la música house en todas sus formas, desde lo clásico a lo contemporáneo.",
    eventTypeFocus: "House, Soulful House, Classic House",
    description: "El sello icónico de música house en Ibiza.",
    ...defaultEntityMeta
  },
  {
    name: "Glitterbox",
    logoUrl: "https://picsum.photos/seed/glitterboxpromoter/300/200",
    history: "Glitterbox es una celebración de la música disco y house con un ambiente inclusivo y extravagante. Drag queens, bailarines y una banda sonora edificante son sus señas de identidad.",
    eventTypeFocus: "Disco, House, Soulful House, Nu-Disco",
    description: "Fiestas disco y house inclusivas y extravagantes.",
    ...defaultEntityMeta
  },
  {
    name: "Music On", 
    logoUrl: "https://picsum.photos/seed/musiconpromoter/300/200", 
    history: "Liderada por Marco Carola, Music On es una marca global de techno y tech-house que ha tenido una fuerte presencia en Ibiza, atrayendo a miles de seguidores.",
    eventTypeFocus: "Techno, Tech House",
    description: "La marca de techno de Marco Carola.",
    ...defaultEntityMeta
  },
  {
    name: "Paradise Ibiza",
    logoUrl: "https://picsum.photos/seed/paradiseibizapromoter/300/200",
    history: "La fiesta de Jamie Jones, Paradise, es un referente del tech-house con un toque tropical y divertido, atrayendo a grandes nombres de la escena.",
    eventTypeFocus: "Tech House, House",
    description: "La fiesta tech-house de Jamie Jones.",
    ...defaultEntityMeta
  },
  {
    name: "Cocoon Ibiza",
    logoUrl: "https://picsum.photos/seed/cocoonibizapromoter/300/200",
    history: "Aunque su presencia ha variado, Cocoon de Sven Väth es una marca legendaria que definió el techno en Ibiza durante muchos años. Históricamente significativa.",
    eventTypeFocus: "Techno, Minimal",
    description: "Marca de techno legendaria (histórica).",
    ...defaultEntityMeta
  },
  {
    name: "Resistance Ibiza",
    logoUrl: "https://picsum.photos/seed/resistanceibizapromoter/300/200",
    history: "Parte del gigante Ultra Music Festival, Resistance trae producciones masivas y line-ups de techno y house de primer nivel a los superclubs de Ibiza.",
    eventTypeFocus: "Techno, House, Producciones a Gran Escala",
    description: "Techno y house de gran producción by Ultra.",
    ...defaultEntityMeta
  },
  {
    name: "Solid Grooves",
    logoUrl: "https://picsum.photos/seed/solidgroovespromoter/300/200",
    history: "Sello y serie de fiestas de tech-house con un sonido crudo y groovy, muy popular entre la nueva generación de clubbers.",
    eventTypeFocus: "Tech House",
    description: "Tech-house crudo y groovy.",
    ...defaultEntityMeta
  },
  {
    name: "Do Not Sleep",
    logoUrl: "https://picsum.photos/seed/donotsleeppromoter/300/200",
    history: "Do Not Sleep se enfoca en el house y techno underground, a menudo ocupando diferentes clubs y ofreciendo line-ups sólidos para los puristas.",
    eventTypeFocus: "Underground House, Techno",
    description: "House y techno underground.",
    ...defaultEntityMeta
  },
  {
    name: "ABODE Ibiza",
    logoUrl: "https://picsum.photos/seed/abodeibizapromoter/300/200",
    history: "Originaria del Reino Unido, ABODE ha llevado su exitosa fórmula de fiestas house y tech-house a Ibiza, con una base de fans leal.",
    eventTypeFocus: "House, Tech House",
    description: "Promotora de house y tech-house del Reino Unido.",
    ...defaultEntityMeta
  },
  {
    name: "Kaluki Musik",
    logoUrl: "https://picsum.photos/seed/kalukimusikpromoter/300/200",
    history: "Sello y promotora de Manchester con un sonido tech-house distintivo que también ha encontrado su lugar en la escena de Ibiza.",
    eventTypeFocus: "Tech House",
    description: "Sello y promotora de tech-house.",
    ...defaultEntityMeta
  },
  {
    name: "Game Over",
    logoUrl: "https://picsum.photos/seed/gameoveribizapromoter/300/200",
    history: "Conocidos por sus eventos únicos, afterparties y un enfoque en la calidad musical, Game Over es un nombre respetado en la escena underground de Ibiza.",
    eventTypeFocus: "Techno, House, Afterparties",
    description: "Eventos únicos y afterparties.",
    ...defaultEntityMeta
  },
  {
    name: "Children of the 80s",
    logoUrl: "https://picsum.photos/seed/children80spromoter/300/200",
    history: "Una fiesta nostálgica que celebra la música de los 80, atrayendo a un público diverso que busca diversión y éxitos retro.",
    eventTypeFocus: "Música de los 80, Retro, Pop",
    description: "Fiesta nostálgica de los 80.",
    ...defaultEntityMeta
  },
  {
    name: "Flower Power Pacha", 
    logoUrl: "https://picsum.photos/seed/flowerpowerpachapromoter/300/200", 
    history: "Una de las fiestas más icónicas y longevas de Pacha Ibiza, Flower Power celebra el espíritu hippy de los 60 y 70 con música de la época y una decoración vibrante.",
    eventTypeFocus: "Música de los 60 y 70, Hippy, Retro",
    description: "La icónica fiesta hippy de Pacha.",
    ...defaultEntityMeta
  },
  {
    name: "Woomoon",
    logoUrl: "https://picsum.photos/seed/woomoonpromoter/300/200",
    history: "Woomoon es una experiencia inmersiva que combina música electrónica con arte, actuaciones y un ambiente espiritual y bohemio, a menudo en Cova Santa.",
    eventTypeFocus: "Organic House, Melodic Techno, World Music, Experiencias Inmersivas",
    description: "Experiencia inmersiva de música y arte.",
    ...defaultEntityMeta
  },
  {
    name: "Shadows (Solomun)", 
    logoUrl: "https://picsum.photos/seed/shadowssolomunpromoter/300/200",
    history: "La fiesta diurna de Solomun, Shadows, se ha convertido en un evento popular, ofreciendo sets extendidos del artista en lugares como Destino o Cova Santa.",
    eventTypeFocus: "Melodic House & Techno, Eventos Diurnos",
    description: "La fiesta diurna de Solomun.",
    ...defaultEntityMeta
  },
  {
    name: "Pacha Group",
    logoUrl: "https://picsum.photos/seed/pachagroup/300/200",
    history: "Pacha es el grupo empresarial detrás del icónico club Pacha Ibiza, fundado en 1973. Ha sido el hogar de las residencias más legendarias de la isla.",
    eventTypeFocus: "House, EDM, Residencias Legendarias",
    description: "Grupo empresarial del icónico Pacha Ibiza.",
    ...defaultEntityMeta
  },
  {
    name: "STMPD RCRDS",
    logoUrl: "https://picsum.photos/seed/stmpdrecords/300/200",
    history: "Sello discográfico fundado por Martin Garrix en 2016, STMPD RCRDS representa la nueva generación del EDM y presenta eventos regulares en Ibiza.",
    eventTypeFocus: "EDM, Big Room House, Progressive House",
    description: "Sello de Martin Garrix, nueva generación EDM.",
    ...defaultEntityMeta
  },
  {
    name: "Afterlife",
    logoUrl: "https://picsum.photos/seed/afterlifepromoter/300/200",
    history: "Fundado por Tale of Us, Afterlife es más que un sello discográfico: es una experiencia completa que combina melodic techno con visuales impresionantes.",
    eventTypeFocus: "Melodic Techno, Progressive House, Experiencias Audiovisuales",
    description: "Sello de Tale of Us, experiencias audiovisuales.",
    ...defaultEntityMeta
  }
];

export const INITIAL_CLUBS: Omit<ClubData, 'id' | 'slug'>[] = [
  // Existing Superclubs
  {
    name: "Amnesia Ibiza",
    photos: ["https://picsum.photos/seed/amnesia1/800/600", "https://picsum.photos/seed/amnesia2/800/600"],
    address: "Carretera Ibiza a San Antonio, Km 5, 07816 Ibiza",
    musicType: "Techno, House, Trance, Latin",
    services: ["Main Room", "Terraza", "VIP Areas", "World-Class Sound System", "Ice Cannons"],
    description: "Legendario superclub de Ibiza con múltiples salas y amaneceres en la terraza.",
    ...defaultEntityMeta
  },
  {
    name: "Pacha Ibiza",
    photos: ["https://picsum.photos/seed/pacha1/800/600", "https://picsum.photos/seed/pacha2/800/600"],
    address: "Av. 8 d'Agost, 07800 Eivissa, Illes Balears",
    musicType: "House, EDM, Global Hits, Reggaeton",
    services: ["Iconic Main Room", "Funky Room", "Rooftop Terrace", "VIP Tables", "Global DJ Lineups"],
    description: "Discoteca de renombre mundial, una institución en Ibiza con su icónico logo de cerezas.",
    ...defaultEntityMeta
  },
  {
    name: "Hï Ibiza",
    photos: ["https://picsum.photos/seed/hiibiza1/800/600", "https://picsum.photos/seed/hiibiza2/800/600"],
    address: "Platja d'en Bossa, 07817 Sant Josep de sa Talaia",
    musicType: "Techno, House, EDM",
    services: ["Theatre (Main Room)", "Club Room", "Wild Corner (Toilets DJ Booth)", "State-of-the-art Production", "VIP"],
    description: "Superclub vanguardista en Playa d'en Bossa, conocido por su producción inmersiva.",
    ...defaultEntityMeta
  },
  {
    name: "Ushuaïa Ibiza Beach Hotel",
    photos: ["https://picsum.photos/seed/ushuaia1/800/600", "https://picsum.photos/seed/ushuaia2/800/600"],
    address: "Platja d'en Bossa, 10, 07817 Sant Josep de sa Talaia",
    musicType: "EDM, House, Tech House",
    services: ["Outdoor Stage", "Pool Parties", "Luxury Hotel", "Pyrotechnics", "Daytime Events"],
    description: "Hotel de playa icónico que alberga fiestas diurnas masivas con los DJs más grandes del mundo.",
    ...defaultEntityMeta
  },
  {
    name: "DC-10",
    photos: ["https://picsum.photos/seed/dc10ibiza1/800/600", "https://picsum.photos/seed/dc10ibiza2/800/600"],
    address: "Carretera las Salinas, km 1, 07818 Sant Josep de sa Talaia",
    musicType: "Techno, Tech House, Minimal",
    services: ["Terrace", "Main Room", "Underground Vibe", "No-Frills Partying"],
    description: "Club underground legendario conocido por sus fiestas Circoloco y su ambiente crudo.",
    ...defaultEntityMeta
  },
  {
    name: "Eden Ibiza",
    photos: ["https://picsum.photos/seed/edenibiza1/800/600", "https://picsum.photos/seed/edenibiza2/800/600"],
    address: "Carrer Salvador Espriu, s/n, 07820 Sant Antoni de Portmany",
    musicType: "House, Tech House, Trance",
    services: ["Main Room", "Second Room", "Void Soundsystem", "San Antonio Superclub"],
    description: "Superclub revitalizado en San Antonio con un potente sistema de sonido y noches de diversos géneros.",
    ...defaultEntityMeta
  },
  {
    name: "Privilege Ibiza",
    photos: ["https://picsum.photos/seed/privilegeibiza1/800/600", "https://picsum.photos/seed/privilegeibiza2/800/600"],
    address: "Urbanización San Rafael, s/n, 07816 Sant Antoni de Portmany",
    musicType: "Techno, Trance, House (Historically)",
    services: ["World's Largest Club (Guinness Record)", "Massive Main Room", "Vista Club (Glass-walled)", "Swimming Pool"],
    description: "Conocido como el club más grande del mundo, con una historia legendaria. (Estado operativo puede variar).",
    ...defaultEntityMeta
  },
  {
    name: "Ibiza Rocks Hotel",
    photos: ["https://picsum.photos/seed/ibizarocks1/800/600", "https://picsum.photos/seed/ibizarocks2/800/600"],
    address: "Carrer de Cervantes, 27, 07820 Sant Antoni de Portmany",
    musicType: "Live Music, Pool Parties, House, Grime, Pop",
    services: ["Hotel", "Poolside Stage", "Daytime Events", "Live Acts & DJs"],
    description: "El hogar de la fiesta en la piscina de Ibiza, que combina actuaciones en vivo y DJs.",
    ...defaultEntityMeta
  },
  {
    name: "O Beach Ibiza",
    photos: ["https://picsum.photos/seed/obeachibiza1/800/600", "https://picsum.photos/seed/obeachibiza2/800/600"],
    address: "Carrer des Molí, 12-14, 07820 Sant Antoni de Portmany",
    musicType: "House, Garage, R&B, Pool Party Anthems",
    services: ["Luxury Beach Club", "Pool Parties", "VIP Beds", "Daytime Glamour"],
    description: "Glamuroso beach club en San Antonio famoso por sus lujosas fiestas en la piscina.",
    ...defaultEntityMeta
  },
  {
    name: "Lío Ibiza",
    photos: ["https://picsum.photos/seed/lioibiza1/800/600", "https://picsum.photos/seed/lioibiza2/800/600"],
    address: "Passeig Joan Carles I, 1, 07800 Eivissa",
    musicType: "Live Music, House, Eclectic",
    services: ["Restaurant", "Cabaret Show", "Club", "Marina Views", "High-End Experience"],
    description: "Experiencia extravagante que combina restaurante, espectáculo de cabaret y club nocturno con vistas al puerto deportivo.",
    ...defaultEntityMeta
  },
  {
    name: "Cova Santa",
    photos: ["https://picsum.photos/seed/covasanta1/800/600", "https://picsum.photos/seed/covasanta2/800/600"],
    address: "Carretera San José km 7, 07818 Sant Josep de sa Talaia",
    musicType: "Techno, House, World Music, Eclectic",
    services: ["Restaurant", "Outdoor Event Space", "Ancient Cave", "Unique Parties"],
    description: "Lugar único construido alrededor de una cueva antigua, que ofrece gastronomía y eventos especiales.",
    ...defaultEntityMeta
  },
  {
    name: "Akasha Ibiza",
    photos: ["https://picsum.photos/seed/akashaibiza1/800/600", "https://picsum.photos/seed/akashaibiza2/800/600"],
    address: "Carretera San Carlos Km 12, 07850 Sant Carles de Peralta (Las Dalias)",
    musicType: "Organic House, Deep House, Melodic Techno, Eclectic",
    services: ["Intimate Club", "Hippy Market Venue (Las Dalias)", "Quality Sound System", "Conscious Clubbing"],
    description: "Club íntimo en el corazón de Las Dalias, enfocado en música electrónica melódica y consciente.",
    ...defaultEntityMeta
  },
  {
    name: "Pikes Ibiza",
    photos: ["https://picsum.photos/seed/pikesibiza1/800/600", "https://picsum.photos/seed/pikesibiza2/800/600"],
    address: "Camí de Sa Vorera, S/N, 07820 Sant Antoni de Portmany",
    musicType: "Eclectic, Balearic, Disco, House",
    services: ["Boutique Hotel", "Iconic Pink Tennis Court", "Freddies Room (Club)", "Pool Parties", "Unique Events"],
    description: "Hotel legendario e hedonista con una rica historia musical, que alberga fiestas íntimas y eclécticas.",
    ...defaultEntityMeta
  },
  {
    name: "Destino Pacha Ibiza Resort",
    photos: ["https://picsum.photos/seed/destinopacha1/800/600", "https://picsum.photos/seed/destinopacha2/800/600"],
    address: "Cap Martinet, s/n, 07819 Talamanca",
    musicType: "House, Tech House, Melodic Techno",
    services: ["Luxury Resort", "Outdoor Stage", "Daytime Events", "Sunset Views", "Pacha Brand"],
    description: "Resort de lujo del grupo Pacha, que ofrece eventos diurnos al aire libre con grandes DJs.",
    ...defaultEntityMeta
  },
  {
    name: "Es Paradis",
    photos: ["https://picsum.photos/seed/esparadis1/800/600", "https://picsum.photos/seed/esparadis2/800/600"],
    address: "Carrer Salvador Espriu, 2, 07820 Sant Antoni de Portmany",
    musicType: "House, Commercial Dance, Water Parties (Fiesta del Agua)",
    services: ["Beautiful Decor", "Water Parties", "Pyramid Roof", "San Antonio Nightlife"],
    description: "Uno de los clubs más bonitos de Ibiza, famoso por su Fiesta del Agua.",
    ...defaultEntityMeta
  },
  {
    name: "Octan Ibiza",
    photos: ["https://picsum.photos/seed/octanibiza1/800/600", "https://picsum.photos/seed/octanibiza2/800/600"],
    address: "Carrer de ses Païsses, 20, 07817 Platja d'en Bossa (Formerly Sankeys)",
    musicType: "Techno, Tech House, Underground",
    services: ["Basement Club Vibe", "Intimate Rooms", "Focus on Sound"],
    description: "Club underground en Playa d'en Bossa (anteriormente Sankeys) con un enfoque en el sonido y el baile.",
    ...defaultEntityMeta
  },
  {
    name: "Underground Ibiza",
    photos: ["https://picsum.photos/seed/undergroundibiza1/800/600", "https://picsum.photos/seed/undergroundibiza2/800/600"],
    address: "Crta. San Antonio - Ibiza Km.7, San Rafael, 07816 Ibiza",
    musicType: "Techno, House, Minimal",
    services: ["Local Favorite", "Intimate Atmosphere", "No Frills", "Music-Focused"],
    description: "Un club favorito de los locales, conocido por su ambiente íntimo y su enfoque en la música.",
    ...defaultEntityMeta
  },
  {
    name: "Benimussa Park",
    photos: ["https://picsum.photos/seed/benimussapark1/800/600", "https://picsum.photos/seed/benimussapark2/800/600"],
    address: "Carrer del Romaní, 18, 07820 Sant Antoni de Portmany",
    musicType: "Varied, Themed Parties (e.g., The Zoo Project)",
    services: ["Outdoor Venue", "Multiple Arenas", "Themed Events", "Festival Vibe"],
    description: "Gran recinto al aire libre que alberga fiestas temáticas únicas y eventos con ambiente de festival.",
    ...defaultEntityMeta
  },
  {
    name: "Nassau Beach Club",
    photos: ["https://picsum.photos/seed/nassaubeach1/800/600", "https://picsum.photos/seed/nassaubeach2/800/600"],
    address: "Ctra. de Platja d'en Bossa, S/N, 07817 Sant Josep de sa Talaia",
    musicType: "House, Chill Out, Balearic",
    services: ["Luxury Beach Club", "Restaurant", "Sunbeds", "DJ Sets"],
    description: "Elegante beach club en Playa d'en Bossa que ofrece gastronomía, relax y música.",
    ...defaultEntityMeta
  },
  {
    name: "Blue Marlin Ibiza",
    photos: ["https://picsum.photos/seed/bluemarlin1/800/600", "https://picsum.photos/seed/bluemarlin2/800/600"],
    address: "Cala Jondal, s/n, 07800 Sant Josep de sa Talaia",
    musicType: "House, Deep House, International DJs",
    services: ["VIP Beach Club", "Restaurant", "Day-to-Night Parties", "Live Music"],
    description: "Beach club de lujo en Cala Jondal, conocido por sus fiestas de día a noche y su clientela VIP.",
    ...defaultEntityMeta
  },
  {
    name: "Club Chinois Ibiza",
    photos: ["https://picsum.photos/seed/clubchinois1/800/600", "https://picsum.photos/seed/clubchinois2/800/600"],
    address: "Passeig Joan Carles I, 17, 07800 Eivissa (Formerly HEART Ibiza)",
    musicType: "House, Melodic Techno, Eclectic High-End",
    services: ["High-End Clubbing", "Themed Nights", "Marina Location", "Sophisticated Decor"],
    description: "Club sofisticado en la Marina Ibiza (anteriormente HEART), que ofrece clubbing de alta gama.",
    ...defaultEntityMeta
  },
  {
    name: "Swag Ibiza",
    photos: ["https://picsum.photos/seed/swagibiza1/800/600", "https://picsum.photos/seed/swagibiza2/800/600"],
    address: "Carrer de la Murtra, 5, 07817 Platja d'en Bossa",
    musicType: "Hip Hop, R&B, Reggaeton, Urban",
    services: ["Urban Music Club", "Playa d'en Bossa Nightlife"],
    description: "El principal club de música urbana de Ibiza, situado en Playa d'en Bossa.",
    ...defaultEntityMeta
  },
  {
    name: "Café Mambo",
    photos: ["https://picsum.photos/seed/cafemambo1/800/600", "https://picsum.photos/seed/cafemambo2/800/600"],
    address: "Carrer Vara de Rey, 40, 07820 Sant Antoni de Portmany",
    musicType: "House, Pre-Parties, Sunset DJs",
    services: ["Iconic Sunset Bar", "Pre-Party Hotspot", "International DJs", "Restaurant"],
    description: "Bar icónico en el Sunset Strip de San Antonio, famoso por sus pre-fiestas con DJs de renombre mundial.",
    ...defaultEntityMeta
  },
  {
    name: "Café del Mar",
    photos: ["https://picsum.photos/seed/cafedelmar1/800/600", "https://picsum.photos/seed/cafedelmar2/800/600"],
    address: "Carrer de Lepant, 27, 07820 Sant Antoni de Portmany",
    musicType: "Chill Out, Balearic, Ambient",
    services: ["Original Sunset Bar", "Chill Out Compilations", "Relaxed Atmosphere"],
    description: "El bar de sunset original, pionero del sonido chill out de Ibiza.",
    ...defaultEntityMeta
  },
  {
    name: "Savannah Ibiza",
    photos: ["https://picsum.photos/seed/savannahibiza1/800/600", "https://picsum.photos/seed/savannahibiza2/800/600"],
    address: "Carrer General Balanzat, 38, 07820 Sant Antoni de Portmany",
    musicType: "House, Pre-Parties, Sunset Music",
    services: ["Sunset Bar", "Restaurant", "Pre-Party Venue"],
    description: "Otro popular bar en el Sunset Strip, que ofrece buena música y vistas al atardecer.",
    ...defaultEntityMeta
  },
  {
    name: "Itaca Ibiza",
    photos: ["https://picsum.photos/seed/itacaibiza1/800/600", "https://picsum.photos/seed/itacaibiza2/800/600"],
    address: "Avinguda del Doctor Fleming, 07820 Sant Antoni de Portmany",
    musicType: "Commercial Dance, House, Varied",
    services: ["Bar", "Club", "Terrace", "San Antonio Nightlife"],
    description: "Concurrido bar y club en San Antonio, popular entre los turistas.",
    ...defaultEntityMeta
  },
  {
    name: "Tantra Ibiza",
    photos: ["https://picsum.photos/seed/tantraibiza1/800/600", "https://picsum.photos/seed/tantraibiza2/800/600"],
    address: "Carrer de la Murtra, 7, 07817 Platja d'en Bossa",
    musicType: "House, Techno, Pre-Parties",
    services: ["Pre-Party Bar", "DJ Sets", "Near Superclubs"],
    description: "Bar de pre-fiestas popular en Playa d'en Bossa, cerca de Hï y Ushuaïa.",
    ...defaultEntityMeta
  },
  {
    name: "Playa Soleil",
    photos: ["https://picsum.photos/seed/playasoleil1/800/600", "https://picsum.photos/seed/playasoleil2/800/600"],
    address: "Carrer de la Murtra, 5, 07817 Platja d'en Bossa",
    musicType: "House, Balearic, Chill Out",
    services: ["Beach Club", "Restaurant", "Music Events", "Wellness"],
    description: "Nuevo y elegante beach club en Playa d'en Bossa, que ofrece gastronomía, música y bienestar.",
    ...defaultEntityMeta
  },
  {
    name: "Las Dalias de Ibiza",
    photos: ["https://picsum.photos/seed/lasdalias1/800/600", "https://picsum.photos/seed/lasdalias2/800/600"],
    address: "Carretera San Carlos Km 12, 07850 Sant Carles de Peralta",
    musicType: "World Music, Live Music, Eclectic DJ Sets",
    services: ["Hippy Market", "Live Music Venue", "Restaurant", "Akasha Club"],
    description: "Mercado hippy icónico y lugar de eventos que también alberga el club Akasha.",
    ...defaultEntityMeta
  },
  {
    name: "The Standard Ibiza",
    photos: ["https://picsum.photos/seed/thestandardibiza1/800/600", "https://picsum.photos/seed/thestandardibiza2/800/600"],
    address: "Vara de Rey, 07800 Eivissa",
    musicType: "House, Disco, Balearic",
    services: ["Boutique Hotel", "Rooftop Pool & Bar", "Restaurant", "DJ Events"],
    description: "Hotel boutique en el centro de Ibiza con una azotea vibrante que alberga eventos con DJ.",
    ...defaultEntityMeta
  },
  {
    name: "NUI Ibiza",
    photos: ["https://picsum.photos/seed/nuiibiza1/800/600", "https://picsum.photos/seed/nuiibiza2/800/600"],
    address: "Carrer de Cas Dominguets, 17, 07819 Jesús",
    musicType: "House, Deep House, Techno",
    services: ["Restaurant & Club", "Art Space", "Intimate Events"],
    description: "Espacio multifacético en Jesús que combina restaurante, club y arte.",
    ...defaultEntityMeta
  },
  {
    name: "Malanga Café Ibiza",
    photos: ["https://picsum.photos/seed/malangacafe1/800/600", "https://picsum.photos/seed/malangacafe2/800/600"],
    address: "Carrer de Carles V, 11, 07800 Eivissa",
    musicType: "Funk, Soul, Reggae, Latin, World Music",
    services: ["Small Club", "Local Vibe", "Diverse Music Policy"],
    description: "Pequeño club en Ibiza ciudad con un ambiente local y una política musical diversa.",
    ...defaultEntityMeta
  },
  {
    name: "Hakkasan Ibiza",
    photos: ["https://picsum.photos/seed/hakkasanibiza1/800/600", "https://picsum.photos/seed/hakkasanibiza2/800/600"],
    address: "Hard Rock Hotel Ibiza, Carrer de la Platja d'en Bossa, 10, 07817 Platja d'en Bossa",
    musicType: "House, Techno, Trance, Progressive",
    services: ["Luxury Club", "Hard Rock Hotel", "International DJs", "VIP Experience"],
    description: "Club de lujo ubicado en el Hard Rock Hotel Ibiza, conocido por sus producciones de clase mundial y grandes DJs.",
    ...defaultEntityMeta
  },
  {
    name: "Nikki Beach Ibiza",
    photos: ["https://picsum.photos/seed/nikkibeachibiza1/800/600", "https://picsum.photos/seed/nikkibeachibiza2/800/600"],
    address: "Playa de Santa Eulalia, Ctra. Es Canar, Km 1, 07840 Santa Eulària des Riu",
    musicType: "House, Deep House, Beach House",
    services: ["Luxury Beach Club", "White Party", "International Brand", "VIP Sunbeds"],
    description: "Icónico beach club de lujo conocido por sus White Parties y ambiente sofisticado en Santa Eulària.",
    ...defaultEntityMeta
  },
  {
    name: "Booom! Ibiza",
    photos: ["https://picsum.photos/seed/booomibiza1/800/600", "https://picsum.photos/seed/booomibiza2/800/600"],
    address: "Carrer de Ses Jondal, 07830 Sant Josep de sa Talaia",
    musicType: "House, Deep House, Melodic House",
    services: ["Beach Club", "Restaurant", "Sunset Sessions", "Intimate Events"],
    description: "Beach club boutique que ofrece eventos íntimos de house music en un ambiente relajado.",
    ...defaultEntityMeta
  },
  {
    name: "Sa Trinxa",
    photos: ["https://picsum.photos/seed/satrinxa1/800/600", "https://picsum.photos/seed/satrinxa2/800/600"],
    address: "Platja de ses Salines, s/n, 07818 Sant Josep de sa Talaia",
    musicType: "Balearic House, Chill Out, Eclectic",
    services: ["Beach Restaurant", "Iconic DJ Sets", "Relaxed Atmosphere"],
    description: "Chiringuito icónico en la playa de Salinas, conocido por su música balear y su ambiente relajado.",
    ...defaultEntityMeta
  },
  {
    name: "Sunset Ashram",
    photos: ["https://picsum.photos/seed/sunsetashram1/800/600", "https://picsum.photos/seed/sunsetashram2/800/600"],
    address: "Carretera de Cala Conta, s/n, 07829 Sant Josep de sa Talaia",
    musicType: "Chill Out, Ethnic Beats, Sunset Soundtracks",
    services: ["Beach Club", "Restaurant", "Sunset Views", "DJ Sets"],
    description: "Popular beach club en Cala Conta, perfecto para disfrutar de la puesta de sol con música.",
    ...defaultEntityMeta
  },
  {
    name: "Kumharas Ibiza",
    photos: ["https://picsum.photos/seed/kumharasibiza1/800/600", "https://picsum.photos/seed/kumharasibiza2/800/600"],
    address: "Carrer de Lugo, 2, 07829 Cala de Bou, Sant Josep de sa Talaia",
    musicType: "Chill Out, World Music, Live Music",
    services: ["Sunset Bar", "Restaurant", "Hippy Market Stalls", "Live Performances"],
    description: "Bar y restaurante relajado con vistas al atardecer, música en vivo y ambiente bohemio.",
    ...defaultEntityMeta
  },
  {
    name: "Keeper Ibiza",
    photos: ["https://picsum.photos/seed/keeperibiza1/800/600", "https://picsum.photos/seed/keeperibiza2/800/600"],
    address: "Marina Botafoch, Local 205, 07800 Eivissa",
    musicType: "Commercial House, Hits",
    services: ["Restaurant", "Bar", "Nightclub Area", "Marina Location"],
    description: "Popular bar, restaurante y pequeño club en Marina Botafoch.",
    ...defaultEntityMeta
  },
  {
    name: "Experimental Beach Ibiza (ECC)",
    photos: ["https://picsum.photos/seed/experimentalbeach1/800/600", "https://picsum.photos/seed/experimentalbeach2/800/600"],
    address: "Playa des Codolar Salinas, s/n, 07817 Sant Josep de sa Talaia",
    musicType: "Balearic, Chill Out, Eclectic",
    services: ["Beach Club", "Restaurant", "Cocktail Bar", "Sunset Views"],
    description: "Elegante beach club en Cap des Falcó, conocido por sus cócteles y puestas de sol.",
    ...defaultEntityMeta
  },
  {
    name: "Amante Ibiza",
    photos: ["https://picsum.photos/seed/amanteibiza1/800/600", "https://picsum.photos/seed/amanteibiza2/800/600"],
    address: "Cala Llonga, Sol d'en Serra, 07849 Santa Eulària des Riu",
    musicType: "Chill Out, Balearic",
    services: ["Luxury Beach Club", "Restaurant", "Yoga", "Movie Nights", "Cliffside Location"],
    description: "Impresionante beach club y restaurante en un acantilado, que ofrece relax y eventos especiales.",
    ...defaultEntityMeta
  },
  {
    name: "Beso Beach Ibiza",
    photos: ["https://picsum.photos/seed/besobeachibiza1/800/600", "https://picsum.photos/seed/besobeachibiza2/800/600"],
    address: "Platja de ses Salines, s/n, 07818 Sant Josep de sa Talaia",
    musicType: "House, Balearic, Spanish Pop",
    services: ["Beach Restaurant", "DJ Sets", "Bohemian Vibe"],
    description: "Popular restaurante de playa en Salinas con un ambiente bohemio y música animada.",
    ...defaultEntityMeta
  },
  {
    name: "Chiringuito Blue",
    photos: ["https://picsum.photos/seed/chiringuitoblue1/800/600", "https://picsum.photos/seed/chiringuitoblue2/800/600"],
    address: "Passeig Marítim, 10, 07840 Santa Eulària des Riu",
    musicType: "Chill Out, Balearic, Live Music",
    services: ["Beach Restaurant", "Kids Area", "DJ Sets"],
    description: "Restaurante de playa de moda en Santa Eulalia con un ambiente relajado y DJs.",
    ...defaultEntityMeta
  }
];

export const INITIAL_EVENTS_PLACEHOLDER: (Omit<EventData, 'id' | 'slug' | 'clubId' | 'djIds' | 'promoterId'> & {clubNameHint?: string; djNameHints?: string[]; promoterNameHint?:string})[] = [
  // ===== EVENTOS LEGENDARIOS DE PACHA =====
  {
    name: "David Guetta - F*** Me I'm Famous",
    date: getFutureDate(0, 1, 15).toISOString(), // Febrero 15, 2025
    time: "23:00",
    description: "La residencia más famosa de David Guetta en Pacha Ibiza. Una noche épica de house y EDM con invitados especiales y la mejor producción.",
    imageUrl: "https://picsum.photos/seed/davidguettafmif/800/600",
    price: "€80-120",
    ticketLink: "https://www.pachaibiza.com",
    eventType: "Residencia",
    ...defaultEntityMeta,
    clubNameHint: "Pacha Ibiza",
    djNameHints: ["David Guetta"],
    promoterNameHint: "Pacha Group"
  },
  {
    name: "Solomun +1",
    date: getFutureDate(0, 1, 22).toISOString(), // Febrero 22, 2025
    time: "23:00",
    description: "La residencia dominical de Solomun en Pacha. Cada semana invita a un artista especial (+1) para crear sets únicos e irrepetibles.",
    imageUrl: "https://picsum.photos/seed/solomunplusone/800/600",
    price: "€70-100",
    ticketLink: "https://www.pachaibiza.com",
    eventType: "Residencia",
    ...defaultEntityMeta,
    clubNameHint: "Pacha Ibiza",
    djNameHints: ["Solomun"],
    promoterNameHint: "Pacha Group"
  },
  {
    name: "Flower Power - The Original Hippy Party",
    date: getFutureDate(0, 2, 1).toISOString(), // Marzo 1, 2025
    time: "22:00",
    description: "La fiesta hippy más icónica de Ibiza. Vuelve a los años 60 y 70 con música psicodélica, vestuario retro y la magia de Pacha.",
    imageUrl: "https://picsum.photos/seed/flowerpower/800/600",
    price: "€50-80",
    ticketLink: "https://www.pachaibiza.com",
    eventType: "Fiesta Temática",
    ...defaultEntityMeta,
    clubNameHint: "Pacha Ibiza",
    promoterNameHint: "Flower Power Pacha"
  },

  // ===== AMNESIA IBIZA LEGENDS =====
  {
    name: "elrow Town - The Craziest Party in the World",
    date: getFutureDate(0, 2, 8).toISOString(), // Marzo 8, 2025
    time: "16:00",
    description: "La fiesta más colorida y loca del mundo aterriza en Amnesia. Decoraciones inmersivas, toneladas de confeti y los mejores DJs de tech house.",
    imageUrl: "https://picsum.photos/seed/elrowtown/800/600",
    price: "€65-95",
    ticketLink: "https://www.amnesia.es",
    eventType: "Fiesta Temática",
    ...defaultEntityMeta,
    clubNameHint: "Amnesia Ibiza",
    djNameHints: ["Bella Groove", "Luna Estrella"],
    promoterNameHint: "elrow"
  },
  {
    name: "Pyramid - Pure Underground Techno",
    date: getFutureDate(0, 2, 15).toISOString(), // Marzo 15, 2025
    time: "23:00",
    description: "La marca de techno más respetada de Amnesia. Una noche dedicada a los titanes del techno con el mejor sonido underground.",
    imageUrl: "https://picsum.photos/seed/pyramidtechno/800/600",
    price: "€55-85",
    ticketLink: "https://www.amnesia.es",
    eventType: "Noche de Club",
    ...defaultEntityMeta,
    clubNameHint: "Amnesia Ibiza",
    djNameHints: ["Marco Kinetic"],
    promoterNameHint: "Pyramid Ibiza"
  },
  {
    name: "Cocoon Heroes - Sven Väth Legacy",
    date: getFutureDate(0, 3, 1).toISOString(), // Abril 1, 2025
    time: "22:00",
    description: "El legado de Sven Väth continúa con una noche especial de techno alemán y minimal en la sala principal de Amnesia.",
    imageUrl: "https://picsum.photos/seed/cocoonheroes/800/600",
    price: "€60-90",
    ticketLink: "https://www.amnesia.es",
    eventType: "Homenaje",
    ...defaultEntityMeta,
    clubNameHint: "Amnesia Ibiza",
    promoterNameHint: "Cocoon Ibiza"
  },

  // ===== USHUAÏA IBIZA POOL PARTIES =====
  {
    name: "Martin Garrix presents STMPD RCRDS",
    date: getFutureDate(0, 3, 15).toISOString(), // Abril 15, 2025
    time: "17:00",
    description: "Martin Garrix presenta su sello discográfico STMPD RCRDS en Ushuaïa con invitados especiales y la mejor producción de EDM.",
    imageUrl: "https://picsum.photos/seed/martingarrixstmpd/800/600",
    price: "€90-150",
    ticketLink: "https://www.ushuaiaibiza.com",
    eventType: "Pool Party",
    ...defaultEntityMeta,
    clubNameHint: "Ushuaïa Ibiza",
    djNameHints: ["Martin Garrix"],
    promoterNameHint: "STMPD RCRDS"
  },
  {
    name: "ANTS - The Colony Invades",
    date: getFutureDate(0, 3, 22).toISOString(), // Abril 22, 2025
    time: "17:00",
    description: "La colonia ANTS toma Ushuaïa todos los sábados con la mejor selección de tech house y una producción espectacular.",
    imageUrl: "https://picsum.photos/seed/antscolony/800/600",
    price: "€75-120",
    ticketLink: "https://www.ushuaiaibiza.com",
    eventType: "Pool Party",
    ...defaultEntityMeta,
    clubNameHint: "Ushuaïa Ibiza",
    promoterNameHint: "ANTS Metropolis"
  },
  {
    name: "Calvin Harris - Funk Wav Bounces",
    date: getFutureDate(0, 4, 5).toISOString(), // Mayo 5, 2025
    time: "18:00",
    description: "Calvin Harris trae su sonido único a Ushuaïa con una mezcla perfecta de funk, electro y dance music.",
    imageUrl: "https://picsum.photos/seed/calvinharris/800/600",
    price: "€100-180",
    ticketLink: "https://www.ushuaiaibiza.com",
    eventType: "Pool Party",
    ...defaultEntityMeta,
    clubNameHint: "Ushuaïa Ibiza",
    djNameHints: ["Calvin Harris"]
  },

  // ===== HAKKASAN IBIZA (Hard Rock Hotel) =====
  {
    name: "Tiësto - The Business",
    date: getFutureDate(0, 4, 12).toISOString(), // Mayo 12, 2025
    time: "23:00",
    description: "El legendario Tiësto presenta 'The Business' en Hakkasan Ibiza con un set exclusivo de trance y progressive house.",
    imageUrl: "https://picsum.photos/seed/tiestobusiness/800/600",
    price: "€80-130",
    ticketLink: "https://hakkasanibiza.com",
    eventType: "Noche de Club",
    ...defaultEntityMeta,
    clubNameHint: "Hakkasan Ibiza",
    djNameHints: ["Tiësto"]
  },

  // ===== DC-10 UNDERGROUND =====
  {
    name: "Circoloco - The Real Underground",
    date: getFutureDate(0, 4, 19).toISOString(), // Mayo 19, 2025
    time: "16:00",
    description: "La fiesta underground más legendaria de Ibiza. Desde 1999, Circoloco en DC-10 es sinónimo de techno puro y ambiente auténtico.",
    imageUrl: "https://picsum.photos/seed/circoloco/800/600",
    price: "€40-70",
    ticketLink: "https://dc10ibiza.com",
    eventType: "Underground",
    ...defaultEntityMeta,
    clubNameHint: "DC-10",
    promoterNameHint: "Circoloco"
  },

  // ===== PRIVILEGE IBIZA - EL CLUB MÁS GRANDE DEL MUNDO =====
  {
    name: "Resistance Ibiza - Ultra Worldwide",
    date: getFutureDate(0, 5, 3).toISOString(), // Junio 3, 2025
    time: "22:00",
    description: "Ultra Music Festival trae Resistance a Privilege con las producciones más grandes y los mejores DJs de techno del mundo.",
    imageUrl: "https://picsum.photos/seed/resistanceibiza/800/600",
    price: "€70-110",
    ticketLink: "https://privilegeibiza.com",
    eventType: "Festival",
    ...defaultEntityMeta,
    clubNameHint: "Privilege Ibiza",
    promoterNameHint: "Resistance Ibiza"
  },

  // ===== DESTINO PACHA RESORT =====
  {
    name: "Solomun - Shadows (Day Party)",
    date: getFutureDate(0, 5, 10).toISOString(), // Junio 10, 2025
    time: "16:00",
    description: "La fiesta diurna de Solomun en Destino ofrece sets extendidos del maestro bosnia con vistas espectaculares al mar.",
    imageUrl: "https://picsum.photos/seed/solomunshadows/800/600",
    price: "€60-90",
    ticketLink: "https://destinoibiza.com",
    eventType: "Pool Party",
    ...defaultEntityMeta,
    clubNameHint: "Destino Pacha Resort",
    djNameHints: ["Solomun"],
    promoterNameHint: "Shadows (Solomun)"
  },

  // ===== COVA SANTA EXPERIENCIAS =====
  {
    name: "Woomoon - Immersive Experience",
    date: getFutureDate(0, 5, 17).toISOString(), // Junio 17, 2025
    time: "20:00",
    description: "Una experiencia inmersiva que combina música electrónica con arte, actuaciones y un ambiente espiritual único en Cova Santa.",
    imageUrl: "https://picsum.photos/seed/woomoon/800/600",
    price: "€50-80",
    ticketLink: "https://covasanta.com",
    eventType: "Experiencia Inmersiva",
    ...defaultEntityMeta,
    clubNameHint: "Cova Santa",
    promoterNameHint: "Woomoon"
  },

  // ===== PIKES IBIZA LEGENDARY =====
  {
    name: "Pikes Pool Party - Freddie's Legacy",
    date: getFutureDate(0, 5, 24).toISOString(), // Junio 24, 2025
    time: "15:00",
    description: "La piscina donde Freddie Mercury celebró su última fiesta de cumpleaños. Una experiencia única en el hotel más rock de Ibiza.",
    imageUrl: "https://picsum.photos/seed/pikespool/800/600",
    price: "€40-70",
    ticketLink: "https://pikesibiza.com",
    eventType: "Pool Party",
    ...defaultEntityMeta,
    clubNameHint: "Pikes Ibiza",
    djNameHints: ["Bella Groove"],
    promoterNameHint: "White Isle Wonders"
  },

  // ===== OPENINGS Y CLOSINGS ÉPICOS =====
  {
    name: "Ibiza Season Opening 2025",
    date: getFutureDate(0, 4, 26).toISOString(), // Abril 26, 2025
    time: "16:00",
    description: "La apertura oficial de la temporada 2025 de Ibiza con los mejores DJs del mundo reunidos en una celebración épica.",
    imageUrl: "https://picsum.photos/seed/ibizaopening2025/800/600",
    price: "€60-100",
    ticketLink: "#",
    eventType: "Apertura de Temporada",
    ...defaultEntityMeta,
    clubNameHint: "Amnesia Ibiza",
    djNameHints: ["David Guetta", "Martin Garrix", "Calvin Harris"]
  },

  // ===== NUEVAS FIESTAS Y CONCEPTOS =====
  {
    name: "Paradise City - Jamie Jones",
    date: getFutureDate(0, 6, 7).toISOString(), // Julio 7, 2025
    time: "17:00",
    description: "Jamie Jones presenta Paradise en DC-10 con el mejor tech house y decoración tropical que transporta a otro mundo.",
    imageUrl: "https://picsum.photos/seed/paradisecity/800/600",
    price: "€50-80",
    ticketLink: "https://dc10ibiza.com",
    eventType: "Fiesta Temática",
    ...defaultEntityMeta,
    clubNameHint: "DC-10",
    promoterNameHint: "Paradise Ibiza"
  },
  {
    name: "Glitterbox - Love, Peace & Dancing",
    date: getFutureDate(0, 6, 14).toISOString(), // Julio 14, 2025
    time: "23:00",
    description: "Una celebración de la música disco y house con drag queens, bailarines y una banda sonora edificante en Hï Ibiza.",
    imageUrl: "https://picsum.photos/seed/glitterbox/800/600",
    price: "€55-85",
    ticketLink: "https://hiibiza.com",
    eventType: "Disco House",
    ...defaultEntityMeta,
    clubNameHint: "Hï Ibiza",
    promoterNameHint: "Glitterbox"
  },
  {
    name: "Defected Records - House Music All Life Long",
    date: getFutureDate(0, 6, 21).toISOString(), // Julio 21, 2025
    time: "22:00",
    description: "El sello house más importante del mundo presenta una noche dedicada a la música house en todas sus formas.",
    imageUrl: "https://picsum.photos/seed/defectedibiza/800/600",
    price: "€50-75",
    ticketLink: "https://booomibiza.com",
    eventType: "House Music",
    ...defaultEntityMeta,
    clubNameHint: "Booom! Ibiza",
    promoterNameHint: "Defected Records Ibiza"
  },

  // ===== EVENTOS ESPECIALES Y COLABORACIONES =====
  {
    name: "Music On - Marco Carola's Vision",
    date: getFutureDate(0, 6, 28).toISOString(), // Julio 28, 2025
    time: "23:00",
    description: "Marco Carola presenta Music On en Amnesia con una noche dedicada al techno y tech house de la más alta calidad.",
    imageUrl: "https://picsum.photos/seed/musicon/800/600",
    price: "€60-90",
    ticketLink: "https://www.amnesia.es",
    eventType: "Techno",
    ...defaultEntityMeta,
    clubNameHint: "Amnesia Ibiza",
    djNameHints: ["Marco Carola"],
    promoterNameHint: "Music On"
  },
  {
    name: "Do Not Sleep - Underground Selection",
    date: getFutureDate(0, 7, 5).toISOString(), // Agosto 5, 2025
    time: "01:00",
    description: "Do Not Sleep presenta una selección underground de house y techno para los verdaderos amantes de la música electrónica.",
    imageUrl: "https://picsum.photos/seed/donotsleep/800/600",
    price: "€35-60",
    ticketLink: "#",
    eventType: "Underground",
    ...defaultEntityMeta,
    clubNameHint: "Underground Ibiza",
    promoterNameHint: "Do Not Sleep"
  },

  // ===== BEACH CLUBS Y CHIRINGUITOS =====
  {
    name: "Blue Marlin - Sunset Sessions",
    date: getFutureDate(0, 7, 12).toISOString(), // Agosto 12, 2025
    time: "18:00",
    description: "Las mejores sesiones de sunset en Blue Marlin Ibiza con deep house y vistas espectaculares a la puesta de sol.",
    imageUrl: "https://picsum.photos/seed/bluemarlin/800/600",
    price: "€30-50",
    ticketLink: "https://bluemarlinibiza.com",
    eventType: "Sunset Session",
    ...defaultEntityMeta,
    clubNameHint: "Blue Marlin Ibiza"
  },
  {
    name: "Nikki Beach - White Party",
    date: getFutureDate(0, 7, 19).toISOString(), // Agosto 19, 2025
    time: "16:00",
    description: "La icónica White Party de Nikki Beach donde el dress code es todo blanco y la música es puro house y deep house.",
    imageUrl: "https://picsum.photos/seed/nikkibeach/800/600",
    price: "€60-100",
    ticketLink: "https://nikkibeach.com",
    eventType: "Beach Party",
    ...defaultEntityMeta,
    clubNameHint: "Nikki Beach Ibiza"
  },

  // ===== EVENTOS DE TEMPORADA ALTA =====
  {
    name: "Afterlife - Tale of Us Experience",
    date: getFutureDate(0, 7, 26).toISOString(), // Agosto 26, 2025
    time: "22:00",
    description: "Tale of Us presenta Afterlife en Hï Ibiza con melodic techno y una experiencia audiovisual única.",
    imageUrl: "https://picsum.photos/seed/afterlife/800/600",
    price: "€70-110",
    ticketLink: "https://hiibiza.com",
    eventType: "Melodic Techno",
    ...defaultEntityMeta,
    clubNameHint: "Hï Ibiza",
    djNameHints: ["Tale of Us"],
    promoterNameHint: "Afterlife"
  },
  {
    name: "Solid Grooves - Raw Tech House",
    date: getFutureDate(0, 8, 2).toISOString(), // Septiembre 2, 2025
    time: "16:00",
    description: "El sello de tech house más crudo presenta una tarde de grooves pesados y energía pura en Privilege.",
    imageUrl: "https://picsum.photos/seed/solidgrooves/800/600",
    price: "€45-75",
    ticketLink: "https://privilegeibiza.com",
    eventType: "Tech House",
    ...defaultEntityMeta,
    clubNameHint: "Privilege Ibiza",
    promoterNameHint: "Solid Grooves"
  },

  // ===== CLOSING SEASON =====
  {
    name: "Ibiza Closing Fiesta 2025",
    date: getFutureDate(0, 9, 15).toISOString(), // Octubre 15, 2025
    time: "20:00",
    description: "La despedida oficial de la temporada 2025 con todos los DJs residentes y una celebración épica hasta el amanecer.",
    imageUrl: "https://picsum.photos/seed/ibizaclosing2025/800/600",
    price: "€80-120",
    ticketLink: "#",
    eventType: "Cierre de Temporada",
    ...defaultEntityMeta,
    clubNameHint: "Pacha Ibiza",
    djNameHints: ["David Guetta", "Solomun", "Martin Garrix"]
  }
];

export const EVENT_TYPES = ["Noche de Club", "Fiesta en Terraza", "Fiesta en la Playa", "Fiesta en Villa", "Fiesta de Día", "Sesión Atardecer", "Fiesta de Apertura", "Fiesta de Cierre", "Festival", "Concierto", "After Party", "Pool Party", "Boat Party", "Fiesta Retro", "Fiesta Temática"];
export const DJ_GENRES = ["Techno", "House", "Trance", "Balearic House", "Deep House", "Tech House", "Minimal Techno", "Progressive House", "Melodic House & Techno", "Melodic Techno", "Organic House", "Afro House", "Disco", "Funk", "Soulful House", "Reggaeton", "EDM", "Drum & Bass", "Ambient", "Hip Hop", "R&B", "Latin", "World Music", "Chill Out", "Grime", "Pop", "Commercial Dance", "Hard Techno", "Industrial", "Acid Techno"];
export const SOCIAL_PLATFORMS = ["SoundCloud", "Mixcloud", "Instagram", "Facebook", "Twitter", "YouTube", "Spotify", "Beatport", "Resident Advisor", "TikTok", "Website", "Telegram", "WhatsApp"];
export const USER_PROFILE_TYPES: { value: UserData['userProfileType'], labelKey: string }[] = [
  { value: 'consumer', labelKey: 'userProfileType.consumer' },
  { value: 'dj', labelKey: 'userProfileType.dj' },
  { value: 'promoter_staff', labelKey: 'userProfileType.promoterStaff' },
  { value: 'venue_staff', labelKey: 'userProfileType.venueStaff' },
  { value: 'artist', labelKey: 'userProfileType.artist' },
];


export const PUBLIC_NAVIGATION_ITEMS = [
  { nameKey: "nav.events", path: "/" },
  { nameKey: "nav.djs", path: "/djs" },
  { nameKey: "nav.promoters", path: "/promoters" },
  { nameKey: "nav.clubs", path: "/clubs" },
];

export const USER_NAVIGATION_ITEMS = [
    { nameKey: "nav.userDashboard", path: "/user/dashboard"},
];

export const ADMIN_NAVIGATION_ITEMS = [
  { nameKey: "nav.adminDashboard", path: "/admin/dashboard" },
  { nameKey: "nav.adminPendingApprovals", path: "/admin/pending-approvals" },
  { nameKey: "nav.adminEvents", path: "/admin/events" },
  { nameKey: "nav.adminDJs", path: "/admin/djs" },
  { nameKey: "nav.adminPromoters", path: "/admin/promoters" },
  { nameKey: "nav.adminClubs", path: "/admin/clubs" },
  { nameKey: "nav.adminUsers", path: "/admin/users" },
];

export const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFKD') 
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '') 
    .replace(/--+/g, '-'); 
};


export const PRIVACY_POLICY_TEXT_ES = `
<h1 class="text-2xl font-bold mb-4">Política de Privacidad</h1>
<p class="mb-2">Fecha de última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
<h2 class="text-xl font-semibold mt-4 mb-2">1. Introducción</h2>
<p class="mb-2">Bienvenido a Sun & Flower Ibiza Calendar. Nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">2. Información que Recopilamos</h2>
<p class="mb-2">Podemos recopilar información personal como tu nombre, nombre de usuario, dirección de correo electrónico, país, estilos de música preferidos, tipo de perfil de usuario y datos de uso cuando te registras y utilizas nuestros servicios. También la información que publicas (eventos, DJs, etc.).</p>
<h2 class="text-xl font-semibold mt-4 mb-2">3. Uso de tu Información</h2>
<p class="mb-2">Usamos tu información para:</p>
<ul class="list-disc list-inside mb-2 ml-4">
  <li>Proporcionar y mejorar nuestros servicios.</li>
  <li>Permitir la publicación y gestión de contenido por parte de los usuarios.</li>
  <li>Personalizar tu experiencia.</li>
  <li>Comunicarnos contigo sobre tu cuenta o nuestros servicios, incluyendo información sobre recuperación de contraseña.</li>
  <li>Con fines de marketing y promoción, incluyendo la posible compartición de datos con terceros de confianza (ej. promotoras, clubs, agencias de marketing) para fines relevantes a la industria de eventos y entretenimiento en Ibiza, siempre que hayas otorgado tu consentimiento explícito para ello donde sea requerido por ley, o como parte necesaria para la prestación del servicio (ej. información de eventos públicos).</li>
</ul>
<h2 class="text-xl font-semibold mt-4 mb-2">4. Compartir tu Información</h2>
<p class="mb-2">El contenido que publicas (eventos, perfiles de DJ, etc.) es público por naturaleza. No vendemos tu información personal identificable directa (como email no público) a terceros sin tu consentimiento explícito, excepto como se describe en esta política o si es requerido por ley. Podríamos compartir datos agregados o anonimizados con socios o con fines de análisis. Al aceptar nuestros términos, reconoces que la información pública que proporcionas puede ser utilizada y compartida por nosotros y terceros para promoción y otros fines relacionados con la plataforma.</p>
<p class="mb-2"><strong>Importante sobre datos a terceros:</strong> Al aceptar nuestros términos y condiciones y utilizar la plataforma para publicar contenido, aceptas que cierta información (incluyendo, pero no limitado a, detalles de eventos, nombres de DJs/promotoras/clubs que publiques, tu nombre de usuario si es público, país y tipo de perfil de usuario) puede ser compartida con terceras partes, incluyendo nuestros socios comerciales, con el fin de promocionar los eventos y la plataforma, realizar análisis de mercado, y ofrecer servicios relacionados. Nos reservamos el derecho de utilizar esta información, incluyendo la posibilidad de transferirla o venderla como parte de un conjunto de datos, siempre cumpliendo con la legislación aplicable en materia de protección de datos.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">5. Seguridad de Datos</h2>
<p class="mb-2">Implementamos medidas de seguridad razonables para proteger tu información, pero ninguna transmisión por Internet es 100% segura.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">6. Tus Derechos</h2>
<p class="mb-2">Tienes derecho a acceder, corregir o eliminar tu información personal. Contacta con nosotros para ejercer estos derechos.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">7. Política de Cookies</h2>
<p class="mb-2">Consulta nuestra <a href="#/cookie-policy" class="text-brand-orange hover:underline">Política de Cookies</a> para más información.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">8. Cambios a esta Política</h2>
<p class="mb-2">Podemos actualizar esta política. Te notificaremos los cambios importantes por email o mediante un aviso en la plataforma.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">9. Contacto</h2>
<p>Si tienes preguntas, contáctanos en <a href="mailto:privacy@sunflower.ibiza" class="text-brand-orange hover:underline">privacy@sunflower.ibiza</a>.</p>
`;

export const PRIVACY_POLICY_TEXT_EN = `
<h1 class="text-2xl font-bold mb-4">Privacy Policy</h1>
<p class="mb-2">Last updated: ${new Date().toLocaleDateString('en-US')}</p>
<h2 class="text-xl font-semibold mt-4 mb-2">1. Introduction</h2>
<p class="mb-2">Welcome to Sun & Flower Ibiza Calendar. We take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">2. Information We Collect</h2>
<p class="mb-2">We may collect personal information such as your name, username, email address, country, preferred music styles, user profile type, and usage data when you register and use our services. Also, information you post (events, DJs, etc.).</p>
<h2 class="text-xl font-semibold mt-4 mb-2">3. Use of Your Information</h2>
<p class="mb-2">We use your information to:</p>
<ul class="list-disc list-inside mb-2 ml-4">
  <li>Provide and improve our services.</li>
  <li>Enable users to post and manage content.</li>
  <li>Personalize your experience.</li>
  <li>Communicate with you about your account or our services, including password recovery information.</li>
  <li>For marketing and promotional purposes, including potentially sharing data with trusted third parties (e.g., promoters, clubs, marketing agencies) for purposes relevant to the Ibiza events and entertainment industry, provided you have given explicit consent where required by law, or as a necessary part of service provision (e.g., public event information).</li>
</ul>
<h2 class="text-xl font-semibold mt-4 mb-2">4. Sharing Your Information</h2>
<p class="mb-2">Content you post (events, DJ profiles, etc.) is public by nature. We do not sell your direct personally identifiable information (like non-public email) to third parties without your explicit consent, except as described in this policy or if required by law. We may share aggregated or anonymized data with partners or for analytics. By accepting our terms, you acknowledge that public information you provide may be used and shared by us and third parties for promotion and other platform-related purposes.</p>
<p class="mb-2"><strong>Importante sobre datos a terceros:</strong> By accepting our terms and conditions and using the platform to publish content, you agree that certain information (including, but not limited to, event details, names of DJs/promoters/clubs you publish, your username if public, country, and user profile type) may be shared with third parties, including our business partners, for the purpose of promoting events and the platform, conducting market analysis, and offering related services. We reserve the right to use this information, including the possibility of transferring or selling it as part of a dataset, always in compliance with applicable data protection legislation.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">5. Data Security</h2>
<p class="mb-2">We implement reasonable security measures to protect your information, but no internet transmission is 100% secure.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">6. Your Rights</h2>
<p class="mb-2">You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">7. Cookie Policy</h2>
<p class="mb-2">Please see our <a href="#/cookie-policy" class="text-brand-orange hover:underline">Cookie Policy</a> for more information.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">8. Changes to this Policy</h2>
<p class="mb-2">We may update this policy. We will notify you of significant changes via email or a notice on the platform.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">9. Contact</h2>
<p>If you have questions, contact us at <a href="mailto:privacy@sunflower.ibiza" class="text-brand-orange hover:underline">privacy@sunflower.ibiza</a>.</p>
`;


export const LEGAL_NOTICE_TEXT_ES = `
<h1 class="text-2xl font-bold mb-4">Aviso Legal</h1>
<p class="mb-2">Fecha de última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
<h2 class="text-xl font-semibold mt-4 mb-2">1. Titularidad del Sitio Web</h2>
<p class="mb-2">Este sitio web, Sun & Flower Ibiza Calendar, es operado por [Nombre Legal de la Empresa/Agencia], con domicilio en [Dirección Fiscal] y CIF [Número de Identificación Fiscal] (en adelante, "la Agencia").</p>
<h2 class="text-xl font-semibold mt-4 mb-2">2. Propiedad Intelectual</h2>
<p class="mb-2">Todo el contenido de este sitio, incluyendo textos, gráficos, logos, iconos, imágenes, así como el software, es propiedad de la Agencia o sus licenciantes y está protegido por las leyes de propiedad intelectual e industrial. El contenido subido por los usuarios es responsabilidad de los mismos, quienes ceden a la Agencia una licencia no exclusiva, mundial y transferible para usar, reproducir, distribuir y mostrar dicho contenido en relación con el servicio de la plataforma.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">3. Uso del Sitio Web y Responsabilidad del Usuario</h2>
<p class="mb-2">El uso de este sitio está sujeto a los presentes términos y condiciones, así como a nuestra Política de Privacidad y Política de Cookies. Al acceder y utilizar el sitio, aceptas estos términos en su totalidad.</p>
<p class="mb-2">Los usuarios son responsables del contenido que suben, asegurando que tienen los derechos necesarios para ello y que no infringe derechos de terceros ni la legalidad vigente. La Agencia se reserva el derecho de retirar cualquier contenido que considere inapropiado, ilegal, o que infrinja estos términos, sin previo aviso.</p>
<p class="mb-2">Está prohibido el uso del sitio para fines ilícitos, difamatorios, o que puedan dañar la imagen de la Agencia o de terceros.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">4. Limitación de Responsabilidad</h2>
<p class="mb-2">La Agencia actúa como intermediaria y no se hace responsable por la exactitud, veracidad o legalidad del contenido publicado por los usuarios (eventos, DJs, etc.). Aunque la Agencia puede realizar verificaciones, no puede garantizar la total corrección de la información. La Agencia no será responsable de cancelaciones de eventos, cambios de programación, o cualquier daño derivado de la información o servicios ofrecidos en la plataforma.</p>
<p class="mb-2">La Agencia no garantiza la disponibilidad ininterrumpida del sitio y no será responsable por fallos técnicos, virus o cualquier otro elemento dañino.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">5. Enlaces a Terceros</h2>
<p class="mb-2">Este sitio puede contener enlaces a sitios web de terceros. La Agencia no controla ni se responsabiliza del contenido o prácticas de privacidad de dichos sitios.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">6. Modificaciones</h2>
<p class="mb-2">La Agencia se reserva el derecho de modificar este Aviso Legal en cualquier momento. Las modificaciones serán efectivas desde su publicación en el sitio.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">7. Ley Aplicable y Jurisdicción</h2>
<p class="mb-2">Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Ibiza, renunciando a cualquier otro fuero que pudiera corresponderles.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">8. Contacto</h2>
<p>Para cualquier consulta legal, contáctanos en <a href="mailto:legal@sunflower.ibiza" class="text-brand-orange hover:underline">legal@sunflower.ibiza</a>.</p>
`;

export const LEGAL_NOTICE_TEXT_EN = `
<h1 class="text-2xl font-bold mb-4">Legal Notice</h1>
<p class="mb-2">Last updated: ${new Date().toLocaleDateString('en-US')}</p>
<h2 class="text-xl font-semibold mt-4 mb-2">1. Website Ownership</h2>
<p class="mb-2">This website, Sun & Flower Ibiza Calendar, is operated by [Legal Company/Agency Name], with registered office at [Tax Address] and VAT ID [Tax Identification Number] (hereinafter, "the Agency").</p>
<h2 class="text-xl font-semibold mt-4 mb-2">2. Intellectual Property</h2>
<p class="mb-2">All content on this site, including text, graphics, logos, icons, images, as well as the software, is the property of the Agency or its licensors and is protected by intellectual and industrial property laws. User-uploaded content is the responsibility of the users, who grant the Agency a non-exclusive, worldwide, transferable license to use, reproduce, distribute, and display such content in connection with the platform's service.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">3. Use of the Website and User Responsibility</h2>
<p class="mb-2">Use of this site is subject to these terms and conditions, as well as our Privacy Policy and Cookie Policy. By accessing and using the site, you accept these terms in their entirety.</p>
<p class="mb-2">Users are responsible for the content they upload, ensuring they have the necessary rights to do so and that it does not infringe third-party rights or current legislation. The Agency reserves the right to remove any content it deems inappropriate, illegal, or that infringes these terms, without prior notice.</p>
<p class="mb-2">The use of the site for illicit, defamatory purposes, or that may damage the image of the Agency or third parties is prohibited.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">4. Limitation of Liability</h2>
<p class="mb-2">The Agency acts as an intermediary and is not responsible for the accuracy, truthfulness, or legality of the content published by users (events, DJs, etc.). Although the Agency may carry out verifications, it cannot guarantee the complete correctness of the information. The Agency will not be liable for event cancellations, schedule changes, or any damage arising from the information or services offered on the platform.</p>
<p class="mb-2">The Agency does not guarantee the uninterrupted availability of the site and will not be responsible for technical failures, viruses, or any other harmful element.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">5. Links to Third Parties</h2>
<p class="mb-2">This site may contain links to third-party websites. The Agency does not control and is not responsible for the content or privacy practices of such sites.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">6. Modifications</h2>
<p class="mb-2">The Agency reserves the right to modify this Legal Notice at any time. Modifications will be effective upon their publication on the site.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">7. Applicable Law and Jurisdiction</h2>
<p class="mb-2">This legal notice is governed by Spanish law. For any dispute, the parties submit to the Courts and Tribunals of Ibiza, waiving any other jurisdiction that may correspond to them.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">8. Contact</h2>
<p>For any legal inquiries, contact us at <a href="mailto:legal@sunflower.ibiza" class="text-brand-orange hover:underline">legal@sunflower.ibiza</a>.</p>
`;


export const COOKIE_POLICY_TEXT_ES = `
<h1 class="text-2xl font-bold mb-4">Política de Cookies</h1>
<p class="mb-2">Fecha de última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
<h2 class="text-xl font-semibold mt-4 mb-2">1. ¿Qué son las Cookies?</h2>
<p class="mb-2">Las cookies son pequeños archivos de texto que los sitios web que visitas colocan en tu dispositivo. Se utilizan ampliamente para que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">2. ¿Cómo Utilizamos las Cookies?</h2>
<p class="mb-2">Utilizamos cookies para:</p>
<ul class="list-disc list-inside mb-2 ml-4">
  <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento del sitio, como mantener tu sesión iniciada o recordar tus preferencias de idioma.</li>
  <li><strong>Cookies de Rendimiento y Analíticas:</strong> Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando y reportando información de forma anónima (Ej: Google Analytics). Esto nos ayuda a mejorar el sitio.</li>
  <li><strong>Cookies de Funcionalidad:</strong> Permiten que el sitio web recuerde elecciones que haces (como tu nombre de usuario, idioma o la región en la que te encuentras) y proporcionan características mejoradas y más personales.</li>
  <li><strong>Cookies de Publicidad/Terceros:</strong> Estas cookies pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios. Pueden ser utilizadas por esas compañías para construir un perfil de tus intereses y mostrarte anuncios relevantes en otros sitios. No almacenan directamente información personal, sino que se basan en la identificación única de tu navegador y dispositivo de internet.</li>
</ul>
<h2 class="text-xl font-semibold mt-4 mb-2">3. Tipos de Cookies que Utilizamos</h2>
<ul class="list-disc list-inside mb-2 ml-4">
  <li><strong>Cookies de Sesión:</strong> Expiran cuando cierras tu navegador.</li>
  <li><strong>Cookies Persistentes:</strong> Permanecen en tu dispositivo durante un período determinado o hasta que las eliminas.</li>
</ul>
<h2 class="text-xl font-semibold mt-4 mb-2">4. Gestión de Cookies</h2>
<p class="mb-2">Puedes controlar y/o eliminar las cookies como desees. Para más información, visita aboutcookies.org. Puedes eliminar todas las cookies que ya están en tu ordenador y puedes configurar la mayoría de los navegadores para evitar que se coloquen. Sin embargo, si haces esto, es posible que tengas que ajustar manually algunas preferencias cada vez que visites un sitio y que algunos servicios y funcionalidades no funcionen.</p>
<p class="mb-2">Al utilizar nuestro sitio, aceptas el uso de cookies de acuerdo con esta Política de Cookies. Si no estás de acuerdo con el uso de cookies de esta manera, debes configurar los ajustes de tu navegador correspondientemente o no utilizar el sitio Sun & Flower Ibiza Calendar.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">5. Cambios a esta Política</h2>
<p class="mb-2">Podemos actualizar esta política. Te notificaremos los cambios importantes.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">6. Contacto</h2>
<p>Si tienes preguntas sobre nuestra política de cookies, contáctanos en <a href="mailto:cookies@sunflower.ibiza" class="text-brand-orange hover:underline">cookies@sunflower.ibiza</a>.</p>
`;

export const COOKIE_POLICY_TEXT_EN = `
<h1 class="text-2xl font-bold mb-4">Cookie Policy</h1>
<p class="mb-2">Last updated: ${new Date().toLocaleDateString('en-US')}</p>
<h2 class="text-xl font-semibold mt-4 mb-2">1. What are Cookies?</h2>
<p class="mb-2">Cookies are small text files that are placed on your device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">2. How We Use Cookies</h2>
<p class="mb-2">We use cookies to:</p>
<ul class="list-disc list-inside mb-2 ml-4">
  <li><strong>Essential Cookies:</strong> Necessary for the site to function, such as keeping your session logged in or remembering your language preferences.</li>
  <li><strong>Performance and Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously (e.g., Google Analytics). This helps us improve the site.</li>
  <li><strong>Functionality Cookies:</strong> Enable the website to remember choices you make (such as your user name, language or the region you are in) and provide enhanced, more personal features.</li>
  <li><strong>Advertising/Third-Party Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device.</li>
</ul>
<h2 class="text-xl font-semibold mt-4 mb-2">3. Types of Cookies We Use</h2>
<ul class="list-disc list-inside mb-2 ml-4">
  <li><strong>Session Cookies:</strong> Expire when you close your browser.</li>
  <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them.</li>
</ul>
<h2 class="text-xl font-semibold mt-4 mb-2">4. Managing Cookies</h2>
<p class="mb-2">You can control and/or delete cookies as you wish – for details, see aboutcookies.org. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.</p>
<p class="mb-2">By using our site, you consent to the use of cookies in accordance with this Cookie Policy. If you do not agree to the use of cookies in this way, you should set your browser settings accordingly or not use the Sun & Flower Ibiza Calendar site.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">5. Changes to this Policy</h2>
<p class="mb-2">We may update this policy. We will notify you of significant changes.</p>
<h2 class="text-xl font-semibold mt-4 mb-2">6. Contact</h2>
<p>If you have questions about our cookie policy, contact us at <a href="mailto:cookies@sunflower.ibiza" class="text-brand-orange hover:underline">cookies@sunflower.ibiza</a>.</p>
`;