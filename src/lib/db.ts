import { supabase, isSupabaseConfigured } from "./supabase";
import {
  articles as defaultArticles,
  mediaItems as defaultMediaItems,
  directory as defaultDirectory,
  projectSites as defaultProjectSites,
  partners as defaultPartners,
  faqItems as defaultFaqs,
  team as defaultTeam,
  testimonials as defaultTestimonials,
  type Article,
  type MediaItem,
  type DirectoryEntry,
  type ProjectSite,
  type Partner,
  type FaqItem,
  type Testimonial,
} from "@/data/site";

export type TeamMember = {
  name: string;
  role: string;
  subRole: string;
  initials: string;
  image: string;
  bio: string;
};

// Clés de persistance locale si Supabase n'est pas encore connecté
const STORAGE_KEYS = {
  articles: "telemed_data_articles",
  media: "telemed_data_media",
  directory: "telemed_data_directory",
  projects: "telemed_data_projects",
  partners: "telemed_data_partners",
  faqs: "telemed_data_faqs",
  team: "telemed_data_team",
  testimonials: "telemed_data_testimonials",
};

function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or SSR
  }
}

// -------------------------------------------------------------
// 1. ARTICLES
// -------------------------------------------------------------
export async function getArticles(): Promise<Article[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("date", { ascending: false });

      if (!error && data) {
        return data.map((row) => ({
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          category: row.category,
          date: row.date,
          readingTime: row.reading_time,
          author: row.author,
          image: row.image,
          secondaryImage: row.secondary_image || undefined,
          body: Array.isArray(row.body) ? row.body : [],
        }));
      }
    } catch {
      // Fallback
    }
  }

  return getLocalData<Article[]>(STORAGE_KEYS.articles, defaultArticles);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const all = await getArticles();
  return all.find((a) => a.slug === slug);
}

export async function saveArticle(article: Article): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        date: article.date,
        reading_time: article.readingTime,
        author: article.author,
        image: article.image,
        secondary_image: article.secondaryImage || null,
        body: article.body,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("articles").upsert(row, { onConflict: "slug" });
      if (error) throw error;
    } catch (err) {
      console.warn("Supabase upsert article failed, saving locally:", err);
    }
  }

  // Toujours maintenir le cache local
  const current = getLocalData<Article[]>(STORAGE_KEYS.articles, defaultArticles);
  const index = current.findIndex((a) => a.slug === article.slug);
  const updated = index >= 0 ? current.map((a, i) => (i === index ? article : a)) : [article, ...current];
  setLocalData(STORAGE_KEYS.articles, updated);
}

export async function deleteArticle(slug: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("articles").delete().eq("slug", slug);
    } catch (err) {
      console.warn("Supabase delete article failed:", err);
    }
  }

  const current = getLocalData<Article[]>(STORAGE_KEYS.articles, defaultArticles);
  setLocalData(
    STORAGE_KEYS.articles,
    current.filter((a) => a.slug !== slug)
  );
}

// -------------------------------------------------------------
// 2. MÉDIATHÈQUE
// -------------------------------------------------------------
export async function getMediaItems(): Promise<MediaItem[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .order("date", { ascending: false });

      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          title: row.title,
          type: row.type,
          theme: row.theme,
          date: row.date,
          image: row.image,
          description: row.description,
          youtubeId: row.youtube_id || undefined,
          duration: row.duration || undefined,
          source: row.source || undefined,
          featured: row.featured,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return getLocalData<MediaItem[]>(STORAGE_KEYS.media, defaultMediaItems);
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = {
        id: item.id,
        title: item.title,
        type: item.type,
        theme: item.theme,
        date: item.date,
        image: item.image,
        description: item.description,
        youtube_id: item.youtubeId || null,
        duration: item.duration || null,
        source: item.source || null,
        featured: Boolean(item.featured),
        updated_at: new Date().toISOString(),
      };
      await supabase.from("media_items").upsert(row, { onConflict: "id" });
    } catch (err) {
      console.warn("Supabase upsert media failed:", err);
    }
  }

  const current = getLocalData<MediaItem[]>(STORAGE_KEYS.media, defaultMediaItems);
  const index = current.findIndex((m) => m.id === item.id);
  const updated = index >= 0 ? current.map((m, i) => (i === index ? item : m)) : [item, ...current];
  setLocalData(STORAGE_KEYS.media, updated);
}

