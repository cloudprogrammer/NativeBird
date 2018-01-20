import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Button = ({
  onPress, text, textAlign, padding, background, accent,
}) => (
  <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: background ? '20%' : 0 }}>
    <Text
      style={{
      color: '#fff',
      textAlign: textAlign || 'center',
      padding: padding ? 8 : 0,
      fontSize: 18,
      backgroundColor: background ? accent : 'transparent',
      borderRadius: 3,
      overflow: 'hidden',
    }}
    >
      {text}
    </Text>
  </TouchableOpacity>
);

Button.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  textAlign: PropTypes.string,
  accent: PropTypes.string,
  background: PropTypes.bool,
  padding: PropTypes.bool,
};

const mapStateToProps = state => ({
  accent: state.theme.accent,
});

export default connect(mapStateToProps)(Button);
