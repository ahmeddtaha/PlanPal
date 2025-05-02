import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChecklistItem, ChecklistCategory, defaultChecklistItems } from '@/types/checklist';

export function useChecklist(category: ChecklistCategory) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      // Get the user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error(`Auth error: ${userError.message}`);
      if (!user) throw new Error('Not authenticated');

      console.log('User authenticated:', user.id);

      // Get the category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('checklist_categories')
        .select('id')
        .eq('name', category)
        .single();

      if (categoryError) {
        console.error('Category error:', categoryError);
        throw new Error(`Failed to get category: ${categoryError.message}`);
      }
      
      console.log('Category found:', category, categoryData?.id);
      setCategoryId(categoryData.id);

      // Get the user's items for this category
      const { data: itemsData, error: itemsError } = await supabase
        .from('checklist_items')
        .select('id, name, checked')
        .eq('category_id', categoryData.id)
        .eq('user_id', user.id);

      if (itemsError) {
        console.error('Items error:', itemsError);
        throw new Error(`Failed to get items: ${itemsError.message}`);
      }

      console.log('Items found:', itemsData?.length);

      // If no items exist yet, create default items
      if (itemsData.length === 0) {
        console.log('Creating default items for category:', category);
        
        const { error: insertError } = await supabase
          .from('checklist_items')
          .insert(
            defaultChecklistItems[category].map(item => ({
              name: item.name,
              category_id: categoryData.id,
              user_id: user.id,
              checked: item.checked,
            }))
          );

        if (insertError) {
          console.error('Insert error:', insertError);
          throw new Error(`Failed to create default items: ${insertError.message}`);
        }

        // Fetch the newly created items
        const { data: newItemsData, error: newItemsError } = await supabase
          .from('checklist_items')
          .select('id, name, checked')
          .eq('category_id', categoryData.id)
          .eq('user_id', user.id);

        if (newItemsError) {
          console.error('New items fetch error:', newItemsError);
          throw new Error(`Failed to fetch new items: ${newItemsError.message}`);
        }

        console.log('Default items created:', newItemsData?.length);
        setItems(newItemsData);
      } else {
        setItems(itemsData);
      }
    } catch (err) {
      console.error('Checklist error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (id: string) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) {
        throw new Error('Item not found');
      }

      const { error: updateError } = await supabase
        .from('checklist_items')
        .update({ checked: !item.checked })
        .eq('id', id);

      if (updateError) {
        console.error('Toggle error:', updateError);
        throw new Error(`Failed to update item: ${updateError.message}`);
      }

      setItems(items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      ));
    } catch (err) {
      console.error('Toggle error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const addItem = async (name: string) => {
    if (!name.trim() || !categoryId) {
      setError('Invalid item name or category');
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error(`Auth error: ${userError.message}`);
      if (!user) throw new Error('Not authenticated');

      const { data: newItem, error: insertError } = await supabase
        .from('checklist_items')
        .insert({
          name: name.trim(),
          category_id: categoryId,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Add item error:', insertError);
        throw new Error(`Failed to add item: ${insertError.message}`);
      }

      setItems([...items, newItem]);
    } catch (err) {
      console.error('Add item error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  return {
    items,
    loading,
    error,
    toggleItem,
    addItem,
  };
} 