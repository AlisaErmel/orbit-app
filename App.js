import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { Button } from "react-native-paper";

export default function App() {
  // Load custom font
  const [fontsLoaded] = useFonts({
    Audiowide_400Regular,
  });

  // First and second texts to display
  const fullText1 = "Welcome to Orbit...";
  const fullText2 = "Orbit — a personal daily life companion app.";

  // Holds currently visible part of text
  const [displayedText, setDisplayedText] = useState("");

  // Controls whether the cursor ▋ is visible or not
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!fontsLoaded) return; // wait until font is ready

    // --- Animation timing values ---
    const typingSpeed = 100;   // how fast each character appears (ms)
    const deletingSpeed = 100; // how fast each character disappears (ms)
    const blinkSpeed = 500;   // how fast cursor blinks (ms)

    // --- State for our animation logic ---
    let index = 0;            // current character index
    let phase = "typing1";    // animation phase: typing1 → blink → deleting → typing2
    let blinkInterval;        // will hold cursor blinking timer

    // --- Main typing loop for the first text ---
    const typeInterval = setInterval(() => {
      if (phase === "typing1") {
        // Show text gradually up to current index
        setDisplayedText(fullText1.slice(0, index));
        index++;

        // When typing is done:
        if (index > fullText1.length) {
          // Switch to blinking phase
          phase = "blink";
          index = fullText1.length;
          clearInterval(typeInterval); // stop typing

          // --- Start blinking cursor ---
          blinkInterval = setInterval(() => {
            setShowCursor((prev) => !prev); // toggle cursor visibility
          }, blinkSpeed);

          // --- After 2 seconds of blinking, start deleting phase ---
          setTimeout(() => {
            clearInterval(blinkInterval); // stop blinking
            setShowCursor(true);          // keep cursor visible for deletion
            phase = "deleting";           // switch phase
            index = fullText1.length;     // start deleting from end

            // --- Deleting loop ---
            const deleteInterval = setInterval(() => {
              setDisplayedText(fullText1.slice(0, index)); // shrink text
              index--;

              // When text is fully deleted:
              if (index < 0) {
                clearInterval(deleteInterval);
                phase = "typing2"; // move to next phase
                index = 0;

                // --- Typing second text ---
                const typeSecond = setInterval(() => {
                  setDisplayedText(fullText2.slice(0, index)); // grow text
                  index++;

                  // Stop when second text is complete
                  if (index > fullText2.length) {
                    phase = "blink";
                    clearInterval(typeSecond);

                    //Infinite cursor blinking
                    blinkInterval = setInterval(() => {
                      setShowCursor((prev) => !prev); // toggle cursor visibility
                    }, blinkSpeed);
                  }


                }, typingSpeed);
              }
            }, deletingSpeed);
          }, 2000); // 2s blinking duration
        }
      }
    }, typingSpeed);

    // Cleanup any intervals if component unmounts
    return () => {
      clearInterval(typeInterval);
      clearInterval(blinkInterval);
    };
  }, [fontsLoaded]); // run once when fonts are ready

  if (!fontsLoaded) return null; // wait for font to load before rendering

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          { fontFamily: "Audiowide_400Regular" },
        ]}
      >
        {/* Show currently typed text */}
        {displayedText}
        {/* Cursor ▋ visibility controlled by showCursor */}
        <Text style={{ opacity: showCursor ? 1 : 0 }}>▋</Text>
      </Text>

      {/* Button to start using app */}
      <Button>Start</Button>

      {/* Background planet image */}
      <Image
        source={require("./assets/images/planet00.png")}
        style={styles.image}
      />

      <StatusBar style="auto" />
    </View>
  );
}

// Basic styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 20,
  },
  image: {
    height: "50%",
    width: "100%",
    resizeMode: "contain",
  },
});
