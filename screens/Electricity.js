import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons, AntDesign } from '@expo/vector-icons';
import SubmitButton from '../constants/SubmitButton';
import axios from 'axios';
import query from '../constants/query';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessBox from '../components/SuccessBox';

const Electricity = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');

    const [selected, setSelected] = useState('');

    const [discoCode, setDiscoCode] = useState(null)
    const [discoName, setDiscoName] = useState(null)
    const [discoError, setDiscoError] = useState(null);

    const [meterType, setMeterType] = useState('');
    const [meterError, setMeterError] = useState(null);

    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState(null);

    const [validated, setValidated] = useState(false);

    const [customerName, setCustomerName] = useState(' ')

    const [number, setNumber] = useState('');
    const [numberError, setNumberError] = useState(null);

    const [pin, setPin] = useState('');
    const [seePin, setSeePin] = useState(false);
    const [pinError, setPinError] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const getUsername = async () => {
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        setUsername(value)
                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        getUsername();
    }, [isFocused])

    const planChanges = (text) => {
        const myArray = text.split(",");
        setSelected(text)
        setDiscoCode(myArray[0]);
        setDiscoName(myArray[1]);
    }

    const validateMeterNumber = async () => {
        setLoading(true);
        setDiscoError(null);
        setNumberError(null);
        setCustomerName(null)

        if (selected.length === 0) {
            setDiscoError('Please choose a disco');
            setLoading(false);
            return
        }

        if (meterType.length === 0) {
            setMeterError('Select meter type');
            setLoading(false);
            return
        }

        if (number.length === 0) {
            setNumberError('Enter a valid meter number');
            setLoading(false);
            return
        }

        const data = {
            service: discoCode,
            meterNumber: number,
            meterType: meterType
        }
        try {
            const response = await axios.post(`${query.baseUrl}validate/electricity`, data);
            if (response.data.success) {
                setValidated(true);
                setCustomerName(response.data.customerName);
            } else {
                if (response.data.error.source === 'general') {
                    setNumberError("Network Error");
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const purchaseDisco = async () => {
        setLoading(true);
        setDiscoError(null);
        setAmountError(null);
        setPinError(null);
        setNumberError(null);
        setMeterError(null);
        setError(null)

        if (selected.length === 0) {
            setDiscoError('Please choose a disco');
            setLoading(false);
            return
        }

        if (meterType.length === 0) {
            setMeterError('Select meter type');
            setLoading(false);
            return
        }

        if (number.length === 0) {
            setNumberError('Enter a valid meter number');
            setLoading(false);
            return
        }

        if (!validated) {
            setNumberError('Invalid meter number')
            setLoading(false);
            return
        }

        if (amount < 1000) {
            setAmountError('Minimum amount is 1000NGN')
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
            service: discoCode,
            meterNumber: number,
            pin: pin,
            username: username,
            meterType: meterType
        }
        try {
            const response = await axios.post(`${query.baseUrl}purchase/power`, data);
            console.log(response.data)
            if (response.data.success) {
                AsyncStorage.setItem('tid', response.data.tid);
                navigation.navigate('ElectricityReceipt', {
                    amount: amount,
                    discoName: discoName,
                    meterNumber: number,
                    meterType: meterType,
                    customerName: customerName
                })
            } else {
                if (response.data.error.source === 'pin') {
                    setPinError(response.data.error.message);
                }
                if (response.data.error.source === 'amount') {
                    setAmountError(response.data.error.message);
                }
                if (response.data.error.source === 'number') {
                    setNumberError(response.data.error.message);
                }
                if (response.data.error.source === 'type') {
                    setMeterError(response.data.error.message);
                }
                if (response.data.error.source === 'general') {
                    setError(response.data.error.message)
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
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
                    <View>
                        <Text style={styles.text}>Disco Name </Text>
                        <Picker
                            selectedValue={selected}
                            onValueChange={(itemValue, itemIndex) =>
                                planChanges(itemValue)
                            }
                            style={styles.inPut}
                        >
                            <Picker.Item label='Select' value={''} />
                            <Picker.Item label='Abuja Electric' value={'AEDC,Abuja Electric'} />
                            <Picker.Item label='Enugu Electric' value={'EEDC,Enugu Electric'} />
                            <Picker.Item label='Eko Electric' value={'EKEDC,Eko Electric'} />
                            <Picker.Item label='Ibadan Electric' value={'IBEDC,Ibadan Electric'} />
                            <Picker.Item label='Ikeja Electric' value={'IKEDC,Ikeja Electric'} />
                            <Picker.Item label='Jos Electric' value={'JEDC,Jos Electric'} />
                            <Picker.Item label='Kaduna Electric' value={'KAEDC,Kaduna Electric'} />
                            <Picker.Item label='Kano Electric' value={'KEDC,Kano Electric'} />
                            <Picker.Item label='Port Harcourt Electric' value={'PhED,Port Harcourt Electric'} />
                        </Picker>
                        {discoError !== null ? (
                            <>
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{discoError}</Text>
                            </>
                        ) : null}
                    </View>

                    <View>
                        <Text style={styles.text}>Meter Type </Text>
                        <Picker
                            selectedValue={meterType}
                            onValueChange={(itemValue, itemIndex) =>
                                setMeterType(itemValue)
                            }
                            style={styles.inPut}
                        >
                            <Picker.Item label='Select' value={''} />
                            <Picker.Item label='Prepaid' value={'PRE'} />
                            <Picker.Item label='Postpaid' value={'POST'} />
                        </Picker>
                        {meterError !== null ? (
                            <>
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{meterError}</Text>
                            </>
                        ) : null}
                    </View>

                    <View>
                        <Text style={styles.text}>
                            Meter Number
                        </Text>
                        <View style={{ width: '100%', alignSelf: 'center', marginTop: 15 }}>
                            <Octicons name="number" size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                                placeholder={'Meter Number'}
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
                    </View>

                    <View>
                        {validated ? (
                            <>
                                <Text style={styles.text}>
                                    Customer Name
                                </Text>

                                <View style={{ width: '100%', alignSelf: 'center', marginTop: 15 }}>
                                    <AntDesign name="user" size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                                        value={customerName}
                                        autoCorrect={false}
                                        placeholder={'Customer Name'}
                                        autoComplete='off'
                                        importantForAutofill={'no'}
                                        readOnly={true}
                                    />
                                </View>
                            </>
                        ) : null}
                    </View>

                    <View>
                        <Text style={styles.text}>
                            Amount
                        </Text>

                        <View style={{ marginTop: 15 }}>
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
                                        if (text < 1000) {
                                            setAmount(text);
                                            setAmountError('Minimum amount is 1000NGN');
                                        } else {
                                            setAmount(text);
                                            setAmountError(null);
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
                    </View>

                    <View>
                        <Text style={styles.text}>
                            Transaction Pin
                        </Text>
                        <View style={{ width: '100%', alignSelf: 'center', marginTop: 15, flex: 0, height: 50 }}>
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
                            <SuccessBox message={error} />
                        ) : null}
                    </View>


                    {error !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{error}</Text>
                        </>
                    ) : null}

                    <View>
                        {!validated ? (
                            <SubmitButton
                                loading={loading}
                                disabled={loading}
                                title={'Validate Meter Number'}
                                handleSubmit={
                                    () => {
                                        validateMeterNumber()
                                    }
                                }
                            />
                        ) : (
                            <SubmitButton
                                loading={loading}
                                disabled={loading}
                                title={'Confirm'}
                                handleSubmit={
                                    () => {
                                        purchaseDisco()
                                    }
                                }
                            />
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Electricity

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
        flex: 1,
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
    inPut: {
        borderWidth: 0,
        height: 48,
        backgroundColor: 'rgba(0,0,0, 0.03)',
        padding: 5,
        paddingLeft: 35,
        borderRadius: 8,
        fontWeight: '700',
        fontSize: 16,
        color: "rgba(0,0,0,0.3)"
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


