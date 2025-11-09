import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image } from "react-native";
import { TextInput } from "react-native-paper";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";

export default function ToDo() {
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    const [todo, setToDo] = useState({
        name: "",
        category: "",
    })

    const categories = ["Study", "Groceries", "Documents", "Sport", "Personal", "Health", "Other"]

    return (
        <SafeAreaView style={styles.container}>

            {/* Image of thw section */}
            <Image
                source={require("../../assets/images/todo.png")}
                style={styles.image}
            />

            {/* TextInput for Name of the ToDo */}
            <TextInput
                label="Name"
                value={todo.name}
                onChangeText={text => setToDo({ ...todo, name: text })}
                mode="outlined"
                style={styles.textInput}
            />

            {/* TextInput for Category of the ToDo */}
            <TextInput
                label="Category"
                value={todo.category}
                onChangeText={text => setToDo({ ...todo, category: text })}
                mode="outlined"
                style={styles.textInput}
            />


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#cd728971",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    image: {
        height: "50%",
        width: "100%",
        resizeMode: "contain",
    },
    textInput: {
        width: "80%",
        marginVertical: 5,
    }
})