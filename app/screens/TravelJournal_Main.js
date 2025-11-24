import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, ActivityIndicator } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { Button } from "react-native-paper";
import { router } from "expo-router";

import { db } from "../../firebaseConfig"; // path to your Realtime DB config
import { ref, onValue } from "firebase/database";

export default function TravelJournal_Main() {
    const [fontsLoaded] = useFonts({ Audiowide_400Regular });

    const [cityCount, setCityCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const citiesRef = ref(db, "traveljournal/"); // path in your database

        // Listen to changes
        const unsubscribe = onValue(citiesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCityCount(Object.keys(data).length); // number of cities/documents
            } else {
                setCityCount(0);
            }
            setLoading(false);
        });

        // Cleanup listener
        return () => unsubscribe();
    }, []);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            {/* Heading */}
            <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>
                TRAVEL JOURNAL
            </Text>

            {/* City count */}
            {loading ? (
                <ActivityIndicator style={{ marginTop: 8 }} />
            ) : (
                <Text style={styles.subtext}>
                    You have saved {cityCount} cities
                </Text>
            )}

            {/* Button to go to the Map screen */}
            <Button
                mode="contained"
                onPress={() => router.push("/screens/TravelJournal")}
                style={styles.mapButton}
            >
                See saved places ----{">"}
            </Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2784d690",
        alignItems: "center",
    },
    heading: {
        fontSize: 34,
        color: "#05540d9a",
        marginTop: 80,
        marginBottom: 5,
    },
    subtext: {
        marginTop: 8,
        fontSize: 16,
        color: "#033e0a",
    },
    mapButton: {
        width: "80%",
        marginTop: 35,
        backgroundColor: "#05540d9a",
    },
});
