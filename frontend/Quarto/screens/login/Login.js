import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ImageBackground, TouchableOpacity, TouchableNativeFeedback, TextInput, Image, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EyeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserIcon from 'react-native-vector-icons/Feather'
import Fetch from '../../helpers/Helper'
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            showPassword: false,
            loader: true
        };
    }

    showPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })

    }
    componentDidMount() {
        this.setState({
            loader: false
        })
    }
    login = () => {
        this.setState({
            loader: true
        })
        Fetch.post('members/login', { username: this.state.username, password: this.state.password }).then(res => {
            this.setState({
                loader: false
            })
            if (res.response) {
                if (res.is_active) {
                    AsyncStorage.setItem('token', res.token);
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Home' })],
                    });
                    this.props.navigation.dispatch(resetAction);
                } else {
                    this.props.navigation.navigate('Otp', {
                        token: res.token
                    })
                }
            } else {
                this.setState({
                    loader: false
                })
                Alert.alert(res.msg);
            }
        })


    }
    render() {

        return (
            <View style={styles.container}>
            {
                this.state.loader == true ?
                    <ActivityIndicator size="large" color="rgb(14,130,167)" style={{ alignSelf: 'center' }} />:
                        (
                        <ScrollView>
                            <StatusBar backgroundColor="black" barStyle="light-content" />

                            <View style={styles.parent}>
                                <View style={styles.row1}>
                                    <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center' }}>
                                        <View style={{ alignSelf: 'center' }}>
                                            <Image source={require('../../images/logo.png')} style={{ width: 200, height: 80, resizeMode: 'center' }} />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.row2}>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', paddingLeft: 15, paddingRight: 15 }}>
                                        <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                            <View style={{ flex: 0.95, flexDirecction: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'rgb(241,243,242)', borderRadius: 4 }}>
                                                    <View style={{ alignSelf: 'center', paddingLeft: 2, marginLeft: 4 }}>
                                                        <UserIcon name="user" color="rgb(113,117,128)" size={18} />
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, alignSelf: 'center' }}>
                                                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                                            <TextInput placeholderTextColor="rgb(113,117,128)" style={styles.email} placeholder="Enter username" onChangeText={(username) => this.setState({ username })} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                            <View style={{ flex: 0.95, flexDirecction: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'rgb(241,243,242)', borderRadius: 4 }}>
                                                    <View style={{ alignSelf: 'center', paddingLeft: 2, marginLeft: 4 }}>
                                                        <Icon name="lock-outline" color="rgb(113,117,128)" size={18} />
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, alignSelf: 'center' }}>
                                                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                                            <TextInput placeholderTextColor="rgb(113,117,128)" style={styles.email} placeholder="Enter password" secureTextEntry={this.state.showPassword ? false : true} onChangeText={(password) => this.setState({ password })} />
                                                        </View>
                                                    </View>
                                                    <View style={{ alignSelf: 'center', paddingRight: 2, marginRight: 5 }} onPress={() => { this.showPassword() }}>
                                                        <EyeIcon name={this.state.showPassword ? 'eye-outline' : 'eye-off-outline'} color="rgb(113,117,128)" size={18} onPress={() => { this.showPassword() }} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.row3}>
                                    {
                                        this.state.username == '' || this.state.password == '' ?
                                            (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                                                <TouchableNativeFeedback >
                                                    <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', borderRadius: 4, backgroundColor: "#009cc6", opacity: 0.35 }} >
                                                        <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={{ alignSelf: 'center', fontSize: 19, color: '#fff', fontFamily: 'notoserif' }}>Log In</Text>
                                                        </View>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>) :
                                            (
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                                                    <TouchableNativeFeedback onPress={this.login} >
                                                        <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', borderRadius: 4, elevation: 7, backgroundColor: "#009cc6" }} >
                                                            <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ alignSelf: 'center', fontSize: 19, color: '#fff', fontFamily: 'notoserif' }}>Log In</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableNativeFeedback>
                                                </View>
                                            )
                                    }

                                </View>
                                <View style={styles.row5}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                                        <Text style={{ alignSelf: 'center', fontSize: 15, color: '#000', fontFamily: 'sans-serif-thin' }}>New user? Click here to signup.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                )

                }
                    </View>

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
        marginTop: 10
    },
    email:
    {
        fontSize: 14,
        color: '#000'
    },
    row1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 55,
    },
    row2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,

    },
    row3:
    {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-around',
        marginTop: 30,
        marginBottom: 15,
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