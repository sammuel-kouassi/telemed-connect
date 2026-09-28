-- ==============================================================================
-- SCRIPT COMPLET DE SYNCHRONISATION SUPABASE (DONNÉES + BUCKET STORAGE)
-- Portail National de Télémédecine de Côte d'Ivoire (RAFT CI)
-- ==============================================================================
-- Copiez tout le contenu de ce fichier et collez-le dans :
-- Supabase Dashboard -> "SQL Editor" -> "New query" -> Cliquez sur "RUN"
-- ==============================================================================

-- 1. POLITIQUES DE SÉCURITÉ POUR LE BUCKET STORAGE 'images'
-- Permet la lecture publique et le téléversement d'images sans blocage RLS
DROP POLICY IF EXISTS "Public Read Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Images" ON storage.objects;

CREATE POLICY "Public Read Images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public Upload Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Update Images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Public Delete Images" ON storage.objects FOR DELETE USING (bucket_id = 'images');

-- 2. POLITIQUES D'ACCÈS POUR LES TABLES (LECTURE & ÉCRITURE)
DROP POLICY IF EXISTS "Admin write articles" ON public.articles;
DROP POLICY IF EXISTS "Admin write media_items" ON public.media_items;
DROP POLICY IF EXISTS "Admin write directory_entries" ON public.directory_entries;
DROP POLICY IF EXISTS "Admin write project_sites" ON public.project_sites;
DROP POLICY IF EXISTS "Admin write partners" ON public.partners;
DROP POLICY IF EXISTS "Admin write faq_items" ON public.faq_items;
DROP POLICY IF EXISTS "Admin write team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admin write testimonials" ON public.testimonials;

DROP POLICY IF EXISTS "Allow all articles" ON public.articles;
DROP POLICY IF EXISTS "Allow all media_items" ON public.media_items;
DROP POLICY IF EXISTS "Allow all directory_entries" ON public.directory_entries;
DROP POLICY IF EXISTS "Allow all project_sites" ON public.project_sites;
DROP POLICY IF EXISTS "Allow all partners" ON public.partners;
DROP POLICY IF EXISTS "Allow all faq_items" ON public.faq_items;
DROP POLICY IF EXISTS "Allow all team_members" ON public.team_members;
DROP POLICY IF EXISTS "Allow all testimonials" ON public.testimonials;

CREATE POLICY "Allow all articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all media_items" ON public.media_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all directory_entries" ON public.directory_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all project_sites" ON public.project_sites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all partners" ON public.partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all faq_items" ON public.faq_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);

-- 3. NETTOYAGE PRÉALABLE POUR SYNCHRONISATION PROPRE
DELETE FROM public.articles;
DELETE FROM public.media_items;
DELETE FROM public.directory_entries;
DELETE FROM public.project_sites;
DELETE FROM public.partners;
DELETE FROM public.faq_items;
DELETE FROM public.team_members;
DELETE FROM public.testimonials;

