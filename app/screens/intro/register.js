import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Switch,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import CircleSnail from 'react-native-progress/CircleSnail';
import PropTypes from 'prop-types';
import Styles from '../../assets/styles';
import Container from '../../components/container';
import Button from '../../components/button';

class Register extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    accent: PropTypes.string,
    text: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      username: '',
      animating: false,
    };
    this._register = this.register.bind(this);
  }

  register() {
    const { email, password, username } = this.state;

    if (email === '' || password === '' || username === '') {
      this.props.alertWithType('error', 'Error', 'Fill in all fields');
    } else {
      this.setState({ animating: true });
      setTimeout(() => {
        this.props.alertWithType('success', 'Success', 'Registered');
      }, 2500);
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
            onSubmitEditing={() => this.usernameField.focus()}
          />
          <TextInput
            placeholder="Username"
            style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={50}
            keyboardType="email-address"
            placeholderTextColor={this.props.text}
            selectionColor={this.props.accent}
            underlineColorAndroid="transparent"
            ref={(input) => { this.usernameField = input; }}
            onChangeText={text => this.setState({ email: text })}
            onSubmitEditing={() => this.passwordField.focus()}
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
            ref={(input) => { this.passwordField = input; }}
            onSubmitEditing={this._register}
          />
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Button
            text="Register"
            onPress={this._register}
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

export default connect(mapStateToProps)(Register);
