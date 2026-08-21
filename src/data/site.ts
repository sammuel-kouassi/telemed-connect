import heroImg from "@/assets/hero.jpg";
import teleecgImg from "@/assets/teleecg.jpg";
import formationImg from "@/assets/formation.jpg";
import teleexpertiseImg from "@/assets/teleexpertise.jpg";
import evenementImg from "@/assets/evenement.jpg";

export const images = {
  hero: heroImg,
  teleecg: teleecgImg,
  formation: formationImg,
  teleexpertise: teleexpertiseImg,
  evenement: evenementImg,
};

export const stats = [
  { value: 4200, suffix: "+", label: "Télé-ECG réalisés" },
  { value: 24, suffix: "", label: "Sites connectés" },
  { value: 12, suffix: "", label: "Partenaires" },
  { value: 860, suffix: "+", label: "Professionnels formés" },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Actualité" | "Projet" | "Formation" | "Recherche";
  date: string;
  readingTime: string;
  author: string;
  image: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "dix-ans-raft-cote-divoire",
    title: "La Côte d'Ivoire accueille les 10 ans du réseau RAFT",
    excerpt:
      "Le Réseau en Afrique Francophone pour la Télémédecine a confié à la Côte d'Ivoire l'organisation de son dixième anniversaire, consacrant son rôle de référence en télé-expertise.",
    category: "Actualité",
    date: "2026-07-12",
    readingTime: "4 min",
    author: "Rédaction du portail",
    image: evenementImg,
    body: [
      "En reconnaissance de la performance et de l'engagement de l'équipe RAFT Côte d'Ivoire, le Réseau en Afrique Francophone pour la Télémédecine a confié à Abidjan l'organisation de la célébration de ses dix années d'activité.",
      "Trois jours d'ateliers ont réuni cliniciens, ingénieurs biomédicaux, décideurs et partenaires techniques autour d'une question centrale : comment passer d'un réseau de projets pilotes à un service public de télémédecine pérenne ?",
      "Les travaux ont abouti à une feuille de route articulée autour de quatre priorités : l'interopérabilité des dossiers patients, la formation continue à distance, le financement durable des plateaux techniques et l'évaluation médico-économique systématique des projets.",
      "La délégation ivoirienne a présenté les résultats du programme Télé-ECG, aujourd'hui déployé dans plus de vingt structures, dont dix centres de santé de premier niveau.",
    ],
  },
  {
    slug: "tele-ecg-bilan-programme",
    title: "Télé-ECG : un diagnostic cardiologique à portée des centres ruraux",
    excerpt:
      "Grâce à des électrocardiographes connectés et à un pool de cardiologues de garde, les centres de santé périphériques obtiennent une interprétation experte en moins de trente minutes.",
    category: "Projet",
    date: "2026-06-28",
    readingTime: "6 min",
    author: "Dr. Innocent NANAN",
    image: teleecgImg,
    body: [
      "Le projet de télé-électrocardiographie a été mis en œuvre en Côte d'Ivoire à partir de 2014, en partenariat avec l'ONG Wake Up Africa, dans au moins vingt structures sanitaires.",
      "Le principe est simple : un infirmier formé réalise l'examen sur un appareil connecté, le tracé est transmis de façon sécurisée à la plateforme, puis interprété par un cardiologue référent qui renvoie un compte rendu structuré.",
      "Le bénéfice clinique est immédiat pour les populations éloignées des centres de référence : les urgences coronariennes sont orientées plus vite, les faux transferts diminuent et les patients stables sont suivis localement.",
      "Le programme a également produit un effet de formation : chaque tracé commenté devient un support pédagogique pour l'équipe locale, ce qui renforce durablement les compétences.",
    ],
  },
  {
    slug: "tele-formation-competences",
    title: "Télé-formation : renforcer les compétences par les TIC",
    excerpt:
      "Un dispositif de formation médicale à distance permet aux professionnels de santé de suivre des séminaires spécialisés sans quitter leur poste.",
    category: "Formation",
    date: "2026-05-19",
    readingTime: "5 min",
    author: "Roger KPON",
    image: formationImg,
    body: [
      "La télémédecine ivoirienne est née de la formation : dès 2004, la formation médicale à distance a constitué la première pierre du réseau, grâce à la rencontre entre le Dr Benjamin GOLD et le Pr EHUA Somian Francis.",
      "Aujourd'hui, des séminaires hebdomadaires sont diffusés vers les CHU et les districts sanitaires, avec des sessions interactives de questions-réponses et des supports téléchargeables.",
      "Les thématiques couvrent la cardiologie, la santé maternelle et néonatale, l'imagerie, l'hygiène hospitalière et la gestion des données de santé.",
      "Chaque session est archivée dans la médiathèque du portail afin d'être réutilisée en autoformation par les équipes qui n'ont pas pu se connecter en direct.",
    ],
  },
  {
    slug: "tele-expertise-cardiologie-chu",
    title: "Télé-expertise en cardiologie : ce que disent les praticiens",
    excerpt:
      "Au CHU de Yopougon comme au centre Focolari de Man, la télé-expertise change la vitesse du diagnostic et la qualité de l'orientation des cas complexes.",
    category: "Recherche",
    date: "2026-04-30",
    readingTime: "7 min",
    author: "Pr EHUA Somian Francis",
    image: teleexpertiseImg,
    body: [
      "Une enquête menée auprès des équipes utilisatrices montre une forte adhésion à la télé-expertise en cardiologie, avec une amélioration perçue de la rapidité des diagnostics.",
      "Les praticiens interrogés soulignent trois apports : l'avis spécialisé rapide, la meilleure orientation des cas complexes et la montée en compétence des équipes locales.",
      "Les freins identifiés restent la qualité de la connectivité dans certaines localités, la maintenance des équipements et la nécessité d'un cadre réglementaire clair pour la responsabilité médicale à distance.",
      "Ces résultats alimentent le plaidoyer pour l'inscription de la télémédecine dans les mécanismes nationaux de financement de la santé.",
    ],
  },
  {
    slug: "feuille-de-route-sante-numerique",
    title: "Santé numérique : les priorités d'interopérabilité pour 2027",
    excerpt:
      "Dossier patient partagé, identifiants uniques, standards HL7/FHIR : le portail publie les orientations techniques retenues par les acteurs du réseau.",
    category: "Actualité",
    date: "2026-03-14",
    readingTime: "5 min",
    author: "Comité technique",
    image: heroImg,
    body: [
      "L'extension de la télémédecine dépend moins des équipements que de la capacité des systèmes à échanger des données de façon fiable et sécurisée.",
      "Le comité technique recommande l'adoption progressive des standards HL7 FHIR pour les échanges cliniques et DICOM pour l'imagerie, avec un référentiel national d'identification des structures.",
      "Un chantier de gouvernance des données accompagne ces choix : consentement du patient, traçabilité des accès, durée de conservation et hébergement souverain des données de santé.",
      "Un guide d'implémentation destiné aux éditeurs et aux directions informatiques hospitalières sera publié dans la médiathèque.",
    ],
  },
];

