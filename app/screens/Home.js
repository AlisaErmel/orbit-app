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
                    style={styles.button}
                    mode="outlined"
                    icon={() => (
                        <Image
                            source={require("../../assets/images/todo.png")}
                            style={styles.buttonIcon}
                        />
                    )}
                >
                    <Text style={[styles.buttonText, { fontFamily: "Audiowide_400Regular" }]}>
                        -------{">"} To Do List
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
    },
    button: {
        margin: 20,
        backgroundColor: "#cd728971",
        borderColor: "#41111d71",
        borderWidth: 5,
        padding: 3,
        width: 300,
        flexDirection: "row"
    },
    buttonText: {
        fontSize: 16,
        color: "black",
    },
    buttonIcon: {
        height: 50,
        width: 50,
    }
});
