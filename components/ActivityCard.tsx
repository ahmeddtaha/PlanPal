import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import { getActivityImage } from '@/utils/activityImages';
import { LinearGradient } from 'expo-linear-gradient';

interface ActivityCardProps {
  time: string;
  title: string;
  description: string;
  location?: string;
}

const { width } = Dimensions.get('window');
const cardWidth = width > 768 ? (width - 80) / 2 : width - 40;

export function ActivityCard({ time, title, description, location }: ActivityCardProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      try {
        const { uri } = await getActivityImage(title, description, location);
        if (mounted) {
          setImageUri(uri);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load activity image:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [title, description, location]);

  const handleLocationPress = () => {
    if (location) {
      const query = encodeURIComponent(location);
      const url = Platform.select({
        ios: `maps://maps.apple.com/?q=${query}`,
        android: `https://www.google.com/maps/search/?api=1&query=${query}`,
        default: `https://www.google.com/maps/search/?api=1&query=${query}`,
      });
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Don't know how to open URI: " + url);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <>
          <Image source={{ uri: imageUri || '' }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.timeContainer}>
            <Clock size={14} color="#fff" />
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>

        {location && (
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={handleLocationPress}
            activeOpacity={0.7}
          >
            <MapPin size={14} color="#fff" />
            <Text style={[styles.location, styles.locationLink]} numberOfLines={1}>
              {location}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 280,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    overflow: 'hidden',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    flex: 1,
  },
  locationLink: {
    textDecorationLine: 'underline',
  },
}); 