export type MediaItem = {
  id: string;
  title: string;
  type: "Photo" | "Vidéo" | "Document";
  theme: string;
  date: string;
  image: string;
  description: string;
};

export const mediaItems: MediaItem[] = [
  {
    id: "m1",
    title: "Réalisation d'un télé-ECG en centre de santé rural",
    type: "Photo",
    theme: "Télé-ECG",
    date: "2026-06-10",
    image: teleecgImg,
    description: "Pose des électrodes par une infirmière formée au protocole de télé-électrocardiographie.",
  },
  {
    id: "m2",
    title: "Séminaire de télé-formation inter-CHU",
    type: "Vidéo",
    theme: "Formation",
    date: "2026-05-22",
    image: formationImg,
    description: "Session interactive diffusée simultanément vers cinq structures sanitaires.",
  },
  {
    id: "m3",
    title: "Staff de télé-expertise cardiologique",
    type: "Photo",
    theme: "Télé-expertise",
    date: "2026-05-04",
    image: teleexpertiseImg,
    description: "Discussion d'un dossier complexe entre équipe locale et cardiologue référent.",
  },
  {
    id: "m4",
    title: "Dix ans du réseau RAFT à Abidjan",
    type: "Photo",
    theme: "Événements",
    date: "2026-07-12",
    image: evenementImg,
    description: "Plénière d'ouverture de la célébration des dix ans du réseau.",
  },
  {
    id: "m5",
    title: "Guide d'interprétation des tracés transmis",
    type: "Document",
    theme: "Télé-ECG",
    date: "2026-02-18",
    image: teleecgImg,
    description: "Protocole de qualité de tracé et critères de transmission urgente.",
  },
  {
    id: "m6",
    title: "Consultation à distance au CHU",
    type: "Vidéo",
    theme: "Télé-expertise",
    date: "2026-01-27",
    image: heroImg,
    description: "Démonstration du parcours complet d'une télé-expertise, de la demande au compte rendu.",
  },
  {
    id: "m7",
    title: "Atelier d'interopérabilité des données de santé",
    type: "Document",
    theme: "Santé numérique",
    date: "2025-11-30",
    image: evenementImg,
    description: "Synthèse des recommandations techniques HL7 FHIR et DICOM.",
  },
  {
    id: "m8",
    title: "Formation pratique des techniciens biomédicaux",
    type: "Photo",
    theme: "Formation",
    date: "2025-10-15",
    image: formationImg,
    description: "Maintenance de premier niveau des électrocardiographes connectés.",
  },
];

