import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import Sendbird from 'sendbird';
import DeviceInfo from 'react-native-device-info';
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
    this.sb = Sendbird.getInstance();
    this.state = {
      modal: false,
      userId: DeviceInfo.getUniqueID(),
      nickname: '',
    };
  }

  connect = () => {
    this.sb.connect(this.state.userId, (user, error) => {
      if (!error) {
        this.sb.updateCurrentUserInfo(this.state.nickname, '', (response, error2) => {
          if (!error2) {
            this.props.navigation.dispatch({
              type: 'Navigation/RESET',
              index: 0,
              actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Main' }],
            });
          }
        });
      }
    });
  }

  InfoModal = () => (
    <Modal visible={this.state.modal} animationType="slide">
      <Container>
        <View style={Styles.center}>
          <Text style={[Styles.aboutText, { paddingHorizontal: 10, color: this.props.text }]}>
                NativeBird is a React Native messaging app it has integrations with:
          </Text>
          <Text style={[Styles.aboutText, { paddingTop: 10, color: this.props.text }]}>
                - Sendbird
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
            NativeBird also has a theming system and a loading screen
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
            <Text style={{ fontSize: 40, color: this.props.text, backgroundColor: 'transparent' }}>NativeBird</Text>
          </View>
          <View
            style={{
              justifyContent: 'center', flex: 1, paddingBottom: '50%', zIndex: 2,
            }}
          >
            <TextInput
              placeholder="Email"
              value={this.state.userId}
              editable={false}
              style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
              placeholderTextColor={this.props.text}
              selectionColor={this.props.accent}
              underlineColorAndroid="transparent"
            />
            <TextInput
              placeholder="Nickname"
              style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
              maxLength={32}
              returnKeyType="go"
              autoCapitalize="none"
              placeholderTextColor={this.props.text}
              autoCorrect={false}
              selectionColor={this.props.accent}
              underlineColorAndroid="transparent"
              secureTextEntry
              onChangeText={text => this.setState({ nickname: text })}
              onSubmitEditing={this.connect}
            />
            <Button
              text="Connect"
              onPress={this.connect}
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