-- 4. INSERTION : ARTICLES & ACTUALITÉS (avec URLs du bucket 'images')
INSERT INTO public.articles (slug, title, excerpt, category, date, reading_time, author, image, body)
VALUES
(
  'outils-du-raft',
  'Outils Du RAFT',
  'Les coordonnateurs du RAFT forment les professionnels de santé sur les outils de télé enseignement du RAFT (DUDAL) et sur l''outil de télé expertise BOGOU.',
  'Formation',
  '2026-06-28',
  '4 min',
  'Coordination RAFT Côte d''Ivoire',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/formation_outils_raft.jpg',
  '["Les coordonnateurs du RAFT forment les professionnels de santé sur les outils de télé enseignement du RAFT (DUDAL) et sur l''outil de télé expertise BOGOU.", "La plateforme DUDAL constitue le dispositif central de formation médicale continue à distance du réseau. Conçue pour opérer efficacement sur des réseaux Internet à bande passante variable ou restreinte, elle offre aux praticiens, spécialistes et étudiants en santé un accès direct à des visioconférences, cours interactifs et séances de télé-enseignement animés par des experts universitaires internationaux et régionaux.", "L''application BOGOU est un système de télé-expertise médicale asynchrone sécurisé, spécialement pensé pour répondre aux défis des zones isolées. Grâce à BOGOU, les soignants dans les centres de santé périphériques peuvent soumettre des dossiers cliniques complexes, partager des clichés diagnostiques ou des tracés, et recevoir dans des délais courts des avis spécialisés émanant des centres hospitaliers universitaires de référence."]'::jsonb
),
(
  'formation-cardiologs-paris-ia',
  'Formation chez Cardiologs à Paris',
  'Dans le cadre de la mise en œuvre de la phase 2 du projet TELE ECG avec la plateforme de e-santé ResoDoc, formation des acteurs principaux du projet chez Cardiologs à Paris.',
  'Formation',
  '2026-06-25',
  '5 min',
  'Prof ADOUBI, Dr DIBY Florent & Mr. Roger KPON',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/formation.jpg',
  '["Dans le cadre de la mise en œuvre de la phase 2 du projet TELE ECG avec la plateforme de e-santé ResoDoc, une formation à l''utilisation du service d''assistance à l''interprétation des ECG une formation des acteurs principaux du Projet TELE ECG a eu lieu à Paris en France.", "L''objectif principal de cette formation était d''échanger autour de l''utilisation de l''intelligence artificielle dans le cadre du projet TELE ECG.", "Cette collaboration technologique de pointe permet d''accélérer l''analyse diagnostique des tracés cardiaques et d''apporter un soutien décisionnel déterminant pour les médecins isolés."]'::jsonb
),
(
  'le-projet-tele-ecg',
  'Le Projet Tele ECG',
  'Le projet de télé ECG a concerné dix centres de santé en Côte d''Ivoire. Le service des maladies cardiovasculaires et thoraciques du CHU de BOUAKE s''est chargé de la télé expertise.',
  'Projet',
  '2026-06-22',
  '5 min',
  'Service des maladies cardiovasculaires et thoraciques — CHU de Bouaké',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/projet_tele_ecg_csrs.jpg',
  '["Le projet de télé ECG a concerné dix centres de santé en Côte d''Ivoire (ODIENNE, ADZOPE, ABOBO, FOCOLARI, NIABLE, FERKESSEDOUGOU, BOUNDIALI, MAN, BOUNA et BOUAKE).", "Le service des maladies cardiovasculaires et thoraciques du CHU de BOUAKE s''est chargé de la télé expertise c''est-à-dire de l''interprétation à distance des ECG via les technologies d''informations et de communications (TIC).", "Ce dispositif a permis une réduction significative des coûts des consultations cardiovasculaires par des ECG à distance, tout en évitant des transferts d''urgence pénibles et coûteux pour les populations de l''intérieur du pays."]'::jsonb
),
(
  'mission-phase-2-projet-tele-ecg',
  'Mission Phase 2 du projet Télé-ECG : intelligence artificielle & plateforme ResoDoc',
  'Dans le cadre de la phase 2 du projet Télé-ECG, le réseau ivoirien intègre l''assistance à l''interprétation par IA pour soutenir les praticiens dans les centres périphériques.',
  'Projet',
  '2026-05-10',
  '5 min',
  'Coordination RAFT Côte d''Ivoire',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/teleecg.jpg',
  '["Le projet de télé-électrocardiographie (Télé-ECG) en Côte d''Ivoire franchit une étape majeure avec le déploiement de sa Phase 2. Après une première phase pilote couronnée de succès dans dix centres de santé, l''accent est désormais mis sur l''interopérabilité avancée et l''assistance à la lecture cardiologique.", "Grâce à l''intégration de modèles d''IA certifiés via la plateforme de télésanté ResoDoc, les praticiens exerçant dans les hôpitaux généraux recevront une pré-analyse instantanée des anomalies du tracé, avant validation officielle par les cardiologues référents.", "Cette évolution permet de réduire le délai de prise en charge des infarctus du myocarde et des troubles du rythme sévères, tout en évitant des évacuations sanitaires coûteuses et éprouvantes pour les familles."]'::jsonb
),
(
  'histoire-telemedecine-cote-divoire-2004',
  'La télémédecine en Côte d''Ivoire d''hier à aujourd''hui : 20 ans d''engagement',
  'En Côte d''Ivoire, la télémédecine a débuté en 2004 par la formation médicale à distance, fruit de la rencontre historique entre le Dr Benjamin GOLD et le Pr EHUA Somian Francis.',
  'Actualité',
  '2026-04-18',
  '7 min',
  'Pr EHUA Somian Francis',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/evenement.jpg',
  '["En Côte d''Ivoire, l''aventure de la télémédecine a commencé par la formation médicale à distance en 2004, grâce à la rencontre entre le Dr Benjamin GOLD et le Pr EHUA Somian Francis, alors vice-doyen chargé de la pédagogie à l''UFR des Sciences Médicales d''Abidjan.", "Cette rencontre a permis au Pr Ehua de participer aux premières activités du Réseau en Afrique Francophone pour la Télémédecine (RAFT) initié depuis Genève et Bamako en 2003.", "Très vite, l''équipe ivoirienne a compris que la télémédecine ne pouvait se limiter à des visioconférences théoriques. L''objectif fondamental est de lutter contre les déserts médicaux en apportant l''avis du spécialiste directement au chevet du patient éloigné.", "Aujourd''hui, avec plus de 20 structures équipées, un réseau actif de cardiologues, et le soutien des ministères ivoiriens de la Santé et du Numérique, la Côte d''Ivoire fait figure de modèle en Afrique de l''Ouest."]'::jsonb
),
(
  'sibim-societe-savante-sante-numerique',
  'La SIBIM : société savante motrice de la santé numérique ivoirienne',
  'Créée en 2007, la Société Ivoirienne de Biosciences et d''Informatique Médicale (SIBIM) fédère les professionnels pour promouvoir la télémédecine et le dossier médical partagé.',
  'Recherche',
  '2026-03-10',
  '5 min',
  'Dr. Innocent NANAN',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/teleexpertise.jpg',
  '["La Société Ivoirienne de Biosciences et d''Informatique Médicale (SIBIM) est l''une des principales structures scientifiques de promotion de la santé numérique en Côte d''Ivoire.", "Fondée en 2007, la SIBIM a joué un rôle moteur dans l''implémentation opérationnelle du projet Télé-ECG et dans l''élaboration des standards éthiques et déontologiques de la consultation à distance.", "L''intégration au réseau RAFT en Côte d''Ivoire s''effectue généralement par l''intermédiaire de la SIBIM ou dans le cadre des conventions signées entre les établissements hospitaliers et la coordination nationale.", "La SIBIM invite tous les médecins, infirmiers, ingénieurs biomédicaux et informaticiens de santé à participer aux ateliers d''évaluation et aux séminaires hebdomadaires."]'::jsonb
);

