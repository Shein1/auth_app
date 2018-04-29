import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Dimensions,
  AsyncStorage
} from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
import { connect } from 'react-redux';
import _ from 'lodash';

const regex = /^otpauth:\/\/totp\/(.+)\?secret=(.+)&issuer=(.*)$/;

class ScanScreen extends Component {
  state = {
    hasCameraPermission: null
  };

  isCodeRead = false;

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    });
  };

  _handleBarCodeRead = ({ type, data }) => {
    const { state, goBack } = this.props.navigation;
    let myData = data.match(regex);

    if (!myData) {
      Alert.alert(
        'Error',
        'Wrong QR Code format',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } else {
      const label = myData[1];
      const secret = myData[2];
      const issuer = myData[3];

      const ar = { label, secret, issuer };

      if (_.some(this.props.data, ar)) {
        isCodeRead = false;
        Alert.alert(
          'Error',
          'QR already readed',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      } else {
        const updated_ar = [...this.props.data, ar];
        console.log(updated_ar);
        try {
          AsyncStorage.setItem('data', JSON.stringify(updated_ar)).then(() => {
            this.props.dispatch({
              type: 'QRCODE_NEW',
              payload: { updated_ar }
            });
          });
        } catch (error) {
          console.log('Error saving data' + error);
        }
        isCodeRead = false;
      }
    }

    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text>Camera permission is not granted</Text>
        ) : (
          <BarCodeScanner
            torchMode="off"
            onBarCodeRead={this._handleBarCodeRead}
            style={{
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width
            }}
          />
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data
  };
}

export default connect(mapStateToProps)(ScanScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff'
  }
});