export async function deleteMediaItem(id: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("media_items").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete media failed:", err);
    }
  }

  const current = getLocalData<MediaItem[]>(STORAGE_KEYS.media, defaultMediaItems);
  setLocalData(
    STORAGE_KEYS.media,
    current.filter((m) => m.id !== id)
  );
}

// -------------------------------------------------------------
// 3. ANNUAIRE SANTÉ
// -------------------------------------------------------------
export async function getDirectoryEntries(): Promise<DirectoryEntry[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("directory_entries").select("*").order("name", { ascending: true });
      if (!error && data) {
        return data.map((row) => ({
          name: row.name,
          category: row.category,
          city: row.city,
          region: row.region,
          services: Array.isArray(row.services) ? row.services : [],
          phone: row.phone,
          email: row.email,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return getLocalData<DirectoryEntry[]>(STORAGE_KEYS.directory, defaultDirectory);
}

export async function saveDirectoryEntry(entry: DirectoryEntry, oldName?: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = {
        name: entry.name,
        category: entry.category,
        city: entry.city,
        region: entry.region,
        services: entry.services,
        phone: entry.phone,
        email: entry.email,
        updated_at: new Date().toISOString(),
      };
      if (oldName && oldName !== entry.name) {
        await supabase.from("directory_entries").delete().eq("name", oldName);
      }
      await supabase.from("directory_entries").upsert(row, { onConflict: "name" });
    } catch (err) {
      console.warn("Supabase directory save failed:", err);
    }
  }

  const current = getLocalData<DirectoryEntry[]>(STORAGE_KEYS.directory, defaultDirectory);
  const targetName = oldName || entry.name;
  const index = current.findIndex((d) => d.name === targetName);
  const updated = index >= 0 ? current.map((d, i) => (i === index ? entry : d)) : [entry, ...current];
  setLocalData(STORAGE_KEYS.directory, updated);
}

export async function deleteDirectoryEntry(name: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("directory_entries").delete().eq("name", name);
    } catch (err) {
      console.warn("Supabase directory delete failed:", err);
    }
  }

  const current = getLocalData<DirectoryEntry[]>(STORAGE_KEYS.directory, defaultDirectory);
  setLocalData(
    STORAGE_KEYS.directory,
    current.filter((d) => d.name !== name)
  );
}

// -------------------------------------------------------------
// 4. SITES DU PROJET & CARTE
// -------------------------------------------------------------
export async function getProjectSites(): Promise<ProjectSite[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("project_sites").select("*").order("city", { ascending: true });
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          city: row.city,
          region: row.region,
          lon: Number(row.lon),
          lat: Number(row.lat),
          program: row.program,
          structures: Number(row.structures),
          since: Number(row.since),
          detail: row.detail,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return getLocalData<ProjectSite[]>(STORAGE_KEYS.projects, defaultProjectSites);
}

export async function saveProjectSite(site: ProjectSite): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = {
        id: site.id,
        city: site.city,
        region: site.region,
        lon: site.lon,
        lat: site.lat,
        program: site.program,
        structures: site.structures,
        since: site.since,
        detail: site.detail,
        updated_at: new Date().toISOString(),
      };
      await supabase.from("project_sites").upsert(row, { onConflict: "id" });
    } catch (err) {
      console.warn("Supabase project site save failed:", err);
    }
  }

  const current = getLocalData<ProjectSite[]>(STORAGE_KEYS.projects, defaultProjectSites);
  const index = current.findIndex((p) => p.id === site.id);
  const updated = index >= 0 ? current.map((p, i) => (i === index ? site : p)) : [site, ...current];
  setLocalData(STORAGE_KEYS.projects, updated);
}

