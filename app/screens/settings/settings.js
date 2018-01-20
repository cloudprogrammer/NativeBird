import React, { Component } from 'react';
import { AsyncStorage, TouchableOpacity, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { updateTheme } from '../../actions/theme';
import Container from '../../components/container';
import Button from '../../components/button';
import Styles from '../../assets/styles';

const styles = EStyleSheet.create({
  // Colors
  $_blue: '$blue',
  $_black: '$black',
  $_white: '$white',
  $_red: '$red',
  // Backgrounds
  $_backgroundDark: '$backgroundPrimary',
  $_backgroundLight: '$backgroundLight',
  // Seconday Backgrounds
  $_rowColor: '$rowColor',
  $_rowColorLight: '$rowColorLight',
  // Gradients
  $_blueGradient: '$blueGradient',
  $_redGradient: '$redGradient',
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  setLight = () => {
    this.props.dispatch(updateTheme(
      styles.$_blueBack,
      styles.$_red,
      styles.$_black,
      styles.$_red,
      styles.$_rowColorLight,
      styles.$_redGradient,
    ));
    this.saveTheme(
      styles.$_blueBack,
      styles.$_red,
      styles.$_black,
      styles.$_red,
      styles.$_rowColorLight,
      styles.$_redGradient,
    );
  }

  setDark = () => {
    this.props.dispatch(updateTheme(
      styles.$_backgroundDark,
      styles.$_blue,
      styles.$_white,
      styles.$_blue,
      styles.$_rowColor,
      styles.$_blueGradient,
    ));
    this.saveTheme(
      styles.$_backgroundDark,
      styles.$_blue,
      styles.$_white,
      styles.$_blue,
      styles.$_rowColor,
      styles.$_blueGradient,
    );
  }

  saveTheme = (backgroundPrimary, accent, text, header, rowColor, gradient) => {
    const theme = JSON.stringify({
      backgroundPrimary,
      accent,
      text,
      gradient,
      header,
      rowColor,
    });
    AsyncStorage.setItem('theme', theme);
  }

  ThemesModal = () => (
    <Modal animationType="slide" visible={this.state.modal}>
      <Container>
        <View style={{ flex: 1, marginTop: 20 }}>
          <TouchableOpacity
            style={{
              marginHorizontal: 10,
              backgroundColor: this.props.rowColor,
              marginTop: 10,
              height: 50,
              justifyContent: 'center',
              borderTopColor: this.props.accent,
              borderTopWidth: 2,
            }}
            onPress={() => this.setDark()}
          >
            <Text style={{ color: this.props.text, paddingLeft: 10 }}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginHorizontal: 10,
              backgroundColor: this.props.rowColor,
              marginTop: 10,
              height: 50,
              justifyContent: 'center',
              borderTopColor: this.props.accent,
              borderTopWidth: 2,
            }}
            onPress={() => this.setLight()}
          >
            <Text style={{ color: this.props.text, paddingLeft: 10 }}>Light</Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.bottomButton}>
          <Button
            text="Done"
            onPress={() => this.setState({ modal: false })}
            background
            padding
          />
        </View>
      </Container>
    </Modal>
  )

  render() {
    return (
      <Container>
        <this.ThemesModal />
        <TouchableOpacity
          style={{
            marginHorizontal: 10,
            backgroundColor: this.props.rowColor,
            marginTop: 10,
            height: 50,
            justifyContent: 'center',
            borderTopColor: this.props.accent,
            borderTopWidth: 2,
          }}
          onPress={() => this.setState({ modal: true })}
        >
          <Text style={{ color: this.props.text, paddingLeft: 10 }}>Themes</Text>
        </TouchableOpacity>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  rowColor: state.theme.rowColor,
  text: state.theme.text,
  accent: state.theme.accent,
});

export default connect(mapStateToProps)(Settings);
