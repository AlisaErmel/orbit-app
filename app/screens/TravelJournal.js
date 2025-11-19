import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";
import MapView, { Marker } from 'react-native-maps';

export default function TravelJournal() {
    //Font
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    return (
        <SafeAreaView style={styles.container} edges={[]}>

            {/* Heading */}
            <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>TRAVEL JOURNAL</Text>

            {/* Map */}
            <MapView
                //ref={mapRef}
                style={styles.map}
            >
            </MapView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#45d2e58b",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    map: {
        flex: 1, // takes all available space
        width: "100%", // ensure it fills horizontally
    },
    heading: {
        fontSize: 34,
        color: "#13b3239a",
        fontStyle: "bold",
        marginTop: 80, //IF I USE EDGES
        marginBottom: 20,
    },
})
