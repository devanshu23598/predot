import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fetch from '../../helpers/Helper'
export default class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            loader: true
        }
    }
    
    getAllCategories = () => {
        Fetch.post('books/get-categories', {}).then(res => {
            if (res.response) {
                this.setState({
                    categories: res.categories,
                    loader:false
                })
            }
        }).catch(err => {
            Alert.alert(err)
        })
    }
    componentDidMount() {
        this.getAllCategories();
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
                                                <Text style={{ fontSize: 23, fontWeight: '700', color: '#000', marginLeft: 10 }}>Categories</Text>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={styles.row2}>
                                        {
                                            this.state.categories.map((category, index) => {
                                                if (this.state.categories.length - 1 == index) {
                                                    return (
                                                        <View style={{ flex: 1, flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }} key={index}>
                                                            <TouchableNativeFeedback onPress={() => this.props.navigation.navigate('BookCategory', {
                                                                _id: category._id,
                                                                name: category.category_name
                                                            })}>
                                                                <View style={{ flex: 0.94, flexDirection: 'column' }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between', }} >
                                                                        <View style={{ flex: 0.5, justifyContent: 'flex-end', paddingBottom: 3 }}>
                                                                            <Text style={{ fontSize: 18, color: 'black', alignSelf: 'flex-start' }} >{category.category_name}</Text>
                                                                        </View>
                                                                        <View style={{ flex: 0.5, justifyContent: 'flex-end', marginLeft: 10, paddingBottom: 3 }}>
                                                                            <Icon name="keyboard-arrow-right" size={22} style={{ alignSelf: 'flex-end', justifyContent: 'flex-end' }} color="rgb(207,207,207)"></Icon>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </TouchableNativeFeedback>
                                                        </View>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <View style={{ flex: 1, flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 10 }} key={index}>
                                                            <TouchableNativeFeedback onPress={() => this.props.navigation.navigate('BookCategory', {
                                                                _id: category._id,
                                                                name: category.category_name
                                                            })}>
                                                                <View style={{ flex: 0.94, flexDirection: 'column' }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', borderBottomColor: 'rgb(228,228,228)', borderWidth: 1, borderLeftColor: 'transparent', borderTopColor: 'transparent', borderRightColor: 'transparent', justifyContent: 'space-between', alignContent: 'space-between' }} >
                                                                        <View style={{ flex: 0.5, justifyContent: 'flex-end', paddingBottom: 3 }}>
                                                                            <Text style={{ fontSize: 18, color: 'black', alignSelf: 'flex-start' }} >{category.category_name}</Text>
                                                                        </View>
                                                                        <View style={{ flex: 0.5, justifyContent: 'flex-end', marginLeft: 10, paddingBottom: 3 }}>
                                                                            <Icon name="keyboard-arrow-right" size={22} style={{ alignSelf: 'flex-end', justifyContent: 'flex-end' }} color="rgb(207,207,207)"></Icon>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </TouchableNativeFeedback>
                                                        </View>
                                                    )
                                                }
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
        justifyContent:'center'
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