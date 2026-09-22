'use client';

export interface UploadResult {
  url: string;
  fileType: string;
  fileSize: string;
  fileName: string;
}

export interface UploadOptions {
  /** Subfolder inside Blob storage — e.g. "documents", "images", "resources" */
  folder?: string;
  /** Optional callback for progress (0–100) */
  onProgress?: (percent: number) => void;
}

/**
 * Upload any file directly to Vercel Blob.
 * Bypasses Vercel's 4.5 MB serverless limit — works up to 500 MB.
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { upload } = await import('@vercel/blob/client');
  const { folder = 'uploads', onProgress } = options;

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const pathname = `${folder}/${Date.now()}-${safeName}`;

  const blob = await upload(pathname, file, {
    access: 'public',
    handleUploadUrl: '/api/upload-document',
    onUploadProgress: (p: any) => {
      if (!onProgress) return;
      const pct =
        p?.percentage ?? (p?.total ? (p.loaded / p.total) * 100 : 0);
      onProgress(Math.min(100, Math.round(pct)));
    },
  });

  // Human-readable size
  const sizeKB = file.size / 1024;
  const sizeMB = sizeKB / 1024;
  const sizeLabel =
    sizeMB >= 1
      ? `${sizeMB.toFixed(1)} MB`
      : `${Math.max(1, Math.round(sizeKB))} KB`;

  const ext = (file.name.split('.').pop() || '').toUpperCase();

  return {
    url: blob.url,
    fileType: ext,
    fileSize: sizeLabel,
    fileName: file.name,
  };
}

/**
 * Force-download any URL as a specific filename.
 * Works cross-origin (e.g. from Vercel Blob).
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (err) {
    console.error('Download failed:', err);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}