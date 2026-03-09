import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { FeedCategory } from '@/types/feed';

const CategoryManager: React.FC = () => {
  const { supabaseClient } = useAuth();
  const [categories, setCategories] = useState<FeedCategory[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (!supabaseClient) return;
    const { data } = await supabaseClient
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (data) setCategories(data as FeedCategory[]);
  };

  useEffect(() => { fetchCategories(); }, [supabaseClient]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseClient || !newName.trim()) return;
    if (categories.length >= 10) {
      setError('Maximum 10 categories');
      return;
    }

    const { data: community } = await supabaseClient
      .from('communities')
      .select('id')
      .limit(1)
      .single();

    if (!community) return;

    const { error: insertError } = await supabaseClient
      .from('categories')
      .insert({
        community_id: community.id,
        name: newName.trim(),
        description: newDesc.trim() || null,
        display_order: categories.length,
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      setNewName('');
      setNewDesc('');
      setError(null);
      fetchCategories();
    }
  };

  const handleUpdate = async (id: string) => {
    if (!supabaseClient || !editName.trim()) return;

    const { error: updateError } = await supabaseClient
      .from('categories')
      .update({ name: editName.trim() })
      .eq('id', id);

    if (!updateError) {
      setEditingId(null);
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabaseClient) return;
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    if (cat.post_count > 0) {
      setError('Cannot delete category with posts. Reassign posts first.');
      return;
    }

    const { error: deleteError } = await supabaseClient
      .from('categories')
      .delete()
      .eq('id', id);

    if (!deleteError) {
      setError(null);
      fetchCategories();
    }
  };

  return (
    <div className="category-manager">
      <h2>Manage Categories</h2>

      {error && <div className="category-manager__error">{error}</div>}

      <div className="category-manager__list">
        {categories.map(cat => (
          <div key={cat.id} className="category-manager__item">
            {editingId === cat.id ? (
              <div className="category-manager__edit">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.id)}
                />
                <button onClick={() => handleUpdate(cat.id)} className="btn btn--primary btn--sm">Save</button>
                <button onClick={() => setEditingId(null)} className="btn btn--sm">Cancel</button>
              </div>
            ) : (
              <>
                <div className="category-manager__info">
                  <span className="category-manager__name">{cat.name}</span>
                  <span className="category-manager__count">{cat.post_count} posts</span>
                </div>
                <div className="category-manager__actions">
                  <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="category-manager__delete">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} className="category-manager__form">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Category name"
          maxLength={50}
        />
        <input
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          placeholder="Description (optional)"
          maxLength={200}
        />
        <button type="submit" className="btn btn--primary btn--sm" disabled={categories.length >= 10}>
          Add Category
        </button>
      </form>

      <p className="category-manager__limit">{categories.length}/10 categories</p>
    </div>
  );
};

export default CategoryManager;
