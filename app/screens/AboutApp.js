import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";

export default function AboutApp() {
    //font
    const [fontsLoaded] = useFonts({ Audiowide_400Regular });

    return (
        <SafeAreaView style={styles.container} edges={[]}>

            {/* Heading */}
            <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>ABOUT APP</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    //main
    container: {
        flex: 1,
        backgroundColor: "#72cdcd71",
        alignItems: "center",
    },
    heading: {
        fontSize: 32,
        color: "#bd36eaa9",
        marginTop: 70,
        marginBottom: 10,
    },
});
