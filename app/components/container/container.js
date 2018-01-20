import React from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Container = ({ children, background, header }) => (
  <View style={{ backgroundColor: background, flex: 1 }}>
    <StatusBar transulcent barStyle="light-content" backgroundColor={header} />
    {children}
  </View>
);

Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  background: PropTypes.string,
  header: PropTypes.string,
};

const mapStateToProps = state => ({
  background: state.theme.backgroundPrimary,
  header: state.theme.header,
});

export default connect(mapStateToProps)(Container);
