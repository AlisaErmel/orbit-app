import { useState, useEffect } from 'react';
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, View, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Animated } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // arrow icon
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebaseConfig';
import { ref, push, onValue } from 'firebase/database';

export default function TravelJournal() {
    //Font
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    //For an arrow
    const navigation = useNavigation();

    const [mapRegion, setMapRegion] = useState({
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 10,
        longitudeDelta: 10,
    });

    const [searchText, setSearchText] = useState('');
    const [markers, setMarkers] = useState([]);

    //Track keyboard height
    const keyboardOffset = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const show = Keyboard.addListener("keyboardWillShow", (e) => {
            Animated.timing(keyboardOffset, {
                toValue: e.endCoordinates.height,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        const hide = Keyboard.addListener("keyboardWillHide", () => {
            Animated.timing(keyboardOffset, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    // Load markers from Firebase on mount
    useEffect(() => {
        const markersRef = ref(db, 'traveljournal/');
        onValue(markersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedMarkers = Object.values(data).map(m => ({
                    city: m.city,
                    country: m.country,
                    coordinate: { latitude: m.latitude, longitude: m.longitude },
                    image: require('../../assets/icons/location.png'),
                }));
                setMarkers(loadedMarkers);
            }
        });
    }, []);


    // Add a new city
    const handleAddCity = async () => {
        if (!searchText) return;

        try {
            const geocode = await Location.geocodeAsync(searchText);
            if (geocode.length > 0) {
                const { latitude, longitude } = geocode[0];
                const [locationInfo] = await Location.reverseGeocodeAsync({ latitude, longitude });
                const country = locationInfo?.country || 'Unknown';

                const newMarker = {
                    city: searchText,
                    country,
                    latitude,
                    longitude,
                };

                // Save to Firebase
                push(ref(db, 'traveljournal/'), newMarker);

                // Add locally for instant update
                setMarkers(prev => [
                    ...prev,
                    { ...newMarker, image: require('../../assets/icons/location.png'), coordinate: { latitude, longitude } }
                ]);

                // Center map
                setMapRegion({ ...mapRegion, latitude, longitude });

                setSearchText('');
                Keyboard.dismiss();
            }
        } catch (err) {
            console.log("Error:", err);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={[]}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

                {/* Map with travel savings*/}
                <View style={{ flex: 1, position: 'relative' }}>
                    <MapView style={{ flex: 1 }} region={mapRegion}>
                        {markers.map((marker, index) => (
                            <Marker key={index} coordinate={marker.coordinate}>
                                <Image
                                    source={require("../../assets/icons/location.png")}
                                    style={{ width: 40, height: 40 }}
                                    resizeMode="contain"
                                    pointerEvents="none"
                                />
                                <Callout tooltip>
                                    <View style={styles.markerCallout}>
                                        <Text style={{ fontWeight: 'bold', fontFamily: "Audiowide_400Regular", fontSize: 16 }}>
                                            {marker.city},
                                        </Text>
                                        <Text style={{ fontSize: 14, color: '#555' }}>
                                            {marker.country}
                                        </Text>
                                    </View>
                                </Callout>

                            </Marker>
                        ))}
                    </MapView>

                    {/* Back button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={28} color="black" />
                    </TouchableOpacity>

                    {/* Add new city (now moves up with keyboard) */}
                    <Animated.View style={[styles.inputCard, { bottom: Animated.add(65, keyboardOffset) }]}>
                        <Card style={{ elevation: 5, padding: 10 }}>
                            <TextInput
                                label="Enter city"
                                value={searchText}
                                onChangeText={setSearchText}
                                style={{ backgroundColor: 'white' }}
                            />
                            <Button mode="contained" onPress={handleAddCity} style={{ marginTop: 8 }}>
                                Add City
                            </Button>
                        </Card>
                    </Animated.View>

                </View>

            </TouchableWithoutFeedback>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#45d2e58b",
    },
    inputCard: {
        position: 'absolute',
        bottom: 65,
        left: 20,
        right: 20,
        padding: 10,
        elevation: 5,
    },
    backButton: {
        position: 'absolute',   // float above the map
        top: 45,                // distance from top (adjust for SafeArea)
        left: 20,               // distance from left
        width: 45,              // width & height make it round
        height: 45,
        borderRadius: 22.5,     // half of width/height for circle
        backgroundColor: 'white', // or any color
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,           // shadow on Android
        shadowColor: '#000',    // shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    markerCallout: {
        padding: 8,
        minWidth: 150,          // ensures it's not too narrow
        maxWidth: 250,          // limits overly long bubbles
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',   // center text horizontally
    },
})
