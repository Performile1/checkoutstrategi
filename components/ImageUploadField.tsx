'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getAdminAuthHeaders } from '@/components/AdminGuard';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  type?: 'logo' | 'cover' | 'general';
  placeholder?: string;
  helperText?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  type = 'general',
  placeholder = '/images/... eller URL',
  helperText,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const authHeaders = getAdminAuthHeaders();
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          ...authHeaders,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Kunde inte ladda upp bilden.');
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err?.message || 'Ett fel uppstod vid uppladdning.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">{label}</label>
        {helperText && <span className="text-xs text-slate-400">{helperText}</span>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin text-brand-600" />
              Laddar upp...
            </>
          ) : (
            <>
              <UploadCloud size={14} />
              Ladda upp {type === 'logo' ? 'logotyp' : type === 'cover' ? 'omslagsbild' : 'bild'}
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
      )}

      {value && (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
          <div className="relative w-12 h-12 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Förhandsgranskning"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-600 dark:text-slate-300 truncate font-mono text-[11px]">{value}</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              <Check size={10} /> Bild vald
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-slate-400 hover:text-red-500 rounded transition"
            title="Ta bort bild"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
