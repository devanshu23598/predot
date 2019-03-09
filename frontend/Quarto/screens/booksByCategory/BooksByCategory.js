import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, SafeAreaView, Image, TouchableNativeFeedback, AsyncStorage, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackActions, NavigationActions } from 'react-navigation';
import { Rating } from 'react-native-elements';
import Fetch from '../../helpers/Helper'
export default class BooksByCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.navigation.state.params._id,
            books: [],
            loader:true
        }
    }
    getBooks = () => {
        Fetch.post('books/get-all', { book_category: this.state.id }).then(res => {
            if (res.response) {
                this.setState({
                    books: res.books,
                    loader:false
                })
            }
        })
    }
    componentDidMount() {
        this.getBooks();
    }
    nextScreen = async (id) => {
        const token = await AsyncStorage.getItem('token')
        if (token == null) {
            this.props.navigation.navigate('Login');
        }
        else {
            this.props.navigation.navigate('BookDetail', {
                id: id
            })
        }
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {
                        this.state.loader == true ?
                            <ActivityIndicator size="large" color="rgb(14,130,167)" style={{ alignSelf: 'center' }} /> :
                            <ScrollView>
                                <StatusBar backgroundColor="black" barStyle="light-content" />

                                <View style={styles.parent}>
                                    <View style={styles.header}>
                                        <View style={{ flex: 0.96, flexDirection: 'column', justifyContent: 'center' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, marginRight: 2 }}>
                                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                                    <Icon name="arrow-back" size={30} color="black" />
                                                </TouchableOpacity>
                                                <Text style={{ fontSize: 23, fontWeight: '700', color: '#000', marginLeft: 10 }}>{this.props.navigation.state.params.name}</Text>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={styles.row2}>
                                        {
                                            this.state.books.map((book, index) => {
                                                return (
                                                    <View style={{ flex: 1, flexDirection: 'row', height: 120, justifyContent: 'center', alignItems: 'center', marginTop: 20 }} key={index}>
                                                        <View style={{ flex: 1, flexDirection: 'column', height: 120, }}>
                                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                                <View style={{ flex: 0.28 }}>
                                                                    <View style={{ width: 100, height: 120 }}>
                                                                        <Image source={{ uri: Fetch.Base_URL + book.book_poster }} style={{ width: 100, height: 120, resizeMode: 'center' }} />
                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.52 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', marginTop: 10 }}>
                                                                        <Text style={{ fontSize: 16, color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{book.book_name}</Text>
                                                                        <Text style={{ fontSize: 12, marginTop: 5 }}>By {book.book_authors}</Text>
                                                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10 }}>
                                                                            <Rating
                                                                                type="star"
                                                                                readonly={true}
                                                                                startingValue={book.book_rating}
                                                                                ratingCount={5}
                                                                                imageSize={15}
                                                                                fractions={1}
                                                                            />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.2, }}>
                                                                    <TouchableNativeFeedback onPress={() => { this.nextScreen(book._id) }}>
                                                                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center', marginTop: 10, marginRight: 8 }}>
                                                                            <View style={{ height: 30, borderRadius: 15, borderColor: '#009cc6', borderWidth: 2 }}>
                                                                                <Text style={{ alignSelf: 'center', color: 'black', marginTop: 3 }}>View</Text>
                                                                            </View>
                                                                        </View>
                                                                    </TouchableNativeFeedback>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                    }

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
        justifyContent: 'center',
        marginBottom:5
    },

    parent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    email:
    {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'sans-serif-thin'
    },
    row1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    row2: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: 2,
        marginBottom:15

    },
    header: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    row3:
    {
        flex: 1,
        flexDirection: 'row',
        height: 30,
        justifyContent: 'space-around',
    },
    row4: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 15,
    },
    row5: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 10
    }
})