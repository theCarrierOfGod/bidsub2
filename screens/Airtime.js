import { KeyboardAvoidingView, Pressable, ScrollViScrollView, ew, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Feather, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import SubmitButton from '../constants/SubmitButton';
import axios from 'axios';
import query from '../constants/query';
import { useIsFocused } from '@react-navigation/native';
import SuccessBox from '../components/SuccessBox';
import { NetworkTest } from '../constants/NetworkTest';
import * as Notifications from 'expo-notifications';

const Airtime = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [selected, setSelected] = useState('');
    const [selectedError, setSelectedError] = useState('')
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState(null)
    const [number, setNumber] = useState('');
    const [numberError, setNumberError] = useState(null)
    const [pin, setPin] = useState('');
    const [seePin, setSeePin] = useState(false);
    const [pinError, setPinError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toPay, setToPay] = useState(null);

    const [error, setError] = useState(null);

    const getUsername = async () => {
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        setUsername(value)
                    }
                })
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        getUsername();
    }, [isFocused]);

    async function scheduleAirtimeNotificatipn(amount, network) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Airtime Purchase",
                body: '#' + amount + ' ' + network + ' airtime' + ' successful',
                data: { data: 'Add here' },
            },
            trigger: { seconds: 1 },
        });
    }


    const purchaseAirtime = async () => {
        setLoading(true);
        setSelectedError(null);
        setAmountError(null);
        setPinError(null);
        setNumberError(null);

        setError(null)

        if (selected.length === 0) {
            setSelectedError('Please choose a network');
            setLoading(false);
            return
        }

        if (number.length === 0) {
            setNumberError('Enter mobile number')
            setLoading(false);
            return
        } else if (number.length < 11) {
            setNumberError('Invalid mobile number')
            setLoading(false);
            return
        }

        if (NetworkTest(number) !== selected.toUpperCase()) {
            setSelectedError('Wrong network selected')
            setLoading(false);
            return
        }

        if (amount < 50) {
            setAmountError('Minimum airtime amount is #50')
            setLoading(false);
            return
        }

        if (pin.length < 4) {
            setPinError('Invalid transaction pin');
            setLoading(false);
            return
        }

        const data = {
            amount: amount,
            network: selected,
            number: number,
            pin: pin,
            username: username
        }

        try {
            const response = await axios.post(`${query.baseUrl}purchase/airtime`, data);
            if (response.data.success) {
                scheduleAirtimeNotificatipn(amount, selected)
                AsyncStorage.setItem('tid', response.data.tid);
                navigation.navigate('AirtimeReceipt')
            } else {
                if (response.data.error.source === 'pin') {
                    setPinError(response.data.error.message);
                }
                if (response.data.error.source === 'amount') {
                    setAmountError(response.data.error.message);
                }
                if (response.data.error.source === 'phone') {
                    setNumberError(response.data.error.message);
                }
                if (response.data.error.source === 'amount') {
                    setAmountError(response.data.error.message);
                }
                if (response.data.error.source === 'general') {
                    setError("Network Error")
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView>
                <View
                    style={{
                        flex: 0,
                        width: '95%',
                        marginHorizontal: '2.5%',
                        marginBottom: 80
                    }}
                >
                    <Text style={styles.text}>
                        Select a network
                    </Text>

                    <View style={styles.networkBox}>
                        <View style={styles.eachNetwork}>
                            <Pressable
                                onPress={() => {
                                    setSelectedError(null);
                                    setSelected('9mobile')
                                }}
                            >
                                <Image
                                    source={require('../assets/images/9mobile.png')}
                                    style={styles.networkIcon}
                                />
                            </Pressable>
                            {selected === '9mobile' ? <AntDesign name="checkcircleo" size={18} style={styles.selectedNetwork} color="black" /> : null}
                        </View>
                        <View>
                            <Pressable
                                onPress={() => {
                                    setSelectedError(null);
                                    setSelected('airtel')
                                }}
                            >
                                <Image
                                    source={require('../assets/images/airtel.png')}
                                    style={styles.networkIcon}
                                />
                            </Pressable>
                            {selected === 'airtel' ? <AntDesign name="checkcircleo" size={18} style={styles.selectedNetwork} color="black" /> : null}
                        </View>
                        <View>
                            <Pressable
                                onPress={() => {
                                    setSelectedError(null);
                                    setSelected('glo')
                                }}
                            >
                                <Image
                                    source={require('../assets/images/glo.png')}
                                    style={styles.networkIcon}
                                />
                            </Pressable>
                            {selected === 'glo' ? <AntDesign name="checkcircleo" size={18} style={styles.selectedNetwork} color="black" /> : null}
                        </View>
                        <View>
                            <Pressable
                                onPress={() => {
                                    setSelectedError(null);
                                    setSelected('mtn')
                                }}
                            >
                                <Image
                                    source={require('../assets/images/mtn.png')}
                                    style={styles.networkIcon}
                                />
                            </Pressable>
                            {selected === 'mtn' ? <AntDesign name="checkcircleo" size={18} style={styles.selectedNetwork} color="black" /> : null}
                        </View>
                    </View>

                    {selectedError !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 20, marginLeft: 15 }} >{selectedError}</Text>
                        </>
                    ) : null}

                    <Text style={styles.text}>
                        Mobile Number
                    </Text>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 15 }}>
                        <Feather name="phone-call" size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                            value={number}
                            maxLength={11}
                            onChangeText={
                                (text) => {
                                    setNumber(text);
                                    setNumberError(null);
                                }
                            }
                            autoCorrect={false}
                            placeholder={'Mobile Number'}
                            inputMode='tel'
                            autoComplete='off'
                        />
                        {numberError !== null ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>

                    {numberError !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{numberError}</Text>
                        </>
                    ) : null}

                    <Text style={styles.text}>
                        Amount
                    </Text>

                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 15 }}>
                        <MaterialCommunityIcons name="currency-ngn" size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                                    if (text < 50) {
                                        setAmount(text);
                                        setAmountError('Minimum amount is 50NGN');
                                        setToPay(text - (text * 0.01))
                                    } else {
                                        setAmount(text);
                                        setAmountError(null);
                                        setToPay(text - (text * 0.01))
                                    }
                                }
                            }

                            autoCorrect={false}
                            inputMode={'numeric'}
                            placeholder={'Amount'}
                            autoComplete='off'
                            importantForAutofill={'no'}
                        />
                        {amountError !== null ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>

                    {amountError !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{amountError}</Text>
                        </>
                    ) : null}
                    {toPay !== null ? (
                        <>
                            <MaterialCommunityIcons name="currency-ngn" size={10} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
                            <Text style={{ color: '#004aad', fontSize: 12, marginTop: 10, marginLeft: 25 }} >To pay {toPay}</Text>
                        </>
                    ) : null}

                    <Text style={styles.text}>
                        Transaction Pin
                    </Text>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 15, flex: 0, height: 50 }}>
                        <MaterialCommunityIcons name="form-textbox-password" size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                            value={pin}
                            onChangeText={
                                (text) => {
                                    setPin(text)
                                    setPinError(null)
                                }
                            }
                            autoCorrect={false}
                            secureTextEntry={!seePin}
                            placeholder={'Transaction Pin'}
                            maxLength={4}
                            inputMode='numeric'
                            autoComplete='off'
                        />
                        <Pressable
                            style={styles.iconRight}
                            onPress={() => {
                                if (seePin)
                                    setSeePin(false)
                                else
                                    setSeePin(true)
                            }}
                        >
                            <Ionicons name={seePin ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={20} color="rgba(0,0,0,0.3)" />
                        </Pressable>
                        {pinError !== null ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>
                    {pinError !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{pinError}</Text>
                        </>
                    ) : null}

                    {error !== null ? (
                        <SuccessBox message={error} />
                    ) : null}
                    <SubmitButton
                        loading={loading}
                        disabled={loading}
                        title={'Confirm'}
                        handleSubmit={
                            () => {
                                purchaseAirtime()
                            }
                        }
                    />
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Airtime

const styles = StyleSheet.create({
    container: {
        flex: 0,
        height: "100%",
        paddingVertical: 12,
    },
    headerText: {
        fontSize: 32,
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 20,
        marginHorizontal: 10,
        lineHeight: 35,
        color: '#000000'
    },
    icon: {
        marginBottom: 20
    },
    eachNetwork: {
        position: 'relative',
        width: 70,
        height: 70,
    },
    networkBox: {
        flex: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    networkIcon: {
        width: 70,
        height: 70,
        borderRadius: 10,
        borderWidth: 0,
    },
    selectedNetwork: {
        position: 'absolute',
        backgroundColor: '#fff',
        top: 5,
        right: 5,
        borderRadius: 50,
        fontWeight: 'bold'
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
    amountChoose: {
        flex: 0,
        backgroundColor: '#004aad',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#004aad',
        width: 80,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
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
    },
    containers: {
        margin: 20
    }
})