import path from 'path'

/**
 * Folder for uploaded photos and videos. Set STORAGE_DIR on the server to a folder outside the
 * app folder (e.g. /home/USERNAME/suvarnavarsha-data), so uploading a new build never touches
 * customer files. Without it, uploads go next to where the app runs, as in development.
 */
export function storagePath(subfolder: string): string {
  return path.resolve(process.env.STORAGE_DIR || process.cwd(), subfolder)
}
