import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import query from '../../constants/query';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const Balance = ({ navigation, refreshing }) => {
    const isFocused = useIsFocused();
    const [seeBalance, setSeeBalance] = useState(true);
    const [balance, setBalance] = useState(0)
    const [spinning, setSpinning] = useState(true);

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}user/${user}`);
            if (response.data) {
                setBalance(response.data[0].balance);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setSpinning(false)
        }
    }

    const isOnline = async () => {
        setSpinning(true)
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        fetchNow(value);
                    } else {
                        navigation.navigate('RootNavigator', { screen: 'SignIn' })
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (isFocused) {
            isOnline();
        }
    }, [isFocused]);

    useEffect(() => {
        if (refreshing) {
            isOnline();
        }
    }, [refreshing]);

    return (
        <View
            style={{
                minHeight: 200
            }}
        >
            {spinning ? (
                <ActivityIndicator
                    animation='fade'
                    size="large"
                    color="#ffffff"
                />
            ) : (
                <>
                    <View
                        style={{
                            width: '70%',
                            alignSelf: 'center',
                            marginTop: 30,
                            paddingHorizontal: '10%'
                        }}>
                        <Pressable
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: -10,
                            }}
                            onPress={() => {
                                if (seeBalance)
                                    setSeeBalance(false)
                                else
                                    setSeeBalance(true)
                            }}
                        >
                            <Ionicons name={seeBalance ? "ios-eye" : "ios-eye-off"} size={16} color="white" />
                        </Pressable>
                        <Text
                            style={{
                                fontSize: 30,
                                fontFamily: 'Rubik-Bold',
                                textAlign: 'center',
                                color: 'white'
                            }}
                        >
                            {seeBalance ? (
                                <>
                                    <MaterialCommunityIcons name="currency-ngn" size={27} color="white" />
                                    {balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </>
                            ) : " - - - - - "}
                        </Text>
                    </View>
                    <View
                        style={{
                            width: '60%',
                            alignSelf: 'center',
                            marginTop: 30
                        }}
                    >
                        <Pressable
                            onPress={() => {
                                navigation.navigate('FundWallet')
                            }}
                            style={{
                                backgroundColor: '#004aad',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 25,
                                borderWidth: 2,
                                borderColor: '#fff',
                                padding: 4,
                            }}
                        >
                            <MaterialCommunityIcons name="wallet-outline" size={24} color="white" style={{
                                marginHorizontal: 5
                            }} />
                            <Text
                                style={{
                                    fontSize: 24,
                                    fontFamily: 'Rubik-Bold',
                                    textAlign: 'center',
                                    color: 'white',
                                    padding: 10,
                                    borderRadius: 25
                                }}
                            >
                                Fund Wallet
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    )
}

export default Balance