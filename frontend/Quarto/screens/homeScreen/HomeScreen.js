import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableNativeFeedback, TouchableOpacity, TextInput, Image, Keyboard, TouchableHighlight, AsyncStorage, Alert, YellowBox, ActivityIndicator } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Myicon from 'react-native-vector-icons/Feather'
import Fetch from '../../helpers/Helper'
import Logout from 'react-native-vector-icons/MaterialCommunityIcons'
import { Rating } from 'react-native-elements';
import io from 'socket.io-client';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFocused: false,
            thriller_books: [],
            horror_books: [],
            mystery_books: [],
            suspense_books: [],
            fiction_books: [],
            crime_books: [],
            crime_id: '5c56d7d843dbba10e45eb008',
            fiction_id: '5c56d7e943dbba10e45eb00a',
            mystery_id: '5c56d81543dbba10e45eb00f',
            suspense_id: '5c56d85943dbba10e45eb017',
            thriller_id: '5c56d87343dbba10e45eb01a',
            horror_id: '5c56d80043dbba10e45eb00d',
            romance_id: '5c56d84543dbba10e45eb014',
            romance_books: [],
            token: false,
            searchText: '',
            searchBooks: [],
            recommended_books: [],
            loader: true,
            searchLoader: false
        };
    }

    getRomance = () => {

        Fetch.post('books/get-limited/8', { book_category: this.state.romance_id }).then(res => {

            if (res.response) {
                this.setState({
                    romance_books: res.books
                })
            }
        })
    }
    getRecommended = async () => {
        const token = await AsyncStorage.getItem('token')

        Fetch.post('training/book-recommendation', {}, token).then(res => {

            if (res.response) {
                this.setState({
                    recommended_books: res.books
                })

            }
        })
    }
    nextSearch = async (id, genres) => {
        const token = await AsyncStorage.getItem('token')
        if (token == null) {
            this.props.navigation.navigate('Login');
        }
        else {
            Fetch.post('training/search', { book_id: id, genres: genres }, token).then(res => {
            })
            this.props.navigation.navigate('BookDetail', {
                id: id
            })
        }
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
    getToken = async () => {
        const token = await AsyncStorage.getItem('token')
        if (token != null) {
            this.setState({
                token: true
            })
        }
        else {
            this.setState({
                token: false
            })
        }
    }
    getThriller = () => {
        Fetch.post('books/get-limited/8', { book_category: this.state.thriller_id }).then(res => {
            if (res.response) {
                this.setState({
                    thriller_books: res.books
                })
            }
        })
    }
    getHorror = () => {
        Fetch.post('books/get-limited/8', { book_category: this.state.horror_id }).then(res => {
            if (res.response) {
                this.setState({
                    horror_books: res.books
                })
            }
        })
    }
    getSuspense = () => {
        Fetch.post('books/get-limited/8', { book_category: this.state.suspense_id }).then(res => {
            if (res.response) {
                this.setState({
                    suspense_books: res.books
                })
            }
        })
    }
    getMystery = () => {

        Fetch.post('books/get-limited/8', { book_category: this.state.mystery_id }).then(res => {

            if (res.response) {
                this.setState({
                    mystery_books: res.books
                })
            }
        })
    }
    getFiction = () => {

        Fetch.post('books/get-limited/8', { book_category: this.state.fiction_id }).then(res => {
            if (res.response) {
                this.setState({
                    fiction_books: res.books
                })
            }
        })
    }
    setValue = (value) => {
        this.setState({
            searchText: value,
            searchloader: true
        })
        Fetch.post('books/get-by-search', { text: value }).then(res => {
            if (res.response) {
                this.setState({
                    searchBooks: res.books,
                    searchloader: false
                })
            }
        })

    }
    getCrime = () => {

        Fetch.post('books/get-limited/8', { book_category: this.state.crime_id }).then(res => {

            if (res.response) {
                this.setState({
                    crime_books: res.books,
                    loader: false
                })
            }
        })
    }
    deleteToken = async () => {
        Alert.alert(
            'Logout!!',
            'Are you sure to logout??',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        AsyncStorage.removeItem('token');
                        this.setState({
                            token: false
                        })
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Home' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                    }
                },
            ],
            { cancelable: false }
        )
    }
    reset = () => {
        this.setState({
            searchText: ''
        })
    }
    componentDidMount() {
        this.getRomance();
        this.getSuspense();
        this.getFiction();
        this.getMystery();
        this.getThriller();
        this.getHorror();
        this.getCrime();
        this.getToken();
        this.setState({
            loader: false
        })
        const socket = io(Fetch.Base_URL);
        socket.on("connect", () => {
            this.getRecommended();
            console.log("yes")

        })
        socket.on("fetch_recommended_books", () => {
            this.getRecommended()
            console.log("no")

        })
        socket.on("disconnect", () => {

        })
        this.setState({
            loader: false
        })
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
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginRight: 2 }}>
                                                {
                                                    this.state.searchText != '' ?
                                                        <View style={{ width: 75, justifyContent: 'flex-start', flexDirection: 'row' }}>
                                                            <TouchableOpacity onPress={this.reset}>
                                                                <Icon name="arrow-back" size={30} color="black" />
                                                            </TouchableOpacity>
                                                            <Image source={require('../../images/logo.png')} style={{ width: 150, height: 35, resizeMode: 'center' }} />

                                                        </View>

                                                        :
                                                        <View style={{ width: 75, justifyContent: 'flex-start', flexDirection: 'row' }}>
                                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryList')} >
                                                                <Image source={require('../../images/categories.png')} style={{ width: 30, height: 30, resizeMode: 'center', marginTop: 4, marginLeft: 4 }} />
                                                            </TouchableOpacity>
                                                            <Image source={require('../../images/logo.png')} style={{ width: 150, height: 35, resizeMode: 'center' }} />

                                                        </View>

                                                }

                                                {
                                                    this.state.searchText == '' && this.state.token ?
                                                        (
                                                            <View style={{ width: 75, justifyContent: 'space-between', flexDirection: 'row' }}>
                                                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('Bookmarks')}>
                                                                    <Icon name="collections-bookmark" size={30} color="black" style={{ marginTop: 4 }} />

                                                                </TouchableOpacity>
                                                                <Logout name="logout" size={30} color="black" style={{ marginTop: 4 }} onPress={() => { this.deleteToken() }} />
                                                            </View>
                                                        ) : (<View>
                                                            {
                                                                this.state.token ? (<View></View>) :
                                                                    <Myicon name="user" size={30} color="black" style={{ marginTop: 4, marginRight: 4 }} onPress={() => this.props.navigation.navigate('Login')} />
                                                            }
                                                        </View>)
                                                }
                                            </View>

                                        </View>
                                    </View>
                                    <View style={styles.row2}>
                                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                                            <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                                <View style={{ flex: 0.95, flexDirecction: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', borderRadius: 10, borderColor: 'transparent', borderWidth: 1, backgroundColor: 'rgb(241,243,242)' }}>
                                                        <View style={{ alignSelf: 'center', paddingLeft: 2 }}>
                                                            <Icon name='search' color="rgb(113,117,128)" size={23} style={{ paddingLeft: 10 }} />
                                                        </View>
                                                        <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, alignSelf: 'center' }}>
                                                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                                                <TextInput placeholderTextColor="rgb(113,117,128)" style={styles.email} placeholder="Search"
                                                                    returnKeyType='search'
                                                                    value={this.state.searchText}
                                                                    onChangeText={(searchText) => this.setState({ searchText })}
                                                                    onSubmitEditing={(event) => { this.setValue(event.nativeEvent.text) }} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    {
                                        this.state.searchText != '' ? (
                                            <View style={styles.row2}>
                                                <ScrollView>
                                                    {
                                                        this.state.searchLoader ? <View style={{
                                                            container: {
                                                                flex: 1,
                                                                flexDirection: 'column',
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}>
                                                            <ActivityIndicator size="large" color="rgb(14,130,167)" style={{ alignSelf: 'center' }} />
                                                        </View> : <View></View>
                                                    }
                                                    {
                                                        this.state.searchBooks.map((book, index) => {
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
                                                                                <TouchableNativeFeedback onPress={() => { this.nextSearch(book._id, book.book_genres) }}>
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
                                                </ScrollView>

                                            </View>
                                        )
                                            :
                                            (
                                                <View>
                                                    {
                                                        this.state.recommended_books.length == 0 ? <View></View> :
                                                            <View style={{ flex: 1, backgroundColor: this.state.searchFocused ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)" }}>
                                                                <View style={styles.row3}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15, marginTop: 25 }}>
                                                                        <View style={{ flex: 1, flexDirection: 'column', height: 50, justifyContent: 'space-around', borderBottomColor: 'rgb(219,219,219)', paddingBottom: 4 }}>
                                                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'space-between', justifyContent: 'space-between' }}>
                                                                                <Text style={{ fontSize: 28, fontWeight: "900", color: '#000', fontFamily: 'notoserif' }}>Recommended Books</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.row4}>

                                                                    <ScrollView horizontal={true}>
                                                                        {
                                                                            this.state.recommended_books.map((book, index) => {
                                                                                return (
                                                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }} key={index}>
                                                                                        <TouchableNativeFeedback onPress={() => { this.nextScreen(book._id) }}>
                                                                                            <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                                                <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                                                    <Image source={{ uri: Fetch.Base_URL + book.book_poster }} style={{ width: 140, height: 225, resizeMode: 'cover' }} />
                                                                                                </View>
                                                                                                <View style={{ height: 40, marginBottom: 15, width: 140, justifyContent: 'space-around', alignItems: 'center' }}>
                                                                                                    <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{book.book_name}</Text>
                                                                                                    <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{book.book_authors}</Text>
                                                                                                </View>
                                                                                            </View>
                                                                                        </TouchableNativeFeedback>
                                                                                    </View>
                                                                                )
                                                                            })
                                                                        }


                                                                    </ScrollView>
                                                                </View>
                                                            </View>
                                                    }

                                                    <View style={{ flex: 1, backgroundColor: this.state.searchFocused ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)" }}>
                                                        <View style={styles.row3}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15, marginTop: 25 }}>
                                                                <View style={{ flex: 1, flexDirection: 'column', height: 50, justifyContent: 'space-around', borderBottomColor: 'rgb(219,219,219)', paddingBottom: 4 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'space-between', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 28, fontWeight: "900", color: '#000', fontFamily: 'notoserif' }}>Romance</Text>
                                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BookCategory', {
                                                                            _id: this.state.romance_id,
                                                                            name: 'Romance'
                                                                        })}>
                                                                            <View>
                                                                                <Text style={{ fontSize: 19, fontWeight: "900", color: '#009cc6' }}>See More</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.row4}>

                                                            <ScrollView horizontal={true}>
                                                                {
                                                                    this.state.romance_books.map((book, index) => {
                                                                        return (
                                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }} key={index}>
                                                                                <TouchableNativeFeedback onPress={() => { this.nextScreen(book._id) }}>
                                                                                    <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                                        <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                                            <Image source={{ uri: Fetch.Base_URL + book.book_poster }} style={{ width: 140, height: 225, resizeMode: 'cover' }} />
                                                                                        </View>
                                                                                        <View style={{ height: 40, marginBottom: 15, width: 140, justifyContent: 'space-around', alignItems: 'center' }}>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{book.book_name}</Text>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{book.book_authors}</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableNativeFeedback>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }


                                                            </ScrollView>
                                                        </View>
                                                    </View>

                                                    <View style={{ flex: 1, backgroundColor: this.state.searchFocused ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)" }}>
                                                        <View style={styles.row3}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15, marginTop: 25 }}>
                                                                <View style={{ flex: 1, flexDirection: 'column', height: 50, justifyContent: 'space-around', borderBottomColor: 'rgb(219,219,219)', paddingBottom: 4 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'space-between', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 28, fontWeight: "900", color: '#000', fontFamily: 'notoserif' }}>Suspense</Text>
                                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BookCategory', {
                                                                            _id: this.state.suspense_id,
                                                                            name: 'Suspense'
                                                                        })}>
                                                                            <View>
                                                                                <Text style={{ fontSize: 19, fontWeight: "900", color: '#009cc6' }}>See More</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.row4}>

                                                            <ScrollView horizontal={true}>
                                                                {
                                                                    this.state.suspense_books.map((book, index) => {
                                                                        return (
                                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }} key={index}>
                                                                                <TouchableNativeFeedback onPress={() => { this.nextScreen(book._id) }}>
                                                                                    <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                                        <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                                            <Image source={{ uri: Fetch.Base_URL + book.book_poster }} style={{ width: 140, height: 225, resizeMode: 'cover' }} />
                                                                                        </View>
                                                                                        <View style={{ height: 40, marginBottom: 15, width: 140, justifyContent: 'space-around', alignItems: 'center' }}>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{book.book_name}</Text>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{book.book_authors}</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableNativeFeedback>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }


                                                            </ScrollView>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, backgroundColor: this.state.searchFocused ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)" }}>
                                                        <View style={styles.row3}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15, marginTop: 25 }}>
                                                                <View style={{ flex: 1, flexDirection: 'column', height: 50, justifyContent: 'space-around', borderBottomColor: 'rgb(219,219,219)', paddingBottom: 4 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'space-between', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 28, fontWeight: "900", color: '#000', fontFamily: 'notoserif' }}>Thriller</Text>
                                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BookCategory', {
                                                                            _id: this.state.thriller_id,
                                                                            name: 'Thriller'
                                                                        })}>
                                                                            <View>
                                                                                <Text style={{ fontSize: 19, fontWeight: "900", color: '#009cc6' }}>See More</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.row4}>

                                                            <ScrollView horizontal={true}>
                                                                {
                                                                    this.state.thriller_books.map((book, index) => {
                                                                        return (
                                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }} key={index}>
                                                                                <TouchableNativeFeedback onPress={() => { this.nextScreen(book._id) }}>
                                                                                    <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                                        <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                                            <Image source={{ uri: Fetch.Base_URL + book.book_poster }} style={{ width: 140, height: 225, resizeMode: 'cover' }} />
                                                                                        </View>
                                                                                        <View style={{ height: 40, marginBottom: 15, width: 140, justifyContent: 'space-around', alignItems: 'center' }}>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{book.book_name}</Text>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{book.book_authors}</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableNativeFeedback>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }


                                                            </ScrollView>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, backgroundColor: this.state.searchFocused ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)" }}>
                                                        <View style={styles.row3}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15, marginTop: 25 }}>
                                                                <View style={{ flex: 1, flexDirection: 'column', height: 50, justifyContent: 'space-around', borderBottomColor: 'rgb(219,219,219)', paddingBottom: 4 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'space-between', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 28, fontWeight: "900", color: '#000', fontFamily: 'notoserif' }}>Crime</Text>
                                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BookCategory', {
                                                                            _id: this.state.crime_id,
                                                                            name: 'Crime'
                                                                        })}>
                                                                            <View>
                                                                                <Text style={{ fontSize: 19, fontWeight: "900", color: '#009cc6' }}>See More</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.row4}>

                                                            <ScrollView horizontal={true}>
                                                                {
                                                                    this.state.crime_books.map((book, index) => {
                                                                        return (
                                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }} key={index}>
                                                                                <TouchableNativeFeedback onPress={() => { this.nextScreen(book._id) }}>
                                                                                    <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                                        <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                                            <Image source={{ uri: Fetch.Base_URL + book.book_poster }} style={{ width: 140, height: 225, resizeMode: 'cover' }} />
                                                                                        </View>
                                                                                        <View style={{ height: 40, marginBottom: 15, width: 140, justifyContent: 'space-around', alignItems: 'center' }}>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{book.book_name}</Text>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{book.book_authors}</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableNativeFeedback>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }


                                                            </ScrollView>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, backgroundColor: this.state.searchFocused ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)" }}>
                                                        <View style={styles.row3}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15, marginTop: 25 }}>
                                                                <View style={{ flex: 1, flexDirection: 'column', height: 50, justifyContent: 'space-around', borderBottomColor: 'rgb(219,219,219)', paddingBottom: 4 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'space-between', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 28, fontWeight: "900", color: '#000', fontFamily: 'notoserif' }}>Fiction</Text>
                                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BookCategory', {
                                                                            _id: this.state.fiction_id,
                                                                            name: 'Fiction'
                                                                        })}>
                                                                            <View>
                                                                                <Text style={{ fontSize: 19, fontWeight: "900", color: '#009cc6' }}>See More</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.row4}>

                                                            <ScrollView horizontal={true}>
                                                                {
                                                                    this.state.fiction_books.map((book, index) => {
                                                                        return (
                                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }} key={index}>
                                                                                <TouchableNativeFeedback onPress={() => { this.nextScreen(book._id) }}>
                                                                                    <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                                        <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                                            <Image source={{ uri: Fetch.Base_URL + book.book_poster }} style={{ width: 140, height: 225, resizeMode: 'cover' }} />
                                                                                        </View>
                                                                                        <View style={{ height: 40, marginBottom: 15, width: 140, justifyContent: 'space-around', alignItems: 'center' }}>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{book.book_name}</Text>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{book.book_authors}</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableNativeFeedback>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }


                                                            </ScrollView>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, backgroundColor: this.state.searchFocused ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)" }}>
                                                        <View style={styles.row3}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15, marginTop: 25 }}>
                                                                <View style={{ flex: 1, flexDirection: 'column', height: 50, justifyContent: 'space-around', borderBottomColor: 'rgb(219,219,219)', paddingBottom: 4 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'space-between', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 28, fontWeight: "900", color: '#000', fontFamily: 'notoserif' }}>Mystery</Text>
                                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BookCategory', {
                                                                            _id: this.state.mystery_id,
                                                                            name: 'Mystery'
                                                                        })}>
                                                                            <View>
                                                                                <Text style={{ fontSize: 19, fontWeight: "900", color: '#009cc6' }}>See More</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.row4}>

                                                            <ScrollView horizontal={true}>
                                                                {
                                                                    this.state.mystery_books.map((book, index) => {
                                                                        return (
                                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }} key={index}>
                                                                                <TouchableNativeFeedback onPress={() => { this.nextScreen(book._id) }}>
                                                                                    <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                                        <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                                            <Image source={{ uri: Fetch.Base_URL + book.book_poster }} style={{ width: 140, height: 225, resizeMode: 'cover' }} />
                                                                                        </View>
                                                                                        <View style={{ height: 40, marginBottom: 15, width: 140, justifyContent: 'space-around', alignItems: 'center' }}>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{book.book_name}</Text>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{book.book_authors}</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableNativeFeedback>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }


                                                            </ScrollView>
                                                        </View>
                                                    </View>

                                                    <View style={{ flex: 1, backgroundColor: this.state.searchFocused ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)" }}>
                                                        <View style={styles.row3}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15, marginTop: 25 }}>
                                                                <View style={{ flex: 1, flexDirection: 'column', height: 50, justifyContent: 'space-around', borderBottomColor: 'rgb(219,219,219)', paddingBottom: 4 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'space-between', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 28, fontWeight: "900", color: '#000', fontFamily: 'notoserif' }}>Horror</Text>
                                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BookCategory', {
                                                                            _id: this.state.horror_id,
                                                                            name: 'Horror'
                                                                        })}>
                                                                            <View>
                                                                                <Text style={{ fontSize: 19, fontWeight: "900", color: '#009cc6' }}>See More</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.row4}>

                                                            <ScrollView horizontal={true}>
                                                                {
                                                                    this.state.horror_books.map((book, index) => {
                                                                        return (
                                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 8, paddingRight: 8 }} key={index}>
                                                                                <TouchableNativeFeedback onPress={() => { this.nextScreen(book._id) }}>
                                                                                    <View style={{ flex: 0.95, flexDirection: 'column', height: 285, justifyContent: 'flex-start' }}>
                                                                                        <View style={{ flex: 1, height: 225, alignSelf: 'center' }}>
                                                                                            <Image source={{ uri: Fetch.Base_URL + book.book_poster }} style={{ width: 140, height: 225, resizeMode: 'cover' }} />
                                                                                        </View>
                                                                                        <View style={{ height: 40, marginBottom: 15, width: 140, justifyContent: 'space-around', alignItems: 'center' }}>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: '500', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{book.book_name}</Text>
                                                                                            <Text style={{ alignSelf: 'center', fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">{book.book_authors}</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableNativeFeedback>
                                                                            </View>

                                                                        )
                                                                    })
                                                                }


                                                            </ScrollView>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                    }
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
        backgroundColor: '#fff'
    },
    parent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
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
        justifyContent: 'center',
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
        justifyContent: 'space-around',
        marginTop: 4,
    },
    row3:
    {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'flex-start',
        marginBottom: 15,
    },
    row4: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,

    },

})