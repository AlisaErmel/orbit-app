import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';

export default function App() {
  const [fontsLoaded] = useFonts({
    Audiowide_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>

      <Text style={[styles.text, { fontFamily: fontsLoaded ? "Audiowide_400Regular" : undefined, }]}>Welcome to Orbit!</Text>

      <Image
        source={require('./assets/images/planet00.png')}
        style={styles.image}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  image: {
    height: '50%',
    width: '100%',
  }
});
