import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, FlatList, View, Text, TouchableWithoutFeedback, Keyboard, Modal, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import DropDownPicker from 'react-native-dropdown-picker';
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { db } from '../../firebaseConfig';
import { ref, push, onValue, remove } from 'firebase/database';

export default function ToDo() {
    //Font
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    //For Picker
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState(null);

    // Form visibility
    const [modalVisible, setModalVisible] = useState(false);

    //For radio to delete the task
    const [completed, setCompleted] = useState({});

    const [todo, setToDo] = useState({
        name: "",
        description: "",
        category: "",
    })

    const categories = ["Study", "Groceries", "Documents", "Sport", "Personal", "Health", "Other"]

    const [items, setItems] = useState([]);

    // Sync dropdown with todo
    useEffect(() => {
        setToDo(prev => ({ ...prev, category }));
    }, [category]);

    useEffect(() => {
        const itemsRef = ref(db, "/todolist/");
        const unsubscribe = onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedItems = Object.keys(data).map(key => ({
                    id: key,       // store Firebase key
                    ...data[key],
                }));
                setItems(formattedItems.reverse()); //To make the latest see first
            } else {
                setItems([]);
            }
        });

        return () => unsubscribe();
    }, []);


    const handleSave = () => {
        if (todo.name && todo.category && todo.description) {
            push(ref(db, 'todolist/'), todo);
            setToDo({ name: "", description: "", category: "" }); // Clear input
            setCategory(null); // reset dropdown
        }
    }

    const deleteItem = (id) => {
        remove(ref(db, `todolist/${id}`));
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Top section */}
            <View style={styles.topSection}>
                <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>TO DO LIST</Text>

                {/* Image of the section */}
                <Image
                    source={require("../../assets/images/todo.png")}
                    style={styles.image}
                />

                {/* Button under image to open modal */}
                <Button
                    mode="outlined"
                    onPress={() => setModalVisible(true)}
                    style={styles.button}
                >
                    <Text style={{ color: "#41111dff" }}>+ Add New Task</Text>
                </Button>
            </View>


            {/* Modal (popup window) to add a new ToDo task */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
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

                            {/* TextInput for Description of the ToDo */}
                            <TextInput
                                placeholder="Description"
                                value={todo.description}
                                onChangeText={text => setToDo({ ...todo, description: text })}
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

                            {/* Button to save ToDo */}
                            <View style={styles.modalButtons}>
                                <Button
                                    mode="contained"
                                    onPress={handleSave}
                                    style={styles.saveButton}
                                >
                                    Save
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={() => setModalVisible(false)}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </Button>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                style={{ flex: 1, alignSelf: "stretch" }}
                renderItem={({ item }) => {
                    const isCompleted = completed[item.id] || false;

                    return (
                        <View style={styles.taskContainer}>
                            <TouchableOpacity
                                style={styles.radio}
                                onPress={() => {
                                    // Show filled circle briefly
                                    setCompleted(prev => ({ ...prev, [item.id]: true }));

                                    // Delete after short delay to show visual feedback
                                    setTimeout(() => deleteItem(item.id), 200);
                                }}
                            >
                                {isCompleted && <View style={styles.radioInner} />}
                            </TouchableOpacity>

                            {/* Task content */}
                            <View style={styles.taskContent}>
                                <View style={styles.taskHeader}>
                                    <Text style={styles.taskName}>{item.name}</Text>
                                    <View style={styles.category}>
                                        <Text style={styles.categoryText}>{item.category}</Text>
                                    </View>
                                </View>
                                <Text style={styles.taskDescription}>{item.description}</Text>
                            </View>
                        </View>
                    );
                }}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#cd728971",
    },
    topSection: {
        alignItems: "center",
    },
    heading: {
        fontSize: 40,
        marginTop: 20,
        color: "#41111dff",
        fontStyle: "bold"
    },
    image: {
        height: 250, // fixed height
        width: 250,  // fixed width
        resizeMode: "contain",
        marginBottom: 10, // small space below image
    },
    textInput: {
        width: "80%",
        marginVertical: 5,
    },
    button: {
        borderWidth: 4,
        borderColor: "#41111dfd",
        marginBottom: 20
    },
    //For Category Dropdown
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
    //For Popup - Add new task
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        width: "85%",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 15,
    },
    saveButton: {
        backgroundColor: "#41111d",
    },
    cancelButton: {
        backgroundColor: "#41111d",
    },
    //FlatList items
    taskContainer: {
        flexDirection: "row",
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 20,
        borderWidth: 2,
        borderColor: "#41111d",
        borderRadius: 10,
        backgroundColor: "#fff",
        alignItems: "flex-start",
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#41111d",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        marginTop: 10,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#41111d",
    },
    taskContent: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    taskName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#41111d",
    },
    category: {
        backgroundColor: "#41111d",
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    categoryText: {
        color: "#fff",
        fontWeight: "bold",
    },
    taskDescription: {
        fontSize: 14,
        color: "#333",
    },
})
