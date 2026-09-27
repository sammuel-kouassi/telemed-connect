import heroImg from "@/assets/hero.jpg";
import teleecgImg from "@/assets/teleecg.jpg";
import formationImg from "@/assets/formation.jpg";
import teleexpertiseImg from "@/assets/teleexpertise.jpg";
import evenementImg from "@/assets/evenement.jpg";

import telemedLogo from "@/assets/telemed_logo.webp";
import partnerSante from "@/assets/partner_sante.webp";
import partnerAnsut from "@/assets/partner_ansut.webp";
import partnerTransition from "@/assets/partner_transition.webp";
import partnerCsrs from "@/assets/partner_csrs.webp";

import testimonialMontaguti from "@/assets/testimonial_montaguti.webp";
import testimonialDoumbia from "@/assets/testimonial_doumbia.webp";
import testimonialGeissbuhler from "@/assets/testimonial_geissbuhler.webp";

import pioneerEhua from "@/assets/pioneer_ehua.webp";
import pioneerRkpon from "@/assets/pioneer_rkpon.webp";
import pioneerNanan from "@/assets/pioneer_nanan.webp";
import pioneerDiby from "@/assets/pioneer_diby.webp";

import cartographieOfficielle from "@/assets/cartographie_officielle.webp";
import raftCiMembres from "@/assets/raft_ci_membres.jpg";

export const images = {
  hero: heroImg,
  teleecg: teleecgImg,
  formation: formationImg,
  teleexpertise: teleexpertiseImg,
  evenement: evenementImg,
  logo: telemedLogo,
  cartographie: cartographieOfficielle,
  membres: raftCiMembres,
};

export const officialContact = {
  phones: ["+225 01 73 99 67 82", "+225 07 49 42 30 73"],
  mainPhone: "+225 01 73 99 67 82",
  email: "info@telemedecine.ci",
  secondaryEmail: "contact@telemedecine.ci",
  address: "Centre de Télémédecine, CHU de Yopougon, Abidjan, Côte d'Ivoire",
  hoursWeekday: "Lundi – Vendredi : 09h00 – 17h00 GMT",
  hoursSaturday: "Samedi : 10h00 – 12h00 GMT",
  emergencyNote: "Astreinte Télé-ECG 24h/24 & 7j/7 pour les urgences cardiologiques",
};