export async function deleteProjectSite(id: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("project_sites").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase project site delete failed:", err);
    }
  }

  const current = getLocalData<ProjectSite[]>(STORAGE_KEYS.projects, defaultProjectSites);
  setLocalData(
    STORAGE_KEYS.projects,
    current.filter((p) => p.id !== id)
  );
}

// -------------------------------------------------------------
// 5. PARTENAIRES
// -------------------------------------------------------------
export async function getPartners(): Promise<Partner[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("partners").select("*").order("name", { ascending: true });
      if (!error && data) {
        return data.map((row) => ({
          name: row.name,
          role: row.role,
          type: row.type,
          description: row.description,
          initials: row.initials,
          logoImg: row.logo_img || undefined,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return getLocalData<Partner[]>(STORAGE_KEYS.partners, defaultPartners);
}

export async function savePartner(partner: Partner, oldName?: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = {
        name: partner.name,
        role: partner.role,
        type: partner.type,
        description: partner.description,
        initials: partner.initials,
        logo_img: partner.logoImg || null,
        updated_at: new Date().toISOString(),
      };
      if (oldName && oldName !== partner.name) {
        await supabase.from("partners").delete().eq("name", oldName);
      }
      await supabase.from("partners").upsert(row, { onConflict: "name" });
    } catch (err) {
      console.warn("Supabase partner save failed:", err);
    }
  }

  const current = getLocalData<Partner[]>(STORAGE_KEYS.partners, defaultPartners);
  const target = oldName || partner.name;
  const index = current.findIndex((p) => p.name === target);
  const updated = index >= 0 ? current.map((p, i) => (i === index ? partner : p)) : [partner, ...current];
  setLocalData(STORAGE_KEYS.partners, updated);
}

export async function deletePartner(name: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("partners").delete().eq("name", name);
    } catch (err) {
      console.warn("Supabase partner delete failed:", err);
    }
  }

  const current = getLocalData<Partner[]>(STORAGE_KEYS.partners, defaultPartners);
  setLocalData(
    STORAGE_KEYS.partners,
    current.filter((p) => p.name !== name)
  );
}

// -------------------------------------------------------------
// 6. FAQ
// -------------------------------------------------------------
export async function getFaqs(): Promise<FaqItem[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("faq_items").select("*").order("display_order", { ascending: true });
      if (!error && data) {
        return data.map((row) => ({
          category: row.category,
          question: row.question,
          answer: row.answer,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return getLocalData<FaqItem[]>(STORAGE_KEYS.faqs, defaultFaqs);
}

export async function saveFaq(faq: FaqItem, oldQuestion?: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = {
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        updated_at: new Date().toISOString(),
      };
      if (oldQuestion && oldQuestion !== faq.question) {
        await supabase.from("faq_items").delete().eq("question", oldQuestion);
      }
      await supabase.from("faq_items").upsert(row, { onConflict: "question" });
    } catch (err) {
      console.warn("Supabase FAQ save failed:", err);
    }
  }

  const current = getLocalData<FaqItem[]>(STORAGE_KEYS.faqs, defaultFaqs);
  const target = oldQuestion || faq.question;
  const index = current.findIndex((f) => f.question === target);
  const updated = index >= 0 ? current.map((f, i) => (i === index ? faq : f)) : [faq, ...current];
  setLocalData(STORAGE_KEYS.faqs, updated);
}

export async function deleteFaq(question: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("faq_items").delete().eq("question", question);
    } catch (err) {
      console.warn("Supabase FAQ delete failed:", err);
    }
  }

  const current = getLocalData<FaqItem[]>(STORAGE_KEYS.faqs, defaultFaqs);
  setLocalData(
    STORAGE_KEYS.faqs,
    current.filter((f) => f.question !== question)
  );
}