-- 5. INSERTION : MÉDIATHÈQUE
INSERT INTO public.media_items (id, title, type, theme, date, image, description, youtube_id, duration, source, featured)
VALUES
(
  'v-africa-telemed',
  'Télémédecine : quelles avancées en Afrique ?',
  'Vidéo',
  'Santé numérique',
  '2026-06-25',
  'https://img.youtube.com/vi/90fZyQnz4-8/hqdefault.jpg',
  'Grand reportage et débat d''experts : état des lieux, déploiement du réseau RAFT, désenclavement sanitaire et innovations médicales pour l''accès aux soins en Afrique francophone.',
  '90fZyQnz4-8',
  '18:42',
  'Medi1TV Afrique',
  true
),
(
  'm1',
  'Membres de la coordination RAFT Côte d''Ivoire',
  'Photo',
  'Événements',
  '2026-06-20',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/raft_ci_membres.jpg',
  'L''équipe de coordination nationale et les référents hospitaliers réunis au CHU de Yopougon pour le bilan des activités et la feuille de route.',
  NULL,
  NULL,
  'Coordination RAFT CI',
  false
),
(
  'm2',
  'Cartographie officielle des sites du projet Télé-ECG',
  'Document',
  'Télé-ECG',
  '2026-06-15',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/cartographie_officielle.webp',
  'Carte officielle d''implantation des structures connectées : Man, Bouaké, Bouna, Ferkessédougou, Odienné, Dabou, etc.',
  NULL,
  NULL,
  'Ministère de la Santé / RAFT',
  false
),
(
  'm3',
  'Session de formation sur les outils DUDAL & BOGOU',
  'Photo',
  'Formation',
  '2026-06-28',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/formation_outils_raft.jpg',
  'Les coordonnateurs du RAFT forment les professionnels de santé sur les outils de télé-enseignement du RAFT (DUDAL) et de télé-expertise (BOGOU).',
  NULL,
  NULL,
  'Centre DUDAL CI',
  false
),
(
  'm-tele-ecg-csrs',
  'Le Projet Télé-ECG et réduction des coûts (CSRS)',
  'Photo',
  'Télé-ECG',
  '2026-06-22',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/projet_tele_ecg_csrs.jpg',
  'Présentation des résultats sur la réduction des coûts des consultations cardiovasculaires par des ECG à distance dans les dix centres connectés.',
  NULL,
  NULL,
  'CHU de Bouaké / CSRS',
  false
),
(
  'm-tele-ecg-monitor',
  'Poste d''interprétation et monitoring Télé-ECG',
  'Photo',
  'Télé-ECG',
  '2026-06-20',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/projet_tele_ecg_monitor.jpg',
  'Interprétation à distance des électrocardiogrammes par les spécialistes du CHU de Bouaké via les technologies de l''information.',
  NULL,
  NULL,
  'Service cardiologie CHU de Bouaké',
  false
),
(
  'm4',
  'Délégation ivoirienne chez Cardiologs à Paris',
  'Photo',
  'Télé-ECG',
  '2026-01-29',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/teleecg.jpg',
  'Prof Adoubi, Dr Diby Florent et M. Roger Kpon lors des travaux sur l''intelligence artificielle appliquée à l''interprétation des électrocardiogrammes.',
  NULL,
  NULL,
  'Mission WUA / RAFT',
  false
),
(
  'm5',
  'Séminaire de télé-expertise cardiologique CHU de Bouaké',
  'Vidéo',
  'Télé-expertise',
  '2026-04-12',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/teleexpertise.jpg',
  'Replay de la session clinique animée par le service des maladies cardiovasculaires et thoraciques du CHU de Bouaké pour les centres régionaux.',
  '90fZyQnz4-8',
  '14:30',
  'CHU de Bouaké',
  false
),
(
  'm6',
  'Célébration des 10 ans du réseau RAFT à Abidjan',
  'Photo',
  'Événements',
  '2026-03-24',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/evenement.jpg',
  'Rencontre internationale des points focaux africains du réseau RAFT et remise de distinctions aux pionniers de la santé numérique.',
  NULL,
  NULL,
  'Réseau RAFT',
  false
);

