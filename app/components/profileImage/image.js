import React from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ProfileImage = ({
  accent, url, showBorder, size,
}) => (
  <Image
    source={!url ? require('./avatarplaceholder.png') : { uri: `${url}` }}
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderColor: accent,
      borderWidth: showBorder ? 2 : 0,
      overflow: 'hidden',
      zIndex: 100,
    }}
    resizeMode="cover"
    width={size}
    height={size}
    borderRadius={size / 2}
  />
);

ProfileImage.propTypes = {
  accent: PropTypes.string,
  showBorder: PropTypes.bool,
  size: PropTypes.number,
  url: PropTypes.object,
};

const mapStateToProps = state => ({
  accent: state.theme.accent,
});

export default connect(mapStateToProps)(ProfileImage);
