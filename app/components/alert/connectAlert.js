import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

const connectAlert = (WrappedComponent) => {
  class ConnectedAlert extends Component {
    render() {
      return (
        <WrappedComponent
          {...this.props}
          alertWithType={this.context.alertWithType}
          alert={this.context.alert}
        />
      );
    }
  }

  ConnectedAlert.contextTypes = {
    alertWithType: PropTypes.func,
    alert: PropTypes.func,
  };

  return hoistNonReactStatic(ConnectedAlert, WrappedComponent);
};

export default connectAlert;
