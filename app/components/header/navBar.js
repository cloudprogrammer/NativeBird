import React from 'react';
import { connect } from 'react-redux';
import { Header } from 'react-navigation';

const NavBar = props => <Header {...props} />;

const mapStateToProps = (state, ownProps) => ({
  getScreenDetails: (scene) => {
    const details = ownProps.getScreenDetails(scene);
    return {
      ...details,
      options: {
        headerStyle: {
          backgroundColor: state.theme.header,
        },
        headerTitleStyle: {
          color: '#fff',
        },
        headerTintColor: '#fff',
        ...details.options,
      },
    };
  },
});

export default connect(mapStateToProps)(NavBar);
