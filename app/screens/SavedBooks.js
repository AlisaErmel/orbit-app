import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { db } from '../../firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';

export default function SavedBooks() {
    const [fontsLoaded] = useFonts({ Audiowide_400Regular });
    const [saved, setSaved] = useState([]);

    // Load saved books from Firebase
    useEffect(() => {
        const savedRef = ref(db, 'booktracker/');
        const unsubscribe = onValue(savedRef, (snapshot) => {
            const data = snapshot.val();
            const savedBooks = data
                ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
                : [];
            setSaved(savedBooks);
        });
        return () => unsubscribe();
    }, []);

    // Remove book
    const removeBook = (bookId) => {
        remove(ref(db, `booktracker/${bookId}`)).catch(err => console.error(err));
    };

    // Book card
    const renderBook = ({ item }) => {
        return (
            <View style={styles.card}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.bookImage} />
                ) : (
                    <View style={[styles.bookImage, styles.noImage]}>
                        <Text style={{
                            fontFamily: "Audiowide_400Regular",
                            color: "#80068eff",
                            textAlign: "center"
                        }}>No Image</Text>
                    </View>
                )}

                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.bookTitle, { fontFamily: "Audiowide_400Regular" }]}>{item.title}</Text>
                    <Text style={[styles.bookAuthor, { fontFamily: "Audiowide_400Regular" }]}>{item.authors?.join(", ") || "Unknown Author"}</Text>
                    <Text style={[styles.bookLang, { fontFamily: "Audiowide_400Regular" }]}>Language: {item.language}</Text>
                    <Text style={[styles.bookCat, { fontFamily: "Audiowide_400Regular" }]}>Category: {item.category}</Text>
                </View>

                <TouchableOpacity onPress={() => removeBook(item.id)}>
                    <Ionicons name="trash-outline" size={28} color="#3e0445c5" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={[]}>

            {/*Heading*/}
            <View style={styles.headingContentStyle}>
                <Image
                    source={require("../../assets/images/book_tracker.png")}
                    style={styles.headingImage}
                />
                <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>SAVED BOOKS</Text>
                <Image
                    source={require("../../assets/images/book_tracker.png")}
                    style={styles.headingImage}
                />
            </View>

            <FlatList
                data={saved}
                keyExtractor={(item) => item.id}
                renderItem={renderBook}
                contentContainerStyle={{ paddingBottom: 100, alignItems: "center" }}
                ListEmptyComponent={() => (
                    <Text style={{ fontFamily: "Audiowide_400Regular", fontSize: 18, marginTop: 150, color: "#3e0445c5", textAlign: "center", width: "80%" }}>
                        No saved books yet.
                    </Text>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e287e771",
    },
    headingContentStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 70,
        marginBottom: 20,
    },
    heading: {
        fontSize: 30,
        color: "#4b0d6fff",
        fontStyle: "bold",
        marginHorizontal: 10,
    },
    headingImage: {
        width: 50,
        height: 50,
    },
    card: {
        backgroundColor: "#ffffffaa",
        width: "90%",
        padding: 10,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    bookImage: {
        width: 60,
        height: 90,
        borderRadius: 8,
        backgroundColor: "#ddd",
    },
    noImage: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e287e771",
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4b0d6fff",
    },
    bookAuthor: {
        fontSize: 14,
        color: "#3e0445c5",
        marginTop: 2,
    },
    bookLang: {
        fontSize: 13,
        marginTop: 2,
        color: "#3e0445c5",
    },
    bookCat: {
        fontSize: 13,
        marginTop: 2,
        color: "#3e0445c5",
    },
});
