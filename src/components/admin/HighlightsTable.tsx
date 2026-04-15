import { useState, FormEvent } from 'react';
import { Edit2, Trash2, MoreVertical, Plus, AlertCircle, X, Check, Upload as UploadIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../supabase';

const BUCKET_NAME = 'highlights';

export default function HighlightsTable({ highlights }: { highlights: any[] }) {
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingNew, setUploadingNew] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const [newHighlight, setNewHighlight] = useState({
    title: '',
    category: '',
    status: 'Visible',
    image_url: 'https://picsum.photos/seed/cricket/800/450',
    description: ''
  });

  const uploadImage = async (file: File, isEdit: boolean = false) => {
    if (isEdit) setUploadingEdit(true);
    else setUploadingNew(true);
    
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      if (isEdit && editingItem) {
        setEditingItem({ ...editingItem, image_url: imageUrl });
      } else {
        setNewHighlight({ ...newHighlight, image_url: imageUrl });
      }
    } catch (e: any) {
      setError(`Upload Failed: ${e.message || 'Unable to upload image'}`);
    } finally {
      if (isEdit) setUploadingEdit(false);
      else setUploadingNew(false);
    }
  };

  const handleAddNewHighlight = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!newHighlight.title || !newHighlight.category || !newHighlight.image_url) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('highlights')
        .insert({
          ...newHighlight,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
      setIsAddingNew(false);
      setNewHighlight({
        title: '',
        category: '',
        status: 'Visible',
        image_url: 'https://picsum.photos/seed/cricket/800/450',
        description: ''
      });
    } catch (e: any) {
      setError(`Add Failed: ${e.message || 'Unable to add highlight'}`);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    setError(null);
    try {
      const { id, ...data } = editingItem;
      const { error: updateError } = await supabase
        .from('highlights')
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;
      setEditingItem(null);
    } catch (e: any) {
      setError(`Update Failed: ${e.message || 'Unable to update highlight'}`);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('highlights')
        .delete()
        .eq('id', deletingId);

      if (deleteError) throw deleteError;
      setDeletingId(null);
    } catch (e: any) {
      setError(`Delete Failed: ${e.message || 'Unable to delete highlight'}`);
    }
  };

  return (
    <div className="mb-12 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black text-primary uppercase tracking-tighter font-headline">Weekly Highlights</h2>
        <motion.button 
          onClick={() => setIsAddingNew(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-secondary-container text-on-secondary-container px-4 md:px-6 py-2 rounded-lg font-bold font-label text-xs uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add New Highlight</span>
          <span className="sm:hidden">Add</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3 text-sm font-medium"
          >
            <AlertCircle size={18} />
            <p>{error}</p>
            <button onClick={() => setError(null)} className="ml-auto underline text-xs">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Highlight Modal */}
      <AnimatePresence>
        {isAddingNew && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl border border-surface-container-high w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-surface-container-high flex justify-between items-center bg-surface-container-low">
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter font-headline">Add New Highlight</h3>
                <button onClick={() => setIsAddingNew(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddNewHighlight} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Title *</label>
                  <input 
                    type="text" 
                    value={newHighlight.title}
                    onChange={(e) => setNewHighlight({...newHighlight, title: e.target.value})}
                    placeholder="e.g. Championship Victory"
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Category *</label>
                  <input 
                    type="text" 
                    value={newHighlight.category}
                    onChange={(e) => setNewHighlight({...newHighlight, category: e.target.value})}
                    placeholder="e.g. Cricket • Finals"
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Image *</label>
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          if (file) uploadImage(file, false);
                        }}
                        disabled={uploadingNew}
                        className="hidden"
                        id="file_upload_new"
                      />
                      <label
                        htmlFor="file_upload_new"
                        className={`block w-full border-2 border-dashed border-surface-container-high rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors ${
                          uploadingNew ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <UploadIcon size={20} className="text-primary" />
                          <span className="text-xs font-bold text-primary">
                            {uploadingNew ? 'Uploading...' : 'Click to upload image'}
                          </span>
                        </div>
                      </label>
                    </div>
                    
                    {/* OR Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-surface-container-high"></div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">OR</span>
                      <div className="flex-1 h-px bg-surface-container-high"></div>
                    </div>

                    {/* URL Input */}
                    <input 
                      type="url" 
                      value={newHighlight.image_url}
                      onChange={(e) => setNewHighlight({...newHighlight, image_url: e.target.value})}
                      placeholder="https://... (or upload image above)"
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Description</label>
                  <textarea 
                    value={newHighlight.description}
                    onChange={(e) => setNewHighlight({...newHighlight, description: e.target.value})}
                    placeholder="Optional description..."
                    rows={3}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Status</label>
                  <select 
                    value={newHighlight.status}
                    onChange={(e) => setNewHighlight({...newHighlight, status: e.target.value})}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
                <div className="space-y-3">
                  {newHighlight.image_url && (
                    <div className="rounded-lg overflow-hidden border border-surface-container-high">
                      <img 
                        src={newHighlight.image_url} 
                        alt="Preview" 
                        className="w-full h-40 object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="flex-1 px-4 py-3 rounded-xl font-bold font-label text-xs uppercase tracking-widest border border-surface-container-high hover:bg-surface-container-low transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-primary text-white px-4 py-3 rounded-xl font-bold font-label text-xs uppercase tracking-widest hover:opacity-90 transition-all whitespace-nowrap"
                    >
                      Add Highlight
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl border border-surface-container-high w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-surface-container-high flex justify-between items-center bg-surface-container-low">
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter font-headline">Edit Highlight</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Title</label>
                  <input 
                    type="text" 
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Category</label>
                  <input 
                    type="text" 
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Image URL</label>
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          if (file) uploadImage(file, true);
                        }}
                        disabled={uploadingEdit}
                        className="hidden"
                        id="file_upload_edit"
                      />
                      <label
                        htmlFor="file_upload_edit"
                        className={`block w-full border-2 border-dashed border-surface-container-high rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors ${
                          uploadingEdit ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <UploadIcon size={20} className="text-primary" />
                          <span className="text-xs font-bold text-primary">
                            {uploadingEdit ? 'Uploading...' : 'Click to upload new image'}
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-surface-container-high"></div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">OR</span>
                      <div className="flex-1 h-px bg-surface-container-high"></div>
                    </div>

                    {/* URL Input */}
                    <input 
                      type="url" 
                      value={editingItem.image_url || ''}
                      onChange={(e) => setEditingItem({...editingItem, image_url: e.target.value})}
                      placeholder="https://... (or upload image above)"
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Description</label>
                  <textarea 
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    placeholder="Optional description..."
                    rows={2}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[10px] font-black text-primary uppercase tracking-widest">Status</label>
                  <select 
                    value={editingItem.status || 'Visible'}
                    onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
                {editingItem.image_url && (
                  <div className="rounded-lg overflow-hidden border border-surface-container-high">
                    <img 
                      src={editingItem.image_url} 
                      alt="Preview" 
                      className="w-full h-40 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold font-label text-xs uppercase tracking-widest border border-surface-container-high hover:bg-surface-container-low transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-bold font-label text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl border border-surface-container-high w-full max-w-sm p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-error-container/20 text-error rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter font-headline">Confirm Delete</h3>
                <p className="text-on-surface-variant text-sm">Are you sure you want to remove this highlight? This action cannot be undone.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold font-label text-xs uppercase tracking-widest border border-surface-container-high hover:bg-surface-container-low transition-colors text-primary"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 bg-error text-on-error px-6 py-3 rounded-xl font-bold font-label text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-error/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-surface-container-high">
              <th className="px-6 py-4 font-label text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Media</th>
              <th className="px-6 py-4 font-label text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Title & Category</th>
              <th className="px-6 py-4 font-label text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 font-label text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high">
            {highlights.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4">
                  <div className="w-20 aspect-video rounded-lg overflow-hidden bg-surface-container-high">
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-primary font-headline">{item.title}</p>
                  <p className="text-xs text-on-surface-variant">{item.category}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    item.status === 'Visible' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Visible' ? 'bg-green-500' : 'bg-on-surface-variant'}`}></span>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><MoreVertical size={16} /></button>
                    <button 
                      onClick={() => setDeletingId(item.id)}
                      className="p-2 text-on-surface-variant hover:text-error transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
