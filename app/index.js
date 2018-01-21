import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppState, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import SendBird from 'sendbird';
import Notifications from 'react-native-push-notifications';
import store from './config/store';
import IntroNav from './config/routes';

import { AlertProvider } from './components/alert';

EStyleSheet.build({
  // Background Primary
  $backgroundPrimary: '#2c2929',
  $backgroundLight: '#f2f2f2',
  // Background Secondary
  $rowColor: '#313131',
  $rowColorLight: '#fff',
  // Accents
  $red: '#ef5350',
  $blue: '#40c4ff',
  // Text
  $black: '#000',
  $white: '#fff',
  // Gradients
  $redGradient: '#FF6D6A',
  $blueGradient: '#73F7FF',
});


export default class Main extends Component {
  constructor(props) {
    super(props);
    this.sb = new SendBird({ appId: 'F31A9018-5D10-4CA8-B0C8-52BA4C536E97' });
  }

  componentWillMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentDidMount() {
    Notifications.configure({
      onRegister(token) {
        if (Platform.OS === 'ios') {
          SendBird.getInstance().registerAPNSPushTokenForCurrentUser(token.token, (result, error) => {
            if (error) {
              console.log(error);
            }
          });
        } else {
          SendBird.getInstance().registerGCMPushTokenForCurrentUser(token.token, (result, error) => {
            if (error) {
              console.log(error);
            }
          });
        }
      },
      // (notification)
      onNotification() {},
      senderID: '254836125005',
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (currentAppState) => {
    if (currentAppState === 'active') {
      if (this.sb) {
        this.sb.setForegroundState();
      }
    } else if (this.sb) {
      this.sb.setBackgroundState();
    }
  };

  render() {
    return (
      <Provider store={store}>
        <AlertProvider>
          <IntroNav />
        </AlertProvider>
      </Provider>
    );
  }
}
