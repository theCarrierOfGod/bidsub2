import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Services = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <View
                style={{
                    paddingBottom: 15
                }}
            >
                <Text
                    style={styles.text}
                >
                    Explore our range of services designed to simplify your life
                </Text>
            </View>
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap',
                    height: '100%'
                }}
            >
                <Pressable
                    style={styles.eachService}
                    onPress={() => {
                        navigation.navigate('Airtime')
                    }}
                >
                    <MaterialCommunityIcons style={styles.icon} name="phone" color={'#004AAD'} size={40} />
                    <Text style={styles.eachText}>
                        Airtime
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.eachService}
                    onPress={() => navigation.navigate('Data')}
                >
                    <MaterialCommunityIcons style={styles.icon} name="wifi" color={'#004AAD'} size={40} />
                    <Text style={styles.eachText}>
                        Data
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.eachService}
                    onPress={() => navigation.navigate('Cable')}
                >
                    <MaterialCommunityIcons style={styles.icon} name="television" color={'#004AAD'} size={40} />
                    <Text style={styles.eachText}>
                        Cable TV
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.eachService}
                    onPress={() => navigation.navigate('Electricity')}
                >
                    <MaterialCommunityIcons style={styles.icon} name="transmission-tower" color={'#004AAD'} size={40} />
                    <Text style={styles.eachText}>
                        Electricity
                    </Text>
                </Pressable>

                {/* <Pressable
                    style={styles.eachService}
                    onPress={() => navigation.navigate('Internet')}
                >
                    <MaterialCommunityIcons style={styles.icon} name="web" color={'#004AAD'} size={40} />
                    <Text style={styles.eachText}>
                        Internet
                    </Text>
                </Pressable> */}

                <Pressable
                    style={styles.eachService}
                    onPress={() => navigation.navigate('Education')}
                >
                    <MaterialCommunityIcons style={styles.icon} name="school-outline" color={'#004AAD'} size={40} />
                    <Text style={styles.eachText}>
                        Education
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default Services

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: '#ffffff'
    },
    icon: {
        marginBottom: 20
    },
    eachText: {
        color: '#004AAD',
        fontWeight: '900',
        fontSize: 18
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
        marginHorizontal: 18,
        lineHeight: 32,
        color: '#004AAD',
    },
    eachService: {
        flex: 0,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        borderWidth: 3,
        borderColor: '#004AAD',
        minHeight: 130,
        minWidth: 110,
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
        marginHorizontal: 20,
        shadowColor: '#004aad',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 15,
        shadowColor: '#004aad',
    },
    spinnerTextStyle: {
        color: '#004AAD'
    }
})