-- 6. INSERTION : ANNUAIRE SANTÉ (18 structures & spécialistes)
INSERT INTO public.directory_entries (name, category, city, region, services, phone, email)
VALUES
(
  'CHU de Bouaké — Pôle Cardiologie & Télé-expertise',
  'CHU',
  'Bouaké',
  'Gbêkê',
  '["Centre national de télé-expertise cardiologique", "Avis Télé-ECG 24/7", "Télé-formation"]'::jsonb,
  '+225 27 31 63 30 00',
  'teleexpertise.bouake@telemedecine.ci'
),
(
  'Centre de Télémédecine — CHU de Yopougon',
  'CHU',
  'Abidjan',
  'Abidjan',
  '["Siège de la coordination RAFT CI", "Télé-formation DUDAL", "Télé-expertise"]'::jsonb,
  '+225 01 73 99 67 82',
  'info@telemedecine.ci'
),
(
  'CHU de Treichville',
  'CHU',
  'Abidjan',
  'Abidjan',
  '["Cardiologie d''urgence", "Télé-ECG", "Imagerie médicale"]'::jsonb,
  '+225 27 21 24 91 00',
  'contact@chu-treichville.ci'
),
(
  'CHR de Man',
  'Hôpital général',
  'Man',
  'Tonkpi',
  '["Télé-ECG", "Télé-expertise cardiologique", "Télé-formation"]'::jsonb,
  '+225 27 33 79 10 20',
  'chr.man@telemedecine.ci'
),
(
  'Centre de Santé Focolari de Man',
  'Centre de santé',
  'Man',
  'Tonkpi',
  '["Site pilote historique Télé-ECG", "Prise en charge cardiologique de proximité"]'::jsonb,
  '+225 27 33 79 05 40',
  'focolari.man@telemedecine.ci'
),
(
  'Hôpital Général de Ferkessédougou',
  'Hôpital général',
  'Ferkessédougou',
  'Tchologo',
  '["Télé-ECG d''urgence", "Liaison directe CHU Bouaké"]'::jsonb,
  '+225 27 36 88 01 10',
  'hg.ferke@telemedecine.ci'
),
(
  'Hôpital Général de Boundiali',
  'Hôpital général',
  'Boundiali',
  'Bagoué',
  '["Télé-ECG connecté", "Dépistage hypertension & cardiopathies"]'::jsonb,
  '+225 27 36 85 02 12',
  'hg.boundiali@telemedecine.ci'
),
(
  'Hôpital Général de Bouna',
  'Hôpital général',
  'Bouna',
  'Bounkani',
  '["Télé-ECG", "Désenclavement sanitaire zone frontalière"]'::jsonb,
  '+225 27 35 91 60 14',
  'hg.bouna@telemedecine.ci'
),
(
  'Hôpital Général de Niablé',
  'Hôpital général',
  'Niablé',
  'Indénié-Djuablin',
  '["Télé-ECG connecté", "Télé-consultation assistée"]'::jsonb,
  '+225 27 35 92 01 40',
  'hg.niable@telemedecine.ci'
),
(
  'Hôpital Général de Danané',
  'Hôpital général',
  'Danané',
  'Tonkpi',
  '["Télé-ECG", "Télé-expertise pédiatrique & cardiologie"]'::jsonb,
  '+225 27 33 78 40 10',
  'hg.danane@telemedecine.ci'
),
(
  'Hôpital Général de Dabou Nord',
  'Hôpital général',
  'Dabou',
  'Grands-Ponts',
  '["Télé-ECG", "Télé-formation continue"]'::jsonb,
  '+225 27 23 57 21 00',
  'hg.dabou@telemedecine.ci'
),
(
  'Hôpital Général d''Odienné',
  'Hôpital général',
  'Odienné',
  'Kabadougou',
  '["Site pilote Télé-ECG Nord-Ouest", "Liaison satellitaire de secours"]'::jsonb,
  '+225 27 34 71 80 15',
  'hg.odienne@telemedecine.ci'
),
(
  'Hôpital Général d''Adzopé',
  'Hôpital général',
  'Adzopé',
  'La Mé',
  '["Télé-ECG connecté", "Télé-expertise"]'::jsonb,
  '+225 27 23 54 01 20',
  'hg.adzope@telemedecine.ci'
),
(
  'Centre de Santé Urbain d''Abobo',
  'Centre de santé',
  'Abidjan',
  'Abidjan',
  '["Télé-ECG de premier recours", "Dépistage communautaire"]'::jsonb,
  '+225 27 24 39 12 00',
  'csu.abobo@telemedecine.ci'
),
(
  'Pr EHUA Somian Francis',
  'Spécialiste',
  'Abidjan',
  'Abidjan',
  '["Point Focal RAFT Côte d''Ivoire", "Chirurgien", "+35 ans de pratique"]'::jsonb,
  '+225 01 73 99 67 82',
  'point.focal@telemedecine.ci'
),
(
  'Roger KPON',
  'Spécialiste',
  'Abidjan',
  'Abidjan',
  '["Coordonnateur Technique RAFT CI", "Top 30 Leaders du Digital 2026", "+30 ans d''expérience"]'::jsonb,
  '+225 07 49 42 30 73',
  'coordination.technique@telemedecine.ci'
),
(
  'Dr. Innocent NANAN',
  'Spécialiste',
  'Abidjan',
  'Abidjan',
  '["Coordonnateur Médical RAFT CI", "+25 ans d''expérience médicale"]'::jsonb,
  '+225 01 73 99 67 82',
  'coordination.medicale@telemedecine.ci'
),
(
  'Dr. Florent DIBY',
  'Spécialiste',
  'Abidjan',
  'Abidjan',
  '["Président ONG Wake Up Africa (WUA)", "Cardiologue clinicien", "+25 ans d''expérience"]'::jsonb,
  '+225 07 49 42 30 73',
  'cardiologie@telemedecine.ci'
);

