import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import { Picker } from '@react-native-picker/picker';

const Dropdown = ({ data, title, selected, setSelected, fetching }) => {
    const pickerRef = useRef();

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }
    if (fetching) {
        return (
            <>
                <Text style={styles.text}>{title}</Text>
                <View style={styles.box}>
                    <ActivityIndicator color={'#004aad'} />
                </View>
            </>
        );
    }

    return (
        <View>
            <Text style={styles.text}>{title}</Text>
            <View style={styles.box}>
                <Picker
                    ref={pickerRef}
                    selectedValue={selected}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelected(itemValue)
                    }
                    style={styles.inPut}>
                    <Picker.Item label={'Select'} value={" ,0"} />
                    {
                        data.map((item, index) => {
                            return <Picker.Item value={`${item.dataPlan},${item.price},${item.duration}`} label={`${item.dataPlan} ${item.type} ${item.duration} - ${item.price}`} key={index} />
                        })
                    }
                </Picker>
            </View>
        </View>
    )
}

export default Dropdown

const styles = StyleSheet.create({
    box: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 15,
        flex: 0,
        height: 50
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
})