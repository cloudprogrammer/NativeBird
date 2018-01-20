import React from 'react';
import { Provider } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
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

export default () => (
  <Provider store={store}>
    <AlertProvider>
      <IntroNav />
    </AlertProvider>
  </Provider>
);
