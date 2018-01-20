import { DrawerItems } from 'react-navigation';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, AsyncStorage, Alert } from 'react-native';
import { connect } from 'react-redux';
import Container from '../container';
import ProfileImage from '../profileImage';

class Drawer extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.object,
    background: PropTypes.string,
    accent: PropTypes.string,
    text: PropTypes.string,
    screenProps: PropTypes.object,
  }

  logOut = () => Alert.alert(
    'Confirm',
    null,
    [
      {
        text: 'Log Out',
        onPress: () => {
          AsyncStorage.removeItem('loggedIn').then(() => {
            this.props.screenProps.rootNavigation.dispatch({
              type: 'Navigation/RESET',
              index: 0,
              actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Intro' }],
            });
          }).catch(() => null);
        },
      },
      { text: 'Cancel' },
    ],
  );

  render() {
    return (
      <Container background={this.props.background}>
        <View style={{ borderRightColor: this.props.accent, borderRightWidth: 2, flex: 1 }}>
          <View style={{ alignItems: 'flex-start', paddingTop: 20, paddingLeft: 16 }}>
            <TouchableOpacity onPress={() => null}>
              <View style={{ alignItems: 'center' }}>
                <ProfileImage
                  showBorder
                  size={75}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, paddingTop: 5 }}>
            <DrawerItems
              {...this.props}
              inactiveTintColor={this.props.text}
              activeTintColor={this.props.accent}
              onItemPress={(route) => {
                if (!route.focused) {
                  this.props.navigation.navigate(`${route.route.key}`);
                }
              }}
              style={{ backgroundColor: this.props.background }}
            />
          </View>
          <TouchableOpacity onPress={() => this.logOut()}>
            <Text style={[{ color: this.props.text, fontWeight: 'bold', margin: 16 }]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  background: state.theme.backgroundPrimary,
  text: state.theme.text,
  accent: state.theme.accent,
});

export default connect(mapStateToProps)(Drawer);