export const mediaThemes = ["Tous", "Télé-ECG", "Télé-expertise", "Formation", "Événements", "Santé numérique"];

export type FaqItem = { question: string; answer: string; category: string };

export const faqCategories = ["Général", "Patients", "Professionnels", "Technique"];

export const faqItems: FaqItem[] = [
  {
    category: "Général",
    question: "Qu'est-ce que la télémédecine ?",
    answer:
      "La télémédecine est une pratique médicale à distance utilisant les technologies de l'information. Elle regroupe la téléconsultation, la télé-expertise, la télésurveillance, la téléassistance et la régulation médicale.",
  },
  {
    category: "Général",
    question: "Quel est le rôle de ce portail ?",
    answer:
      "Le portail informe sur les projets de télémédecine en Côte d'Ivoire, recense les structures connectées, publie les ressources de formation et met en relation les acteurs du réseau.",
  },
  {
    category: "Général",
    question: "Qui coordonne la télémédecine en Côte d'Ivoire ?",
    answer:
      "Les activités sont coordonnées par l'équipe RAFT Côte d'Ivoire, en collaboration avec les CHU, les districts sanitaires, les partenaires techniques et les ONG impliquées.",
  },
  {
    category: "Patients",
    question: "La télémédecine remplace-t-elle une consultation classique ?",
    answer:
      "Non. Elle complète le parcours de soins. L'examen est réalisé dans une structure de proximité par un professionnel de santé, l'avis spécialisé étant apporté à distance.",
  },
  {
    category: "Patients",
    question: "Mes données de santé sont-elles protégées ?",
    answer:
      "Les échanges sont réalisés via des plateformes sécurisées, avec traçabilité des accès. Les données ne sont consultées que par les professionnels intervenant dans votre prise en charge.",
  },
  {
    category: "Patients",
    question: "Combien de temps faut-il pour obtenir un résultat ?",
    answer:
      "Pour un télé-ECG, l'interprétation est généralement transmise en moins de trente minutes lorsqu'une urgence est signalée, et sous 24 heures pour les examens programmés.",
  },
  {
    category: "Professionnels",
    question: "Comment rejoindre le réseau avec ma structure ?",
    answer:
      "Adressez une demande via le formulaire de contact en précisant votre structure, son plateau technique et vos besoins. Une évaluation de faisabilité technique est ensuite planifiée.",
  },
  {
    category: "Professionnels",
    question: "Existe-t-il des formations certifiantes ?",
    answer:
      "Des sessions de télé-formation sont organisées régulièrement, avec attestation de participation. Les supports restent accessibles dans la médiathèque.",
  },
  {
    category: "Technique",
    question: "Quels équipements sont nécessaires ?",
    answer:
      "Un poste connecté, une connexion internet stable, et selon l'activité un électrocardiographe connecté, une caméra d'examen ou une station d'imagerie compatible.",
  },
  {
    category: "Technique",
    question: "Que faire en cas de panne d'un équipement ?",
    answer:
      "Signalez l'incident via le formulaire de contact en sélectionnant « Support technique ». Un technicien biomédical du réseau prend contact pour le diagnostic et la maintenance.",
  },
];

