import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Newspaper,
  Film,
  Building2,
  MapPin,
  Handshake,
  HelpCircle,
  Users,
  Database,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Sparkles,
  Download,
} from "lucide-react";
import logoImg from "@/assets/telemed_logo.webp";
import { getCurrentAdmin, logoutAdminUser, isSupabaseConfigured, type AdminUser } from "@/lib/supabase";
import {
  useArticles,
  useMediaItems,
  useDirectory,
  useProjects,
  usePartners,
  useFaqs,
  useTeam,
  useTestimonials,
} from "@/hooks/useData";
import { seedInitialDataToSupabase, type TeamMember } from "@/lib/db";
import type { Article, MediaItem, DirectoryEntry, ProjectSite, Partner, FaqItem, Testimonial } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

type TabKey =
  | "dashboard"
  | "articles"
  | "media"
  | "directory"
  | "projects"
  | "partners"
  | "faqs"
  | "team"
  | "database";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Queries
  const { data: articles = [], save: saveArt, remove: removeArt } = useArticles();
  const { data: mediaItems = [], save: saveMed, remove: removeMed } = useMediaItems();
  const { data: directoryEntries = [], save: saveDir, remove: removeDir } = useDirectory();
  const { data: projectSites = [], save: saveProj, remove: removeProj } = useProjects();
  const { data: partners = [], save: savePart, remove: removePart } = usePartners();
  const { data: faqs = [], save: saveFaqItem, remove: removeFaqItem } = useFaqs();
  const { data: teamMembers = [], save: saveTeamMbr, remove: removeTeamMbr } = useTeam();
  const { data: testimonials = [], save: saveTestim, remove: removeTestim } = useTestimonials();

  // Active dialog states
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  const [directoryModalOpen, setDirectoryModalOpen] = useState(false);
  const [editingDirectory, setEditingDirectory] = useState<{ entry: DirectoryEntry; oldName?: string } | null>(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectSite | null>(null);

  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<{ partner: Partner; oldName?: string } | null>(null);

  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<{ faq: FaqItem; oldQuestion?: string } | null>(null);

  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<{ member: TeamMember; oldName?: string } | null>(null);

  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<{ testimonial: Testimonial; oldAuthor?: string } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    title: string;
    onConfirm: () => Promise<void>;
  }>({ open: false, title: "", onConfirm: async () => {} });

  const supabaseActive = isSupabaseConfigured();

  // Vérifier la session
  useEffect(() => {
    getCurrentAdmin().then((user) => {
      if (!user) {
        navigate({ to: "/admin/login" });
      } else {
        setAdminUser(user);
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await logoutAdminUser();
    toast.info("Déconnexion effectuée");
    navigate({ to: "/admin/login" });
  };

  const handleSeed = async () => {
    if (!supabaseActive) {
      toast.error("Supabase n'est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.");
      return;
    }
    setIsSeeding(true);
    try {
      const res = await seedInitialDataToSupabase();
      if (res.success) {
        await queryClient.invalidateQueries();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur de synchronisation");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySql = () => {
    const sqlScript = `-- SCHEMA POSTGRESQL COMPLET SUPABASE (Voir supabase/schema.sql dans le projet)
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  reading_time TEXT NOT NULL DEFAULT '4 min',
  author TEXT NOT NULL,
  image TEXT NOT NULL,
  secondary_image TEXT,
  body JSONB NOT NULL DEFAULT '[]'::jsonb
);
-- Activez RLS et exécutez le fichier complet supabase/schema.sql`;
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    toast.success("Script SQL copié dans le presse-papier !");
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleExportJson = () => {
    const allData = {
      articles,
      mediaItems,
      directoryEntries,
      projectSites,
      partners,
      faqs,
      teamMembers,
      testimonials,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `telemed_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sauvegarde JSON téléchargée avec succès !");
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 border-2 border-[#74a638] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-slate-600">Chargement de l'espace administration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#74a638] selection:text-white">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-3 sm:px-6 py-2 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Unique Toggle sidebar button (desktop & mobile) */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileSidebarOpen(!mobileSidebarOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            className="h-8.5 w-8.5 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            title={sidebarCollapsed ? "Agrandir le menu" : "Réduire le menu"}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>

          {/* Official Logo on pristine white */}
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Logo Télémédecine Côte d'Ivoire"
              className="h-8 w-auto object-contain"
            />
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                Administration
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connecté
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs h-8.5 px-3 rounded-lg shadow-2xs"
          >
            <Link to="/" target="_blank">
              <span className="hidden sm:inline mr-1.5">Site public</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            </Link>
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs h-8.5 px-3 rounded-lg"
          >
            <LogOut className="h-3.5 w-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline font-medium">Déconnexion</span>
          </Button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside
          className={`border-r border-slate-200 bg-white p-2.5 flex md:flex-col gap-1 shrink-0 transition-all duration-200 ${
            sidebarCollapsed ? "md:w-16" : "md:w-60"
          } ${mobileSidebarOpen ? "block" : "hidden md:flex"} overflow-x-auto md:overflow-y-auto`}
        >
          {!sidebarCollapsed && (
            <div className="px-3 py-2 hidden md:block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
          )}

          <NavButton
            active={activeTab === "dashboard"}
            onClick={() => { setActiveTab("dashboard"); setMobileSidebarOpen(false); }}
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Vue d'ensemble"
            collapsed={sidebarCollapsed}
          />

          <NavButton
            active={activeTab === "articles"}
            onClick={() => { setActiveTab("articles"); setMobileSidebarOpen(false); }}
            icon={<Newspaper className="h-4 w-4" />}
            label="Articles & Actualités"
            count={articles.length}
            collapsed={sidebarCollapsed}
          />

          <NavButton
            active={activeTab === "media"}
            onClick={() => { setActiveTab("media"); setMobileSidebarOpen(false); }}
            icon={<Film className="h-4 w-4" />}
            label="Médiathèque"
            count={mediaItems.length}
            collapsed={sidebarCollapsed}
          />

          <NavButton
            active={activeTab === "directory"}
            onClick={() => { setActiveTab("directory"); setMobileSidebarOpen(false); }}
            icon={<Building2 className="h-4 w-4" />}
            label="Annuaire Santé"
            count={directoryEntries.length}
            collapsed={sidebarCollapsed}
          />

          <NavButton
            active={activeTab === "projects"}
            onClick={() => { setActiveTab("projects"); setMobileSidebarOpen(false); }}
            icon={<MapPin className="h-4 w-4" />}
            label="Sites & Carte"
            count={projectSites.length}
            collapsed={sidebarCollapsed}
          />

          <NavButton
            active={activeTab === "partners"}
            onClick={() => { setActiveTab("partners"); setMobileSidebarOpen(false); }}
            icon={<Handshake className="h-4 w-4" />}
            label="Partenaires"
            count={partners.length}
            collapsed={sidebarCollapsed}
          />

          <NavButton
            active={activeTab === "faqs"}
            onClick={() => { setActiveTab("faqs"); setMobileSidebarOpen(false); }}
            icon={<HelpCircle className="h-4 w-4" />}
            label="Foire aux questions"
            count={faqs.length}
            collapsed={sidebarCollapsed}
          />

          <NavButton
            active={activeTab === "team"}
            onClick={() => { setActiveTab("team"); setMobileSidebarOpen(false); }}
            icon={<Users className="h-4 w-4" />}
            label="Équipe & Témoins"
            count={teamMembers.length + testimonials.length}
            collapsed={sidebarCollapsed}
          />

          <div className="border-t border-slate-200 my-2 hidden md:block" />

          <NavButton
            active={activeTab === "database"}
            onClick={() => { setActiveTab("database"); setMobileSidebarOpen(false); }}
            icon={<Database className="h-4 w-4 text-[#74a638]" />}
            label="Base de données"
            collapsed={sidebarCollapsed}
          />
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-5 sm:p-7 md:p-8 overflow-y-auto bg-slate-50">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">Vue d'ensemble</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gestion centralisée des contenus du portail national
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleExportJson}
                    variant="outline"
                    size="sm"
                    className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-8 shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                    Exporter Sauvegarde JSON
                  </Button>
                </div>
              </div>

              {/* Stats Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                  title="Articles & Actus"
                  count={articles.length}
                  icon={<Newspaper className="h-5 w-5 text-blue-600" />}
                  onAction={() => setActiveTab("articles")}
                />
                <StatCard
                  title="Médias & Vidéos"
                  count={mediaItems.length}
                  icon={<Film className="h-5 w-5 text-purple-600" />}
                  onAction={() => setActiveTab("media")}
                />
                <StatCard
                  title="Structures santé"
                  count={directoryEntries.length}
                  icon={<Building2 className="h-5 w-5 text-emerald-600" />}
                  onAction={() => setActiveTab("directory")}
                />
                <StatCard
                  title="Sites cartographiés"
                  count={projectSites.length}
                  icon={<MapPin className="h-5 w-5 text-amber-600" />}
                  onAction={() => setActiveTab("projects")}
                />
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
                <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#74a638]" />
                  Actions Rapides d'Ajout
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button
                    onClick={() => {
                      setEditingArticle({
                        slug: `article-${Date.now()}`,
                        title: "",
                        excerpt: "",
                        category: "Actualité",
                        date: new Date().toISOString().slice(0, 10),
                        readingTime: "4 min",
                        author: "Coordination RAFT Côte d'Ivoire",
                        image: "/src/assets/hero.jpg",
                        body: [""],
                      });
                      setArticleModalOpen(true);
                    }}
                    variant="outline"
                    className="border-slate-200 bg-slate-50 hover:bg-[#74a638]/5 hover:border-[#74a638]/30 hover:text-[#74a638] text-slate-700 font-medium text-xs justify-start h-auto py-3 px-3 shadow-2xs transition-all"
                  >
                    <Plus className="h-4 w-4 text-[#74a638] mr-2 shrink-0" />
                    <span>Nouvel Article</span>
                  </Button>

                  <Button
                    onClick={() => {
                      setEditingMedia({
                        id: `media-${Date.now()}`,
                        title: "",
                        type: "Photo",
                        theme: "Télé-ECG",
                        date: new Date().toISOString().slice(0, 10),
                        image: "/src/assets/teleecg.jpg",
                        description: "",
                      });
                      setMediaModalOpen(true);
                    }}
                    variant="outline"
                    className="border-slate-200 bg-slate-50 hover:bg-[#74a638]/5 hover:border-[#74a638]/30 hover:text-[#74a638] text-slate-700 font-medium text-xs justify-start h-auto py-3 px-3 shadow-2xs transition-all"
                  >
                    <Plus className="h-4 w-4 text-purple-600 mr-2 shrink-0" />
                    <span>Nouveau Média</span>
                  </Button>

                  <Button
                    onClick={() => {
                      setEditingDirectory({
                        entry: {
                          name: "",
                          category: "Hôpital général",
                          city: "",
                          region: "",
                          services: ["Télé-ECG"],
                          phone: "+225 ",
                          email: "",
                        },
                      });
                      setDirectoryModalOpen(true);
                    }}
                    variant="outline"
                    className="border-slate-200 bg-slate-50 hover:bg-[#74a638]/5 hover:border-[#74a638]/30 hover:text-[#74a638] text-slate-700 font-medium text-xs justify-start h-auto py-3 px-3 shadow-2xs transition-all"
                  >
                    <Plus className="h-4 w-4 text-emerald-600 mr-2 shrink-0" />
                    <span>Nouvelle Structure</span>
                  </Button>

                  <Button
                    onClick={() => {
                      setEditingProject({
                        id: `site-${Date.now()}`,
                        city: "",
                        region: "",
                        lon: -5.0,
                        lat: 7.0,
                        program: "Télé-ECG",
                        structures: 1,
                        since: 2026,
                        detail: "",
                      });
                      setProjectModalOpen(true);
                    }}
                    variant="outline"
                    className="border-slate-200 bg-slate-50 hover:bg-[#74a638]/5 hover:border-[#74a638]/30 hover:text-[#74a638] text-slate-700 font-medium text-xs justify-start h-auto py-3 px-3 shadow-2xs transition-all"
                  >
                    <Plus className="h-4 w-4 text-amber-600 mr-2 shrink-0" />
                    <span>Nouveau Site Carte</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLES */}
          {activeTab === "articles" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Articles & Actualités ({articles.length})</h2>
                  <p className="text-xs text-slate-500">Ajoutez, modifiez ou retirez des articles du portail</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingArticle({
                      slug: `article-${Date.now()}`,
                      title: "",
                      excerpt: "",
                      category: "Actualité",
                      date: new Date().toISOString().slice(0, 10),
                      readingTime: "4 min",
                      author: "Coordination RAFT Côte d'Ivoire",
                      image: "/src/assets/hero.jpg",
                      body: [""],
                    });
                    setArticleModalOpen(true);
                  }}
                  className="bg-[#74a638] hover:bg-[#64922e] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Ajouter un Article
                </Button>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 max-w-sm shadow-2xs">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-xs text-slate-900 placeholder:text-slate-400 outline-none w-full"
                />
              </div>

              <div className="grid gap-3">
                {articles
                  .filter(
                    (a) =>
                      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.category.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((article) => (
                    <div
                      key={article.slug}
                      className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-14 w-20 object-cover rounded-lg shrink-0 border border-slate-200 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] bg-slate-100 border-slate-200 text-slate-700">
                              {article.category}
                            </Badge>
                            <span className="text-[11px] text-slate-500">{article.date}</span>
                          </div>
                          <h3 className="font-semibold text-sm text-slate-900 truncate max-w-lg">{article.title}</h3>
                          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{article.excerpt}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        >
                          <Link to="/articles/$slug" params={{ slug: article.slug }} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingArticle({ ...article });
                            setArticleModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            setDeleteConfirm({
                              open: true,
                              title: `Supprimer l'article "${article.title}" ?`,
                              onConfirm: async () => {
                                await removeArt(article.slug);
                                toast.success("Article supprimé avec succès");
                              },
                            });
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: MÉDIATHÈQUE */}
          {activeTab === "media" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Médiathèque ({mediaItems.length})</h2>
                  <p className="text-xs text-slate-500">Photos, vidéos YouTube et documents</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingMedia({
                      id: `media-${Date.now()}`,
                      title: "",
                      type: "Photo",
                      theme: "Télé-ECG",
                      date: new Date().toISOString().slice(0, 10),
                      image: "/src/assets/teleecg.jpg",
                      description: "",
                    });
                    setMediaModalOpen(true);
                  }}
                  className="bg-[#74a638] hover:bg-[#64922e] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Ajouter un Média
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all"
                  >
                    <div className="relative aspect-video bg-slate-100">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <Badge className="bg-slate-900/80 backdrop-blur-md text-[10px] text-white border-none">
                          {item.type}
                        </Badge>
                        <Badge className="bg-[#74a638] text-[10px] text-white border-none font-medium">
                          {item.theme}
                        </Badge>
                      </div>
                      {item.youtubeId && (
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-semibold">
                          YouTube
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                        <span>{item.date}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => {
                              setEditingMedia({ ...item });
                              setMediaModalOpen(true);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => {
                              setDeleteConfirm({
                                open: true,
                                title: `Supprimer le média "${item.title}" ?`,
                                onConfirm: async () => {
                                  await removeMed(item.id);
                                  toast.success("Média supprimé avec succès");
                                },
                              });
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANNUAIRE */}
          {activeTab === "directory" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Annuaire Santé ({directoryEntries.length})</h2>
                  <p className="text-xs text-slate-500">Établissements hospitaliers, centres de santé et spécialistes</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingDirectory({
                      entry: {
                        name: "",
                        category: "Hôpital général",
                        city: "",
                        region: "",
                        services: ["Télé-ECG"],
                        phone: "+225 ",
                        email: "",
                      },
                    });
                    setDirectoryModalOpen(true);
                  }}
                  className="bg-[#74a638] hover:bg-[#64922e] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Ajouter une Structure
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {directoryEntries.map((entry) => (
                  <div
                    key={entry.name}
                    className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] bg-slate-100 border-slate-200 text-slate-700">
                          {entry.category}
                        </Badge>
                        <span className="text-xs text-slate-500 font-medium">
                          {entry.city} · {entry.region}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900">{entry.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.services.map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <div>
                        <span>{entry.phone}</span> · <span className="text-slate-400">{entry.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => {
                            setEditingDirectory({ entry: { ...entry }, oldName: entry.name });
                            setDirectoryModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          onClick={() => {
                            setDeleteConfirm({
                              open: true,
                              title: `Supprimer "${entry.name}" de l'annuaire ?`,
                              onConfirm: async () => {
                                await removeDir(entry.name);
                                toast.success("Entrée supprimée");
                              },
                            });
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SITES & PROJETS */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Sites Cartographiés ({projectSites.length})</h2>
                  <p className="text-xs text-slate-500">Points GPS et programmes sur la carte interactive de Côte d'Ivoire</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingProject({
                      id: `site-${Date.now()}`,
                      city: "",
                      region: "",
                      lon: -5.0,
                      lat: 7.0,
                      program: "Télé-ECG",
                      structures: 1,
                      since: 2026,
                      detail: "",
                    });
                    setProjectModalOpen(true);
                  }}
                  className="bg-[#74a638] hover:bg-[#64922e] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Ajouter un Site
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {projectSites.map((site) => (
                  <div
                    key={site.id}
                    className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-[#74a638]/15 text-[#74a638] border border-[#74a638]/20 font-semibold text-[10px]">
                          {site.program}
                        </Badge>
                        <span className="text-[11px] text-slate-500">Depuis {site.since}</span>
                      </div>
                      <h4 className="font-semibold text-base text-slate-900">{site.city}</h4>
                      <p className="text-xs text-slate-500">{site.region}</p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3">{site.detail}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>
                        GPS: {site.lat.toFixed(2)}, {site.lon.toFixed(2)} ({site.structures} struct.)
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => {
                            setEditingProject({ ...site });
                            setProjectModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          onClick={() => {
                            setDeleteConfirm({
                              open: true,
                              title: `Supprimer le site "${site.city}" ?`,
                              onConfirm: async () => {
                                await removeProj(site.id);
                                toast.success("Site supprimé");
                              },
                            });
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PARTENAIRES */}
          {activeTab === "partners" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Partenaires ({partners.length})</h2>
                  <p className="text-xs text-slate-500">Ministères, agences étatiques, ONG et universités</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingPartner({
                      partner: {
                        name: "",
                        role: "",
                        type: "Institutionnel",
                        description: "",
                        initials: "",
                      },
                    });
                    setPartnerModalOpen(true);
                  }}
                  className="bg-[#74a638] hover:bg-[#64922e] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Ajouter un Partenaire
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[10px] bg-slate-100 border-slate-200 text-slate-700">
                          {partner.type}
                        </Badge>
                        <span className="h-7 w-7 rounded-lg bg-[#74a638]/10 text-[#74a638] font-bold text-xs flex items-center justify-center border border-[#74a638]/20">
                          {partner.initials}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900">{partner.name}</h4>
                      <p className="text-xs text-[#74a638] font-semibold mt-0.5">{partner.role}</p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3">{partner.description}</p>
                    </div>

                    <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-100">
                      <Button
                        onClick={() => {
                          setEditingPartner({ partner: { ...partner }, oldName: partner.name });
                          setPartnerModalOpen(true);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteConfirm({
                            open: true,
                            title: `Supprimer le partenaire "${partner.name}" ?`,
                            onConfirm: async () => {
                              await removePart(partner.name);
                              toast.success("Partenaire supprimé");
                            },
                          });
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FAQ */}
          {activeTab === "faqs" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Foire aux questions ({faqs.length})</h2>
                  <p className="text-xs text-slate-500">Questions fréquentes classées par thème</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingFaq({
                      faq: {
                        category: "Général",
                        question: "",
                        answer: "",
                      },
                    });
                    setFaqModalOpen(true);
                  }}
                  className="bg-[#74a638] hover:bg-[#64922e] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Ajouter une Question
                </Button>
              </div>

              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all"
                  >
                    <div className="min-w-0">
                      <Badge variant="outline" className="text-[10px] bg-slate-100 border-slate-200 text-slate-700 mb-1.5">
                        {f.category}
                      </Badge>
                      <h4 className="font-semibold text-sm text-slate-900">{f.question}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{f.answer}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                      <Button
                        onClick={() => {
                          setEditingFaq({ faq: { ...f }, oldQuestion: f.question });
                          setFaqModalOpen(true);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteConfirm({
                            open: true,
                            title: `Supprimer la question "${f.question}" ?`,
                            onConfirm: async () => {
                              await removeFaqItem(f.question);
                              toast.success("Question supprimée");
                            },
                          });
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: ÉQUIPE & TÉMOIGNAGES */}
          {activeTab === "team" && (
            <div className="space-y-8">
              {/* Membres de l'équipe */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Membres de la Coordination & Pionniers ({teamMembers.length})</h2>
                    <p className="text-xs text-slate-500">Présentation des acteurs clés du réseau RAFT CI</p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingTeam({
                        member: {
                          name: "",
                          role: "",
                          subRole: "",
                          initials: "",
                          image: "/src/assets/hero.jpg",
                          bio: "",
                        },
                      });
                      setTeamModalOpen(true);
                    }}
                    className="bg-[#74a638] hover:bg-[#64922e] text-white text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Ajouter un Membre
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.name}
                      className="bg-white border border-slate-200/90 rounded-xl p-4 flex gap-3.5 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all"
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-16 w-16 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 truncate">{member.name}</h4>
                          <div className="flex items-center">
                            <Button
                              onClick={() => {
                                setEditingTeam({ member: { ...member }, oldName: member.name });
                                setTeamModalOpen(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              onClick={() => {
                                setDeleteConfirm({
                                  open: true,
                                  title: `Supprimer ${member.name} de l'équipe ?`,
                                  onConfirm: async () => {
                                    await removeTeamMbr(member.name);
                                    toast.success("Membre supprimé");
                                  },
                                });
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-[#74a638] font-semibold">{member.role}</p>
                        <p className="text-[11px] text-slate-500">{member.subRole}</p>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Témoignages */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Témoignages & Citations ({testimonials.length})</h2>
                    <p className="text-xs text-slate-500">Avis d'experts, médecins et directeurs</p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingTestimonial({
                        testimonial: {
                          author: "",
                          role: "",
                          image: "/src/assets/hero.jpg",
                          quote: "",
                        },
                      });
                      setTestimonialModalOpen(true);
                    }}
                    className="bg-[#74a638] hover:bg-[#64922e] text-white text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Ajouter un Témoignage
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {testimonials.map((testim) => (
                    <div
                      key={testim.author}
                      className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={testim.image}
                              alt={testim.author}
                              className="h-10 w-10 rounded-full object-cover border border-slate-200 bg-slate-100"
                            />
                            <div>
                              <h4 className="font-semibold text-sm text-slate-900">{testim.author}</h4>
                              <p className="text-xs text-slate-500">{testim.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button
                              onClick={() => {
                                setEditingTestimonial({ testimonial: { ...testim }, oldAuthor: testim.author });
                                setTestimonialModalOpen(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              onClick={() => {
                                setDeleteConfirm({
                                  open: true,
                                  title: `Supprimer le témoignage de ${testim.author} ?`,
                                  onConfirm: async () => {
                                    await removeTestim(testim.author);
                                    toast.success("Témoignage supprimé");
                                  },
                                });
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 italic mt-3 line-clamp-4">
                          "{testim.quote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BASE DE DONNÉES & SUPABASE */}
          {activeTab === "database" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Base de Données & Stockage</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gestion de la synchronisation Supabase Cloud PostgreSQL et du bucket Storage
                </p>
              </div>

              {/* Status card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-slate-900">Supabase Cloud PostgreSQL</h3>
                        <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-2 font-medium">Actif</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Projet : <span className="text-slate-700 font-mono font-medium">pjwqyvcmwlvtwyuhnkww</span> · Bucket : <span className="text-[#74a638] font-mono font-semibold">images (Public)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
                  <Button
                    onClick={handleSeed}
                    disabled={isSeeding || !supabaseActive}
                    className="bg-[#74a638] hover:bg-[#64922e] text-white text-xs h-9 cursor-pointer font-semibold shadow-sm"
                  >
                    {isSeeding ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Synchronisation en cours...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Resynchroniser données initiales
                      </span>
                    )}
                  </Button>

                  <Button
                    onClick={handleExportJson}
                    variant="outline"
                    className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 cursor-pointer shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                    Exporter Sauvegarde JSON
                  </Button>

                  <Button
                    onClick={handleCopySql}
                    variant="outline"
                    className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 cursor-pointer shadow-2xs"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                        Script copié !
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                        Copier script SQL
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Table Records Summary Grid */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#74a638]" />
                  Tables actives & enregistrements en ligne
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Articles</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">{articles.length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Médiathèque</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">{mediaItems.length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Annuaire Santé</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">{directoryEntries.length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Sites Carte</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">{projectSites.length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Partenaires</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">{partners.length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">FAQ</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">{faqs.length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Membres Équipe</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">{teamMembers.length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[11px] text-slate-500 block">Témoignages</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">{testimonials.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ARTICLE FORM */}
      {/* ========================================================================= */}
      <Dialog open={articleModalOpen} onOpenChange={setArticleModalOpen}>
        <DialogContent className="max-w-2xl bg-white border border-slate-200 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingArticle?.title ? "Modifier l'article" : "Créer un nouvel article"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Remplissez les détails de l'article pour le portail national.
            </DialogDescription>
          </DialogHeader>

          {editingArticle && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Titre de l'article *</label>
                  <Input
                    value={editingArticle.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "");
                      setEditingArticle({ ...editingArticle, title, slug: slug || editingArticle.slug });
                    }}
                    placeholder="Ex: Lancement de la Phase 3 Télé-ECG"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Identifiant URL (Slug) *</label>
                  <Input
                    value={editingArticle.slug}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        category: e.target.value as Article["category"],
                      })
                    }
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-md p-2 text-slate-900 outline-none text-xs focus:border-[#74a638]"
                  >
                    <option value="Actualité">Actualité</option>
                    <option value="Projet">Projet</option>
                    <option value="Formation">Formation</option>
                    <option value="Recherche">Recherche</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <Input
                    type="date"
                    value={editingArticle.date}
                    onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temps de lecture</label>
                  <Input
                    value={editingArticle.readingTime}
                    onChange={(e) => setEditingArticle({ ...editingArticle, readingTime: e.target.value })}
                    placeholder="4 min"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Auteur</label>
                <Input
                  value={editingArticle.author}
                  onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                  placeholder="Coordination RAFT Côte d'Ivoire"
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Résumé court (Excerpt)</label>
                <Textarea
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  rows={2}
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <ImageUploadField
                  label="Image principale"
                  value={editingArticle.image}
                  onChange={(url) => setEditingArticle({ ...editingArticle, image: url })}
                  placeholder="https://... ou téléverser depuis le PC"
                  prefix="art_main"
                  required
                />
                <ImageUploadField
                  label="Image secondaire (Optionnel)"
                  value={editingArticle.secondaryImage || ""}
                  onChange={(url) => setEditingArticle({ ...editingArticle, secondaryImage: url || undefined })}
                  placeholder="https://... ou téléverser depuis le PC"
                  prefix="art_sec"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Corps du texte (Paragraphes séparés par une ligne vide)
                </label>
                <Textarea
                  value={editingArticle.body.join("\n\n")}
                  onChange={(e) => {
                    const text = e.target.value;
                    const paragraphs = text.split("\n\n").filter(Boolean);
                    setEditingArticle({ ...editingArticle, body: paragraphs.length ? paragraphs : [text] });
                  }}
                  rows={6}
                  placeholder="Écrivez le contenu de l'article ici..."
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setArticleModalOpen(false)}
              className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!editingArticle?.title || !editingArticle?.slug) {
                  toast.error("Veuillez renseigner au moins le titre et le slug.");
                  return;
                }
                await saveArt(editingArticle);
                toast.success("Article enregistré avec succès !");
                setArticleModalOpen(false);
              }}
              className="bg-[#74a638] hover:bg-[#64922e] text-white font-semibold text-xs shadow-sm"
            >
              Enregistrer l'article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: MEDIA ITEM FORM */}
      {/* ========================================================================= */}
      <Dialog open={mediaModalOpen} onOpenChange={setMediaModalOpen}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 text-slate-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingMedia?.title ? "Modifier le média" : "Ajouter un média"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Photos, vidéos YouTube ou documents institutionnels.
            </DialogDescription>
          </DialogHeader>

          {editingMedia && (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre du média *</label>
                <Input
                  value={editingMedia.title}
                  onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                  placeholder="Ex: Cérémonie de remise des kits Télé-ECG"
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={editingMedia.type}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        type: e.target.value as MediaItem["type"],
                      })
                    }
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-md p-2 text-slate-900 outline-none text-xs focus:border-[#74a638]"
                  >
                    <option value="Photo">Photo</option>
                    <option value="Vidéo">Vidéo</option>
                    <option value="Document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thème</label>
                  <select
                    value={editingMedia.theme}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        theme: e.target.value as MediaItem["theme"],
                      })
                    }
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-md p-2 text-slate-900 outline-none text-xs focus:border-[#74a638]"
                  >
                    <option value="Télé-ECG">Télé-ECG</option>
                    <option value="Télé-expertise">Télé-expertise</option>
                    <option value="Formation">Formation</option>
                    <option value="Événements">Événements</option>
                    <option value="Santé numérique">Santé numérique</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <ImageUploadField
                  label="Image / Miniature"
                  value={editingMedia.image}
                  onChange={(url) => setEditingMedia({ ...editingMedia, image: url })}
                  placeholder="https://... ou téléverser depuis le PC"
                  prefix="media"
                  required
                />
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Identifiant YouTube (si vidéo)</label>
                  <Input
                    value={editingMedia.youtubeId || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
                      const yId = match ? match[1] : val;
                      setEditingMedia({
                        ...editingMedia,
                        youtubeId: yId || undefined,
                        image: yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : editingMedia.image,
                      });
                    }}
                    placeholder="Ex: 90fZyQnz4-8"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <Textarea
                  value={editingMedia.description}
                  onChange={(e) => setEditingMedia({ ...editingMedia, description: e.target.value })}
                  rows={2}
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source / Crédit</label>
                  <Input
                    value={editingMedia.source || ""}
                    onChange={(e) => setEditingMedia({ ...editingMedia, source: e.target.value || undefined })}
                    placeholder="Coordination RAFT CI"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Durée (si vidéo)</label>
                  <Input
                    value={editingMedia.duration || ""}
                    onChange={(e) => setEditingMedia({ ...editingMedia, duration: e.target.value || undefined })}
                    placeholder="Ex: 14:30"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMediaModalOpen(false)}
              className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!editingMedia?.title) {
                  toast.error("Veuillez renseigner le titre.");
                  return;
                }
                await saveMed(editingMedia);
                toast.success("Média enregistré avec succès !");
                setMediaModalOpen(false);
              }}
              className="bg-[#74a638] hover:bg-[#64922e] text-white font-semibold text-xs shadow-sm"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: DIRECTORY ENTRY FORM */}
      {/* ========================================================================= */}
      <Dialog open={directoryModalOpen} onOpenChange={setDirectoryModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingDirectory?.entry.name ? "Modifier la structure" : "Ajouter une structure"}
            </DialogTitle>
          </DialogHeader>

          {editingDirectory && (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom de l'établissement ou médecin *</label>
                <Input
                  value={editingDirectory.entry.name}
                  onChange={(e) =>
                    setEditingDirectory({
                      ...editingDirectory,
                      entry: { ...editingDirectory.entry, name: e.target.value },
                    })
                  }
                  placeholder="Ex: Hôpital Général de Korhogo"
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={editingDirectory.entry.category}
                    onChange={(e) =>
                      setEditingDirectory({
                        ...editingDirectory,
                        entry: {
                          ...editingDirectory.entry,
                          category: e.target.value as DirectoryEntry["category"],
                        },
                      })
                    }
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-md p-2 text-slate-900 outline-none text-xs focus:border-[#74a638]"
                  >
                    <option value="CHU">CHU</option>
                    <option value="Hôpital général">Hôpital général</option>
                    <option value="Centre de santé">Centre de santé</option>
                    <option value="Spécialiste">Spécialiste</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                  <Input
                    value={editingDirectory.entry.city}
                    onChange={(e) =>
                      setEditingDirectory({
                        ...editingDirectory,
                        entry: { ...editingDirectory.entry, city: e.target.value },
                      })
                    }
                    placeholder="Korhogo"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Région</label>
                  <Input
                    value={editingDirectory.entry.region}
                    onChange={(e) =>
                      setEditingDirectory({
                        ...editingDirectory,
                        entry: { ...editingDirectory.entry, region: e.target.value },
                      })
                    }
                    placeholder="Poro"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Services offerts (séparés par des virgules)
                </label>
                <Input
                  value={editingDirectory.entry.services.join(", ")}
                  onChange={(e) =>
                    setEditingDirectory({
                      ...editingDirectory,
                      entry: {
                        ...editingDirectory.entry,
                        services: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  placeholder="Télé-ECG connecté, Urgences cardiologiques"
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
                  <Input
                    value={editingDirectory.entry.phone}
                    onChange={(e) =>
                      setEditingDirectory({
                        ...editingDirectory,
                        entry: { ...editingDirectory.entry, phone: e.target.value },
                      })
                    }
                    placeholder="+225 27 00 00 00 00"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email de contact</label>
                  <Input
                    value={editingDirectory.entry.email}
                    onChange={(e) =>
                      setEditingDirectory({
                        ...editingDirectory,
                        entry: { ...editingDirectory.entry, email: e.target.value },
                      })
                    }
                    placeholder="contact@structure.ci"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDirectoryModalOpen(false)}
              className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!editingDirectory?.entry.name) return;
                await saveDir({ entry: editingDirectory.entry, oldName: editingDirectory.oldName });
                toast.success("Structure enregistrée avec succès !");
                setDirectoryModalOpen(false);
              }}
              className="bg-[#74a638] hover:bg-[#64922e] text-white font-semibold text-xs shadow-sm"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 4: PROJECT SITE FORM (CARTE) */}
      {/* ========================================================================= */}
      <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingProject?.city ? "Modifier le site cartographique" : "Ajouter un site sur la carte"}
            </DialogTitle>
          </DialogHeader>

          {editingProject && (
            <div className="space-y-3 py-2 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ville *</label>
                  <Input
                    value={editingProject.city}
                    onChange={(e) => setEditingProject({ ...editingProject, city: e.target.value })}
                    placeholder="Bouaké"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Région *</label>
                  <Input
                    value={editingProject.region}
                    onChange={(e) => setEditingProject({ ...editingProject, region: e.target.value })}
                    placeholder="Gbêkê"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Latitude GPS</label>
                  <Input
                    type="number"
                    step="any"
                    value={editingProject.lat}
                    onChange={(e) => setEditingProject({ ...editingProject, lat: parseFloat(e.target.value) || 0 })}
                    placeholder="7.69"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Longitude GPS</label>
                  <Input
                    type="number"
                    step="any"
                    value={editingProject.lon}
                    onChange={(e) => setEditingProject({ ...editingProject, lon: parseFloat(e.target.value) || 0 })}
                    placeholder="-5.03"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Programme</label>
                  <select
                    value={editingProject.program}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        program: e.target.value as ProjectSite["program"],
                      })
                    }
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-md p-2 text-slate-900 outline-none text-xs focus:border-[#74a638]"
                  >
                    <option value="Télé-ECG">Télé-ECG</option>
                    <option value="Télé-expertise">Télé-expertise</option>
                    <option value="Télé-formation">Télé-formation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Structures</label>
                  <Input
                    type="number"
                    value={editingProject.structures}
                    onChange={(e) => setEditingProject({ ...editingProject, structures: parseInt(e.target.value) || 1 })}
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actif depuis</label>
                  <Input
                    type="number"
                    value={editingProject.since}
                    onChange={(e) => setEditingProject({ ...editingProject, since: parseInt(e.target.value) || 2026 })}
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Détails & description pour la carte</label>
                <Textarea
                  value={editingProject.detail}
                  onChange={(e) => setEditingProject({ ...editingProject, detail: e.target.value })}
                  rows={3}
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProjectModalOpen(false)}
              className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!editingProject?.city) return;
                await saveProj(editingProject);
                toast.success("Site cartographique enregistré avec succès !");
                setProjectModalOpen(false);
              }}
              className="bg-[#74a638] hover:bg-[#64922e] text-white font-semibold text-xs shadow-sm"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 5: PARTNER FORM */}
      {/* ========================================================================= */}
      <Dialog open={partnerModalOpen} onOpenChange={setPartnerModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingPartner?.partner.name ? "Modifier le partenaire" : "Ajouter un partenaire"}
            </DialogTitle>
          </DialogHeader>

          {editingPartner && (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom du partenaire *</label>
                <Input
                  value={editingPartner.partner.name}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      partner: { ...editingPartner.partner, name: e.target.value },
                    })
                  }
                  placeholder="Ex: Ministère de la Santé"
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={editingPartner.partner.type}
                    onChange={(e) =>
                      setEditingPartner({
                        ...editingPartner,
                        partner: {
                          ...editingPartner.partner,
                          type: e.target.value as Partner["type"],
                        },
                      })
                    }
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-md p-2 text-slate-900 outline-none text-xs focus:border-[#74a638]"
                  >
                    <option value="Institutionnel">Institutionnel</option>
                    <option value="Technique">Technique</option>
                    <option value="ONG">ONG</option>
                    <option value="Académique">Académique</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initiales</label>
                  <Input
                    value={editingPartner.partner.initials}
                    onChange={(e) =>
                      setEditingPartner({
                        ...editingPartner,
                        partner: { ...editingPartner.partner, initials: e.target.value.toUpperCase() },
                      })
                    }
                    placeholder="MS"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rôle / Mission</label>
                <Input
                  value={editingPartner.partner.role}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      partner: { ...editingPartner.partner, role: e.target.value },
                    })
                  }
                  placeholder="Tutelle institutionnelle & santé publique"
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <Textarea
                  value={editingPartner.partner.description}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      partner: { ...editingPartner.partner, description: e.target.value },
                    })
                  }
                  rows={3}
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPartnerModalOpen(false)}
              className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!editingPartner?.partner.name) return;
                await savePart({ partner: editingPartner.partner, oldName: editingPartner.oldName });
                toast.success("Partenaire enregistré avec succès !");
                setPartnerModalOpen(false);
              }}
              className="bg-[#74a638] hover:bg-[#64922e] text-white font-semibold text-xs shadow-sm"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 6: FAQ FORM */}
      {/* ========================================================================= */}
      <Dialog open={faqModalOpen} onOpenChange={setFaqModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingFaq?.faq.question ? "Modifier la FAQ" : "Ajouter une question"}
            </DialogTitle>
          </DialogHeader>

          {editingFaq && (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                <Input
                  value={editingFaq.faq.category}
                  onChange={(e) =>
                    setEditingFaq({
                      ...editingFaq,
                      faq: { ...editingFaq.faq, category: e.target.value },
                    })
                  }
                  placeholder="Général, Télé-ECG, Formation..."
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question *</label>
                <Input
                  value={editingFaq.faq.question}
                  onChange={(e) =>
                    setEditingFaq({
                      ...editingFaq,
                      faq: { ...editingFaq.faq, question: e.target.value },
                    })
                  }
                  placeholder="Quelle est la procédure d'adhésion ?"
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Réponse détaillée *</label>
                <Textarea
                  value={editingFaq.faq.answer}
                  onChange={(e) =>
                    setEditingFaq({
                      ...editingFaq,
                      faq: { ...editingFaq.faq, answer: e.target.value },
                    })
                  }
                  rows={4}
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFaqModalOpen(false)}
              className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!editingFaq?.faq.question) return;
                await saveFaqItem({ faq: editingFaq.faq, oldQuestion: editingFaq.oldQuestion });
                toast.success("Question enregistrée avec succès !");
                setFaqModalOpen(false);
              }}
              className="bg-[#74a638] hover:bg-[#64922e] text-white font-semibold text-xs shadow-sm"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 7: TEAM MEMBER FORM */}
      {/* ========================================================================= */}
      <Dialog open={teamModalOpen} onOpenChange={setTeamModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingTeam?.member.name ? "Modifier le membre" : "Ajouter un membre de l'équipe"}
            </DialogTitle>
          </DialogHeader>

          {editingTeam && (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom complet *</label>
                <Input
                  value={editingTeam.member.name}
                  onChange={(e) =>
                    setEditingTeam({
                      ...editingTeam,
                      member: { ...editingTeam.member, name: e.target.value },
                    })
                  }
                  placeholder="Prof EHUA Somian Francis"
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rôle principal</label>
                  <Input
                    value={editingTeam.member.role}
                    onChange={(e) =>
                      setEditingTeam({
                        ...editingTeam,
                        member: { ...editingTeam.member, role: e.target.value },
                      })
                    }
                    placeholder="Point focal RAFT Côte d'Ivoire"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Titre / Spécialité</label>
                  <Input
                    value={editingTeam.member.subRole}
                    onChange={(e) =>
                      setEditingTeam({
                        ...editingTeam,
                        member: { ...editingTeam.member, subRole: e.target.value },
                      })
                    }
                    placeholder="Chirurgien · +35 ans d'expérience"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Photo (URL ou téléverser depuis le PC)"
                value={editingTeam.member.image}
                onChange={(url) =>
                  setEditingTeam({
                    ...editingTeam,
                    member: { ...editingTeam.member, image: url },
                  })
                }
                placeholder="https://... ou téléverser depuis le PC"
                prefix="team"
              />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Biographie</label>
                <Textarea
                  value={editingTeam.member.bio}
                  onChange={(e) =>
                    setEditingTeam({
                      ...editingTeam,
                      member: { ...editingTeam.member, bio: e.target.value },
                    })
                  }
                  rows={3}
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTeamModalOpen(false)}
              className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!editingTeam?.member.name) return;
                await saveTeamMbr({ member: editingTeam.member, oldName: editingTeam.oldName });
                toast.success("Membre enregistré avec succès !");
                setTeamModalOpen(false);
              }}
              className="bg-[#74a638] hover:bg-[#64922e] text-white font-semibold text-xs shadow-sm"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 8: TESTIMONIAL FORM */}
      {/* ========================================================================= */}
      <Dialog open={testimonialModalOpen} onOpenChange={setTestimonialModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingTestimonial?.testimonial.author ? "Modifier le témoignage" : "Ajouter un témoignage"}
            </DialogTitle>
          </DialogHeader>

          {editingTestimonial && (
            <div className="space-y-3 py-2 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Auteur du témoignage *</label>
                  <Input
                    value={editingTestimonial.testimonial.author}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        testimonial: { ...editingTestimonial.testimonial, author: e.target.value },
                      })
                    }
                    placeholder="Dr. Carlo MONTAGUTI"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fonction / Titre</label>
                  <Input
                    value={editingTestimonial.testimonial.role}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        testimonial: { ...editingTestimonial.testimonial, role: e.target.value },
                      })
                    }
                    placeholder="Centre Focolari Man"
                    className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Photo"
                value={editingTestimonial.testimonial.image}
                onChange={(url) =>
                  setEditingTestimonial({
                    ...editingTestimonial,
                    testimonial: { ...editingTestimonial.testimonial, image: url },
                  })
                }
                placeholder="https://... ou téléverser depuis le PC"
                prefix="testimonial"
              />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Citation / Témoignage</label>
                <Textarea
                  value={editingTestimonial.testimonial.quote}
                  onChange={(e) =>
                    setEditingTestimonial({
                      ...editingTestimonial,
                      testimonial: { ...editingTestimonial.testimonial, quote: e.target.value },
                    })
                  }
                  rows={4}
                  className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTestimonialModalOpen(false)}
              className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!editingTestimonial?.testimonial.author) return;
                await saveTestim({
                  testimonial: editingTestimonial.testimonial,
                  oldAuthor: editingTestimonial.oldAuthor,
                });
                toast.success("Témoignage enregistré avec succès !");
                setTestimonialModalOpen(false);
              }}
              className="bg-[#74a638] hover:bg-[#64922e] text-white font-semibold text-xs shadow-sm"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}>
        <DialogContent className="max-w-md bg-white border border-slate-200 text-slate-900 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-base font-bold text-slate-900">Confirmation de suppression</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-600">{deleteConfirm.title}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm((prev) => ({ ...prev, open: false }))}
              className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await deleteConfirm.onConfirm();
                setDeleteConfirm((prev) => ({ ...prev, open: false }));
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm"
            >
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composants utilitaires de navigation
function NavButton({
  active,
  onClick,
  icon,
  label,
  count,
  badge,
  collapsed = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
  badge?: string;
  collapsed?: boolean;
}) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={`${label}${typeof count === "number" ? ` (${count})` : ""}`}
        className={`relative flex items-center justify-center w-full h-10 rounded-xl transition-all cursor-pointer select-none ${
          active
            ? "bg-[#74a638] text-white shadow-md shadow-[#74a638]/20 font-semibold"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        <span>{icon}</span>
        {typeof count === "number" && count > 0 && (
          <span
            className={`absolute top-2 right-2 h-1.5 w-1.5 rounded-full ${
              active ? "bg-white" : "bg-[#74a638]"
            }`}
          />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer select-none whitespace-nowrap ${
        active
          ? "bg-[#74a638] text-white shadow-md shadow-[#74a638]/20 font-semibold"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={active ? "text-white" : "text-slate-500"}>{icon}</span>
        <span>{label}</span>
      </div>
      {typeof count === "number" && (
        <span
          className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
            active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          {count}
        </span>
      )}
      {badge && (
        <span
          className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
            active ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({
  title,
  count,
  icon,
  onAction,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  onAction: () => void;
}) {
  return (
    <div
      onClick={onAction}
      className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#74a638]/40 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">{title}</span>
        <div className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{count}</span>
        <span className="text-[11px] text-[#74a638] font-semibold group-hover:underline">Gérer →</span>
      </div>
    </div>
  );
}
