import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";

export default function AboutApp() {
    const [fontsLoaded] = useFonts({ Audiowide_400Regular });
    if (!fontsLoaded) return null;

    const openLink = (url) => {
        Linking.openURL(url);
    };

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>
                ABOUT APP
            </Text>

            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Google Fonts */}
                <View style={styles.card}>
                    <Text style={[styles.cardTitle, { fontFamily: "Audiowide_400Regular" }]}>Google Fonts — Audiowide</Text>
                    <Text style={styles.cardText}>
                        Designed by Astigmatic
                        {"\n\n"}
                        Copyright (c) 2012, Brian J. Bonislawsky DBA Astigmatic (AOETI),
                        with Reserved Font Name "Audiowide".
                        {"\n\n"}
                        This font is licensed under the SIL Open Font License 1.1.
                    </Text>

                    <TouchableOpacity onPress={() => openLink("https://openfontlicense.org")}>
                        <Text style={styles.link}>https://openfontlicense.org</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openLink("https://fonts.google.com/specimen/Audiowide")}>
                        <Text style={styles.link}>https://fonts.google.com/specimen/Audiowide</Text>
                    </TouchableOpacity>
                </View>

                {/* Planets 2D */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Planets 2D Assets</Text>
                    <Text style={styles.cardText}>
                        Assets from Kenney — “Planets 2D” pack.
                        {"\n"}
                        Free for personal and commercial use under the Kenney license.
                    </Text>

                    <TouchableOpacity onPress={() => openLink("https://kenney.nl/assets/planets")}>
                        <Text style={styles.link}>https://kenney.nl/assets/planets</Text>
                    </TouchableOpacity>
                </View>

                {/* Map Marker */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Map Marker Icon</Text>
                    <Text style={styles.cardText}>
                        Maps and location icons created by Vectorslab — Flaticon.
                    </Text>

                    <TouchableOpacity onPress={() => openLink("https://www.flaticon.com/free-icons/maps-and-location")}>
                        <Text style={styles.link}>https://www.flaticon.com/free-icons/maps-and-location</Text>
                    </TouchableOpacity>
                </View>

                {/* Pinterest */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Images from Pinterest</Text>
                    <Text style={styles.cardText}>
                        Some images on the FilmTracker_List screen were sourced from Pinterest
                        for non-commercial, educational, and prototype purposes.
                    </Text>

                    <TouchableOpacity onPress={() => openLink("https://www.pinterest.com")}>
                        <Text style={styles.link}>https://www.pinterest.com</Text>
                    </TouchableOpacity>
                </View>

                {/* Google Books API */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Google Books API</Text>
                    <Text style={styles.cardText}>
                        The Google Books API provides access to the Google Books repository.
                        {"\n\n"}
                        By using this API, you agree to the Google APIs Terms of Service
                        and the Books API policies.
                        {"\n\n"}
                        Service name: books.googleapis.com
                        {"\n"}
                        Type: SaaS & APIs
                        {"\n"}
                        Last update: 7/22/22
                    </Text>

                    <TouchableOpacity onPress={() => openLink("https://developers.google.com/books")}>
                        <Text style={styles.link}>https://developers.google.com/books</Text>
                    </TouchableOpacity>
                </View>

                {/* Shuttle Icon */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Start Button Icon</Text>
                    <Text style={styles.cardText}>
                        Shuttle/start button icon created by Freepik — Flaticon.
                    </Text>

                    <TouchableOpacity onPress={() => openLink("https://www.flaticon.com/free-icons/start-button")}>
                        <Text style={styles.link}>https://www.flaticon.com/free-icons/start-button</Text>
                    </TouchableOpacity>
                </View>


                {/* Copyright footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Copyright (c) 2025 Alisa Ermel{"\n"}
                        All rights reserved.{"\n\n"}

                    </Text>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    scroll: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        width: "100%",
        alignItems: "center",
    },
    card: {
        backgroundColor: "white",
        width: "100%",
        padding: 20,
        borderRadius: 25,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: "#bd36eaa9",
        opacity: 0.95,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#bd36eaa9",
        marginBottom: 10,
        fontFamily: "Audiowide_400Regular",
    },
    cardText: {
        fontSize: 15,
        color: "#333",
        lineHeight: 20,
    },
    link: {
        marginTop: 10,
        color: "#007AFF",
        textDecorationLine: "underline",
        fontSize: 15,
    },
    footer: {
        marginTop: 20,
        marginBottom: 60,
        paddingHorizontal: 10,
        width: "100%",
        alignItems: "center",
    },
    footerText: {
        fontSize: 13,
        color: "#333",
        textAlign: "center",
        lineHeight: 18,
    },
});