export type Partner = {
  name: string;
  role: string;
  type: "Institutionnel" | "Technique" | "ONG" | "Académique";
  description: string;
  initials: string;
};

export const partners: Partner[] = [
  {
    name: "RAFT",
    role: "Réseau en Afrique Francophone pour la Télémédecine",
    type: "Institutionnel",
    description:
      "Réseau fondateur qui structure la coopération francophone en télémédecine et accompagne les points focaux nationaux.",
    initials: "RA",
  },
  {
    name: "Ministère de la Santé",
    role: "Tutelle et cadre réglementaire",
    type: "Institutionnel",
    description:
      "Définit les orientations nationales de santé numérique et l'intégration de la télémédecine dans l'offre de soins.",
    initials: "MS",
  },
  {
    name: "Wake Up Africa",
    role: "ONG partenaire du projet Télé-ECG",
    type: "ONG",
    description:
      "Partenaire de mise en œuvre du projet de télé-électrocardiographie et de l'équipement des centres de santé.",
    initials: "WU",
  },
  {
    name: "CHU de Yopougon",
    role: "Centre de référence en télé-expertise",
    type: "Académique",
    description: "Point focal RAFT, pôle de lecture cardiologique et de formation des professionnels de santé.",
    initials: "CY",
  },
  {
    name: "UFR Sciences Médicales d'Abidjan",
    role: "Formation et recherche",
    type: "Académique",
    description: "Conçoit les curricula de formation médicale à distance et pilote les travaux d'évaluation.",
    initials: "UF",
  },
  {
    name: "Hôpitaux Universitaires de Genève",
    role: "Coopération scientifique",
    type: "Technique",
    description: "Appui méthodologique et technologique historique au développement du réseau RAFT.",
    initials: "HU",
  },
  {
    name: "Centre Focolari de Man",
    role: "Site pilote de télé-expertise",
    type: "ONG",
    description: "Structure confessionnelle engagée dans la prise en charge cardiologique assistée à distance.",
    initials: "CF",
  },
  {
    name: "Agence nationale du numérique",
    role: "Infrastructure et connectivité",
    type: "Technique",
    description: "Accompagne la connectivité des sites et l'hébergement souverain des données de santé.",
    initials: "AN",
  },
];

export type DirectoryEntry = {
  name: string;
  category: "CHU" | "Hôpital général" | "Centre de santé" | "Spécialiste";
  city: string;
  region: string;
  services: string[];
  phone: string;
  email: string;
};

