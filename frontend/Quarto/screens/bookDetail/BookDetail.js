import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Image, Alert, AsyncStorage, TouchableOpacity, ActivityIndicator,TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MyIcon from 'react-native-vector-icons/FontAwesome5';
import CommentAdd from 'react-native-vector-icons/MaterialCommunityIcons'
import { Rating } from 'react-native-elements';
import Fetch from '../../helpers/Helper'
import io from 'socket.io-client';
export default class BookDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandText: false,
            bookmarkStatus: false,
            book: {},
            book_genres: [],
            input: {},
            reviews: [],
            loader: true,
            socket: false,
            real_time_review: [],
            socketio: io(Fetch.Base_URL)
        }


    }
    getBook = async () => {
        const token = await AsyncStorage.getItem('token')
        if (token == null) {
            const resetAction = StackActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                    NavigationActions.navigate({ routeName: 'Login' })
                ],
            });
            this.props.navigation.dispatch(resetAction);
        }
        else {
            Fetch.post('books/get-by-id', { book_id: this.props.navigation.state.params.id }, token).then(res => {
                if (res.response) {
                    this.setState({
                        book: res.book,
                        book_genres: Object.keys(res.book['book_genres']).join(),
                        input: res.book['book_genres'],
                        loader: false
                    })
                }
                else {
                    this.setState({
                        loader: false
                    })
                    if (res.msg == "Authorization Failed") {
                        const resetAction = StackActions.reset({
                            index: 1,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Home' }),
                                NavigationActions.navigate({ routeName: 'Login' })
                            ],
                        });
                        this.props.navigation.dispatch(resetAction);
                    }
                    else {
                        Alert.alert(res.msg)
                    }
                }
            })
        }
    }
    myBookmark = async () => {
        const token = await AsyncStorage.getItem('token')
        Fetch.post('bookmarks/add', { book_id: this.props.navigation.state.params.id, socket: this.state.socket }, token).then(res => {
            if (res.response) {
                if (res.deleted) {
                    this.setState({
                        bookmarkStatus: false
                    })
                }
                else {
                    this.setState({
                        bookmarkStatus: true
                    })
                }
            }
        })
    }
    getReviews = async (rate) => {
        const token = await AsyncStorage.getItem('token')
        Fetch.post('reviews/get', { book_id: this.props.navigation.state.params.id }, token).then(res => {
            if (res.response) {
                this.setState({
                    reviews: res.reviews
                })
            }
        })
    }
    myrating = async (rate) => {
        const token = await AsyncStorage.getItem('token')
        Fetch.post('books/book-rating', { book_id: this.props.navigation.state.params.id, book_rating: rate, genres: this.state.input }, token).then(res => {
            if (res.response) {
                Alert.alert("Thanks for rating!! ")
                this.getBook()
            }
        })
    }
    getBookmarkDetail = async () => {
        const token = await AsyncStorage.getItem('token')
        Fetch.post('bookmarks/check', { book_id: this.props.navigation.state.params.id }, token).then(res => {
            this.setState({
                bookmarkStatus: res.response
            })
        })
    }
    componentDidMount() {
        this.getBookmarkDetail();
        this.getBook();
        this.getReviews();
        this.state.socketio.on("fetch_reviews", (data) => {
            this.state.real_time_review.push(data)
            this.setState({
                real_time_review: this.state.real_time_review
            })
            console.log("no")

        })
        if (this.props.navigation.state.params.socket) {
            this.setState({
                socket: true
            })
        }

    }
    ratingCompleted = (rate) => {
        Alert.alert(
            'Rating!!',
            `Are you sure to give ${rate} rating to this book ??`,
            [
                { text: 'No', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        this.myrating(rate)
                    }
                },
            ],
            { cancelable: false }
        )
    }
    review = () => {
        this.props.navigation.navigate('Review', {
            book_id: this.props.navigation.state.params.id
        });
    }
    expand = () => {
        this.setState({
            expandText: !this.state.expandText
        })
    }
    bookmark = () => {
        this.setState({
            bookmarkStatus: !this.state.bookmarkStatus
        }, () => {
            this.myBookmark();
        })
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {
                        this.state.loader == true ?
                            <ActivityIndicator size="large" color="rgb(14,130,167)" style={{ alignSelf: 'center' }} /> : (
                                <ScrollView>
                                    <StatusBar backgroundColor="black" barStyle="light-content" />
                                    <View style={styles.parent}>
                                        <View style={styles.header}>
                                            <View style={{ flex: 0.96, flexDirection: 'column', justifyContent: 'center', }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginRight: 2 }}>
                                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                                        <Icon name="arrow-back" size={30} color="black" />
                                                    </TouchableOpacity>
                                                    {
                                                        this.state.bookmarkStatus ? (
                                                            <TouchableOpacity onPress={() => this.bookmark()}>
                                                                <Icon name="bookmark" size={30} color="black" />
                                                            </TouchableOpacity>
                                                        ) : (
                                                                <TouchableOpacity onPress={() => this.bookmark()}>
                                                                    <Icon name="bookmark-border" size={30} color="black" />
                                                                </TouchableOpacity>
                                                            )
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.row2}>
                                            <View style={{ flex: 0.4, flexDirection: 'column', height: 180, justifyContent: 'center', alignItems: 'center' }}>
                                                <Image source={{ uri: Fetch.Base_URL + this.state.book.book_poster }} style={{ alignSelf: 'center', resizeMode: 'center', height: 180, width: 160 }} />
                                            </View>
                                            <View style={{ flex: 0.58, flexDirection: 'column', height: 180, justifyContent: 'flex-start', marginTop: -10 }}>
                                                <View style={{ flex: 0.22, flexDirection: 'row', justifyContent: 'center' }}>
                                                    <View style={{ flex: 0.95, flexDirection: 'column', alignSelf: 'center' }}>
                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            <Text style={{ alignSelf: 'flex-end', fontSize: 19, fontWeight: '700', color: 'black' }} numberOfLines={1} ellipsizeMode="tail"> {this.state.book.book_name} </Text>
                                                        </View>

                                                    </View>
                                                </View>
                                                <View style={{ flex: 0.22, flexDirection: 'row', justifyContent: 'center' }}>
                                                    <View style={{ flex: 0.95, flexDirection: 'column', alignSelf: 'center' }}>
                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            <Text style={{ alignSelf: 'center', marginLeft: 3 }}>{this.state.book.book_authors} </Text>
                                                        </View>

                                                    </View>
                                                </View>
                                                <View style={{ flex: 0.12, flexDirection: 'row', justifyContent: 'center' }}>
                                                    <View style={{ flex: 0.95, flexDirection: 'column' }}>
                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            <Text style={{ fontSize: 14, fontWeight: '400', marginLeft: 3 }}>Avg. Rating:</Text>
                                                            <Rating
                                                                type="star"
                                                                style={{ alignSelf: 'center', marginTop: 2 }}
                                                                readonly={true}
                                                                ratingColor="#ffe8d8"
                                                                startingValue={this.state.book.book_rating}
                                                                ratingCount={5}
                                                                imageSize={13}
                                                                fractions={1}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={{ flex: 0.22, flexDirection: 'row', justifyContent: 'center' }}>
                                                    <View style={{ flex: 0.95, flexDirection: 'column', alignSelf: 'center' }}>
                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            <Text style={{ alignSelf: 'center', marginLeft: 3 }} numberOfLines={1} ellipsizeMode="tail">{this.state.book_genres}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 0.22, flexDirection: 'row', justifyContent: 'center' }}>
                                                    <View style={{ flex: 0.95, flexDirection: 'column', alignSelf: 'center' }}>
                                                        <View style={{
                                                            width: 90, height: 30, borderRadius: 15
                                                            , borderColor: 'transparent', backgroundColor: 'rgb(14,130,167)', elevation: 8, paddingTop: 1
                                                        }}>
                                                            <Text style={{ alignSelf: 'center', marginLeft: 3, color: 'white', alignSelf: 'center', marginTop: 3 }}>Read Book</Text>
                                                        </View>

                                                    </View>
                                                </View>
                                            </View>

                                        </View>

                                        <View style={styles.row4}>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 0.95, flexDirection: 'column', justifyContent: 'center' }}>
                                                    <Rating
                                                        type="star"
                                                        ratingColor="#ffe8d8"
                                                        startingValue={0}
                                                        imageSize={30}
                                                        fractions={1}
                                                        onFinishRating={this.ratingCompleted}
                                                    />

                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.row5}>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 19, fontWeight: '700', color: 'black', marginLeft: 10 }}>Introduction </Text>
                                                {
                                                    this.state.expandText ? (
                                                        <TouchableOpacity onPress={() => this.expand()}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                <Text style={{ fontSize: 16, alignSelf: 'center' }}>Less </Text>
                                                                <Icon name="arrow-drop-up" size={19} color="grey" style={{ marginRight: 10, alignSelf: 'center', marginTop: 2 }} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    ) : (
                                                            <TouchableOpacity onPress={() => this.expand()}>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                    <Text style={{ fontSize: 16, alignSelf: 'center' }}>Expand </Text>
                                                                    <Icon name="arrow-drop-down" size={19} color="grey" style={{ marginRight: 10, alignSelf: 'center', marginTop: 2 }} />
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                }


                                            </View>
                                            {
                                                this.state.expandText == true ? (
                                                    <View style={{ paddingLeft: 10, paddingRight: 15, justifyContent: 'space-evenly', marginTop: 10 }}>
                                                        <Text >{this.state.book.book_des}</Text>
                                                    </View>
                                                ) : (
                                                        <View style={{ paddingLeft: 10, paddingRight: 15, justifyContent: 'space-evenly', marginTop: 10, }}>
                                                            <Text numberOfLines={4} ellipsizeMode="tail" >{this.state.book.book_des}</Text>
                                                        </View>
                                                    )
                                            }

                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 8, marginBottom: 3 }}>
                                            <View style={{ flex: 0.96, flexDirection: 'column', alignSelf: 'center', height: 1, backgroundColor: 'rgb(223,223,223)' }}>
                                            </View>
                                        </View>
                                        <View style={styles.row5}>

                                            {
                                                this.state.reviews.length == 0 && this.state.real_time_review.length == 0 ? (
                                                    <TouchableNativeFeedback onPress={()=>{this.review()}}> 
                                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 8, marginBottom: 3 }}>
                                                        <View style={{ flex: 0.96, flexDirection: 'column', alignSelf: 'center', height: 40, marginLeft: 10 }}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                                                                <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', borderRadius: 28, elevation: 7, backgroundColor:"rgb(14,130,167)", height: 40 }} >
                                                                        <CommentAdd name="comment-plus" size={24} color="white" style={{alignSelf:'center'}} />
                                                                        <Text style={{ alignSelf: 'center', fontSize: 19, color: '#fff', fontFamily: 'notoserif',marginLeft:5 }}>GIVE YOUR REVIEW</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    </TouchableNativeFeedback>
                                                    

                                                ) :
                                                    (
                                                        <View>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                                                <Text style={{ fontSize: 19, fontWeight: '700', color: 'black', marginLeft: 10 }}>Reviews</Text>
                                                                <TouchableOpacity onPress={() => { this.review() }}>
                                                                    <Icon name="rate-review" size={30} color="black" style={{ marginRight: 12 }} />
                                                                </TouchableOpacity>

                                                            </View>
                                                            {
                                                                this.state.real_time_review.reverse().map((value, index) => {
                                                                    return (
                                                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 8 }} key={index}>
                                                                            <View style={{ flex: 0.9, flexDirection: 'column', alignSelf: 'flex-start' }}>
                                                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                                    <MyIcon name="user-circle" size={22} color="rgb(117,117,117)" style={{ alignSelf: 'center', marginTop: 10 }} />
                                                                                    <Text style={{ color: 'black', fontWeight: '400', marginLeft: 5, fontSize: 17, marginTop: 8 }}>{value.member_id.username}</Text>
                                                                                </View>
                                                                                <Text style={{ marginTop: 7 }} >{value.review}</Text>
                                                                            </View>

                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </View>
                                                    )
                                            }

                                            {
                                                this.state.reviews.map((value, index) => {
                                                    return (
                                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 8 }} key={index}>
                                                            <View style={{ flex: 0.9, flexDirection: 'column', alignSelf: 'flex-start' }}>
                                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                    <MyIcon name="user-circle" size={22} color="rgb(117,117,117)" style={{ alignSelf: 'center', marginTop: 10 }} />
                                                                    <Text style={{ color: 'black', fontWeight: '400', marginLeft: 5, fontSize: 17, marginTop: 8 }}>{value.member_id.username}</Text>
                                                                </View>
                                                                <Text style={{ marginTop: 7 }} >{value.review}</Text>
                                                            </View>

                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>


                                    </View>
                                </ScrollView>
                            )}
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
        justifyContent: 'center'
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
        marginTop: 14,
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
        marginTop: 10,
        marginBottom: 10
    }
})
