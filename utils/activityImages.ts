interface ActivityImage {
  uri: string;
  category: string;
}

const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedImage {
  uri: string;
  timestamp: number;
}

const imageCache: { [key: string]: CachedImage } = {};

async function searchUnsplash(query: string): Promise<string> {
  // Check cache first
  const cacheKey = query.toLowerCase();
  const cachedResult = imageCache[cacheKey];
  
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
    return cachedResult.uri;
  }

  if (!UNSPLASH_ACCESS_KEY) {
    return defaultImage.uri;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const imageUri = data.results[0].urls.regular;
      
      // Cache the result
      imageCache[cacheKey] = {
        uri: imageUri,
        timestamp: Date.now(),
      };
      
      return imageUri;
    }
  } catch (error) {
    console.error('Failed to fetch image from Unsplash:', error);
  }

  return defaultImage.uri;
}

const defaultImage = {
  uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop',
  category: 'default',
};

export async function getActivityImage(title: string, description: string, location?: string): Promise<ActivityImage> {
  // Combine relevant information for the search query
  const searchQuery = [
    title,
    location,
    // Extract key terms from description
    ...description.split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3)
  ]
    .filter(Boolean)
    .join(' ');

  const uri = await searchUnsplash(searchQuery);
  
  return {
    uri,
    category: 'activity',
  };
} 