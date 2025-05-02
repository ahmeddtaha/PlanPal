import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Square } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface ElectronicsItem {
  id: string;
  name: string;
  checked: boolean;
}

const defaultItems: ElectronicsItem[] = [
  { id: '1', name: 'Phone Charger', checked: false },
  { id: '2', name: 'Power Bank', checked: false },
  { id: '3', name: 'Camera', checked: false },
  { id: '4', name: 'Laptop', checked: false },
  { id: '5', name: 'Universal Adapter', checked: false },
];

export default function ElectronicsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ElectronicsItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get the electronics category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('checklist_categories')
        .select('id')
        .eq('name', 'Electronics')
        .single();

      if (categoryError) throw categoryError;
      setCategoryId(categoryData.id);

      // Get the user's items for this category
      const { data: itemsData, error: itemsError } = await supabase
        .from('checklist_items')
        .select('id, name, checked')
        .eq('category_id', categoryData.id)
        .eq('user_id', user.id);

      if (itemsError) throw itemsError;

      // If no items exist yet, create default items
      if (itemsData.length === 0) {
        const { error: insertError } = await supabase
          .from('checklist_items')
          .insert(
            defaultItems.map(item => ({
              name: item.name,
              category_id: categoryData.id,
              user_id: user.id,
              checked: item.checked,
            }))
          );

        if (insertError) throw insertError;

        // Fetch the newly created items
        const { data: newItemsData, error: newItemsError } = await supabase
          .from('checklist_items')
          .select('id, name, checked')
          .eq('category_id', categoryData.id)
          .eq('user_id', user.id);

        if (newItemsError) throw newItemsError;
        setItems(newItemsData);
      } else {
        setItems(itemsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (id: string) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      const { error: updateError } = await supabase
        .from('checklist_items')
        .update({ checked: !item.checked })
        .eq('id', id);

      if (updateError) throw updateError;

      setItems(items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const addItem = async () => {
    if (!newItemName.trim() || !categoryId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: newItem, error: insertError } = await supabase
        .from('checklist_items')
        .insert({
          name: newItemName.trim(),
          category_id: categoryId,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setItems([...items, newItem]);
      setNewItemName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Electronics</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.addSection}>
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={newItemName}
          onChangeText={setNewItemName}
          placeholderTextColor="#666"
        />
        <TouchableOpacity
          style={[styles.addButton, !newItemName && styles.addButtonDisabled]}
          onPress={addItem}
          disabled={!newItemName}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemRow}
            onPress={() => toggleItem(item.id)}
          >
            {item.checked ? (
              <Check size={24} color="#FFD700" />
            ) : (
              <Square size={24} color="#666" />
            )}
            <Text style={[
              styles.itemText,
              item.checked && styles.itemTextChecked
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
}); 