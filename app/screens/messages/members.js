import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import SendBird from 'sendbird';
import { connect } from 'react-redux';

import Container from '../../components/container';
import { PULLDOWNDISTANCE } from '../../assets/consts';

let sb = null;

const styles = StyleSheet.create({
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 10,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    padding: 5,
    marginTop: 10,
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleLabel: {
    
    fontFamily: 'Dosis',
    fontSize: 19,
  },
  descText: {
    textAlign: 'center',
    
    fontFamily: 'Dosis',
    fontSize: 16
  },
});

class Members extends Component {

  constructor(props) {
    super(props);
    sb = SendBird.getInstance();
    this.state = {
      channel: props.navigation.state.params.channel,
      list: [],
      inviteList: [],
    };
  }

  componentWillMount() {
    this.getUserList();
  }

  onlineStyle = online => ({
    textAlign: 'center',
    fontSize: 12,
    color: (online === 'online') ? '#00bc8c' : '#fff',
    
  })

  getUserList = () => {
    const members = this.state.channel.members;
    const response = members.filter(user => user.userId !== sb.currentUser.userId);
    this.setState({ list: this.state.list.concat(response) });
  }

  render() {
    return (
      <Container>
        <View style={styles.listContainer}>
          <FlatList
            onEndReachedThreshold={PULLDOWNDISTANCE}
            data={this.state.list}
            keyExtractor={item => item.nickname}
            renderItem={({ item }) =>
              <View style={[styles.listItem, { backgroundColor: this.props.rowColor, borderBottomColor: this.props.accent }]}>
                <View style={styles.listIcon}>
                  <Image style={styles.profileIcon} source={{ uri: item.profileUrl.replace('http://', 'https://') }}resizeMode="cover" borderRadius={20} />
                </View>
                <View style={styles.listInfo}>
                  <Text style={[styles.titleLabel, { color: this.props.text }]}>{item.nickname}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginRight: 10 }}>
                  <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Text style={this.onlineStyle(item.connectionStatus)}>{item.connectionStatus}</Text>
                    <Text style={[styles.descText, { color: this.props.text }]}>{(item.lastSeenAt === 0) ? '-' : moment(item.lastSeenAt).format('MM/DD h:mma')}</Text>
                  </View>
                </View>
              </View>
              }
          />
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  rowColor: state.theme.rowColor,
  text: state.theme.text,
  accent: state.theme.accent,
});

export default connect(mapStateToProps)(Members);
