import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import * as Linking from 'expo-linking';



const Help = ({ navigation }) => {
    const isFocused = useIsFocused();

    const isOnline = async () => {
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {

                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        isOnline();
    }, [isFocused]);

    return (
        <ScrollView>

            <Text
                style={{
                    fontSize: 22,
                    margin: 18,
                    fontFamily: 'Ubuntu-Regular'
                }}
            >
                You can reach our customer care representatives on the following social media platforms.
            </Text>

            <Pressable
                onPress={() => {
                    Linking.openURL('https://twitter.com/Bidsub_co?t=KyhzwR1OYkr-eO74cnRMyg&s=09');
                }}
                style={[styles.row, styles.listHover]}
            >
                <View style={styles.icon}>
                    <AntDesign name="twitter" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Twitter
                    </Text>
                    <Text style={styles.justText}>
                        @Bidsub_co
                    </Text>
                </View>
            </Pressable>

            <Pressable
                onPress={() => {
                    Linking.openURL('https://instagram.com/bidsub_co?igshid=MzNlNGNkZWQ4Mg==');
                }}
                style={[styles.row, styles.listHover]}
            >
                <View style={styles.icon}>
                    <AntDesign name="instagram" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Instagram
                    </Text>
                    <Text style={styles.justText}>
                        @Bidsub_co
                    </Text>
                </View>
            </Pressable>

            <Pressable
                onPress={() => {
                    Linking.openURL('https://wa.me/+2347082902822');
                }}
                style={[styles.row, styles.listHover]}
            >
                <View style={styles.icon}>
                    <FontAwesome name="whatsapp" size={40} color="#128C7E" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        WhatsApp
                    </Text>
                    <Text style={styles.justText}>
                        07082902822
                    </Text>
                </View>
            </Pressable>

        </ScrollView>
    )
}

export default Help

const styles = StyleSheet.create({
    jCenter: {
        justifyContent: 'center'
    },
    aCenter: {
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row'
    },
    growOne: {
        flexGrow: 1
    },
    m5: {
        margin: 5
    },
    image: {
        width: 70,
        height: 70,
        borderWidth: 5,
        margin: 10,
        marginRight: 0,
        borderRadius: 100,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 2,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        marginLeft: 20
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    justText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    infoText: {
        color: "#007AFF",
        fontSize: 17,
        fontWeight: "800",
    },
    icon: {
        width: 65,
        height: 65,
        borderRadius: 100,
        margin: 15,
        backgroundColor: '#8cabd5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listHover: {
        backgroundColor: 'white',
        marginTop: 8
    },
    dets: {
        fontSize: 14,
        fontWeight: 900,
        color: '#004AAD',
        marginHorizontal: 25,
        marginVertical: 5
    }
})