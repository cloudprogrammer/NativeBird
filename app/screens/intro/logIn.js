import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Switch,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import CircleSnail from 'react-native-progress/CircleSnail';
import PropTypes from 'prop-types';
import Styles from '../../assets/styles';
import Container from '../../components/container';
import Button from '../../components/button';

class LogIn extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    accent: PropTypes.string,
    text: PropTypes.string,
    gradient: PropTypes.string,
    navigation: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      rememberLogIn: true,
      animating: false,
    };
    this._logIn = this.logIn.bind(this);
    this._forgotPassword = this.forgotPassword.bind(this);
  }

  logIn() {
    const { email, password, rememberLogIn } = this.state;

    if (email === '' || password === '') {
      this.props.alertWithType('error', 'Error', 'Fill in all fields');
    } else {
      this.setState({ animating: true });
      setTimeout(() => {
        this.setState({ animating: false });
        AsyncStorage.setItem('loggedIn', JSON.stringify(rememberLogIn)).then(() => {
          this.props.navigation.dispatch({
            type: 'Navigation/RESET',
            index: 0,
            actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Main' }],
          });
        });
      }, 3000);
    }
  }

  forgotPassword() {
    const { email } = this.state;

    if (email === '') {
      this.props.alertWithType('error', 'Error', 'Enter email');
    } else {
      this.setState({ animating: true });
      setTimeout(() => {
        this.setState({ animating: false });
        this.props.alertWithType('success', 'Success', 'Password reset link sent');
      }, 3000);
    }
  }

  render() {
    return (
      <Container>
        <View style={[Styles.progressContainer, { zIndex: this.state.animating ? 10000 : 0 }]}>
          <CircleSnail
            color={[this.props.accent]}
            size={100}
            animating={this.state.animating}
            hidesWhenStopped
            indeterminate
          />
        </View>
        <View style={[Styles.paddingTop15, { flex: 1 }]}>
          <TextInput
            placeholder="Email"
            style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={50}
            keyboardType="email-address"
            placeholderTextColor={this.props.text}
            selectionColor={this.props.accent}
            underlineColorAndroid="transparent"
            onChangeText={text => this.setState({ email: text })}
            onSubmitEditing={() => this.password.focus()}
          />
          <TextInput
            placeholder="Password"
            style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
            maxLength={32}
            returnKeyType="go"
            autoCapitalize="none"
            placeholderTextColor={this.props.text}
            autoCorrect={false}
            selectionColor={this.props.accent}
            underlineColorAndroid="transparent"
            secureTextEntry
            onChangeText={text => this.setState({ password: text })}
            ref={(input) => { this.password = input; }}
            onSubmitEditing={this._logIn}
          />
          <View style={[Styles.row, Styles.paddingTop]}>
            <Text style={[Styles.italic, { color: this.props.text }]}>
                Remember Log In?
            </Text>
            <Switch
              onTintColor={this.props.accent}
              tintColor={this.props.accent}
              value={this.state.rememberLogIn}
              thumbTintColor={this.props.gradient}
              onValueChange={val => this.setState({ rememberLogIn: val })}
            />
          </View>
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Button
            text="Forgot Password"
            onPress={this._forgotPassword}
            padding
            background
          />
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Button
            text="Log In"
            onPress={this._logIn}
            padding
            background
          />
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  text: state.theme.text,
  accent: state.theme.accent,
  gradient: state.theme.gradient,
  header: state.theme.header,
});

export default connect(mapStateToProps)(LogIn);