export const directory: DirectoryEntry[] = [
  {
    name: "CHU de Yopougon",
    category: "CHU",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Télé-expertise cardiologie", "Télé-formation"],
    phone: "+225 27 23 46 70 00",
    email: "teleexpertise@chu-yopougon.ci",
  },
  {
    name: "CHU de Treichville",
    category: "CHU",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Télé-ECG", "Imagerie à distance"],
    phone: "+225 27 21 24 91 00",
    email: "contact@chu-treichville.ci",
  },
  {
    name: "CHU de Bouaké",
    category: "CHU",
    city: "Bouaké",
    region: "Gbêkê",
    services: ["Télé-expertise", "Télé-formation"],
    phone: "+225 27 31 63 30 00",
    email: "telemedecine@chu-bouake.ci",
  },
  {
    name: "Hôpital général de Korhogo",
    category: "Hôpital général",
    city: "Korhogo",
    region: "Poro",
    services: ["Télé-ECG"],
    phone: "+225 27 36 86 01 20",
    email: "hg.korhogo@sante.ci",
  },
  {
    name: "Centre de santé Focolari",
    category: "Centre de santé",
    city: "Man",
    region: "Tonkpi",
    services: ["Télé-expertise cardiologie"],
    phone: "+225 27 33 79 05 40",
    email: "focolari.man@sante.ci",
  },
  {
    name: "Hôpital général de San Pedro",
    category: "Hôpital général",
    city: "San Pedro",
    region: "San Pedro",
    services: ["Télé-ECG", "Télé-formation"],
    phone: "+225 27 34 71 12 30",
    email: "hg.sanpedro@sante.ci",
  },
  {
    name: "Hôpital général de Daloa",
    category: "Hôpital général",
    city: "Daloa",
    region: "Haut-Sassandra",
    services: ["Télé-ECG"],
    phone: "+225 27 32 78 21 44",
    email: "hg.daloa@sante.ci",
  },
  {
    name: "Centre de santé urbain d'Abengourou",
    category: "Centre de santé",
    city: "Abengourou",
    region: "Indénié-Djuablin",
    services: ["Télé-ECG"],
    phone: "+225 27 35 91 30 12",
    email: "csu.abengourou@sante.ci",
  },
  {
    name: "Pr EHUA Somian Francis",
    category: "Spécialiste",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Point focal RAFT", "Chirurgie"],
    phone: "+225 27 23 46 70 12",
    email: "point.focal@telemedecine.ci",
  },
  {
    name: "Dr. DOUMBIA Mamadou",
    category: "Spécialiste",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Cardiologie", "Télé-expertise"],
    phone: "+225 27 23 46 70 18",
    email: "cardio.yopougon@telemedecine.ci",
  },
  {
    name: "Dr. Innocent NANAN",
    category: "Spécialiste",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Coordination technique", "Télé-ECG"],
    phone: "+225 27 22 41 55 09",
    email: "coordination@telemedecine.ci",
  },
  {
    name: "Hôpital général de Yamoussoukro",
    category: "Hôpital général",
    city: "Yamoussoukro",
    region: "Bélier",
    services: ["Télé-ECG", "Télé-formation"],
    phone: "+225 27 30 64 02 10",
    email: "hg.yamoussoukro@sante.ci",
  },
];

export type ProjectSite = {
  id: string;
  city: string;
  region: string;
  lon: number;
  lat: number;
  program: "Télé-ECG" | "Télé-expertise" | "Télé-formation";
  structures: number;
  since: number;
  detail: string;
};

