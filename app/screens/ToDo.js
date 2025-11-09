import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image } from "react-native";
import { TextInput } from "react-native-paper";

export default function ToDo() {
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
                placeholder="Name"
                value={todo.name}
                onChangeText={text => setToDo({ ...todo, name: text })}
                mode="outlined"
                outlineColor="#41111d71"
                activeOutlineColor="#41111d"
                outlineStyle={{ borderWidth: 5 }} // <-- makes the border thicker
                style={styles.textInput}
            />


            {/* TextInput for Category of the ToDo */}
            <TextInput
                placeholder="Category"
                value={todo.category}
                onChangeText={text => setToDo({ ...todo, category: text })}
                mode="outlined"
                outlineColor="#41111d71"
                activeOutlineColor="#41111d"
                outlineStyle={{ borderWidth: 5 }} // <-- makes the border thicker
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