import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, FlatList, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Constants from "expo-constants";

export default function BookTracker({ navigation }) {
    //font
    const [fontsLoaded] = useFonts({ Audiowide_400Regular });

    //API key
    const apiKey = Constants.expoConfig.extra.googleBooksApiKey;

    //States
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [subject, setSubject] = useState("");
    const [lang, setLang] = useState("");
    const [books, setBooks] = useState([]);
    const [saved, setSaved] = useState([]);

    // Search books
    const searchBooks = async () => {
        Keyboard.dismiss();

        let query = [];

        if (title) query.push(`intitle:${title}`);
        if (author) query.push(`inauthor:${author}`);
        if (subject) query.push(`subject:${subject}`);
        if (query.length === 0) return;

        const q = query.join("+");

        let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            q
        )}&maxResults=20&key=${apiKey}`;

        if (lang) url += `&langRestrict=${lang}`;

        const res = await fetch(url);
        const data = await res.json();

        setBooks(data.items || []);
    };

    // Save book
    const toggleSaveBook = (book) => {
        const exists = saved.find((b) => b.id === book.id);
        if (exists) {
            setSaved(saved.filter((b) => b.id !== book.id));
        } else {
            setSaved([...saved, book]);
        }
    };

    // Book card
    const renderBook = ({ item }) => {
        const info = item.volumeInfo;
        const image = info.imageLinks?.thumbnail;
        const isSaved = saved.some((b) => b.id === item.id);

        return (
            <View style={styles.card}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.bookImage} />
                ) : (
                    <View style={[styles.bookImage, styles.noImage]}>
                        <Text>No Image</Text>
                    </View>
                )}

                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.bookTitle}>{info.title}</Text>
                    <Text style={styles.bookAuthor}>
                        {info.authors ? info.authors.join(", ") : "Unknown Author"}
                    </Text>
                    <Text style={styles.bookLang}>Language: {info.language}</Text>
                    <Text style={styles.bookCat}>
                        Category: {info.categories?.[0] || "N/A"}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => toggleSaveBook(item)}>
                    <Ionicons
                        name={isSaved ? "heart" : "heart-outline"}
                        size={28}
                        color="#3e0445c5"
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>

                {/* Heading + Saved Heart */}
                <View style={styles.headerRow}>
                    <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>
                        BOOK TRACKER
                    </Text>

                    <TouchableOpacity onPress={() => navigation.navigate("SavedBooks", { saved })}>
                        <Ionicons name="heart" size={33} color="#3e0445c5" />
                    </TouchableOpacity>
                </View>

                {/* Search inputs */}
                <View style={styles.searchBlock}>
                    <TextInput
                        placeholder="Search by title"
                        placeholderTextColor="#3e0445c5"
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput
                        placeholder="Search by author"
                        placeholderTextColor="#3e0445c5"
                        style={styles.input}
                        value={author}
                        onChangeText={setAuthor}
                    />

                    <TextInput
                        placeholder="Search by genre/subject"
                        placeholderTextColor="#3e0445c5"
                        style={styles.input}
                        value={subject}
                        onChangeText={setSubject}
                    />

                    <TextInput
                        placeholder="Language (en, de, ru...)"
                        placeholderTextColor="#3e0445c5"
                        style={styles.input}
                        value={lang}
                        onChangeText={setLang}
                    />

                    <TouchableOpacity style={styles.searchBtn} onPress={searchBooks}>
                        <Text style={styles.searchBtnText}>SEARCH</Text>
                    </TouchableOpacity>
                </View>

                {/* Results */}
                <FlatList
                    data={books}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBook}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e287e771",
        alignItems: "center",
    },
    headerRow: {
        width: "95%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    heading: {
        fontSize: 32,
        color: "#3e0445c5",
    },
    searchBlock: {
        width: "90%",
        marginTop: 20,
    },
    input: {
        backgroundColor: "#ffffffaa",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        color: "#3e0445c5",
        fontSize: 16,
    },
    searchBtn: {
        backgroundColor: "#3e0445c5",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 5,
        marginBottom: 10,
    },
    searchBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#3e0445c5",
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
