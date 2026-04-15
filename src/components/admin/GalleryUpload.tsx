import { useState, FormEvent } from 'react';
import { Trash2, Upload as UploadIcon, AlertCircle, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../supabase';

const BUCKET_NAME = 'highlights';
const MAX_ITEMS = 5;

export default function GalleryUpload({ galleryItems }: { galleryItems: any[] }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'photo',
    category: 'Photos',
    url: ''
  });

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const fileName = `gallery_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      setNewItem({ ...newItem, url: publicUrlData.publicUrl });
      setSuccess('File uploaded successfully!');
    } catch (e: any) {
      setError(`Upload Failed: ${e.message || 'Unable to upload file'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddGalleryItem = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (galleryItems.length >= MAX_ITEMS) {
      setError(`Maximum ${MAX_ITEMS} items allowed`);
      return;
    }

    if (!newItem.name || !newItem.url) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('gallery')
        .insert({
          ...newItem,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
      setSuccess('Gallery item added successfully!');
      setNewItem({
        name: '',
        type: 'photo',
        category: 'Photos',
        url: ''
      });
    } catch (e: any) {
      setError(`Add Failed: ${e.message || 'Unable to add gallery item'}`);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setDeletingId(null);

    try {
      const { error: deleteError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSuccess('Gallery item deleted successfully!');
    } catch (e: any) {
      setError(`Delete Failed: ${e.message || 'Unable to delete gallery item'}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Items */}
      <div>
        <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-6 font-headline">
          Gallery Items ({galleryItems.length}/{MAX_ITEMS})
        </h3>
        {galleryItems.length === 0 ? (
          <div className="bg-surface-container-low p-12 rounded-xl text-center">
            <p className="text-on-surface-variant">No gallery items yet. Add your first item below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-surface-container-low rounded-xl overflow-hidden border border-surface-container-high"
              >
                <div className="relative h-48 bg-surface-container-high overflow-hidden group">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-primary/80 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-bold text-on-surface truncate">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">{item.category}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeletingId(item.id)}
                    className="w-full bg-red-500/10 text-red-500 py-2 rounded-lg font-bold text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setDeletingId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl space-y-6"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter font-headline">Delete Item?</h3>
                <p className="text-sm text-on-surface-variant mt-2">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeletingId(null)}
                  className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-lg font-bold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleDelete(deletingId);
                  }}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Item Form */}
      {galleryItems.length < MAX_ITEMS && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-low rounded-2xl p-8 border border-surface-container-high"
        >
          <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-6 font-headline">Add Gallery Item</h3>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3">
              <Check className="text-green-500 flex-shrink-0" size={20} />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleAddGalleryItem} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Match Victory"
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Type *</label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Category *</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Photos">Photos</option>
                  <option value="Videos">Videos</option>
                  <option value="Match Day">Match Day</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">File Upload *</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (file) uploadFile(file);
                    }}
                    disabled={uploading}
                    className="hidden"
                    id="gallery_upload"
                  />
                  <label
                    htmlFor="gallery_upload"
                    className={`block w-full border-2 border-dashed border-surface-container-high rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <UploadIcon size={20} className="text-primary" />
                      <span className="text-xs font-bold text-primary">
                        {uploading ? 'Uploading...' : 'Click to upload'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">URL *</label>
              <input
                type="url"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                placeholder="https://... (auto-filled after upload)"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-primary editorial-gradient text-white py-4 rounded-xl font-black font-label uppercase text-sm shadow-lg"
              >
                Add to Gallery
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
