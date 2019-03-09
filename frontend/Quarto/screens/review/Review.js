import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Dimensions, Alert,TextInput, TouchableNativeFeedback,AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fetch from '../../helpers/Helper';

export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }


    }
    saveReview = async () => {
        const token = await AsyncStorage.getItem('token')
        Fetch.post('reviews/add', { book_id: this.props.navigation.state.params.book_id, review: this.state.text }, token).then(res => {
            if (res.response) {
                Alert.alert("Thanks for your review ");
                this.props.navigation.navigate('BookDetail')
            }
        })
    }



    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <StatusBar backgroundColor="black" barStyle="light-content" />


                    <ScrollView>
                        <View style={styles.parent}>
                            <View style={styles.header}>
                                <View style={{ flex: 0.98, flexDirection: 'column', justifyContent: 'center', height: 50 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 2, marginRight: 2, alignItems: 'center', height: 50 }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                            <Icon name="arrow-back" size={30} color="black" style={{ alignSelf: 'center' }} />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 23, fontWeight: '700', color: 'black', marginLeft: 4, alignSelf: 'center' }}>Review</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row2}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                                <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <View style={{ flex: 0.95, flexDirecction: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', borderRadius: 10, borderColor: 'transparent', borderWidth: 1, backgroundColor: 'rgb(241,243,242)' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, alignSelf: 'flex-start' }}>
                                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                                    <TextInput placeholderTextColor="rgb(113,117,128)" style={{ fontSize: 14, color: '#000', fontWeight: 'bold', justifyContent: 'flex-start', textAlignVertical: 'top' }} placeholder="Your reviews"
                                                        multiline={true}
                                                        numberOfLines={10}
                                                        value={this.state.searchText}
                                                        onChangeText={(text) => this.setState({ text })} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {
                                    this.state.text != '' ? (
                                        <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                            <View style={{ flex: 0.95, flexDirecction: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                                                    <TouchableNativeFeedback onPress={()=>{this.saveReview()}} >
                                                        <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', borderRadius: 4, elevation: 7, backgroundColor: "#009cc6", height: 40 }} >
                                                            <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ alignSelf: 'center', fontSize: 19, color: '#fff', fontFamily: 'notoserif' }}>Submit</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableNativeFeedback>
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                            <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                                <View style={{ flex: 0.95, flexDirecction: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                                                            <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', borderRadius: 4, elevation: 7, backgroundColor: "#009cc6", height: 40,opacity: 0.35 }} >
                                                                <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ alignSelf: 'center', fontSize: 19, color: '#fff', fontFamily: 'notoserif' }}>Submit</Text>
                                                                </View>
                                                            </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                }


                            </View>
                        </View>
                    </ScrollView>



                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
    parent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',

        height: 50
    },
    email:
    {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
    header: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    row1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    row2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 4,
    },
    footer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'stretch',
    },
    row3:
    {
        flex: 1,
        flexDirection: 'row',
        height: 70,
        justifyContent: 'flex-start',
        marginBottom: 15

    },
    row4: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 40,
        marginTop: 10
    },
    row5: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 10
    }
})