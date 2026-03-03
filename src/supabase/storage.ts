import { supabase } from './config';

const BUCKET = 'products';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Compress an image file using canvas if it exceeds max size.
 * Returns a Blob that fits within the limit.  
 */
async function compressImage(file: File, maxSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Scale down if image is very large
      const maxDim = 1600;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      // Try decreasing quality until we fit
      let quality = 0.8;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao comprimir imagem'));
              return;
            }
            if (blob.size <= maxSize || quality <= 0.1) {
              resolve(blob);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          'image/webp',
          quality
        );
      };
      tryCompress();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Falha ao carregar imagem'));
    };
    img.src = url;
  });
}

function generatePath(prefix: string, ext: string): string {
  const id = crypto.randomUUID();
  return `${prefix}/${id}.${ext}`;
}

/**
 * Upload an image file to Supabase Storage.
 * Validates MIME type and compresses if > 5MB.
 * Returns the public URL.
 */
export async function uploadImage(
  file: File,
  prefix: string = 'products'
): Promise<string> {
  // Validate MIME
  if (!file.type.startsWith('image/')) {
    throw new Error('Tipo de arquivo inválido. Apenas imagens são permitidas.');
  }

  let blob: Blob = file;

  // Compress if over 5MB
  if (file.size > MAX_SIZE) {
    blob = await compressImage(file, MAX_SIZE);
  }

  const ext = blob.type === 'image/webp' ? 'webp' : file.name.split('.').pop() || 'jpg';
  const path = generatePath(prefix, ext);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: blob.type || 'image/jpeg',
      cacheControl: '31536000', // 1 year cache
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao fazer upload: ${error.message}`);
  }

  return getPublicUrl(path);
}

/**
 * Upload image from a URL (for seeding).
 * Downloads the image, then uploads to Supabase.
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  prefix: string = 'products'
): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Falha ao baixar imagem: ${response.status}`);
  }

  const blob = await response.blob();
  const contentType = blob.type || 'image/jpeg';
  const ext = contentType.includes('webp') ? 'webp' : contentType.includes('png') ? 'png' : 'jpg';
  const path = generatePath(prefix, ext);

  // Compress if necessary
  let uploadBlob: Blob = blob;
  if (blob.size > MAX_SIZE) {
    // Create a temporary File for compression
    const file = new File([blob], `temp.${ext}`, { type: contentType });
    uploadBlob = await compressImage(file, MAX_SIZE);
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, uploadBlob, {
      contentType: uploadBlob.type || contentType,
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao fazer upload: ${error.message}`);
  }

  return getPublicUrl(path);
}

/**
 * Delete an image from Supabase Storage given its full URL or path.
 */
export async function deleteImage(urlOrPath: string): Promise<void> {
  // Extract path from full URL if needed
  let path = urlOrPath;
  if (urlOrPath.startsWith('http')) {
    const url = new URL(urlOrPath);
    // URL pattern: .../storage/v1/object/public/BUCKET/path
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
    if (match) {
      path = match[1];
    } else {
      return; // Not a Supabase URL, skip
    }
  }

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error('Erro ao deletar imagem:', error.message);
  }
}

/**
 * Get public URL for a file in storage.
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Default placeholder image (inline SVG data URI)
export const DEFAULT_PRODUCT_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect fill="#E8EDF2" width="400" height="300"/>
    <text fill="#90A4AE" font-family="Arial" font-size="16" text-anchor="middle" x="200" y="140">Sem imagem</text>
    <text fill="#B0BEC5" font-family="Arial" font-size="40" text-anchor="middle" x="200" y="185">🐟</text>
  </svg>`
);