export const stats = [
  { value: 4200, suffix: "+", label: "Télé-ECG réalisés" },
  { value: 24, suffix: "", label: "Sites connectés" },
  { value: 4, suffix: "", label: "Partenaires officiels" },
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
    slug: "mission-phase-2-projet-tele-ecg",
    title: "Mission Phase 2 du projet Télé-ECG : intelligence artificielle & plateforme ResoDoc",
    excerpt:
      "Dans le cadre de la phase 2 du projet Télé-ECG, le réseau ivoirien intègre l'assistance à l'interprétation par IA pour soutenir les praticiens dans les centres périphériques.",
    category: "Projet",
    date: "2026-06-22",
    readingTime: "5 min",
    author: "Coordination RAFT Côte d'Ivoire",
    image: teleecgImg,
    body: [
      "Le projet de télé-électrocardiographie (Télé-ECG) en Côte d'Ivoire franchit une étape majeure avec le déploiement de sa Phase 2. Après une première phase pilote couronnée de succès dans dix centres de santé, l'accent est désormais mis sur l'interopérabilité avancée et l'assistance à la lecture cardiologique.",
      "Le Réseau en Afrique Francophone pour la Télémédecine (RAFT), en partenariat avec l'ONG Wake Up Africa (WUA), a procédé dès 2014 à l'installation des premiers kits dans les centres régionaux. La Phase 2 étend ce dispositif vers de nouveaux districts sanitaires.",
      "Grâce à l'appui de la plateforme e-santé ResoDoc et des algorithmes d'analyse pré-diagnostique, les tracés capturés en zone rurale sont pré-qualifiés instantanément avant validation par le pool de cardiologues de garde du CHU de Bouaké et des CHU d'Abidjan.",
      "Cette évolution permet de réduire le délai de prise en charge des infarctus du myocarde et des troubles du rythme sévères, tout en évitant des évacuations sanitaires coûteuses et éprouvantes pour les familles.",
    ],
  },
  {
    slug: "formation-cardiologs-paris-ia",
    title: "Formation chez Cardiologs à Paris : l'IA au service de l'expertise cardiologique",
    excerpt:
      "Une délégation ivoirienne composée du Prof Adoubi, du Dr Diby Florent et de M. Roger Kpon a été formée à Paris sur l'assistance à l'interprétation des ECG par intelligence artificielle.",
    category: "Formation",
    date: "2026-05-15",
    readingTime: "6 min",
    author: "Roger KPON",
    image: formationImg,
    body: [
      "Dans le cadre de la mise en œuvre de la phase 2 du projet TELE ECG avec la plateforme de e-santé ResoDoc, une session de formation approfondie des acteurs principaux du projet s'est tenue au siège de la société Cardiologs à Paris.",
      "Organisée avec le concours de Doc&You, cette session a réuni une délégation ivoirienne de premier plan : le Prof ADOUBI, le Dr DIBY Florent (Président de l'ONG Wake Up Africa) et M. Roger KPON (Coordonnateur Technique du RAFT Côte d'Ivoire).",
      "L'objectif principal était d'échanger autour de l'utilisation concrète de l'intelligence artificielle appliquée à l'électrocardiographie clinique : détection précoce des fibrillations atriales, identification des blocs de conduction et validation des alertes prioritaires.",
      "Les échanges ont permis de définir les protocoles d'intégration adaptés aux contraintes de connectivité du territoire ivoirien, garantissant un fonctionnement fluide même en cas de faible bande passante.",
    ],
  },
  {
    slug: "histoire-telemedecine-cote-divoire-2004",
    title: "La télémédecine en Côte d'Ivoire d'hier à aujourd'hui : 20 ans d'engagement",
    excerpt:
      "En Côte d'Ivoire, la télémédecine a débuté en 2004 par la formation médicale à distance, fruit de la rencontre historique entre le Dr Benjamin GOLD et le Pr EHUA Somian Francis.",
    category: "Actualité",
    date: "2026-04-18",
    readingTime: "7 min",
    author: "Pr EHUA Somian Francis",
    image: evenementImg,
    body: [
      "En Côte d'Ivoire, l'aventure de la télémédecine a commencé par la formation médicale à distance en 2004, grâce à la rencontre entre le Dr Benjamin GOLD et le Pr EHUA Somian Francis, alors vice-doyen chargé de la pédagogie à l'UFR des Sciences Médicales d'Abidjan.",
      "Cette rencontre a permis au Pr Ehua de participer aux premières activités du Réseau en Afrique Francophone pour la Télémédecine (RAFT) initié depuis Genève et Bamako en 2003.",
      "Très vite, l'équipe ivoirienne a compris que la télémédecine ne pouvait se limiter à des visioconférences théoriques. L'objectif fondamental est de lutter contre les déserts médicaux en apportant l'avis du spécialiste directement au chevet du patient éloigné.",
      "Aujourd'hui, avec plus de 20 structures équipées, un réseau actif de cardiologues, et le soutien des ministères ivoiriens de la Santé et du Numérique, la Côte d'Ivoire fait figure de modèle en Afrique de l'Ouest.",
    ],
  },
  {
    slug: "sibim-societe-savante-sante-numerique",
    title: "La SIBIM : société savante motrice de la santé numérique ivoirienne",
    excerpt:
      "Créée en 2007, la Société Ivoirienne de Biosciences et d'Informatique Médicale (SIBIM) fédère les professionnels pour promouvoir la télémédecine et le dossier médical partagé.",
    category: "Recherche",
    date: "2026-03-10",
    readingTime: "5 min",
    author: "Dr. Innocent NANAN",
    image: teleexpertiseImg,
    body: [
      "La Société Ivoirienne de Biosciences et d'Informatique Médicale (SIBIM) est l'une des principales structures scientifiques de promotion de la santé numérique en Côte d'Ivoire.",
      "Fondée en 2007, la SIBIM a joué un rôle moteur dans l'implémentation opérationnelle du projet Télé-ECG et dans l'élaboration des standards éthiques et déontologiques de la consultation à distance.",
      "L'intégration au réseau RAFT en Côte d'Ivoire s'effectue généralement par l'intermédiaire de la SIBIM ou dans le cadre des conventions signées entre les établissements hospitaliers et la coordination nationale.",
      "La SIBIM invite tous les médecins, infirmiers, ingénieurs biomédicaux et informaticiens de santé à participer aux ateliers d'évaluation et aux séminaires hebdomadaires.",
    ],
  },
  {
    slug: "tele-ecg-dix-centres-de-sante-pionniers",
    title: "Télé-ECG : le retour d'expérience des dix premiers centres connectés",
    excerpt:
      "D'Odienné à Adzopé, en passant par Man, Ferkessédougou, Bouna et Boundiali, les kits Medico Net ont prouvé l'efficacité de la télé-expertise cardiaque en milieu isolé.",
    category: "Projet",
    date: "2026-02-05",
    readingTime: "6 min",
    author: "Dr. Florent DIBY",
    image: heroImg,
    body: [
      "Le projet de télé-électrocardiographie a concerné en priorité dix centres de santé stratégiques répartis dans toute la Côte d'Ivoire : Odienné, Adzopé, Abobo, Focolari (Man), Niablé, Ferkessédougou, Boundiali, Man, Bouna et Bouaké.",
      "Le service des maladies cardiovasculaires et thoraciques du CHU de Bouaké s'est chargé du volet télé-expertise, assurant l'interprétation systématique des tracés transmis par liaison numérique.",
      "Chaque site bénéficiaire a été doté d'un équipement complet comprenant ordinateur, module d'acquisition numérique, onduleur de protection électrique et matériel de communication sécurisé.",
      "Ce modèle a démontré qu'avec un encadrement rigoureux et une formation continue des soignants locaux, il est possible de délivrer une médecine d'excellence partout sur le territoire.",
    ],
  },
];

