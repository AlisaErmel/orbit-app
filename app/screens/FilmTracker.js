import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, Pressable, Image, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { db } from '../../firebaseConfig';
import { ref, push, onValue, remove } from 'firebase/database';

export default function FilmTracker() {
    //Font
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    //Film
    const [film, setFilm] = useState({
        rating: 0, // 0-5
        name: "",
        comments: "",
        image: null, //image url, if the user provides
    })

    // Save a new film
    const handleSave = () => {
        if (film.rating && film.name) {
            push(ref(db, 'filmtracker/'), film);
            setFilm({ rating: 0, name: "", comments: "", image: null }); // Clear input
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container} edges={[]}>

                {/* Header */}
                <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>FILM TRACKER</Text>

                {/* Inserting a new film form */}
                {/*<Text>-----------------------------------------------------</Text>*/}

                <View style={styles.insertForm}>

                    {/* Rating: */}
                    <Text style={[styles.ratingText, { fontFamily: "Audiowide_400Regular" }]}>Rate the film:</Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Pressable key={i} onPress={() => setFilm({ ...film, rating: i })}>
                                <Image
                                    source={require("../../assets/images/film_tracker.png")} // only one image
                                    style={[styles.ratingImage, {
                                        borderWidth: film.rating >= i ? 4 : 0,   // border appears if pressed
                                        borderColor: film.rating >= i ? "#9a0537b6" : "transparent",
                                    }]}
                                />
                            </Pressable>
                        ))}
                    </View>



                    {/* Name of the film: */}
                    <TextInput
                        placeholder="Name"
                        value={film.name}
                        onChangeText={text => setFilm({ ...film, name: text })}
                        mode="outlined"
                        outlineColor="#e5884571"
                        activeOutlineColor="#9a0537b6"
                        outlineStyle={{ borderWidth: 5 }} // <-- makes the border thicker
                        style={styles.nameTextInput}
                    />

                    {/* Comments of the film: */}
                    <TextInput
                        placeholder="Comments"
                        value={film.comments}
                        onChangeText={text => setFilm({ ...film, comments: text })}
                        mode="outlined"
                        outlineColor="#e5884571"
                        activeOutlineColor="#9a0537b6"
                        outlineStyle={{ borderWidth: 5 }} // <-- makes the border thicker
                        style={styles.commentsTextInput}
                        multiline={true}          // allow multi-line input
                        textAlignVertical="top"   // start text from the top
                    />

                    {/* Image Picker */}
                    <Pressable
                        style={[styles.imageInput, { alignItems: "center" }]}
                        onPress={async () => {
                            // Request permission first
                            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                            if (status !== 'granted') {
                                Alert.alert(
                                    "Permission required",
                                    "Please grant access to your photos to pick an image."
                                );
                                return;
                            }

                            // Open image picker
                            let result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ["images"],
                                quality: 1,
                            });

                            if (!result.canceled) {
                                setFilm({ ...film, image: result.assets[0].uri });
                            }
                        }}
                    >
                        <Text style={{ marginBottom: 5, fontFamily: "Audiowide_400Regular", color: "#9a0537b6" }}>
                            Pick an Image (optional)
                        </Text>

                        {film.image && (
                            <View style={{ position: 'relative' }}>
                                <Image source={{ uri: film.image }} style={{ width: 100, height: 150 }} />
                                <Pressable
                                    onPress={() => setFilm({ ...film, image: null })}
                                    style={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -5,
                                        backgroundColor: "#9a0537b6",
                                        padding: 5,
                                        borderRadius: 50,
                                    }}
                                >
                                    <MaterialIcons name="delete" size={24} color="white" />
                                </Pressable>
                            </View>

                        )}
                    </Pressable>


                    {/* Button to save the film */}
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={styles.saveButton}
                    >
                        Save Film
                    </Button>


                </View>
            </SafeAreaView >
        </TouchableWithoutFeedback>
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
        color: "#9a0537b6",
        fontStyle: "bold",
        marginTop: 80, //IF I USE EDGES
    },
    //Inserting a new film form
    ratingText: {
        fontSize: 20,
        color: "#9a0537b6"
    },
    ratingImage: {
        width: 50,
        height: 50,
        marginHorizontal: 2,
        borderRadius: 30, // optional rounded border
    },
    insertForm: {
        position: "absolute",   // Makes it float above other content
        top: 150,               // Distance from the top of the screen
        left: 20,               // Distance from the left
        right: 20,              // Distance from the right
        borderColor: "#9a0537b6",
        borderWidth: 5,
        padding: 30,
        borderRadius: 10,
        alignItems: "center",
    },
    nameTextInput: {
        width: "80%",
        marginVertical: 5,
    },
    commentsTextInput: {
        width: "80%",
        height: 150,
        marginVertical: 5,
    },
    imageInput: {
        width: "80%",
        marginVertical: 5,
        padding: 10,
        justifyContent: "center",
    },
    saveButton: {
        width: "80%",
        marginTop: 15,
        backgroundColor: "#9a05377d",
    },
})