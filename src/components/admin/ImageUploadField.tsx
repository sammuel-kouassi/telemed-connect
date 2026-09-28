import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, ExternalLink, Check, Loader2 } from "lucide-react";
import { uploadImageToStorage } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  prefix?: string;
  required?: boolean;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "https://... ou téléverser depuis le PC",
  prefix = "img",
  required = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP, etc.)");
      return;
    }

    // Limiter la taille à 15 Mo par précaution
    if (file.size > 15 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 15 Mo.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Téléversement de l'image vers Supabase Storage...");

    try {
      const extension = file.name.split(".").pop() || "jpg";
      const baseClean = file.name
        .substring(0, file.name.lastIndexOf("."))
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9_-]/g, "_")
        .slice(0, 30);
      const uniqueFileName = `${prefix}_${Date.now()}_${baseClean}.${extension}`;

      const res = await uploadImageToStorage(file, uniqueFileName);

      if (res.url) {
        onChange(res.url);
        toast.success("Image enregistrée dans Supabase Storage !", { id: toastId });
      } else {
        toast.error(res.error || "Échec de l'envoi de l'image", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inattendue";
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const isSupabaseUrl = value?.includes("supabase.co/storage/v1/object/public");

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isSupabaseUrl && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#74a638] bg-[#74a638]/10 px-2 py-0.5 rounded-full border border-[#74a638]/20">
            <Check className="h-3 w-3" /> Supabase Storage CDN
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Controls Row: Text Input + Upload Button */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex items-center gap-2 rounded-xl transition-all ${
          isDragging ? "ring-2 ring-[#74a638] bg-[#74a638]/5" : ""
        }`}
      >
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638] text-xs h-9 pr-8"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
              title="Effacer l'URL"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="border-slate-300 bg-white hover:bg-[#74a638]/10 hover:border-[#74a638]/40 hover:text-[#74a638] text-slate-700 text-xs h-9 px-3 shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer font-medium transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#74a638]" />
              <span className="hidden sm:inline">Envoi...</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5 text-[#74a638]" />
              <span>Depuis le PC</span>
            </>
          )}
        </Button>
      </div>

      {/* Visual Thumbnail Preview if an image is specified */}
      {value && (
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="h-12 w-16 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative flex items-center justify-center">
            <img
              src={value}
              alt="Aperçu"
              className="h-full w-full object-cover"
              onError={(e) => {
                // Remplacer par icône si image invalide
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <ImageIcon className="h-5 w-5 text-slate-400 absolute pointer-events-none" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-slate-700 truncate">{value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isSupabaseUrl ? "Fichier hébergé dans le cloud Supabase" : "Lien externe ou ressource locale"}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              asChild
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700"
              title="Ouvrir l'image"
            >
              <a href={value} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