export type MediaItem = {
  id: string;
  title: string;
  type: "Photo" | "Vidéo" | "Document";
  theme: "Télé-ECG" | "Télé-expertise" | "Formation" | "Événements" | "Santé numérique";
  date: string;
  image: string;
  description: string;
  youtubeId?: string;
  duration?: string;
  source?: string;
  featured?: boolean;
};

export const mediaItems: MediaItem[] = [
  {
    id: "v-africa-telemed",
    title: "Télémédecine : quelles avancées en Afrique ?",
    type: "Vidéo",
    theme: "Santé numérique",
    date: "2026-06-25",
    image: "https://img.youtube.com/vi/90fZyQnz4-8/hqdefault.jpg",
    description:
      "Grand reportage et débat d'experts : état des lieux, déploiement du réseau RAFT, désenclavement sanitaire et innovations médicales pour l'accès aux soins en Afrique francophone.",
    youtubeId: "90fZyQnz4-8",
    duration: "18:42",
    source: "Medi1TV Afrique",
    featured: true,
  },
  {
    id: "m1",
    title: "Membres de la coordination RAFT Côte d'Ivoire",
    type: "Photo",
    theme: "Événements",
    date: "2026-06-20",
    image: raftCiMembres,
    description:
      "L'équipe de coordination nationale et les référents hospitaliers réunis au CHU de Yopougon pour le bilan des activités et la feuille de route.",
    source: "Coordination RAFT CI",
  },
  {
    id: "m2",
    title: "Cartographie officielle des sites du projet Télé-ECG",
    type: "Document",
    theme: "Télé-ECG",
    date: "2026-06-15",
    image: cartographieOfficielle,
    description:
      "Carte officielle d'implantation des structures connectées : Man, Bouaké, Bouna, Ferkessédougou, Odienné, Dabou, etc.",
    source: "Ministère de la Santé / RAFT",
  },
  {
    id: "m3",
    title: "Session de télé-formation sur les outils DUDAL & BOGOU",
    type: "Photo",
    theme: "Formation",
    date: "2026-05-18",
    image: formationImg,
    description:
      "Formation pratique des médecins et infirmiers aux outils de télé-enseignement DUDAL et de télé-expertise clinique asynchrone BOGOU.",
    source: "Centre DUDAL CI",
  },
  {
    id: "m4",
    title: "Délégation ivoirienne chez Cardiologs à Paris",
    type: "Photo",
    theme: "Télé-ECG",
    date: "2026-01-29",
    image: teleecgImg,
    description:
      "Prof Adoubi, Dr Diby Florent et M. Roger Kpon lors des travaux sur l'intelligence artificielle appliquée à l'interprétation des électrocardiogrammes.",
    source: "Mission WUA / RAFT",
  },
  {
    id: "m5",
    title: "Séminaire de télé-expertise cardiologique CHU de Bouaké",
    type: "Vidéo",
    theme: "Télé-expertise",
    date: "2026-04-12",
    image: teleexpertiseImg,
    description:
      "Replay de la session clinique animée par le service des maladies cardiovasculaires et thoraciques du CHU de Bouaké pour les centres régionaux.",
    youtubeId: "90fZyQnz4-8",
    duration: "14:30",
    source: "CHU de Bouaké",
  },
  {
    id: "m6",
    title: "Célébration des 10 ans du réseau RAFT à Abidjan",
    type: "Photo",
    theme: "Événements",
    date: "2026-03-24",
    image: evenementImg,
    description:
      "Rencontre internationale des points focaux africains du réseau RAFT et remise de distinctions aux pionniers de la santé numérique.",
    source: "Réseau RAFT",
  },
];

