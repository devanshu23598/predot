/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation'
import AppNavigator from './naviagtion/stackNavigation/StackNavigator'
import Login from './screens/login/Login';
export default class App extends Component {
  render() {
    console.disableYellowBox = true;
    return (
      <Container/>
    );
  }
}

const Container=createAppContainer(AppNavigator);