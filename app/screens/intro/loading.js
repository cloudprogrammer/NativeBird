import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import CircleSnail from 'react-native-progress/CircleSnail';
import PropTypes from 'prop-types';
import Container from '../../components/container';
import Styles from '../../assets/styles';
import { updateTheme } from '../../actions/theme';

class Loading extends Component {
  static propTypes = {
    accent: PropTypes.string,
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      animating: true,
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('theme').then((storedTheme) => {
      const theme = JSON.parse(storedTheme);
      if (theme !== null) {
        this.props.dispatch(updateTheme(
          theme.backgroundPrimary,
          theme.accent,
          theme.text,
          theme.header,
          theme.rowColor,
          theme.gradient,
        ));
      }
    });
  }

  componentDidMount() {
    setTimeout(() => {
      AsyncStorage.getItem('loggedIn').then((success) => {
        this.props.navigation.dispatch({
          type: 'Navigation/RESET',
          index: 0,
          actions: [{ type: 'Navigation/NAVIGATE', routeName: success && success === 'true' ? 'Main' : 'Intro' }],
        });
      });
    }, 2500);
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  accent: state.theme.accent,
});

export default connect(mapStateToProps)(Loading);
