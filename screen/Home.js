import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Alert,
  AsyncStorage,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import Totp from '../lib/totp';

console.disableYellowBox = true;

const { width, height } = Dimensions.get('window');

class HomeScreen extends React.Component {
  state = {
    timer: null
  };

  componentWillMount() {
    try {
      AsyncStorage.getItem('data').then(result => {
        if (result) {
          let init = JSON.parse(result);
          console.log('data', init.length);
          this.props.dispatch({ type: 'INIT_DATA', payload: { init } });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentDidUpdate() {
    const duration = 4000;
    setInterval(() => {
      this.setState({ timer: this.state.timer + duration });
    }, duration);
  }

  render() {
    const { navigate } = this.props.navigation;
    const list = this._items();
    return (
      <View style={styles.container}>
        <ScrollView>
          {list}
          <TouchableOpacity
            style={styles.buttonAdd}
            onPress={() => navigate('Scan')}
          >
            <Text> ADD </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonClear}
            onPress={() => this._clear()}
          >
            <Text> CLEAR </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  _clear() {
    try {
      AsyncStorage.removeItem('data').then(() => {
        this.props.dispatch({ type: 'QRCODE_CLEAR' });
      });
    } catch (e) {
      console.log(e);
    }
  }

  _items = () => {
    const list = this.props.data.map((myData, index) => {
      const token = new Totp(myData.secret, 4).generate();
      return (
        <TouchableOpacity
          key={index}
          style={styles.case}
          onLongPress={() => {
            this._onLongPress(index);
          }}
        >
          <Text style={styles.text}>{myData.label}</Text>
          <Text style={styles.token}>{token}</Text>
          <Text style={styles.text}>{myData.issuer}</Text>
        </TouchableOpacity>
      );
    });
    return list;
  };

  _onLongPress = index => {
    Alert.alert(
      'Warning',
      'Are you sure to delete ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed')
        },
        {
          text: 'OK',
          style: 'destructive',
          onPress: () => {
            let updatedList = [...this.props.data];
            updatedList.splice(index, 1);

            try {
              AsyncStorage.setItem('data', JSON.stringify(updatedList)).then(
                () => {
                  this.props.dispatch({
                    type: 'QRCODE_DELETE',
                    payload: { updatedList }
                  });
                }
              );
            } catch (e) {
              console.log(e);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  _generateToken(secret) {
    return secret;
  }
}

function mapStateToProps(state) {
  return {
    data: state.data
  };
}

export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: '#ddd'
      },
      android: {
        backgroundColor: '#fff'
      }
    })
  },
  buttonAdd: {
    alignItems: 'center',
    ...Platform.select({
      ios: {
        backgroundColor: '#92f442'
      },
      android: {
        backgroundColor: '#31e524'
      }
    }),
    justifyContent: 'center',
    margin: 7,
    borderRadius: 15,
    height: 40
  },
  buttonClear: {
    alignItems: 'center',
    ...Platform.select({
      ios: {
        backgroundColor: '#f44441'
      },
      android: {
        backgroundColor: '#af0200'
      }
    }),
    justifyContent: 'center',
    margin: 7,
    borderRadius: 15,
    height: 40
  },
  text: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    color: '#fff'
  },
  token: {
    fontSize: 20,
    color: '#b5ffca',
    marginLeft: 10
  },
  case: {
    ...Platform.select({
      ios: {
        backgroundColor: '#3d3d3d'
      },
      android: {
        backgroundColor: '#565656'
      }
    }),
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15
  },
  containerEmpty: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonAddAlone: {
    marginTop: 100,
    alignItems: 'center',
    backgroundColor: '#000',
    justifyContent: 'center',
    borderRadius: 30,
    marginBottom: 100
  },
  textAlone: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    color: '#fff'
  },
  stretch: {
    width: 150,
    height: 150
  }
});
