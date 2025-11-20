import { StyleSheet, Text, View, Image } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { router } from "expo-router";


export default function Home() {
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.text, { fontFamily: "Audiowide_400Regular" }]}>Here you can choose the section you want to fill in.</Text>

            <View>

                {/* Button To Do list */}
                <Button
                    onPress={() => router.push("/screens/ToDo")}
                    style={[styles.button, { backgroundColor: "#cd728971", borderColor: "#41111d71", }]}
                    mode="outlined"
                    icon={() => (
                        <Image
                            source={require("../../assets/images/todo.png")}
                            style={styles.buttonIcon}
                        />
                    )}
                >
                    <Text style={[styles.buttonText, { fontFamily: "Audiowide_400Regular", color: "#41111d71", }]}>
                        -------{">"} To Do List
                    </Text>
                </Button>


                {/* Button Mood Journal */}
                <Button
                    onPress={() => router.push("/screens/MoodJournal")}
                    style={[styles.button, { backgroundColor: "#72cdcd71", borderColor: "#bd36ea71", }]}
                    mode="outlined"
                    icon={() => (
                        <Image
                            source={require("../../assets/images/mood_journal.png")}
                            style={styles.buttonIcon}
                        />
                    )}
                >
                    <Text style={[styles.buttonText, { fontFamily: "Audiowide_400Regular", color: "#bd36ea71" }]}>
                        -------{">"} ABOUT APP (was a mood journal)
                    </Text>
                </Button>


                {/* Button Travel Journal */}
                <Button
                    onPress={() => router.push("/screens/TravelJournal_Main")}
                    style={[styles.button, { backgroundColor: "#2784d65f", borderColor: "#05540d9a", }]}
                    mode="outlined"
                    icon={() => (
                        <Image
                            source={require("../../assets/images/travel_journal.png")}
                            style={styles.buttonIcon}
                        />
                    )}
                >
                    <Text style={[styles.buttonText, { fontFamily: "Audiowide_400Regular", color: "#05540d9a" }]}>
                        -------{">"} Travel Journal
                    </Text>
                </Button>


                {/* Button Film Tracker */}
                <Button
                    onPress={() => router.push("/screens/FilmTracker")}
                    style={[styles.button, { backgroundColor: "#e5884571", borderColor: "#9a05378f", }]}
                    mode="outlined"
                    icon={() => (
                        <Image
                            source={require("../../assets/images/film_tracker.png")}
                            style={styles.buttonIcon}
                        />
                    )}
                >
                    <Text style={[styles.buttonText, { fontFamily: "Audiowide_400Regular", color: "#9a05378f" }]}>
                        -------{">"} Film Tracker
                    </Text>
                </Button>

                {/* Button Book Tracker */}
                <Button
                    onPress={() => router.push("/screens/BookTracker")}
                    style={[styles.button, { backgroundColor: "#e287e771", borderColor: "#3d044571", }]}
                    mode="outlined"
                    icon={() => (
                        <Image
                            source={require("../../assets/images/book_tracker.png")}
                            style={styles.buttonIcon}
                        />
                    )}
                >
                    <Text style={[styles.buttonText, { fontFamily: "Audiowide_400Regular", color: "#3d044571" }]}>
                        -------{">"} Book Tracker
                    </Text>
                </Button>

                {/* Button Water Tracker */}
                <Button
                    onPress={() => router.push("/screens/WaterTracker")}
                    style={[styles.button, { backgroundColor: "#b0e5ef71", borderColor: "#04453671", }]}
                    mode="outlined"
                    icon={() => (
                        <Image
                            source={require("../../assets/images/water_tracker.png")}
                            style={styles.buttonIcon}
                        />
                    )}
                >
                    <Text style={[styles.buttonText, { fontFamily: "Audiowide_400Regular", color: "#04453671" }]}>
                        -------{">"} Water Tracker
                    </Text>
                </Button>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        marginHorizontal: 20,
        marginTop: 100,
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        borderWidth: 5,
        padding: 3,
        width: 300,
        //alignItems: "flex-start",
        //flexDirection: "row"
    },
    buttonText: {
        fontSize: 16,
        borderColor: "black",
    },
    buttonIcon: {
        height: 50,
        width: 50,
    }
});
