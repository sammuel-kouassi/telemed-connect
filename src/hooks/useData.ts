import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getArticles,
  getArticleBySlug,
  saveArticle,
  deleteArticle,
  getMediaItems,
  saveMediaItem,
  deleteMediaItem,
  getDirectoryEntries,
  saveDirectoryEntry,
  deleteDirectoryEntry,
  getProjectSites,
  saveProjectSite,
  deleteProjectSite,
  getPartners,
  savePartner,
  deletePartner,
  getFaqs,
  saveFaq,
  deleteFaq,
  getTeamMembers,
  saveTeamMember,
  deleteTeamMember,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  type TeamMember,
} from "@/lib/db";
import type { Article, MediaItem, DirectoryEntry, ProjectSite, Partner, FaqItem, Testimonial } from "@/data/site";

export function useArticles() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  const saveMut = useMutation({
    mutationFn: (article: Article) => saveArticle(article),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (slug: string) => deleteArticle(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  return { ...query, save: saveMut.mutateAsync, remove: deleteMut.mutateAsync, isSaving: saveMut.isPending };
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => getArticleBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useMediaItems() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["media_items"],
    queryFn: getMediaItems,
  });

  const saveMut = useMutation({
    mutationFn: (item: MediaItem) => saveMediaItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media_items"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteMediaItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media_items"] });
    },
  });

  return { ...query, save: saveMut.mutateAsync, remove: deleteMut.mutateAsync, isSaving: saveMut.isPending };
}

export function useDirectory() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["directory"],
    queryFn: getDirectoryEntries,
  });

  const saveMut = useMutation({
    mutationFn: ({ entry, oldName }: { entry: DirectoryEntry; oldName?: string | undefined }) =>
      saveDirectoryEntry(entry, oldName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directory"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (name: string) => deleteDirectoryEntry(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directory"] });
    },
  });

  return { ...query, save: saveMut.mutateAsync, remove: deleteMut.mutateAsync, isSaving: saveMut.isPending };
}

export function useProjects() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["projects"],
    queryFn: getProjectSites,
  });

  const saveMut = useMutation({
    mutationFn: (site: ProjectSite) => saveProjectSite(site),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProjectSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return { ...query, save: saveMut.mutateAsync, remove: deleteMut.mutateAsync, isSaving: saveMut.isPending };
}

export function usePartners() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["partners"],
    queryFn: getPartners,
  });

  const saveMut = useMutation({
    mutationFn: ({ partner, oldName }: { partner: Partner; oldName?: string | undefined }) =>
      savePartner(partner, oldName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (name: string) => deletePartner(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });

  return { ...query, save: saveMut.mutateAsync, remove: deleteMut.mutateAsync, isSaving: saveMut.isPending };
}

export function useFaqs() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["faqs"],
    queryFn: getFaqs,
  });

  const saveMut = useMutation({
    mutationFn: ({ faq, oldQuestion }: { faq: FaqItem; oldQuestion?: string | undefined }) =>
      saveFaq(faq, oldQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (question: string) => deleteFaq(question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });

  return { ...query, save: saveMut.mutateAsync, remove: deleteMut.mutateAsync, isSaving: saveMut.isPending };
}

export function useTeam() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["team"],
    queryFn: getTeamMembers,
  });

  const saveMut = useMutation({
    mutationFn: ({ member, oldName }: { member: TeamMember; oldName?: string | undefined }) =>
      saveTeamMember(member, oldName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (name: string) => deleteTeamMember(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  return { ...query, save: saveMut.mutateAsync, remove: deleteMut.mutateAsync, isSaving: saveMut.isPending };
}

export function useTestimonials() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });

  const saveMut = useMutation({
    mutationFn: ({ testimonial, oldAuthor }: { testimonial: Testimonial; oldAuthor?: string | undefined }) =>
      saveTestimonial(testimonial, oldAuthor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (author: string) => deleteTestimonial(author),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  return { ...query, save: saveMut.mutateAsync, remove: deleteMut.mutateAsync, isSaving: saveMut.isPending };
}