-- 7. INSERTION : SITES DU PROJET (CARTOGRAPHIE LEAFLET)
INSERT INTO public.project_sites (id, city, region, lon, lat, program, structures, since, detail)
VALUES
('bouake', 'Bouaké', 'Gbêkê', -5.03, 7.69, 'Télé-expertise', 3, 2014, 'Centre national d''expertise en cardiologie (CHU de Bouaké) assurant la télé-lecture des ECG transmis depuis toute la Côte d''Ivoire.'),
('abidjan', 'Abidjan', 'Abidjan', -4.03, 5.35, 'Télé-formation', 6, 2004, 'Siège historique de la coordination RAFT CI (CHU de Yopougon, CHU Treichville, Abobo) et centre de diffusion des cours DUDAL.'),
('man', 'Man', 'Tonkpi', -7.55, 7.41, 'Télé-ECG', 3, 2014, 'CHR de Man et Centre de santé Focolari : site pilote historique de télé-expertise cardiologique pour tout l''Ouest ivoirien.'),
('ferkessedougou', 'Ferkessédougou', 'Tchologo', -5.2, 9.6, 'Télé-ECG', 2, 2014, 'Hôpital Général équipé en kit Medico Net pour la prise en charge des cardiopathies en zone septentrionale.'),
('boundiali', 'Boundiali', 'Bagoué', -6.49, 9.52, 'Télé-ECG', 2, 2014, 'Électrocardiographes connectés déployés pour désenclaver les districts sanitaires de la Bagoué.'),
('bouna', 'Bouna', 'Bounkani', -2.99, 9.27, 'Télé-ECG', 1, 2014, 'Hôpital Général de Bouna : couverture de l''extrême Nord-Est et liaison sécurisée vers le CHU référent.'),
('niable', 'Niablé', 'Indénié-Djuablin', -3.27, 6.66, 'Télé-ECG', 1, 2014, 'Hôpital Général de Niablé : télé-transmission rapide des tracés vers les cardiologues pour les populations agricoles et frontalières.'),
('danane', 'Danané', 'Tonkpi', -8.08, 7.26, 'Télé-ECG', 1, 2014, 'Hôpital Général de Danané : surveillance et orientation cardiologique en zone montagneuse.'),
('dabou', 'Dabou', 'Grands-Ponts', -4.38, 5.32, 'Télé-ECG', 2, 2014, 'Hôpital Général de Dabou Nord : relais de télé-diagnostic cardiovasculaire pour la région lagunaire.'),
('odienne', 'Odienné', 'Kabadougou', -7.56, 9.51, 'Télé-ECG', 1, 2014, 'Hôpital Général d''Odienné : pionnier du Télé-ECG dans le Kabadougou, doté d''une liaison de télé-transmission renforcée.'),
('adzope', 'Adzopé', 'La Mé', -3.86, 6.1, 'Télé-ECG', 1, 2014, 'Hôpital Général d''Adzopé : site historique du programme Télé-ECG, assurant le diagnostic précoce des infarctus.');

