import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from '../../components/container';

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <Container />
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(Friends);
