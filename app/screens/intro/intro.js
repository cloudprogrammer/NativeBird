import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../../components/button/';
import Container from '../../components/container/';
import Styles from '../../assets/styles';

class Intro extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    text: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      modal: false,
    };
  }

  InfoModal = () => (
    <Modal visible={this.state.modal} animationType="slide">
      <Container>
        <View style={Styles.center}>
          <Text style={[Styles.aboutText, { paddingHorizontal: 10, color: this.props.text }]}>
                Skeleton is a boiler plate app for React Native, it has integration with:
          </Text>
          <Text style={[Styles.aboutText, { paddingTop: 10, color: this.props.text }]}>
                - React Navigation
          </Text>
          <Text style={[Styles.aboutText, { color: this.props.text }]}>
                - Redux & React Redux
          </Text>
          <Text style={[Styles.aboutText, { color: this.props.text }]}>
                - React Dropdown Alert
          </Text>
          <Text style={[Styles.aboutText, { color: this.props.text }]}>
                - React Progress
          </Text>
          <Text style={[Styles.aboutText, { color: this.props.text }]}>
                - ESLint
          </Text>
          <Text style={[Styles.aboutText, { color: this.props.text }]}>
                - React Native Extended Stylesheet
          </Text>
          <Text style={[Styles.aboutText, { paddingTop: 10, paddingHorizontal: 10, color: this.props.text }]}>
                Skeleton also has a theming system and a loading screen
          </Text>
        </View>
        <View style={Styles.bottomButton}>
          <Text style={[Styles.aboutText, { paddingBottom: 10, paddingHorizontal: 10, color: this.props.text }]}>
            Developed by Mudasar Javed
          </Text>
          <Button
            text="Done"
            padding
            onPress={() => this.setState({ modal: false })}
            background
          />
        </View>
      </Container>
    </Modal>
  )

  render() {
    return (
      <Container>
        <this.InfoModal />
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <View style={{ alignItems: 'center', flex: 1, paddingTop: 50 }}>
            <Text style={{ fontSize: 40, color: this.props.text, backgroundColor: 'transparent' }}>Skeleton</Text>
          </View>
          <View
            style={{
              justifyContent: 'center', flex: 1, paddingBottom: '50%', zIndex: 2,
            }}
          >
            <Button
              text="Register"
              onPress={() => this.props.navigation.navigate('Register')}
              padding
              background
            />
            <Text
              style={{
                color: this.props.text, paddingVertical: 20, fontSize: 20, textAlign: 'center',
              }}
            > Or
            </Text>
            <Button
              text="Log In"
              onPress={() => this.props.navigation.navigate('LogIn')}
              padding
              background
            />
          </View>
          <View
            style={{
              paddingBottom: 20,
            }}
          >
            <Button
              text="About"
              onPress={() => this.setState({ modal: true })}
              padding
              background
            />
          </View>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  text: state.theme.text,
  accent: state.theme.accent,
});

export default connect(mapStateToProps)(Intro);
