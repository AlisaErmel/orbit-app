import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";

export default function Home() {
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { fontFamily: "Audiowide_400Regular" }]}>This is the main screen!</Text>

            <StatusBar style="auto" />
        </View>
    )
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
    },
});
