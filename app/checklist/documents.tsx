import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Upload, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

interface Document {
  id: string;
  name: string;
  image_url?: string;
  checked: boolean;
}

const BUCKET_NAME = 'document-images';

const getPublicImageUrl = (filePath: string) => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  return data.publicUrl;
};

export default function DocumentsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  React.useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // Get the user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error(`Auth error: ${userError.message}`);
      if (!user) throw new Error('Not authenticated');

      // Get the Documents category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('checklist_categories')
        .select('id')
        .eq('name', 'Documents')
        .single();

      if (categoryError) throw new Error(`Failed to get category: ${categoryError.message}`);
      setCategoryId(categoryData.id);

      // Get the user's documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('checklist_items')
        .select('id, name, checked, image_url')
        .eq('category_id', categoryData.id)
        .eq('user_id', user.id);

      if (documentsError) throw new Error(`Failed to get documents: ${documentsError.message}`);
      setItems(documentsData);
    } catch (err) {
      console.error('Documents error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    if (!documentName.trim()) {
      setError('Please enter a document name');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadDocument(result.assets[0].base64!);
      }
    } catch (err) {
      console.error('Image picker error:', err);
      setError(err instanceof Error ? err.message : 'Failed to pick image');
    }
  };

  const uploadDocument = async (base64Image: string) => {
    if (!categoryId) return;
    setUploading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload image to storage
      const fileName = `${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, decode(base64Image), {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

      if (uploadError) throw new Error(`Failed to upload image: ${uploadError.message}`);

      // Get public URL
      const publicUrl = getPublicImageUrl(filePath);

      // Create checklist item
      const { data: newDocument, error: insertError } = await supabase
        .from('checklist_items')
        .insert({
          name: documentName.trim(),
          category_id: categoryId,
          user_id: user.id,
          image_url: publicUrl,
          checked: false,
        })
        .select()
        .single();

      if (insertError) throw new Error(`Failed to create document: ${insertError.message}`);

      setItems([...items, newDocument]);
      setDocumentName('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id: string, imageUrl?: string) => {
    try {
      // Delete the checklist item
      const { error: deleteError } = await supabase
        .from('checklist_items')
        .delete()
        .eq('id', id);

      if (deleteError) throw new Error(`Failed to delete document: ${deleteError.message}`);

      // If there's an image, delete it from storage
      if (imageUrl) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          const filePath = `${user.id}/${fileName}`;
          const { error: storageError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

          if (storageError) console.error('Failed to delete image:', storageError);
        }
      }

      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete document');
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
        <Text style={styles.title}>Documents</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.uploadSection}>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={pickImage}
          disabled={uploading}
        >
          <Upload size={24} color="#666" />
          <Text style={styles.uploadText}>
            {uploading ? 'Uploading...' : 'Upload Document Image'}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Document Name"
          value={documentName}
          onChangeText={setDocumentName}
          placeholderTextColor="#666"
          editable={!uploading}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((doc) => (
          <View key={doc.id} style={styles.documentCard}>
            {doc.image_url ? (
              <Image 
                source={{ uri: doc.image_url }} 
                style={styles.documentImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{doc.name}</Text>
              <TouchableOpacity
                onPress={() => deleteDocument(doc.id, doc.image_url)}
                style={styles.deleteButton}
              >
                <Trash2 size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
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
    fontSize: 20,
    fontWeight: '600',
  },
  uploadSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    color: '#666',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  documentImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#666',
    fontSize: 16,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
}); 