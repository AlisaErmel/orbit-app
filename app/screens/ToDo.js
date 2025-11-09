import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image } from "react-native";
import { TextInput } from "react-native-paper";
import DropDownPicker from 'react-native-dropdown-picker';
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";

export default function ToDo() {
    //Font
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    //For Picker
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState(null);

    const [todo, setToDo] = useState({
        name: "",
        category: "",
    })

    const categories = ["Study", "Groceries", "Documents", "Sport", "Personal", "Health", "Other"]

    return (
        <SafeAreaView style={styles.container}>

            {/* Image of the section */}
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


            {/* DropDown Picker for Category of the ToDo */}
            <DropDownPicker
                open={open}
                value={category}
                items={categories.map(cat => ({ label: cat, value: cat }))}
                setOpen={setOpen}
                setValue={setCategory}
                placeholder="Select a category"
                style={[
                    styles.dropdown,
                    open ? styles.dropdownOpen : null  // change border/background when open
                ]}
                dropDownContainerStyle={[
                    styles.dropdownContainer,
                    open ? styles.dropdownContainerOpen : null // change dropdown container when open
                ]}
                textStyle={{ fontFamily: "Audiowide_400Regular" }}
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
    },
    dropdown: {
        width: "80%",
        marginVertical: 5,
        borderWidth: 5,
        borderColor: "#41111d71",
        borderRadius: 4,
        height: 56,  // match TextInput
        alignSelf: "center",
    },
    dropdownContainer: {
        width: "80%",
        borderWidth: 5,
        borderColor: "#41111d71",
        borderRadius: 4,
        alignSelf: "center",
    },
    dropdownOpen: {
        borderColor: "#41111d",   // e.g., tomato border when pressed
    },
    dropdownContainerOpen: {
        borderColor: "#41111d",    // match border color of picker
    },
})