export const projectSites: ProjectSite[] = [
  {
    id: "abidjan",
    city: "Abidjan",
    region: "Abidjan",
    lon: -4.03,
    lat: 5.35,
    program: "Télé-expertise",
    structures: 6,
    since: 2004,
    detail: "Pôle national de lecture cardiologique et centre de diffusion des télé-formations.",
  },
  {
    id: "bouake",
    city: "Bouaké",
    region: "Gbêkê",
    lon: -5.03,
    lat: 7.69,
    program: "Télé-formation",
    structures: 3,
    since: 2012,
    detail: "Relais régional de formation médicale à distance pour le centre du pays.",
  },
  {
    id: "korhogo",
    city: "Korhogo",
    region: "Poro",
    lon: -5.63,
    lat: 9.46,
    program: "Télé-ECG",
    structures: 2,
    since: 2015,
    detail: "Transmission des tracés vers Abidjan pour les urgences cardiologiques du Nord.",
  },
  {
    id: "man",
    city: "Man",
    region: "Tonkpi",
    lon: -7.55,
    lat: 7.41,
    program: "Télé-expertise",
    structures: 2,
    since: 2014,
    detail: "Site pilote historique de la télé-expertise en cardiologie à l'Ouest.",
  },
  {
    id: "sanpedro",
    city: "San Pedro",
    region: "San Pedro",
    lon: -6.64,
    lat: 4.75,
    program: "Télé-ECG",
    structures: 2,
    since: 2016,
    detail: "Couverture du littoral sud-ouest et des populations des zones portuaires.",
  },
  {
    id: "daloa",
    city: "Daloa",
    region: "Haut-Sassandra",
    lon: -6.45,
    lat: 6.88,
    program: "Télé-ECG",
    structures: 2,
    since: 2015,
    detail: "Appui aux districts sanitaires du centre-ouest pour le dépistage cardiovasculaire.",
  },
  {
    id: "abengourou",
    city: "Abengourou",
    region: "Indénié-Djuablin",
    lon: -3.49,
    lat: 6.73,
    program: "Télé-ECG",
    structures: 1,
    since: 2017,
    detail: "Site de l'Est connecté au pool de cardiologues de garde.",
  },
  {
    id: "bondoukou",
    city: "Bondoukou",
    region: "Gontougo",
    lon: -2.8,
    lat: 8.04,
    program: "Télé-formation",
    structures: 1,
    since: 2018,
    detail: "Participation aux séminaires hebdomadaires en santé maternelle et néonatale.",
  },
  {
    id: "yamoussoukro",
    city: "Yamoussoukro",
    region: "Bélier",
    lon: -5.28,
    lat: 6.82,
    program: "Télé-ECG",
    structures: 2,
    since: 2014,
    detail: "Plateau technique central relayant les examens des districts voisins.",
  },
  {
    id: "odienne",
    city: "Odienné",
    region: "Kabadougou",
    lon: -7.56,
    lat: 9.51,
    program: "Télé-ECG",
    structures: 1,
    since: 2019,
    detail: "Site le plus septentrional du réseau, connecté par liaison satellitaire de secours.",
  },
  {
    id: "gagnoa",
    city: "Gagnoa",
    region: "Gôh",
    lon: -5.95,
    lat: 6.13,
    program: "Télé-ECG",
    structures: 1,
    since: 2017,
    detail: "Dépistage cardiovasculaire en milieu agricole et suivi des patients hypertendus.",
  },
  {
    id: "aboisso",
    city: "Aboisso",
    region: "Sud-Comoé",
    lon: -3.2,
    lat: 5.47,
    program: "Télé-expertise",
    structures: 1,
    since: 2018,
    detail: "Orientation des cas complexes vers les CHU d'Abidjan sans transfert inutile.",
  },
];

export const programColors: Record<ProjectSite["program"], string> = {
  "Télé-ECG": "var(--color-accent)",
  "Télé-expertise": "var(--color-primary)",
  "Télé-formation": "var(--color-gold)",
};

export const team = [
  { name: "Pr EHUA Somian Francis", role: "Point focal RAFT Côte d'Ivoire", initials: "EF" },
  { name: "Roger KPON", role: "Coordonnateur technique", initials: "RK" },
  { name: "Dr. Innocent NANAN", role: "Coordonnateur technique", initials: "IN" },
  { name: "Dr. Florent DIBY", role: "Président ONG Wake Up Africa", initials: "FD" },
];

export const testimonials = [
  {
    quote:
      "Le RAFT a confié à la Côte d'Ivoire l'organisation de ses dix ans, consacrant son rôle de référence dans le développement de la télé-expertise en Afrique.",
    author: "Pr Antoine GEISSBUHLER",
    role: "Directeur du réseau RAFT",
  },
  {
    quote:
      "La télé-expertise en cardiologie a considérablement amélioré la prise en charge de nos patients : nous obtenons rapidement des avis spécialisés et orientons mieux les cas complexes.",
    author: "Dr. Carlo MONTAGUTI",
    role: "Centre Focolari, Man",
  },
  {
    quote:
      "Ce projet transforme nos pratiques quotidiennes : diagnostics plus rapides, compétences renforcées et meilleure prise en charge sur tout le territoire.",
    author: "Dr. DOUMBIA Mamadou",
    role: "Point focal RAFT, CHU de Yopougon",
  },
];
