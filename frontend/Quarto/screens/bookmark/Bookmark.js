import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Image, Alert, AsyncStorage, TouchableOpacity, TouchableNativeFeedback, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fetch from '../../helpers/Helper';
import io from 'socket.io-client';
export default class Bookmarks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: [],
            oddBookmarks: [],
            evenBookmarks: []
        }

    }
    fetchBookmarks = async () => {
        this.setState({
            oddBookmarks: [],
            evenBookmarks: [],
            bookmarks: []
        })
        const token = await AsyncStorage.getItem('token')
        Fetch.post('bookmarks/get', {}, token).then(res => {
            if (res.response) {
                this.setState({
                    bookmarks: res.bookmarks
                }, () => {
                    this.divide();
                })
            }
        })
    }
    divide = () => {

        this.state.bookmarks.map((value, index) => {
            if (index % 2 == 0) {
                this.state.evenBookmarks.push(value);
                this.setState({
                    evenBookmarks: this.state.evenBookmarks
                })
            }
            else {
                this.state.oddBookmarks.push(value);
                this.setState({
                    oddBookmarks: this.state.oddBookmarks
                })
            }
        })
    }
    componentDidMount = () => {
        this.fetchBookmarks();
        const socket = io(Fetch.Base_URL);
        socket.on("fetch_bookmark", () => {
            this.fetchBookmarks()
            console.log("no")

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
                                        <Text style={{ fontSize: 23, fontWeight: '700', color: 'black', marginLeft: 4, alignSelf: 'center' }}>Bookmarks</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {
                            this.state.bookmarks.length === 0 ? (<View style={{flex:1,flexDirection:"row",justifyContent:'center',alignItems:'center',marginTop:100}}>
                                <View style={{  flex:0.98,  flexDirection: 'column', justifyContent: 'center' ,height:250,alignSelf:'center'}}>
                                    <Image source={require('../../images/no_result.png')} style={{width:200,height:110,resizeMode:'cover',alignSelf:'center'}}/>
                                    <Text style={{alignSelf:'center',marginTop:14}}>No bookmarks found</Text>
                                    
                                </View>
                            </View>) : (
                                <View style={styles.row2}>
                                    <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                        {
                                            this.state.evenBookmarks.map((value, i) => {
                                                return (
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 8, paddingRight: 8, marginTop: 10 }} key={i}>
                                                        <TouchableNativeFeedback onPress={() => {
                                                            this.props.navigation.navigate('BookDetail', {
                                                                id: value.book_id._id,
                                                                socket: true
                                                            })
                                                        }}>
                                                            <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                    <Image source={{ uri: Fetch.Base_URL + value.book_id.book_poster }} style={{ width: 160, height: 225, resizeMode: 'cover' }} />
                                                                </View>
                                                                <View style={{ height: 40, marginBottom: 15, width: 160, justifyContent: 'space-around', alignItems: 'center' }}>
                                                                    <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{value.book_id.book_name}</Text>
                                                                    <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{value.book_id.book_authors}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableNativeFeedback>
                                                    </View>
                                                )

                                            })
                                        }

                                    </View>
                                    <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                        {
                                            this.state.oddBookmarks.map((value, i) => {
                                                return (
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 8, paddingRight: 8, marginTop: 10 }} key={i}>
                                                        <TouchableNativeFeedback onPress={() => {
                                                            this.props.navigation.navigate('BookDetail', {
                                                                id: value.book_id._id,
                                                                socket: true
                                                            })
                                                        }}>
                                                            <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                    <Image source={{ uri: Fetch.Base_URL + value.book_id.book_poster }} style={{ width: 160, height: 225, resizeMode: 'cover' }} />
                                                                </View>
                                                                <View style={{ height: 40, marginBottom: 15, width: 160, justifyContent: 'center', alignItems: 'center' }}>

                                                                    <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black', marginLeft: 10 }} numberOfLines={1} ellipsizeMode="tail">{value.book_id.book_name}</Text>
                                                                    <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{value.book_id.book_authors}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableNativeFeedback>
                                                    </View>
                                                )

                                            })
                                        }

                                    </View>
                                </View>
                            )
                        }

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