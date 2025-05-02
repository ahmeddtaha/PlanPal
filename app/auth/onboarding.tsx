import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plane } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop' }}
        style={[styles.backgroundImage, { width, height }]}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', '#000']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Plane size={48} color="#FFFFFF" />
            <Text style={styles.logo}>PlanPal</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to PlanPal</Text>
            <Text style={styles.subtitle}>Your Travel Planning Companion</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 60,
    marginBottom: 'auto',
  },
  logo: {
    fontSize: 48,
    color: 'white',
    fontWeight: '600',
  },
  textContainer: {
    gap: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
});