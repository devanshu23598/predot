import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ImageBackground, TouchableOpacity, TouchableNativeFeedback, TextInput, Image, Alert, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EyeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserIcon from 'react-native-vector-icons/Feather'
import Fetch from '../../helpers/Helper'

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            phonenumber: '',
            password: '',
            showPassword: false
        };
    }
    toggleLoader=()=>{
        this.setState({
            loader:!this.state.loader
        })
    }
    showPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })

    }

    signup = () => {
        
        Fetch.post('members/signup', { username: this.state.username, password: this.state.password,phone_number:this.state.phonenumber }).then(res => {
            if (res.response) {
                Alert.alert(res.msg)
                this.props.navigation.navigate('Login')
            } else {
                Alert.alert(res.msg)                
            }
        })
    }
    render() {

        return (
            <View style={styles.container}>
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
                                                <UserIcon name="phone" color="rgb(113,117,128)" size={18} />
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, alignSelf: 'center' }}>
                                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                                    <TextInput placeholderTextColor="rgb(113,117,128)" style={styles.email} placeholder="Enter phone number" onChangeText={(phonenumber) => this.setState({ phonenumber })} />
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
                                this.state.username == '' || this.state.password == '' || this.state.phonenumber == '' ?
                                    (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} pointerEvents="none">
                                        <TouchableNativeFeedback >
                                            <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', borderRadius: 4, backgroundColor: "#009cc6", opacity: 0.35 }} >
                                                <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ alignSelf: 'center', fontSize: 19, color: '#fff', fontFamily: 'notoserif' }}>Sign Up</Text>
                                                </View>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>) :
                                    (
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                                            <TouchableNativeFeedback onPress={this.signup} >
                                                <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', borderRadius: 4, elevation: 7, backgroundColor: "#009cc6" }} >
                                                    <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ alignSelf: 'center', fontSize: 19, color: '#fff', fontFamily: 'notoserif' }}>Sign Up</Text>
                                                    </View>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>
                                    )
                            }
                        </View>
                        <View style={styles.row5}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                                <Text style={{ alignSelf: 'center', fontSize: 15, color: '#000' }}>Already exists? Login.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
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