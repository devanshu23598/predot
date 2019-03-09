import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ImageBackground, TouchableOpacity, TouchableNativeFeedback, TextInput, AsyncStorage, Alert,ActivityIndicator } from 'react-native';
import Fetch from '../../helpers/Helper';
import { StackActions, NavigationActions } from 'react-navigation';

export default class Otp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            showPassword: false,
            token: this.props.navigation.state.params.token,
            resend: true,
            loader:true
        };
    }

    showPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })

    }
    verified = () => {
        this.setState({
            loader:true
        })
        Fetch.post('members/verification', { otp: this.state.otp }, this.state.token).then(res => {
            this.setState({
                loader:false
            })
            if (res.response) {
                AsyncStorage.setItem('token', this.state.token);
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                });
                this.props.navigation.dispatch(resetAction);
            }
            else {
                Alert.alert(res.msg);
            }
        })
    }
    componentDidMount(){
        this.setState({
            loader:false
        })
    }
    resend = () => {
        this.setState({
            resend: false
        })
        Fetch.post('members/resend-otp', {}, this.state.token).then(res => {

        })

    }
    render() {

        return (
            <View style={styles.container}>
                {
                    this.state.loader == true ?
                        <ActivityIndicator size="large" color="rgb(14,130,167)" style={{ alignSelf: 'center' }} /> :
                        <ScrollView>
                            <StatusBar backgroundColor="black" barStyle="light-content" />
                            <View style={styles.parent}>
                                <View style={styles.row2}>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', paddingLeft: 15, paddingRight: 15 }}>
                                        <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                            <View style={{ flex: 0.95, flexDirecction: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, alignSelf: 'center' }}>
                                                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Text style={{ alignSelf: 'center', fontSize: 19, fontWeight: "400" }}>Mobile Verification in process.</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                            <View style={{ flex: 0.95, flexDirecction: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, alignSelf: 'center' }}>
                                                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                                            <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: "400" }} >We have sent OTP to your mobile number.</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                                            <View style={{ flex: 0.95, flexDirecction: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', borderBottomColor: "rgb(200,200,200)", borderWidth: 0.8, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent' }}>

                                                    <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>
                                                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                                            <TextInput placeholderTextColor="rgb(113,117,128)" style={styles.email} placeholder="Enter OTP" keyboardType="numeric" onChangeText={(otp) => this.setState({ otp })} />
                                                        </View>
                                                    </View>

                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {
                                    this.state.resend ?
                                        <View style={styles.row5}>
                                            <TouchableOpacity onPress={this.resend}>
                                                <Text style={{ alignSelf: 'center', fontSize: 12, color: '#ccc' }}>Resend OTP</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <View></View>
                                }

                                <View style={styles.row3}>
                                    {
                                        this.state.otp == '' ?
                                            (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                                                <TouchableNativeFeedback >
                                                    <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', borderRadius: 4, backgroundColor: "#009cc6", opacity: 0.35 }} >
                                                        <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={{ alignSelf: 'center', fontSize: 19, color: '#fff', fontFamily: 'notoserif' }}>Continue</Text>
                                                        </View>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>) :
                                            (
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                                                    <TouchableNativeFeedback onPress={this.verified}>
                                                        <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', borderRadius: 4, elevation: 3, backgroundColor: "#009cc6" }} >
                                                            <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ alignSelf: 'center', fontSize: 19, color: '#fff', fontFamily: 'notoserif' }}>Continue</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableNativeFeedback>
                                                </View>
                                            )
                                    }
                                </View>
                                <View style={styles.row5}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                                        <Text style={{ alignSelf: 'center', fontSize: 15, color: '#000' }}>Go Back to Login.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
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