// -------------------------------------------------------------
// 7. ÉQUIPE
// -------------------------------------------------------------
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("team_members").select("*").order("display_order", { ascending: true });
      if (!error && data) {
        return data.map((row) => ({
          name: row.name,
          role: row.role,
          subRole: row.sub_role,
          initials: row.initials,
          image: row.image,
          bio: row.bio,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return getLocalData<TeamMember[]>(STORAGE_KEYS.team, defaultTeam);
}

export async function saveTeamMember(member: TeamMember, oldName?: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = {
        name: member.name,
        role: member.role,
        sub_role: member.subRole,
        initials: member.initials,
        image: member.image,
        bio: member.bio,
        updated_at: new Date().toISOString(),
      };
      if (oldName && oldName !== member.name) {
        await supabase.from("team_members").delete().eq("name", oldName);
      }
      await supabase.from("team_members").upsert(row, { onConflict: "name" });
    } catch (err) {
      console.warn("Supabase team save failed:", err);
    }
  }

  const current = getLocalData<TeamMember[]>(STORAGE_KEYS.team, defaultTeam);
  const target = oldName || member.name;
  const index = current.findIndex((t) => t.name === target);
  const updated = index >= 0 ? current.map((t, i) => (i === index ? member : t)) : [member, ...current];
  setLocalData(STORAGE_KEYS.team, updated);
}

export async function deleteTeamMember(name: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("team_members").delete().eq("name", name);
    } catch (err) {
      console.warn("Supabase team delete failed:", err);
    }
  }

  const current = getLocalData<TeamMember[]>(STORAGE_KEYS.team, defaultTeam);
  setLocalData(
    STORAGE_KEYS.team,
    current.filter((t) => t.name !== name)
  );
}

// -------------------------------------------------------------
// 8. TÉMOIGNAGES
// -------------------------------------------------------------
export async function getTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("testimonials").select("*").order("display_order", { ascending: true });
      if (!error && data) {
        return data.map((row) => ({
          author: row.author,
          role: row.role,
          image: row.image,
          quote: row.quote,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return getLocalData<Testimonial[]>(STORAGE_KEYS.testimonials, defaultTestimonials);
}

export async function saveTestimonial(testimonial: Testimonial, oldAuthor?: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = {
        author: testimonial.author,
        role: testimonial.role,
        image: testimonial.image,
        quote: testimonial.quote,
        updated_at: new Date().toISOString(),
      };
      if (oldAuthor && oldAuthor !== testimonial.author) {
        await supabase.from("testimonials").delete().eq("author", oldAuthor);
      }
      await supabase.from("testimonials").upsert(row, { onConflict: "author" });
    } catch (err) {
      console.warn("Supabase testimonial save failed:", err);
    }
  }

  const current = getLocalData<Testimonial[]>(STORAGE_KEYS.testimonials, defaultTestimonials);
  const target = oldAuthor || testimonial.author;
  const index = current.findIndex((t) => t.author === target);
  const updated = index >= 0 ? current.map((t, i) => (i === index ? testimonial : t)) : [testimonial, ...current];
  setLocalData(STORAGE_KEYS.testimonials, updated);
}

export async function deleteTestimonial(author: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("testimonials").delete().eq("author", author);
    } catch (err) {
      console.warn("Supabase testimonial delete failed:", err);
    }
  }

  const current = getLocalData<Testimonial[]>(STORAGE_KEYS.testimonials, defaultTestimonials);
  setLocalData(
    STORAGE_KEYS.testimonials,
    current.filter((t) => t.author !== author)
  );
}

// -------------------------------------------------------------
// IMPORTATION DES DONNÉES PAR DÉFAUT VERS SUPABASE (SEEDING)
// -------------------------------------------------------------
function toBucketImageUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Extraire le nom de fichier propre depuis le chemin d'import local
  const filename = url.split("/").pop() || "";
  return `https://pjwqyvcmwlvtwyuhnkww.supabase.co/storage/v1/object/public/images/${filename}`;
}

