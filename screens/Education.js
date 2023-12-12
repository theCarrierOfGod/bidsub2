import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CableDropDown from '../components/services/CableDropDown';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import query from '../constants/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubmitButton from '../constants/SubmitButton';
import { useIsFocused } from '@react-navigation/native';
import SuccessBox from '../components/SuccessBox';

const Education = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [selected, setSelected] = useState('');
    const [selectedError, setSelectedError] = useState('');
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState(null)
    const [fetching, setFetching] = useState(false);
    const [pin, setPin] = useState('');
    const [seePin, setSeePin] = useState(false);
    const [pinError, setPinError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultPlan, setResultPlan] = useState('');
    const [resultList, setResultList] = useState([]);
    const [resultName, setResultName] = useState(null);
    const [error, setError] = useState(null)
    const [resultType, setResultType] = useState(null)


    const fetchNow = async (selected) => {
        setFetching(true)
        try {
            const response = await axios.get(`${query.baseUrl}plans/${selected}`);
            if (response.data.plans) {
                setResultList(response.data.plans)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                setFetching(false)
            }, 1000);
        }
    }

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

    const planChanges = (text) => {
        const myArray = text.split(",");
        setResultPlan(text)
        setResultName(myArray[0]);
        setAmount(myArray[1]);
        setResultType(myArray[2]);
    }

    const changeSelection = async (type) => {
        setSelectedError(null);
        fetchNow(type);
        setSelected(type);
    }

    const purchaseChecker = async () => {
        setLoading(true);
        setSelectedError(null);
        setAmountError(null);
        setPinError(null);

        setError(null)

        if (selected.length === 0) {
            setSelectedError('Please choose a network');
            setLoading(false);
            return
        }

        if (amount < 50) {
            setAmountError('Minimum Cable amount is #50')
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
            pin: pin,
            username: username,
            result: resultName
        }
        try {
            const response = await axios.post(`${query.baseUrl}purchase/edu`, data);
            if (response.data.success) {
                AsyncStorage.setItem('tid', response.data.tid);
                navigation.navigate('EduReceipt');
            } else {
                if (response.data.error.source === 'pin') {
                    setPinError(response.data.error.message);
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
            setLoading(false)
        }
    }

    useEffect(() => {
        getUsername();
    }, [isFocused])

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView
                style={{
                    flex: 0,
                    width: '95%',
                    marginHorizontal: '2.5%',
                    marginBottom: 80
                }}>
                <Text style={styles.text}>
                    Select exam body
                </Text>
                <View style={styles.eachNetwork}>
                    <Pressable
                        onPress={() => {
                            changeSelection('neco')
                        }}
                    >
                        <Image
                            source={require('../assets/images/neco.jpg')}
                            style={styles.networkIcon}
                        />
                    </Pressable>
                    {selected === 'dstv' ? <AntDesign name="checkcircleo" size={18} style={styles.selectedNetwork} color="black" /> : null}
                </View>
                {selectedError !== null ? (
                    <>
                        <Text style={{ color: 'red', fontSize: 12, marginTop: 20, marginLeft: 15 }} >{selectedError}</Text>
                    </>
                ) : null}

                <CableDropDown data={resultList} title="Result Checker" selected={resultPlan} setSelected={planChanges} fetching={fetching} />

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
                        readOnly={true}
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
                            purchaseChecker()
                        }
                    }
                />

            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Education

const styles = StyleSheet.create({
    container: {
        flex: 0,
        height: "100%",
        marginTop: 12,
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
        marginHorizontal: 10,
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
    }
}) 