export const mediaThemes = ["Tous", "Télé-ECG", "Télé-expertise", "Formation", "Événements", "Santé numérique"];

export type FaqItem = { question: string; answer: string; category: string };

export const faqCategories = ["Général", "Télé-ECG", "Formation", "Adhésion SIBIM", "Technique"];

export const faqItems: FaqItem[] = [
  {
    category: "Général",
    question: "Qu'est-ce que le réseau RAFT en Côte d'Ivoire ?",
    answer:
      "Le RAFT (Réseau en Afrique Francophone pour la Télémédecine) est une initiative née en 2003 en Afrique et active en Côte d'Ivoire depuis 2004. Il regroupe aujourd'hui des dizaines de pays et s'attache à lutter contre les déserts médicaux par la télé-formation et la télé-expertise clinique.",
  },
  {
    category: "Télé-ECG",
    question: "Comment fonctionne le projet de télé-électrocardiographie (Télé-ECG) ?",
    answer:
      "Le projet Télé-ECG, initié avec l'ONG Wake Up Africa (WUA), équipe les centres de santé périphériques (Odienné, Adzopé, Man, Ferkessédougou, Bouna, Boundiali, etc.) en kits connectés. Les infirmiers réalisent l'ECG, transmis immédiatement pour interprétation experte par les cardiologues du CHU de Bouaké et d'Abidjan.",
  },
  {
    category: "Télé-ECG",
    question: "Quel est le délai pour recevoir un compte rendu d'ECG d'urgence ?",
    answer:
      "En cas de suspicion de syndrome coronarien aigu ou d'urgence vitale, l'interprétation par le cardiologue référent est transmise au centre demandeur en moins de 30 minutes, accompagnée des recommandations de prise en charge immédiate.",
  },
  {
    category: "Formation",
    question: "Quels sont les outils technologiques utilisés pour la télé-formation ?",
    answer:
      "Le réseau utilise la plateforme DUDAL pour la diffusion des cours et séminaires à faible bande passante, et l'outil BOGOU pour les discussions de cas cliniques et la télé-expertise asynchrone.",
  },
  {
    category: "Adhésion SIBIM",
    question: "Comment un professionnel de santé peut-il rejoindre le réseau RAFT ?",
    answer:
      "L'intégration au RAFT en Côte d'Ivoire s'effectue généralement par l'intermédiaire de la SIBIM (Société Ivoirienne de Biosciences et d'Informatique Médicale) ou dans le cadre d'un établissement de santé conventionné. L'adhésion à la SIBIM facilite l'accès aux formations continues et aux outils du réseau.",
  },
  {
    category: "Technique",
    question: "Qu'est-ce que le kit Medico Net fourni aux centres bénéficiaires ?",
    answer:
      "Chaque site bénéficiaire reçoit un ordinateur portable, un vidéo projecteur, un onduleur haute protection, une webcam, un casque et un écran de projection, ainsi qu'un électrocardiographe numérique homologué avec logiciel de télé-transmission sécurisée.",
  },
  {
    category: "Technique",
    question: "Comment sont protégées les données de santé des patients ivoiriens ?",
    answer:
      "Les flux médicaux transitent sur des canaux chiffrés de bout-en-bout avec traçabilité intégrale des accès. Seuls les soignants directement habilités accèdent aux dossiers patients conformément aux exigences de souveraineté des données de santé du Ministère.",
  },
];

