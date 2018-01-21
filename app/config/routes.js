import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { NavBar } from '../components/header';
import { Intro, Loading, LogIn, Register } from '../screens/intro';
import { Conversations, Chat, Invite } from '../screens/messages';
import { Settings } from '../screens/settings';
import { connectAlert } from '../components/alert';
import Drawer from '../components/drawer';

const MessagesNav = StackNavigator({
  Friends: {
    screen: connectAlert(Conversations),
    navigationOptions: props => ({
      header: headerProps => <NavBar {...headerProps} />,
      title: 'Converstations',
      headerLeft: (
        <TouchableOpacity onPress={() => props.screenProps.drawerNavigation.navigate('DrawerOpen')}>
          <View style={{ paddingLeft: 10, paddingRight: 20 }}>
            <Icon name="md-menu" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
      ),
    }),
  },
  Chat: {
    screen: connectAlert(Chat),
    navigationOptions: {
      header: headerProps => <NavBar {...headerProps} />,
    },
  },
  Invite: {
    screen: connectAlert(Invite),
    navigationOptions: {
      header: headerProps => <NavBar {...headerProps} />,
    },
  },
}, {
  headerMode: 'screen',
});

const SettingsNav = StackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: props => ({
      header: headerProps => <NavBar {...headerProps} />,
      title: 'Settings',
      headerLeft: (
        <TouchableOpacity onPress={() => props.screenProps.drawerNavigation.navigate('DrawerOpen')}>
          <View style={{ paddingLeft: 10, paddingRight: 20 }}>
            <Icon name="md-menu" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
      ),
    }),
  },
}, {
  headerMode: 'screen',
});

const MainNav = DrawerNavigator({
  Messages: {
    screen: ({ navigation }) =>
      <MessagesNav screenProps={{ drawerNavigation: navigation }} />,
  },
  Settings: {
    screen: ({ navigation }) =>
      <SettingsNav screenProps={{ drawerNavigation: navigation }} />,
  },
}, {
  drawerPosition: 'left',
  drawerWidth: 125,
  initialRouteName: 'Friends',
  contentComponent: (props) => {
    const clonedProps = {
      ...props,
      items: props.items.filter(item => !['Profile'].includes(item.key)),
    };
    return (
      <Drawer {...clonedProps} />
    );
  },
});

const IntroNav = StackNavigator({
  Intro: {
    screen: Intro,
    navigationOptions: {
      header: () => null,
    },
  },
  Loading: {
    screen: Loading,
    navigationOptions: {
      header: () => null,
    },
  },
  LogIn: {
    screen: connectAlert(LogIn),
    navigationOptions: {
      header: props => <NavBar {...props} />,
      title: 'Log In',
    },
  },
  Register: {
    screen: connectAlert(Register),
    navigationOptions: {
      header: props => <NavBar {...props} />,
      title: 'Register',
    },
  },
  Main: {
    screen: ({ navigation }) => <MainNav screenProps={{ rootNavigation: navigation }} />,
    navigationOptions: {
      header: () => null,
    },
  },
}, {
  initialRouteName: 'Loading',
  headerMode: 'screen',
});

export default IntroNav;
