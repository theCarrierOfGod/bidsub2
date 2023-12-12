import { Alert, Image, Pressable, SafeAreaView, Share, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from '../../constants/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import query from '../../constants/query';

const AirtimeReciept = ({ navigation }) => {
    const [tid, setTid] = useState('');
    const [username, setUsername] = useState('');
    const [spinning, setSpinning] = useState(true);
    const [amount, setAmount] = useState(0);
    const [number, setNumber] = useState('');
    const [selected, setSelected] = useState('')

    const fetchNow = async (tid) => {
        try {
            const response = await axios.get(`${query.baseUrl}transaction/${tid}`);
            if (response.data.transaction) {
                let transacts = response.data.transaction;
                setAmount(transacts.amount);
                setNumber(transacts.recepient);
                if (transacts.token !== null) {
                    setSelected(transacts.token.toLowerCase())
                }
            } else {
                navigation.navigate('Home')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                setSpinning(false)
            }, 3000);
        }
    }

    const getUsername = async () => {
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        setUsername(value)
                        AsyncStorage.getItem('tid')
                            .then(value => {
                                if (value != null) {
                                    setTid(value);
                                    fetchNow(value);
                                } else {
                                    navigation.navigate('Airtime')
                                }
                            })
                    } else {
                        navigation.navigate('Home')
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUsername();
    }, [])

    return (
        <SafeAreaView
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Loader spinning={spinning} />

            {spinning ? null : (
                <>
                    <View
                        style={{
                            flex: 0,
                            height: '70%',
                            width: '95%',
                            marginTop: 70,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{ color: '#004aad', fontSize: 25, height: 40, fontFamily: 'Rubik-Bold' }}>
                            My Receipt
                        </Text>
                        <View
                            style={{
                                alignItems: 'center',
                                position: 'absolute',
                                top: 20,
                                zIndex: 1000,
                                right: 20,

                            }}
                        >
                            <Pressable
                                onPress={() => {
                                    navigation.replace('Home');
                                }}
                                style={{
                                    width: '150%',
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#004aad',
                                    color: 'white',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 0,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#004aad',
                                        fontSize: 12
                                    }}
                                >
                                    Done
                                </Text>
                            </Pressable>
                        </View>
                        <View
                            style={[styles.shadowProp, styles.shadowBox]}
                        >
                            <View>
                                {selected === 'airtel' ? (
                                    <Image
                                        source={require('../../assets/images/airtel.png')}
                                        style={styles.networkIcon}
                                    />
                                ) : null}

                                {selected === '9mobile' ? (
                                    <Image
                                        source={require('../../assets/images/9mobile.png')}
                                        style={styles.networkIcon}
                                    />
                                ) : null}

                                {selected === 'mtn' ? (
                                    <Image
                                        source={require('../../assets/images/mtn.png')}
                                        style={styles.networkIcon}
                                    />
                                ) : null}

                                {selected === 'glo' ? (
                                    <Image
                                        source={require('../../assets/images/glo.png')}
                                        style={styles.networkIcon}
                                    />
                                ) : null}
                            </View>
                            <Text
                                style={{
                                    fontSize: 25,
                                    fontFamily: 'Ubuntu-Bold',
                                    marginTop: 10
                                }}
                            >
                                Airtime Purchase Successful
                            </Text>

                            <View style={{ flex: 0, height: 2, width: '100%', marginTop: 10, backgroundColor: 'black' }} />

                            <View
                                style={{
                                    justifyContent: 'space-evenly',
                                    width: '100%',
                                    height: '75%',
                                    paddingBottom: 30,
                                }}
                            >

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        width: '100%',
                                    }}
                                >
                                    <View
                                        style={{
                                            margin: 5,
                                            marginLeft: 15,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {selected === 'airtel' ? (
                                            <Image
                                                source={require('../../assets/images/airtel.png')}
                                                style={styles.networkIcon}
                                            />
                                        ) : null}

                                        {selected === '9mobile' ? (
                                            <Image
                                                source={require('../../assets/images/9mobile.png')}
                                                style={styles.networkIcon}
                                            />
                                        ) : null}

                                        {selected === 'mtn' ? (
                                            <Image
                                                source={require('../../assets/images/mtn.png')}
                                                style={styles.networkIcon}
                                            />
                                        ) : null}

                                        {selected === 'glo' ? (
                                            <Image
                                                source={require('../../assets/images/glo.png')}
                                                style={styles.networkIcon}
                                            />
                                        ) : null}
                                    </View>

                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: 'Ubuntu-Medium',
                                                fontWeight: 500,
                                                fontSize: 20,
                                                margin: 20,
                                                marginBottom: 5
                                            }}
                                        >
                                            Recipient
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'Ubuntu-Bold',
                                                fontWeight: 500,
                                                fontSize: 20,
                                                margin: 20,
                                                marginTop: 5
                                            }}
                                        >
                                            {number}
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <Text
                                        style={{
                                            fontFamily: 'Ubuntu-Medium',
                                            fontWeight: 500,
                                            fontSize: 20,
                                            margin: 20,
                                            marginBottom: 5
                                        }}
                                    >
                                        Reference Number
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'Ubuntu-Bold',
                                            fontWeight: 500,
                                            fontSize: 20,
                                            margin: 20,
                                            marginTop: 5
                                        }}
                                    >
                                        {tid}
                                    </Text>
                                </View>

                                <View>
                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: 'Ubuntu-Medium',
                                                fontWeight: 500,
                                                fontSize: 20,
                                                margin: 20,
                                                marginBottom: 5
                                            }}
                                        >
                                            Amount
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'Ubuntu-Bold',
                                                fontWeight: 500,
                                                fontSize: 20,
                                                margin: 20,
                                                marginTop: 5,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <MaterialCommunityIcons name="currency-ngn" size={20} color="black" /> {amount}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            )}
        </SafeAreaView>
    )
}

export default AirtimeReciept

const styles = StyleSheet.create({
    shadowProp: {
        shadowColor: '#004aad',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 15,
        shadowColor: '#004aad',
    },
    shadowBox: {
        flex: 0,
        backgroundColor: '#ffffff',
        height: '70%',
        width: '90%',
        borderRadius: 25,
        padding: 7,
        borderWidth: 1,
        borderColor: '#ffffff',
        alignItems: 'center'
    },
    networkIcon: {
        width: 75,
        height: 75,
        borderRadius: 10,
        borderWidth: 3,
        marginTop: 10
    },
})