export type Partner = {
  name: string;
  role: string;
  type: "Institutionnel" | "Technique" | "ONG" | "Académique";
  description: string;
  initials: string;
  logoImg?: string;
};

export const partners: Partner[] = [
  {
    name: "Ministère de la Santé et de l'Hygiène Publique",
    role: "Tutelle institutionnelle & santé publique",
    type: "Institutionnel",
    description:
      "Ministère de la Santé, de l'Hygiène Publique et de la Couverture Maladie Universelle de Côte d'Ivoire. Définit le cadre réglementaire et stratégique du déploiement de la télémédecine.",
    initials: "MS",
    logoImg: partnerSante,
  },
  {
    name: "ANSUT",
    role: "Agence Nationale du Service Universel des Télécommunications-TIC",
    type: "Institutionnel",
    description:
      "Assure le développement des infrastructures de télécommunications et la connectivité haut débit des structures sanitaires sur tout le territoire national.",
    initials: "AN",
    logoImg: partnerAnsut,
  },
  {
    name: "Ministère de la Transition Numérique",
    role: "Ministère de la Transition Numérique et de l'Innovation Technologique",
    type: "Institutionnel",
    description:
      "Accompagne la modernisation des services de santé et garantit l'alignement avec la stratégie nationale de transformation numérique de l'État.",
    initials: "MT",
    logoImg: partnerTransition,
  },
  {
    name: "CSRS",
    role: "Centre Suisse de Recherches Scientifiques en Côte d'Ivoire",
    type: "Académique",
    description:
      "Institution d'excellence engagée dans la recherche biomédicale, l'évaluation médico-économique et la santé numérique en Afrique de l'Ouest.",
    initials: "CS",
    logoImg: partnerCsrs,
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
    name: "CHU de Bouaké — Pôle Cardiologie & Télé-expertise",
    category: "CHU",
    city: "Bouaké",
    region: "Gbêkê",
    services: ["Centre national de télé-expertise cardiologique", "Avis Télé-ECG 24/7", "Télé-formation"],
    phone: "+225 27 31 63 30 00",
    email: "teleexpertise.bouake@telemedecine.ci",
  },
  {
    name: "Centre de Télémédecine — CHU de Yopougon",
    category: "CHU",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Siège de la coordination RAFT CI", "Télé-formation DUDAL", "Télé-expertise"],
    phone: "+225 01 73 99 67 82",
    email: "info@telemedecine.ci",
  },
  {
    name: "CHU de Treichville",
    category: "CHU",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Cardiologie d'urgence", "Télé-ECG", "Imagerie médicale"],
    phone: "+225 27 21 24 91 00",
    email: "contact@chu-treichville.ci",
  },
  {
    name: "CHR de Man",
    category: "Hôpital général",
    city: "Man",
    region: "Tonkpi",
    services: ["Télé-ECG", "Télé-expertise cardiologique", "Télé-formation"],
    phone: "+225 27 33 79 10 20",
    email: "chr.man@telemedecine.ci",
  },
  {
    name: "Centre de Santé Focolari de Man",
    category: "Centre de santé",
    city: "Man",
    region: "Tonkpi",
    services: ["Site pilote historique Télé-ECG", "Prise en charge cardiologique de proximité"],
    phone: "+225 27 33 79 05 40",
    email: "focolari.man@telemedecine.ci",
  },
  {
    name: "Hôpital Général de Ferkessédougou",
    category: "Hôpital général",
    city: "Ferkessédougou",
    region: "Tchologo",
    services: ["Télé-ECG d'urgence", "Liaison directe CHU Bouaké"],
    phone: "+225 27 36 88 01 10",
    email: "hg.ferke@telemedecine.ci",
  },
  {
    name: "Hôpital Général de Boundiali",
    category: "Hôpital général",
    city: "Boundiali",
    region: "Bagoué",
    services: ["Télé-ECG connecté", "Dépistage hypertension & cardiopathies"],
    phone: "+225 27 36 85 02 12",
    email: "hg.boundiali@telemedecine.ci",
  },
  {
    name: "Hôpital Général de Bouna",
    category: "Hôpital général",
    city: "Bouna",
    region: "Bounkani",
    services: ["Télé-ECG", "Désenclavement sanitaire zone frontalière"],
    phone: "+225 27 35 91 60 14",
    email: "hg.bouna@telemedecine.ci",
  },
  {
    name: "Hôpital Général de Niablé",
    category: "Hôpital général",
    city: "Niablé",
    region: "Indénié-Djuablin",
    services: ["Télé-ECG connecté", "Télé-consultation assistée"],
    phone: "+225 27 35 92 01 40",
    email: "hg.niable@telemedecine.ci",
  },
  {
    name: "Hôpital Général de Danané",
    category: "Hôpital général",
    city: "Danané",
    region: "Tonkpi",
    services: ["Télé-ECG", "Télé-expertise pédiatrique & cardiologie"],
    phone: "+225 27 33 78 40 10",
    email: "hg.danane@telemedecine.ci",
  },
  {
    name: "Hôpital Général de Dabou Nord",
    category: "Hôpital général",
    city: "Dabou",
    region: "Grands-Ponts",
    services: ["Télé-ECG", "Télé-formation continue"],
    phone: "+225 27 23 57 21 00",
    email: "hg.dabou@telemedecine.ci",
  },
  {
    name: "Hôpital Général d'Odienné",
    category: "Hôpital général",
    city: "Odienné",
    region: "Kabadougou",
    services: ["Site pilote Télé-ECG Nord-Ouest", "Liaison satellitaire de secours"],
    phone: "+225 27 34 71 80 15",
    email: "hg.odienne@telemedecine.ci",
  },
  {
    name: "Hôpital Général d'Adzopé",
    category: "Hôpital général",
    city: "Adzopé",
    region: "La Mé",
    services: ["Télé-ECG connecté", "Télé-expertise"],
    phone: "+225 27 23 54 01 20",
    email: "hg.adzope@telemedecine.ci",
  },
  {
    name: "Centre de Santé Urbain d'Abobo",
    category: "Centre de santé",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Télé-ECG de premier recours", "Dépistage communautaire"],
    phone: "+225 27 24 39 12 00",
    email: "csu.abobo@telemedecine.ci",
  },
  {
    name: "Pr EHUA Somian Francis",
    category: "Spécialiste",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Point Focal RAFT Côte d'Ivoire", "Chirurgien", "+35 ans de pratique"],
    phone: "+225 01 73 99 67 82",
    email: "point.focal@telemedecine.ci",
  },
  {
    name: "Roger KPON",
    category: "Spécialiste",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Coordonnateur Technique RAFT CI", "Top 30 Leaders du Digital 2026", "+30 ans d'expérience"],
    phone: "+225 07 49 42 30 73",
    email: "coordination.technique@telemedecine.ci",
  },
  {
    name: "Dr. Innocent NANAN",
    category: "Spécialiste",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Coordonnateur Médical RAFT CI", "+25 ans d'expérience médicale"],
    phone: "+225 01 73 99 67 82",
    email: "coordination.medicale@telemedecine.ci",
  },
  {
    name: "Dr. Florent DIBY",
    category: "Spécialiste",
    city: "Abidjan",
    region: "Abidjan",
    services: ["Président ONG Wake Up Africa (WUA)", "Cardiologue clinicien", "+25 ans d'expérience"],
    phone: "+225 07 49 42 30 73",
    email: "cardiologie@telemedecine.ci",
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
    id: "bouake",
    city: "Bouaké",
    region: "Gbêkê",
    lon: -5.03,
    lat: 7.69,
    program: "Télé-expertise",
    structures: 3,
    since: 2014,
    detail: "Centre national d'expertise en cardiologie (CHU de Bouaké) assurant la télé-lecture des ECG transmis depuis toute la Côte d'Ivoire.",
  },
  {
    id: "abidjan",
    city: "Abidjan",
    region: "Abidjan",
    lon: -4.03,
    lat: 5.35,
    program: "Télé-formation",
    structures: 6,
    since: 2004,
    detail: "Siège historique de la coordination RAFT CI (CHU de Yopougon, CHU Treichville, Abobo) et centre de diffusion des cours DUDAL.",
  },
  {
    id: "man",
    city: "Man",
    region: "Tonkpi",
    lon: -7.55,
    lat: 7.41,
    program: "Télé-ECG",
    structures: 3,
    since: 2014,
    detail: "CHR de Man et Centre de santé Focolari : site pilote historique de télé-expertise cardiologique pour tout l'Ouest ivoirien.",
  },
  {
    id: "ferkessedougou",
    city: "Ferkessédougou",
    region: "Tchologo",
    lon: -5.2,
    lat: 9.6,
    program: "Télé-ECG",
    structures: 2,
    since: 2014,
    detail: "Hôpital Général équipé en kit Medico Net pour la prise en charge des cardiopathies en zone septentrionale.",
  },
  {
    id: "boundiali",
    city: "Boundiali",
    region: "Bagoué",
    lon: -6.49,
    lat: 9.52,
    program: "Télé-ECG",
    structures: 2,
    since: 2014,
    detail: "Électrocardiographes connectés déployés pour désenclaver les districts sanitaires de la Bagoué.",
  },
  {
    id: "bouna",
    city: "Bouna",
    region: "Bounkani",
    lon: -2.99,
    lat: 9.27,
    program: "Télé-ECG",
    structures: 1,
    since: 2014,
    detail: "Hôpital Général de Bouna : couverture de l'extrême Nord-Est et liaison sécurisée vers le CHU référent.",
  },
  {
    id: "niable",
    city: "Niablé",
    region: "Indénié-Djuablin",
    lon: -3.27,
    lat: 6.66,
    program: "Télé-ECG",
    structures: 1,
    since: 2014,
    detail: "Hôpital Général de Niablé : télé-transmission rapide des tracés vers les cardiologues pour les populations agricoles et frontalières.",
  },
  {
    id: "danane",
    city: "Danané",
    region: "Tonkpi",
    lon: -8.08,
    lat: 7.26,
    program: "Télé-ECG",
    structures: 1,
    since: 2014,
    detail: "Hôpital Général de Danané : surveillance et orientation cardiologique en zone montagneuse.",
  },
  {
    id: "dabou",
    city: "Dabou",
    region: "Grands-Ponts",
    lon: -4.38,
    lat: 5.32,
    program: "Télé-ECG",
    structures: 2,
    since: 2014,
    detail: "Hôpital Général de Dabou Nord : relais de télé-diagnostic cardiovasculaire pour la région lagunaire.",
  },
  {
    id: "odienne",
    city: "Odienné",
    region: "Kabadougou",
    lon: -7.56,
    lat: 9.51,
    program: "Télé-ECG",
    structures: 1,
    since: 2014,
    detail: "Hôpital Général d'Odienné : pionnier du Télé-ECG dans le Kabadougou, doté d'une liaison de télé-transmission renforcée.",
  },
  {
    id: "adzope",
    city: "Adzopé",
    region: "La Mé",
    lon: -3.86,
    lat: 6.1,
    program: "Télé-ECG",
    structures: 1,
    since: 2014,
    detail: "Hôpital Général d'Adzopé : site historique du programme Télé-ECG, assurant le diagnostic précoce des infarctus.",
  },
];

