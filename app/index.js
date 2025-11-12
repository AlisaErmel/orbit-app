import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, Image, Animated, View } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function IndexPage() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({ Audiowide_400Regular });

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [showButton, setShowButton] = useState(false);

    const blinkInterval = useRef(null);
    const typingTimeout = useRef(null);

    const fullText1 = "Welcome to Orbit...";
    const fullText2 = "Orbit — a personal daily life companion app.";

    useEffect(() => {
        if (!fontsLoaded) return;

        const typingSpeed = 100;
        const blinkSpeed = 500;

        const startBlinking = () => {
            // Ensure no multiple intervals
            if (blinkInterval.current) clearInterval(blinkInterval.current);
            blinkInterval.current = setInterval(() => {
                setShowCursor(prev => !prev);
            }, blinkSpeed);
        };

        const stopBlinking = () => {
            if (blinkInterval.current) clearInterval(blinkInterval.current);
            setShowCursor(true);
        };

        const typeText = (text, callback) => {
            let index = 0;

            const typeChar = () => {
                setDisplayedText(text.slice(0, index));
                index++;
                if (index <= text.length) {
                    typingTimeout.current = setTimeout(typeChar, typingSpeed);
                } else {
                    callback && callback();
                }
            };
            typeChar();
        };

        // Start typing first text
        typeText(fullText1, () => {
            // Pause 1s then delete
            setTimeout(() => {
                let index = fullText1.length;
                const deleteChar = () => {
                    setDisplayedText(fullText1.slice(0, index));
                    index--;
                    if (index >= 0) {
                        typingTimeout.current = setTimeout(deleteChar, typingSpeed);
                    } else {
                        // Type second text
                        typeText(fullText2, () => {
                            setShowButton(true);
                            Animated.timing(fadeAnim, {
                                toValue: 1,
                                duration: 1500,
                                useNativeDriver: true,
                            }).start();
                            startBlinking();
                        });
                    }
                };
                deleteChar();
            }, 1000);
        });

        // Cleanup on unmount
        return () => {
            if (blinkInterval.current) clearInterval(blinkInterval.current);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.text, { fontFamily: "Audiowide_400Regular" }]}>
                {displayedText}
                <Text style={{ opacity: showCursor ? 1 : 0 }}>▋</Text>
            </Text>

            <Image
                source={require("../assets/images/main.png")}
                style={styles.image}
            />

            <View style={styles.buttonContainer}>
                {showButton && (
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Button
                            onPress={() => router.push("/screens/Home")}
                            style={styles.button}
                            mode="outlined"
                            icon={() => (
                                <MaterialCommunityIcons
                                    name="rocket-launch-outline"
                                    size={28}
                                    color="black"
                                />
                            )}
                        >
                            <Text style={[styles.buttonText, { fontFamily: "Audiowide_400Regular" }]}>
                                Start
                            </Text>
                        </Button>
                    </Animated.View>
                )}
            </View>
        </SafeAreaView>
    );
}

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
        height: 60,
    },
    image: {
        height: "50%",
        width: "100%",
        resizeMode: "contain",
    },
    buttonContainer: {
        height: 120,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        margin: 20,
        padding: 15,
        borderRadius: 50,
        borderWidth: 5,
        borderColor: 'black',
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
});
