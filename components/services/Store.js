import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import SubmitButton from '../constants/SubmitButton';
import { usePaystackPayment } from 'react-paystack';
import axios from 'axios';
import query from '../constants/query';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swal from 'sweetalert2';

const FundWallet = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pKEy, setPKey] = useState('')
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [spinning, setSpinning] = useState(true);
    const [error, setError] = useState('');

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}user/${user}`);
            if (response.data) {
                setUsername(response.data[0].username)
                setEmail(response.data[0].email)
            } else {
                setError(response.data.error)
            }
            const res = axios.get(`${query.baseUrl}public`);
            if (res.data) {
                console.log(res._token);
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setSpinning(false)
        }
    }

    const pubNow = async () => {
        try {
            const res = await axios.get(`${query.baseUrl}public`);
            if (res.data) {
                setPKey(res.data._token);
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setSpinning(false)
        }
    }

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: amount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
        publicKey: pKEy,
    };

    // you can call this function anything
    const onSuccess = (reference) => {
        // Implementation for whatever you want to do with reference and after success call.
        console.log(reference);
        purchaseAirtime(reference);
    };

    // you can call this function anything
    const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed');
    }

    const purchaseAirtime = async (reference) => {
        setIsLoading(true);
        const data = {
            amount: amount,
            username: username,
            reference: reference.reference,
            status: reference.status,
        }
        console.log(data)
        try {
            const response = await axios.post(`${query.baseUrl}wallet/fund`, data);
            if (response.data.success) {
                Swal.fire({
                    title: 'Fund Wallet',
                    text: 'Success',
                    icon: 'success',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    didClose: () => {
                        navigation.popToTop();
                    }
                })
            } else {
                console.log(response.data.error.source);
                setAmountError(response.data.error.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const PayWithPaystack = usePaystackPayment(config);

    
    const isOnline = async () => {
        setSpinning(true);
        setError('')
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        fetchNow(value);
                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            pubNow();
            isOnline();
        }
    }, [isFocused])

    if (spinning) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ActivityIndicator
                    size={'large'}
                />
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.text}>
                    Amount
                </Text>

                <View style={{ width: '90%', alignSelf: 'center', marginTop: 15 }}>
                    <MaterialCommunityIcons name="currency-ngn" size={21} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
                    <TextInput
                        style={{
                            borderWidth: 0,
                            height: 48,
                            backgroundColor: 'rgba(0,0,0, 0.03)',
                            padding: 5,
                            paddingLeft: 35,
                            borderRadius: 8,
                            fontWeight: '700',
                            fontSize: 16,
                            color: "rgba(0,0,0,0.3)"
                        }}
                        value={amount}
                        onChangeText={
                            (text) => {
                                setAmount(text);
                                setAmountError('')
                            }
                        }
                        autoCorrect={false}
                        inputMode={'number-pad'}
                        placeholder={'Amount'}
                    />
                    {amountError.length > 0 ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                </View>

                {amountError.length > 0 ? (
                    <>
                        <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{amountError}</Text>
                    </>
                ) : null}
            </View>
            <SubmitButton
                title={'Proceed'}
                handleSubmit={
                    () => {
                        if (amount < 500) {
                            setAmountError('Minimum funding amount is #500');
                            return;
                        }
                        PayWithPaystack(onSuccess, onClose)
                    }
                }
                loading={isLoading}
                disabled={isLoading}
            />
        </ScrollView>
    )
}

export default FundWallet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    text: {
        fontSize: 20,
        fontFamily: 'Rubik-Bold',
        fontWeight: 'normal',
        marginBottom: 2,
        marginHorizontal: 10,
        marginTop: 15,
        lineHeight: 32,
        color: '#000000',
    },
    iconLeft: {
        position: 'absolute',
        left: 8,
        top: 12
    },
    iconRight: {
        position: 'absolute',
        right: 12,
        top: 7,
        padding: 5
    }
})