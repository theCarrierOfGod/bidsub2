import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import Recent from '../components/dashboard/Recent'
import Balance from '../components/dashboard/Balance';
import { Feather } from '@expo/vector-icons';

const Dashboard = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <ScrollView
            style={{ backgroundColor: 'white' }}
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View
                style={{
                    backgroundColor: '#004aad',
                    height: 175,
                    width: '100%'
                }}>
                <Balance navigation={navigation} refreshing={refreshing} />
            </View>
            <View
                style={styles.billSection}
            >
                <View
                    style={styles.sectionHeader}
                >
                    <Text style={styles.rightHeadText}> Bills </Text>
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
            <View>
                <Recent refreshing={refreshing} />
            </View>
        </ScrollView>
    )
}

export default Dashboard

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
        borderWidth: 5,
        borderColor: '#000000',
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