export const programColors: Record<ProjectSite["program"], string> = {
  "Télé-ECG": "var(--color-accent)",
  "Télé-expertise": "var(--color-primary)",
  "Télé-formation": "var(--color-gold)",
};

export const team = [
  {
    name: "Prof EHUA Somian Francis",
    role: "Point focal RAFT Côte d'Ivoire",
    subRole: "Médecin, Chirurgien · +35 ans de pratiques médicales",
    initials: "EF",
    image: pioneerEhua,
    bio: "Pionnier de la télémédecine en Côte d'Ivoire depuis sa rencontre en 2004 avec le Dr Benjamin Gold. Vice-doyen honoraire à l'UFR Sciences Médicales.",
  },
  {
    name: "Roger KPON",
    role: "Coordonnateur Technique",
    subRole: "Ingénieur Informaticien · Top 30 Leaders du Digital 2026",
    initials: "RK",
    image: pioneerRkpon,
    bio: "Distingué parmi les 30 leaders du digital en Côte d'Ivoire. Plus de 30 ans d'expertise dans le déploiement d'infrastructures de santé numérique et d'outils RAFT (DUDAL, BOGOU).",
  },
  {
    name: "Dr. Innocent NANAN",
    role: "Coordonnateur Technique & Médical",
    subRole: "Médecine & Santé Numérique · +25 ans d'expérience",
    initials: "IN",
    image: pioneerNanan,
    bio: "Coordinateur des protocoles cliniques de télé-expertise et acteur clé du raccordement des centres de santé périphériques.",
  },
  {
    name: "Dr. Florent DIBY",
    role: "Président ONG Wake Up Africa",
    subRole: "Médecin Cardiologue · +25 ans d'expérience",
    initials: "FD",
    image: pioneerDiby,
    bio: "Cardiologue clinicien et président de l'ONG Wake Up Africa (WUA), co-fondateur du projet Télé-ECG déployé dans plus de vingt centres.",
  },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    author: "Dr. Carlo MONTAGUTI",
    role: "CENTRE FOCOLARI MAN",
    image: testimonialMontaguti,
    quote:
      "Le projet de télé-expertise en cardiologie a considérablement amélioré la prise en charge de nos patients au Centre de Santé Focolari de Man. Il nous permet d’obtenir rapidement des avis spécialisés et de mieux orienter les cas complexes. C’est une avancée majeure pour notre structure et pour la qualité des soins.",
  },
  {
    author: "Dr. DOUMBIA Mamadou",
    role: "Point Focal RAFT CHU Yopougon",
    image: testimonialDoumbia,
    quote:
      "En tant que point focal du RAFT au CHU de Yopougon et formateur des professionnels de santé, je constate une forte adhésion des équipes à la télé-expertise en cardiologie. Ce projet transforme nos pratiques quotidiennes, améliore la rapidité des diagnostics, renforce les compétences des soignants et contribue à une meilleure prise en charge des patients sur l’ensemble du territoire.",
  },
  {
    author: "Prof Antoine GEISSBUHLER",
    role: "Directeur du réseau RAFT",
    image: testimonialGeissbuhler,
    quote:
      "En reconnaissance de la performance et de l'engagement de l'équipe RAFT Côte d'Ivoire dans la mise en œuvre des activités de télémédecine, le Réseau en Afrique Francophone pour la Télémédecine a confié à la Côte d'Ivoire l'organisation des 10 ans du RAFT, consacrant ainsi son rôle de référence dans le développement de la télé-expertise en Afrique.",
  },
];
