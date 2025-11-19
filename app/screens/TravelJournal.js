import { useState } from 'react';
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, View, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // arrow icon
import { useNavigation } from '@react-navigation/native';

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

    const handleAddCity = async () => {
        if (!searchText) return;

        try {
            // Geocode the city
            const geocode = await Location.geocodeAsync(searchText);

            if (geocode.length > 0) {
                const { latitude, longitude } = geocode[0];

                // Reverse geocode to get country
                const [locationInfo] = await Location.reverseGeocodeAsync({ latitude, longitude });

                const country = locationInfo?.country || 'Unknown';

                // Add marker
                const newMarker = {
                    coordinate: { latitude, longitude },
                    city: searchText,
                    country,
                    image: require('../../assets/icons/location.png'), // my custom PNG marker
                };

                setMarkers((prev) => [...prev, newMarker]);

                // Center map
                setMapRegion({ ...mapRegion, latitude, longitude });

                // Clear input
                setSearchText('');
            }
        } catch (err) {
            console.log('Error:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={[]}>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

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
                                    />
                                    <Callout>
                                        <View style={{ padding: 5 }}>
                                            <Text style={{ fontWeight: 'bold' }}>{marker.city}</Text>
                                            <Text>{marker.country}</Text>
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

                        {/* Add new city */}
                        <Card style={styles.inputCard}>
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
                    </View>

                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
        top: 40,                // distance from top (adjust for SafeArea)
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
})
