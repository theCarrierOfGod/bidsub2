import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';

export default function Bills({ navigation }) {
    const data = ([
        {
            title: 'Airtime',
            icon: 'phone-call',
            link: 'Airtime',
        },
        {
            title: 'Data',
            icon: 'wifi',
            link: 'Data',
        },
        {
            title: 'More',
            icon: 'more-horizontal',
            link: 'Services',
        },
    ]);

    return (
        <View
            style={styles.billSection}
        >
            <View
                style={styles.sectionHeader}
            >
                <Text style={styles.rightHeadText}> Bills </Text>
                <Pressable
                    onPress={() => {
                        navigation.navigate('Services')
                    }}
                >
                    <Text style={styles
                        .link}
                    >
                        See all
                    </Text>
                </Pressable>
            </View>
            <View style={styles.sectionBody}>
                <Pressable
                    onPress={() => {
                        navigation.navigate('Airtime')
                    }}
                >
                    <View style={styles.item}>
                        <Feather name={'phone-call'} size={24} style={styles.itemIcom} color="white" />
                        <Text style={styles.itemTitle}>{'Airtime'}</Text>
                    </View>
                </Pressable >
                <Pressable
                    onPress={() => {
                        navigation.navigate('Data')
                    }}
                >
                    <View style={styles.item}>
                        <Feather name={'wifi'} size={24} style={styles.itemIcom} color="white" />
                        <Text style={styles.itemTitle}>{'Data'}</Text>
                    </View>
                </Pressable >
                <Pressable
                    onPress={() => {
                        navigation.navigate('Cable')
                    }}
                >
                    <View style={styles.item}>
                        <Feather name={'tv'} size={24} style={styles.itemIcom} color="white" />
                        <Text style={styles.itemTitle}>{'Cable'}</Text>
                    </View>
                </Pressable >
                <Pressable
                    onPress={() => {
                        navigation.navigate('Services')
                    }}
                >
                    <View style={styles.item}>
                        <Feather name={'more-horizontal'} size={24} style={styles.itemIcom} color="white" />
                        <Text style={styles.itemTitle}>{'More'}</Text>
                    </View>
                </Pressable >
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    billSection: {
        flex: 0,
        padding: 10
    },
    sectionBody: {
        marginVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    link: {
        color: 'grey',
        fontFamily: 'monospace',
        fontSize: 15
    },
    rightHeadText: {
        fontSize: 20,
        fontFamily: 'Rubik-Bold'
    },
    item: {
        minHeight: 100,
        minWidth: 100,
        width: '30%',
        backgroundColor: '#000022',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000022',
        margin: 5,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemIcom: {
        marginVertical: 12,
    },
    itemTitle: {
        color: 'white',
        fontFamily: 'Ubuntu-Medium'
    }
})