import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import DropdownAlert from 'react-native-dropdownalert';

class AlertProvider extends Component {
  static childContextTypes = {
    alertWithType: PropTypes.func,
    alert: PropTypes.func,
  };

  static propTypes = {
    children: PropTypes.any,
  };

  getChildContext() {
    return {
      alert: (...args) => this.dropdown.alert(...args),
      alertWithType: (...args) => this.dropdown.alertWithType(...args),
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {React.Children.only(this.props.children)}
        <DropdownAlert
          successColor="#00bc8c"
          errorColor="#ef5350"
          closeInterval={2500}
          elevation={100}
          updateStatusBar={false}
          ref={(ref) => {
            this.dropdown = ref;
          }}
          containerStyle={{ padding: 16, flexDirection: 'row', zIndex: 1 }}
        />
      </View>
    );
  }
}

export default AlertProvider;
