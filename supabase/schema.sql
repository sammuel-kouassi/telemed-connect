-- ==============================================================================
-- SCHEMA SUPABASE POUR LE PORTAIL NATIONAL DE TÉLÉMÉDECINE EN CÔTE D'IVOIRE (RAFT CI)
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase (SQL Editor).
-- ==============================================================================

-- 1. Table: Articles & Actualités
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Actualité', 'Projet', 'Formation', 'Recherche')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    reading_time TEXT NOT NULL DEFAULT '4 min',
    author TEXT NOT NULL,
    image TEXT NOT NULL,
    secondary_image TEXT,
    body JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table: Médiathèque (Photos, Vidéos, Documents)
CREATE TABLE IF NOT EXISTS public.media_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Photo', 'Vidéo', 'Document')),
    theme TEXT NOT NULL CHECK (theme IN ('Télé-ECG', 'Télé-expertise', 'Formation', 'Événements', 'Santé numérique')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    youtube_id TEXT,
    duration TEXT,
    source TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table: Annuaire des Structures & Professionnels
CREATE TABLE IF NOT EXISTS public.directory_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('CHU', 'Hôpital général', 'Centre de santé', 'Spécialiste')),
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    services JSONB NOT NULL DEFAULT '[]'::jsonb,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: Sites du Projet & Cartographie
CREATE TABLE IF NOT EXISTS public.project_sites (
    id TEXT PRIMARY KEY,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    program TEXT NOT NULL CHECK (program IN ('Télé-ECG', 'Télé-expertise', 'Télé-formation')),
    structures INTEGER NOT NULL DEFAULT 1,
    since INTEGER NOT NULL DEFAULT 2014,
    detail TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table: Partenaires Officiels
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Institutionnel', 'Technique', 'ONG', 'Académique')),
    description TEXT NOT NULL,
    initials TEXT NOT NULL,
    logo_img TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Table: Foire aux Questions (FAQ)
CREATE TABLE IF NOT EXISTS public.faq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Table: Membres de l'Équipe & Pionniers
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    sub_role TEXT NOT NULL,
    initials TEXT NOT NULL,
    image TEXT NOT NULL,
    bio TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Table: Témoignages
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    image TEXT NOT NULL,
    quote TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- POLITIQUES DE SÉCURITÉ (Row Level Security - RLS)
-- Lecture publique pour tous les visiteurs
-- Modification réservée aux administrateurs authentifiés
-- ==============================================================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public read media_items" ON public.media_items FOR SELECT USING (true);
CREATE POLICY "Public read directory_entries" ON public.directory_entries FOR SELECT USING (true);
CREATE POLICY "Public read project_sites" ON public.project_sites FOR SELECT USING (true);
CREATE POLICY "Public read partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Public read faq_items" ON public.faq_items FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);

-- Écriture authentifiée (Admin)
CREATE POLICY "Admin write articles" ON public.articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write media_items" ON public.media_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write directory_entries" ON public.directory_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write project_sites" ON public.project_sites FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write partners" ON public.partners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write faq_items" ON public.faq_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write team_members" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
