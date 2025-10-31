import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';

export default function App() {
  const [fontsLoaded] = useFonts({
    Audiowide_400Regular,
  });

  const fullText = "Welcome to Orbit...";
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) clearInterval(interval);
      }, 100); // typing speed (ms)
      return () => clearInterval(interval);
    }
  }, [fontsLoaded]);

  // Blinking effect starts ONLY when typing is done
  useEffect(() => {
    if (displayedText.length === fullText.length) {
      const blink = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);
      return () => clearInterval(blink);
    }
  }, [displayedText]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>

      <Text style={[styles.text, { fontFamily: fontsLoaded ? "Audiowide_400Regular" : undefined, }]}>
        {displayedText}
        <Text
          style={{
            opacity: displayedText.length < fullText.length ? 1 : showCursor ? 1 : 0,
          }}
        >
          ▋
        </Text>
      </Text>

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
