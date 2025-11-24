import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, ActivityIndicator, View, Image } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { Button } from "react-native-paper";
import { router } from "expo-router";
import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function TravelJournal_Main() {
    const [fontsLoaded] = useFonts({ Audiowide_400Regular });

    const [cityCount, setCityCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const citiesRef = ref(db, "traveljournal/"); // path in the database

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
            <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]} numberOfLines={1}>
                TRAVEL JOURNAL
            </Text>

            {/* Image */}
            <Image
                source={require("../../assets/images/travel_journal.png")}
                style={styles.image}
            />

            {/* Main part */}
            <View style={styles.mainText}>

                {/* Text 1 */}
                <Text style={[styles.text, { fontFamily: "Audiowide_400Regular" }]}>
                    WELCOME TO YOUR{" "}
                    <Text style={styles.travelJournal}>
                        TRAVEL JOURNAL
                    </Text>
                </Text>

                {/* Separator line */}
                <View style={styles.separator} />

                {/* City count */}
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 8 }} />
                ) : (
                    <Text style={[styles.subtext, { fontFamily: "Audiowide_400Regular" }]}>
                        YOU HAVE SAVED{"       "}
                        <Text style={styles.cityCount}>
                            {cityCount}
                        </Text>
                        {" "}CITIES
                    </Text>
                )}

                {/* Separator line */}
                <View style={styles.separator} />

                {/* Text 2 */}
                <Text style={[styles.text, { fontFamily: "Audiowide_400Regular" }]}>
                    EXPLORE AND ADD NEW PLACES:{")"}
                </Text>

            </View>

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
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        fontSize: 34,
        color: "#05540d9a",
        marginBottom: 10,
        textAlign: "center",
    },
    mainText: {
        width: "80%",              // control width
        backgroundColor: "white",
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderColor: "#05540d9a",
        borderRadius: 15,
        borderWidth: 5,
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    text: {
        fontSize: 18,
        textAlign: "center",
        marginVertical: 10,        // space between texts
    },
    subtext: {
        fontSize: 18,
        textAlign: "center",
        marginVertical: 10,
    },
    cityCount: {
        color: "#05540dbf",
        fontSize: 36,
        fontWeight: "bold",
        marginHorizontal: 5,
    },
    mapButton: {
        width: "80%",
        backgroundColor: "#05540d9a",
        paddingVertical: 8,
    },
    travelJournal: {
        color: "#05540d9a",
    },
    image: {
        height: 250, // fixed height
        width: 250,  // fixed width
        resizeMode: "contain",
        marginBottom: 10, // small space below image
    },
    separator: {
        width: "80%",           // same width as mainText
        height: 2,              // thickness of the line
        backgroundColor: "#05540d9a",
        marginVertical: 5,     // space above and below the line
        alignSelf: "center",
    },
});