export async function seedInitialDataToSupabase(): Promise<{
  success: boolean;
  counts: Record<string, number>;
  message: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      counts: {},
      message: "Supabase n'est pas encore configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.",
    };
  }

  try {
    const counts: Record<string, number> = {};

    // 1. Articles
    const articleRows = defaultArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      date: a.date,
      reading_time: a.readingTime,
      author: a.author,
      image: toBucketImageUrl(a.image),
      secondary_image: a.secondaryImage ? toBucketImageUrl(a.secondaryImage) : null,
      body: a.body,
    }));
    await supabase.from("articles").upsert(articleRows, { onConflict: "slug" });
    counts["articles"] = articleRows.length;

    // 2. Media
    const mediaRows = defaultMediaItems.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      theme: m.theme,
      date: m.date,
      image: toBucketImageUrl(m.image),
      description: m.description,
      youtube_id: m.youtubeId || null,
      duration: m.duration || null,
      source: m.source || null,
      featured: Boolean(m.featured),
    }));
    await supabase.from("media_items").upsert(mediaRows, { onConflict: "id" });
    counts["media"] = mediaRows.length;

    // 3. Directory
    const dirRows = defaultDirectory.map((d) => ({
      name: d.name,
      category: d.category,
      city: d.city,
      region: d.region,
      services: d.services,
      phone: d.phone,
      email: d.email,
    }));
    await supabase.from("directory_entries").upsert(dirRows, { onConflict: "name" });
    counts["directory"] = dirRows.length;

    // 4. Projects
    const projectRows = defaultProjectSites.map((p) => ({
      id: p.id,
      city: p.city,
      region: p.region,
      lon: p.lon,
      lat: p.lat,
      program: p.program,
      structures: p.structures,
      since: p.since,
      detail: p.detail,
    }));
    await supabase.from("project_sites").upsert(projectRows, { onConflict: "id" });
    counts["projects"] = projectRows.length;

    // 5. Partners
    const partnerRows = defaultPartners.map((p) => ({
      name: p.name,
      role: p.role,
      type: p.type,
      description: p.description,
      initials: p.initials,
      logo_img: toBucketImageUrl(p.logoImg),
    }));
    await supabase.from("partners").upsert(partnerRows, { onConflict: "name" });
    counts["partners"] = partnerRows.length;

    // 6. Faqs
    const faqRows = defaultFaqs.map((f, i) => ({
      category: f.category,
      question: f.question,
      answer: f.answer,
      display_order: i,
    }));
    await supabase.from("faq_items").upsert(faqRows, { onConflict: "question" });
    counts["faqs"] = faqRows.length;

    // 7. Team
    const teamRows = defaultTeam.map((t, i) => ({
      name: t.name,
      role: t.role,
      sub_role: t.subRole,
      initials: t.initials,
      image: toBucketImageUrl(t.image),
      bio: t.bio,
      display_order: i,
    }));
    await supabase.from("team_members").upsert(teamRows, { onConflict: "name" });
    counts["team"] = teamRows.length;

    // 8. Testimonials
    const testRows = defaultTestimonials.map((t, i) => ({
      author: t.author,
      role: t.role,
      image: toBucketImageUrl(t.image),
      quote: t.quote,
      display_order: i,
    }));
    await supabase.from("testimonials").upsert(testRows, { onConflict: "author" });
    counts["testimonials"] = testRows.length;

    return {
      success: true,
      counts,
      message: "Toutes les données initiales ont été synchronisées avec succès dans Supabase !",
    };
  } catch (err: unknown) {
    return {
      success: false,
      counts: {},
      message: err instanceof Error ? err.message : "Erreur lors de la synchronisation",
    };
  }
}
