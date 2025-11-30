import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, FlatList, TouchableWithoutFeedback, Keyboard, Animated } from "react-native";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Constants from "expo-constants";
import { db } from '../../firebaseConfig';
import { ref, push, onValue, remove } from 'firebase/database';
import { router } from "expo-router";

export default function BookTracker() {
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
    const searchHeight = useRef(new Animated.Value(1)).current;// 1 means visible
    const [showSearch, setShowSearch] = useState(true);
    const [searchPerformed, setSearchPerformed] = useState(false); // for no books were found
    const [loading, setLoading] = useState(false);

    // To load saved books
    useEffect(() => {
        const savedRef = ref(db, 'booktracker/');
        const unsubscribe = onValue(savedRef, (snapshot) => {
            const data = snapshot.val();
            const savedBooks = data
                ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
                : [];
            setSaved(savedBooks);

            // Update isSaved flag in current books
            setBooks(prevBooks =>
                prevBooks.map(book => ({
                    ...book,
                    isSaved: savedBooks.some(sb =>
                        sb.title === book.volumeInfo.title &&
                        sb.authors?.join(",") === book.volumeInfo.authors?.join(",")
                    )
                }))
            );
        });
        return () => unsubscribe();
    }, []);


    // Search books
    const searchBooks = async () => {
        Keyboard.dismiss();
        setSearchPerformed(true); //for no books were found
        setLoading(true);

        let query = [];

        if (title) query.push(`intitle:${title}`);
        if (author) query.push(`inauthor:${author}`);
        if (subject) query.push(`subject:${subject}`);

        // If nothing entered, use a generic query to fetch books
        const q = query.length > 0 ? query.join("+") : "book"; // default search

        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=40&key=${apiKey}${lang ? `&langRestrict=${lang}` : ""}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (!data.items) {
                setBooks([]);
                return;
            }

            const filtered = data.items.filter(book => {
                const info = book.volumeInfo;

                // --- Strict language filter ---
                if (lang) {
                    const bookLang = info.language?.toLowerCase();
                    if (!bookLang || bookLang !== lang.toLowerCase()) return false;
                }

                // --- Strict subject filter ---
                if (subject) {
                    const categories = info.categories || [];
                    const match = categories.some(cat =>
                        cat.toLowerCase().includes(subject.toLowerCase())
                    );
                    if (!match) return false;
                }

                return true;
            });

            // Mark saved books
            const updatedBooks = filtered.map(book => ({
                ...book,
                isSaved: saved.some(s =>
                    s.title === book.volumeInfo.title &&
                    s.authors?.join(",") === book.volumeInfo.authors?.join(",")
                )
            }));

            setBooks(updatedBooks);
        } catch (error) {
            console.error("Error fetching books:", error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    // Save book to Firebase
    const toggleSaveBook = useCallback((book) => {
        const exists = saved.find(b =>
            b.title === book.volumeInfo.title &&
            b.authors?.join(",") === book.volumeInfo.authors?.join(",")
        );

        if (exists) {
            remove(ref(db, `booktracker/${exists.id}`)).catch(err => console.error(err));
        } else {
            push(ref(db, 'booktracker/'), {
                title: book.volumeInfo.title || "Unknown Title",
                authors: book.volumeInfo.authors || ["Unknown Author"],
                image: book.volumeInfo.imageLinks?.thumbnail || null,
                language: book.volumeInfo.language || "N/A",
                category: book.volumeInfo.categories?.[0] || "N/A",
            }).catch(err => console.error(err));
        }
    }, [saved]);

    // Book card
    const BookCard = React.memo(({ item, onToggleSave }) => {
        const info = item.volumeInfo;
        const image = info.imageLinks?.thumbnail;

        return (
            <View style={styles.card}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.bookImage} />
                ) : (
                    <View style={[styles.bookImage, styles.noImage]}>
                        <Text style={{ fontFamily: "Audiowide_400Regular", color: "#80068eff", textAlign: "center" }}>No Image</Text>
                    </View>
                )}

                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.bookTitle, { fontFamily: "Audiowide_400Regular" }]}>{info.title}</Text>
                    <Text style={[styles.bookAuthor, { fontFamily: "Audiowide_400Regular" }]}>{info.authors?.join(", ") || "Unknown Author"}</Text>
                    <Text style={[styles.bookLang, { fontFamily: "Audiowide_400Regular" }]}>Language: {info.language}</Text>
                    <Text style={[styles.bookCat, { fontFamily: "Audiowide_400Regular" }]}>{info.categories?.[0] || "N/A"}</Text>
                </View>

                <TouchableOpacity onPress={() => onToggleSave(item)}>
                    <Ionicons name={item.isSaved ? "heart" : "heart-outline"} size={28} color="#3e0445c5" />
                </TouchableOpacity>
            </View>
        );
    });

    //Hide and show inputs
    const toggleSearch = () => {
        Animated.timing(searchHeight, {
            toValue: showSearch ? 0 : 1, // hide if 1 -> 0
            duration: 300,
            useNativeDriver: false,
        }).start();
        setShowSearch(!showSearch);
    };

    return (
        <SafeAreaView style={styles.container} edges={[]}>

            <View style={styles.headContent}>

                {/* Heading + Saved Heart */}
                <View style={styles.headerRow}>
                    <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>
                        BOOK TRACKER
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push("/screens/SavedBooks")}
                        style={styles.topHeart}
                    >
                        <Ionicons name="heart" size={33} color="#3e0445c5" />
                    </TouchableOpacity>
                </View>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.searchBlock}>

                        <Animated.View
                            style={[
                                {
                                    height: searchHeight.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 280],
                                    }),
                                    overflow: "hidden",
                                },
                            ]}
                        >

                            {/* Search inputs */}
                            <TextInput
                                placeholder="Search by title"
                                placeholderTextColor="#3f044585"
                                style={[styles.input, { fontFamily: "Audiowide_400Regular" }]}
                                value={title}
                                onChangeText={setTitle}
                            />

                            <TextInput
                                placeholder="Search by author"
                                placeholderTextColor="#3f044585"
                                style={[styles.input, { fontFamily: "Audiowide_400Regular" }]}
                                value={author}
                                onChangeText={setAuthor}
                            />

                            <TextInput
                                placeholder="Search by genre/subject"
                                placeholderTextColor="#3f044585"
                                style={[styles.input, { fontFamily: "Audiowide_400Regular" }]}
                                value={subject}
                                onChangeText={setSubject}
                            />

                            <TextInput
                                placeholder="Language (en, de, ru...)"
                                placeholderTextColor="#3f044585"
                                style={[styles.input, { fontFamily: "Audiowide_400Regular" }]}
                                value={lang}
                                onChangeText={setLang}
                            />

                            <TouchableOpacity
                                style={[
                                    styles.searchBtn,
                                    loading ? { backgroundColor: "#3f044562" } : {} // change color when loading
                                ]}
                                onPress={searchBooks}
                                disabled={loading} // makes the button unclickable when loading
                            >
                                <Text style={[styles.searchBtnText, { fontFamily: "Audiowide_400Regular" }]}>
                                    {loading ? "SEARCHING..." : "SEARCH"}
                                </Text>
                            </TouchableOpacity>


                        </Animated.View>

                        {/* Arrow to hide/show the search */}
                        <TouchableOpacity
                            onPress={toggleSearch}
                            style={styles.arrow} // align items vertically centered
                        >
                            <Ionicons
                                name={showSearch ? "chevron-up-outline" : "chevron-down-outline"}
                                size={28}
                                color="#3e0445c5"
                            />
                            <Text style={{ marginLeft: 10, color: "#3e0445c5", fontWeight: "bold", fontFamily: "Audiowide_400Regular" }}>
                                {showSearch ? "Hide Search" : "Show Search"}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </TouchableWithoutFeedback>
            </View>

            {/* Results */}
            <FlatList
                data={books}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BookCard item={item} onToggleSave={toggleSaveBook} />}
                contentContainerStyle={{
                    paddingBottom: 100,
                    alignItems: "center",
                }}
                ListEmptyComponent={() => {
                    if (loading) {
                        return <Text style={{ fontFamily: "Audiowide_400Regular", fontSize: 18, marginTop: 150, color: "#3e0445c5" }}>Loading...</Text>;
                    } else if (searchPerformed && books.length === 0) {
                        return <Text style={{ fontFamily: "Audiowide_400Regular", fontSize: 18, marginTop: 150, color: "#3e0445c5", textAlign: "center", width: "80%" }}>
                            No books were found for these search filters.
                        </Text>;
                    }
                    return null;
                }}
            />

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    //main
    container: {
        flex: 1,
        backgroundColor: "#e287e771",
    },
    //heading
    headContent: {
        alignItems: "center"
    },
    headerRow: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 70,
    },
    heading: {
        fontSize: 32,
        color: "#3e0445c5",
    },
    topHeart: {
        borderWidth: 2,    // border thickness
        borderColor: "#3e0445c5", // border color
        borderRadius: 25,  // round corners (circle)
        padding: 5,        // padding around the icon
        backgroundColor: "#ffffffaa", // semi-transparent background
        zIndex: 10,        // ensures it's above other elements
    },
    //inputs and search button
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
    },
    searchBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    //books cards
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
        color: "#80068eff",
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
    //arrow to hide/show inputs and search button
    arrow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
});