-- 8. INSERTION : PARTENAIRES OFFICIELS (avec URLs logos bucket 'images')
INSERT INTO public.partners (name, role, type, description, initials, logo_img)
VALUES
(
  'Ministère de la Santé et de l''Hygiène Publique',
  'Tutelle institutionnelle & santé publique',
  'Institutionnel',
  'Ministère de la Santé, de l''Hygiène Publique et de la Couverture Maladie Universelle de Côte d''Ivoire. Définit le cadre réglementaire et stratégique du déploiement de la télémédecine.',
  'MS',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/partner_sante.webp'
),
(
  'ANSUT',
  'Agence Nationale du Service Universel des Télécommunications-TIC',
  'Institutionnel',
  'Assure le développement des infrastructures de télécommunications et la connectivité haut débit des structures sanitaires sur tout le territoire national.',
  'AN',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/partner_ansut.webp'
),
(
  'Ministère de la Transition Numérique',
  'Ministère de la Transition Numérique et de l''Innovation Technologique',
  'Institutionnel',
  'Accompagne la modernisation des services de santé et garantit l''alignement avec la stratégie nationale de transformation numérique de l''État.',
  'MT',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/partner_transition.webp'
),
(
  'CSRS',
  'Centre Suisse de Recherches Scientifiques en Côte d''Ivoire',
  'Académique',
  'Institution d''excellence engagée dans la recherche biomédicale, l''évaluation médico-économique et la santé numérique en Afrique de l''Ouest.',
  'CS',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/partner_csrs.webp'
);

