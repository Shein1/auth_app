import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './screen/Home';
import ScanScreen from './screen/Scan';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

const MainStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        title: 'Home Authentificator'
      }
    }
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#35517c'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
);

const RootStack = StackNavigator(
  {
    Main: {
      screen: MainStack
    },
    Scan: {
      screen: ScanScreen
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

class MyComponent extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    );
  }
}

let initialState = {
  data: []
};

const Reducer = (prev_state = initialState, action) => {
  switch (action.type) {
    case 'QRCODE_CLEAR':
      return Object.assign({}, prev_state, {
        data: []
      });

    case 'QRCODE_DELETE':
      return Object.assign({}, prev_state, {
        data: action.payload.updatedList
      });

    case 'QRCODE_NEW':
      return Object.assign({}, prev_state, {
        data: action.payload.updated_ar
      });

    case 'INIT_DATA':
      return Object.assign({}, prev_state, {
        data: action.payload.init
      });

    default:
      return prev_state;
  }
};

const store = createStore(Reducer);

export default MyComponent;
