import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";

export default function BookTracker() {
    //font
    const [fontsLoaded] = useFonts({ Audiowide_400Regular });
    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.container}>

            {/* Heading */}
            <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>
                BOOK TRACKER
            </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    //main
    container: {
        flex: 1,
        backgroundColor: "#e287e771",
        alignItems: "center",
    },
    heading: {
        fontSize: 36,
        color: "#3e0445c5",
        marginTop: 20,
        marginBottom: 10,
    },
});