-- 9. INSERTION : FAQ (7 questions/réponses officielles)
INSERT INTO public.faq_items (category, question, answer, display_order)
VALUES
(
  'Général',
  'Qu''est-ce que le réseau RAFT en Côte d''Ivoire ?',
  'Le RAFT (Réseau en Afrique Francophone pour la Télémédecine) est une initiative née en 2003 en Afrique et active en Côte d''Ivoire depuis 2004. Il regroupe aujourd''hui des dizaines de pays et s''attache à lutter contre les déserts médicaux par la télé-formation et la télé-expertise clinique.',
  0
),
(
  'Télé-ECG',
  'Comment fonctionne le projet de télé-électrocardiographie (Télé-ECG) ?',
  'Le projet Télé-ECG, initié avec l''ONG Wake Up Africa (WUA), équipe les centres de santé périphériques (Odienné, Adzopé, Man, Ferkessédougou, Bouna, Boundiali, etc.) en kits connectés. Les infirmiers réalisent l''ECG, transmis immédiatement pour interprétation experte par les cardiologues du CHU de Bouaké et d''Abidjan.',
  1
),
(
  'Télé-ECG',
  'Quel est le délai pour recevoir un compte rendu d''ECG d''urgence ?',
  'En cas de suspicion de syndrome coronarien aigu ou d''urgence vitale, l''interprétation par le cardiologue référent est transmise au centre demandeur en moins de 30 minutes, accompagnée des recommandations de prise en charge immédiate.',
  2
),
(
  'Formation',
  'Quels sont les outils technologiques utilisés pour la télé-formation ?',
  'Le réseau utilise la plateforme DUDAL pour la diffusion des cours et séminaires à faible bande passante, et l''outil BOGOU pour les discussions de cas cliniques et la télé-expertise asynchrone.',
  3
),
(
  'Adhésion SIBIM',
  'Comment un professionnel de santé peut-il rejoindre le réseau RAFT ?',
  'L''intégration au RAFT en Côte d''Ivoire s''effectue généralement par l''intermédiaire de la SIBIM (Société Ivoirienne de Biosciences et d''Informatique Médicale) ou dans le cadre d''un établissement de santé conventionné. L''adhésion à la SIBIM facilite l''accès aux formations continues et aux outils du réseau.',
  4
),
(
  'Technique',
  'Qu''est-ce que le kit Medico Net fourni aux centres bénéficiaires ?',
  'Chaque site bénéficiaire reçoit un ordinateur portable, un vidéo projecteur, un onduleur haute protection, une webcam, un casque et un écran de projection, ainsi qu''un électrocardiographe numérique homologué avec logiciel de télé-transmission sécurisée.',
  5
),
(
  'Technique',
  'Comment sont protégées les données de santé des patients ivoiriens ?',
  'Les flux médicaux transitent sur des canaux chiffrés de bout-en-bout avec traçabilité intégrale des accès. Seuls les soignants directement habilités accèdent aux dossiers patients conformément aux exigences de souveraineté des données de santé du Ministère.',
  6
);

