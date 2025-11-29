import { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function FilmTracker_List() {

    //State for films
    const [films, setFilms] = useState([]);

    //Fetch films from Firebase
    useEffect(() => {
        const filmsRef = ref(db, 'filmtracker/'); // your path in Firebase

        const unsubscribe = onValue(filmsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert object to array
                const filmsArray = Object.keys(data).map(key => ({
                    id: key,       // use Firebase key as id
                    ...data[key]   // spread the rest of the film data
                }));
                setFilms(filmsArray);
            } else {
                setFilms([]); // no data
            }
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);


    return (
        <SafeAreaView style={styles.container} edges={[]}>

            {/*Heading*/}
            <View style={styles.headingContentStyle}>
                <Image
                    source={require("../../assets/images/film_tracker.png")}
                    style={styles.headingImage}
                />
                <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>YOUR FILMS</Text>
                <Image
                    source={require("../../assets/images/film_tracker.png")}
                    style={styles.headingImage}
                />
            </View>


            {/*List of the films*/}
            <FlatList
                data={films}
                style={{ alignSelf: "stretch", paddingHorizontal: 30 }}
                contentContainerStyle={{ paddingBottom: 50 }} // <-- add bottom padding
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.filmItem}>
                        {/* Film Image */}
                        <Image
                            source={item.image ? { uri: item.image } : require("../../assets/images/film_default.jpg")}
                            style={styles.filmImage}
                        />

                        {/* Name and Comments */}
                        <View style={styles.filmTextContainer}>
                            <Text style={[styles.filmName, { fontFamily: "Audiowide_400Regular" }]}>{item.name}</Text>
                            <Text style={[styles.filmComments, { fontFamily: "Audiowide_400Regular" }]}>{item.comments}</Text>
                        </View>

                        {/* Rating */}
                        <View style={styles.filmRatingContainer}>
                            <Text style={[styles.filmRating, { fontFamily: "Audiowide_400Regular" }]}>{item.rating}</Text>
                        </View>
                    </View>
                )}
            />

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
    headingContentStyle: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 70,
    },
    heading: {
        fontSize: 30,
        color: "#9a0537b6",
        marginHorizontal: 10,
    },
    headingImage: {
        width: 50,
        height: 50,
    },
    //List of the films
    filmItem: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "#9a0537b6",
        borderWidth: 5,
        padding: 10,
        marginVertical: 10,
        width: "100%",
    },
    filmImage: {
        width: 110,
        height: 160,
        borderRadius: 10,
        marginRight: 10,
    },
    filmTextContainer: {
        flex: 1,
        justifyContent: "center",
    },
    filmName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#9a0537b6",
    },
    filmComments: {
        fontSize: 14,
        color: "#333",
        marginTop: 2,
    },
    filmRatingContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
    },
    filmRating: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#9a0537b6",
        borderWidth: 5,
        borderRadius: 100,
        borderColor: "#9a0537b6",
        padding: 10,
    },
})
