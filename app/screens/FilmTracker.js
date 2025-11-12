import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { TextInput } from "react-native-paper";

export default function FilmTracker() {
    //Font
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    return (
        <SafeAreaView style={styles.container} edges={[]}>

            {/* Header */}
            <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>FILM TRACKER</Text>

            {/* Inserting form */}
            <View>
                <TextInput
                    placeholder="Name"
                    //value={todo.name}
                    //onChangeText={text => setToDo({ ...todo, name: text })}
                    mode="outlined"
                    outlineColor="#41111d71"
                    activeOutlineColor="#41111d"
                    outlineStyle={{ borderWidth: 5 }} // <-- makes the border thicker
                    style={styles.textInput}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5884571",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    heading: {
        fontSize: 40,
        marginTop: 20,
        color: "#7c3903ff",
        fontStyle: "bold",
        marginTop: 80, //IF I USE EDGES
    },
    textInput: {
        width: "80%",
        marginVertical: 5,
    },
})