-- 10. INSERTION : MEMBRES DE L'ÉQUIPE (avec URLs portraits bucket 'images')
INSERT INTO public.team_members (name, role, sub_role, initials, image, bio, display_order)
VALUES
(
  'Prof EHUA Somian Francis',
  'Point focal RAFT Côte d''Ivoire',
  'Médecin, Chirurgien · +35 ans de pratiques médicales',
  'EF',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/pioneer_ehua.webp',
  'Pionnier de la télémédecine en Côte d''Ivoire depuis sa rencontre en 2004 avec le Dr Benjamin Gold. Vice-doyen honoraire à l''UFR Sciences Médicales.',
  0
),
(
  'Roger KPON',
  'Coordonnateur Technique',
  'Ingénieur Informaticien · Top 30 Leaders du Digital 2026',
  'RK',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/pioneer_rkpon.webp',
  'Distingué parmi les 30 leaders du digital en Côte d''Ivoire. Plus de 30 ans d''expertise dans le déploiement d''infrastructures de santé numérique et d''outils RAFT (DUDAL, BOGOU).',
  1
),
(
  'Dr. Innocent NANAN',
  'Coordonnateur Technique & Médical',
  'Médecine & Santé Numérique · +25 ans d''expérience',
  'IN',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/pioneer_nanan.webp',
  'Coordinateur des protocoles cliniques de télé-expertise et acteur clé du raccordement des centres de santé périphériques.',
  2
),
(
  'Dr. Florent DIBY',
  'Président ONG Wake Up Africa',
  'Médecin Cardiologue · +25 ans d''expérience',
  'FD',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/pioneer_diby.webp',
  'Cardiologue clinicien et président de l''ONG Wake Up Africa (WUA), co-fondateur du projet Télé-ECG déployé dans plus de vingt centres.',
  3
);

-- 11. INSERTION : TÉMOIGNAGES (avec URLs portraits bucket 'images')
INSERT INTO public.testimonials (author, role, image, quote, display_order)
VALUES
(
  'Dr. Carlo MONTAGUTI',
  'CENTRE FOCOLARI MAN',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/testimonial_montaguti.webp',
  'Le projet de télé-expertise en cardiologie a considérablement amélioré la prise en charge de nos patients au Centre de Santé Focolari de Man. Il nous permet d’obtenir rapidement des avis spécialisés et de mieux orienter les cas complexes. C’est une avancée majeure pour notre structure et pour la qualité des soins.',
  0
),
(
  'Dr. DOUMBIA Mamadou',
  'Point Focal RAFT CHU Yopougon',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/testimonial_doumbia.webp',
  'En tant que point focal du RAFT au CHU de Yopougon et formateur des professionnels de santé, je constate une forte adhésion des équipes à la télé-expertise en cardiologie. Ce projet transforme nos pratiques quotidiennes, améliore la rapidité des diagnostics, renforce les compétences des soignants et contribue à une meilleure prise en charge des patients sur l’ensemble du territoire.',
  1
),
(
  'Prof Antoine GEISSBUHLER',
  'Directeur du réseau RAFT',
  'https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/testimonial_geissbuhler.webp',
  'En reconnaissance de la performance et de l''engagement de l''équipe RAFT Côte d''Ivoire dans la mise en œuvre des activités de télémédecine, le Réseau en Afrique Francophone pour la Télémédecine a confié à la Côte d''Ivoire l''organisation des 10 ans du RAFT, consacrant ainsi son rôle de référence dans le développement de la télé-expertise en Afrique.',
  2
);
