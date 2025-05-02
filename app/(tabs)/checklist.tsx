import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';

const categories = [
  {
    id: 'documents',
    title: 'Documents',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1969&auto=format&fit=crop',
  },
  {
    id: 'clothing',
    title: 'Clothing',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'toiletries',
    title: 'Toiletries',
    image: 'https://images.unsplash.com/photo-1600423115367-87ea7661688f?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: 'electronics',
    title: 'Electronics',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=2021&auto=format&fit=crop',
  },
];

export default function ChecklistScreen() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    if (categoryId === 'documents') {
      router.push('/checklist/documents');
    } else if (categoryId === 'clothing') {
      router.push('/checklist/clothing');
    } else if (categoryId === 'toiletries') {
      router.push('/checklist/toiletries');
    } else if (categoryId === 'electronics') {
      router.push('/checklist/electronics');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Checklist</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Image
              source={{ uri: category.image }}
              style={styles.categoryImage}
            />
            <View style={styles.categoryOverlay}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  categoryCard: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
}); 