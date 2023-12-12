import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import SubmitButton from '../constants/SubmitButton';
import axios from 'axios';
import query from '../constants/query';
import CableDropDown from '../components/services/CableDropDown';
import { useIsFocused } from '@react-navigation/native';
import SuccessBox from '../components/SuccessBox';

const Cable = ({ navigation }) => {
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

    const [error, setError] = useState(null)

    const [validated, setValidated] = useState(false);
    const [customerName, setCustomerName] = useState(null);

    const [CablePlan, setCablePlan] = useState('');
    const [CableList, setCableList] = useState([]);
    const [cableType, setCableType] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [planName, setPlanName] = useState('');

    const planChanges = (text) => {
        const myArray = text.split(",");
        setCablePlan(text)
        setPlanName(myArray[0]);
        setAmount(myArray[1]);
        setCableType(myArray[2]);
    }

    const changeSelection = async (type) => {
        setSelectedError(null);
        setValidated(false);
        fetchNow(type);
        setSelected(type);
        setCustomerName(null)
    }

    const fetchNow = async (selected) => {
        setFetching(true)
        try {
            const response = await axios.get(`${query.baseUrl}plans/${selected}`);
            if (response.data.plans) {
                setCableList(response.data.plans)
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

    useEffect(() => {
        getUsername();
    }, [isFocused])

    const validateIUC = async () => {
        setLoading(true);
        setSelectedError(null);
        setNumberError(null);

        if (selected.length === 0) {
            setSelectedError('Please choose a network');
            setLoading(false);
            return
        }

        if (number.length === 0) {
            setNumberError('Enter a valid IUC number');
            setLoading(false);
            return
        }

        const data = {
            service: selected,
            smartNumber: number,
        }
        try {
            const response = await axios.post(`${query.baseUrl}validate/cable`, data);
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

    const purchaseCable = async () => {
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
            setNumberError('Enter IUC Number')
            setLoading(false);
            return
        }

        if (!validated) {
            setNumberError('Invalid IUC Number')
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

        const message = `${planName} valid for ${addition} on ${number} (${selected})`;

        const data = {
            amount: amount,
            network: selected,
            number: number,
            pin: pin,
            username: username,
            plan: planName
        }
        try {
            const response = await axios.post(`${query.baseUrl}purchase/cable`, data);
            if (response.data.success) {
                AsyncStorage.setItem('tid', response.data.tid);
                navigation.navigate('CableReceipt', {
                    amount: amount,
                    selected: selected,
                    number: number,
                    plan: planName,
                    type: cableType
                })
            } else {
                if (response.data.error.source === 'pin') {
                    setPinError(response.data.error.message);
                }
                if (response.data.error.source === 'amount') {
                    setAmountError(response.data.error.message);
                }
                if (response.data.error.source === 'iuc') {
                    setNumberError(response.data.error.message);
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
                        Select a cable network
                    </Text>

                    <View style={styles.networkBox}>
                        <View style={styles.eachNetwork}>
                            <Pressable
                                onPress={() => {
                                    changeSelection('dstv')
                                }}
                            >
                                <Image
                                    source={require('../assets/images/dstv.png')}
                                    style={styles.networkIcon}
                                />
                            </Pressable>
                            {selected === 'dstv' ? <AntDesign name="checkcircleo" size={18} style={styles.selectedNetwork} color="black" /> : null}
                        </View>
                        <View>
                            <Pressable
                                onPress={() => {
                                    changeSelection('gotv')
                                }}
                            >
                                <Image
                                    source={require('../assets/images/gotv.png')}
                                    style={styles.networkIcon}
                                />
                            </Pressable>
                            {selected === 'gotv' ? <AntDesign name="checkcircleo" size={18} style={styles.selectedNetwork} color="black" /> : null}
                        </View>
                        <View>
                            <Pressable
                                onPress={() => {
                                    changeSelection('startimes')
                                }}
                            >
                                <Image
                                    source={require('../assets/images/startimes.png')}
                                    style={styles.networkIcon}
                                />
                            </Pressable>
                            {selected === 'startimes' ? <AntDesign name="checkcircleo" size={18} style={styles.selectedNetwork} color="black" /> : null}
                        </View>
                    </View>

                    {selectedError !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 20, marginLeft: 15 }} >{selectedError}</Text>
                        </>
                    ) : null}

                    <CableDropDown data={CableList} title="Cable Plan" selected={CablePlan} setSelected={planChanges} fetching={fetching} />

                    <Text style={styles.text}>
                        IUC Number
                    </Text>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 15 }}>
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
                            placeholder={'IUC Number'}
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

                    {validated ? (
                        <>
                            <Text style={styles.text}>
                                Customer Name
                            </Text>

                            <View style={{ width: '90%', alignSelf: 'center', marginTop: 15 }}>
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
                                    inputMode={'numeric'}
                                    placeholder={'Amount'}
                                    autoComplete='off'
                                    importantForAutofill={'no'}
                                    readOnly={true}
                                />
                            </View>
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
                    {!validated ? (
                        <SubmitButton
                            loading={loading}
                            disabled={loading}
                            title={'Validate User'}
                            handleSubmit={
                                () => {
                                    validateIUC()
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
                                    purchaseCable()
                                }
                            }
                        />
                    )}
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Cable

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