import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { Button } from "react-native-paper";
import { router } from "expo-router";

export default function TravelJournal_Main() {
    //Font
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    return (
        <SafeAreaView style={styles.container} edges={[]}>

            {/* Heading */}
            <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>TRAVEL JOURNAL</Text>

            {/*Button to the Map */}
            <Button
                mode="contained"
                onPress={() => router.push("/screens/TravelJournal")}
                style={styles.mapButton}
            >
                See saved places ----{">"}
            </Button>
        </SafeAreaView>
    )
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
        marginTop: 80, //IF I USE EDGES
        marginBottom: 5,
    },
    mapButton: {
        width: "80%",
        marginTop: 35,
        backgroundColor: "#05540d9a",
    },
})