import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import moment from 'moment';
import CircleSnail from 'react-native-progress/CircleSnail';
import SendBird from 'sendbird';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Container from '../../components/container';
import { connectAlert } from '../../components/alert';

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
    fontSize: 16,
  },
});

class InviteUser extends Component {
  static navigationOptions = props => ({
    headerRight: (
      <TouchableOpacity onPress={() => props.navigation.state.params.invite()}>
        <Icon name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'} color={this.props.accent} size={30} />
      </TouchableOpacity>
    ),
  })

  constructor(props) {
    super(props);
    sb = SendBird.getInstance();
    this.state = {
      channel: props.navigation.state.params.channel,
      list: [],
      listQuery: sb.createUserListQuery(),
      inviteList: [],
    };
  }

  componentWillMount() {
    this.getUserList();
  }

  componentDidMount() {
    this.props.navigation.setParams({ invite: this.onInvite });
  }

  onUserPress = (item) => {
    let { inviteList } = this.state;
    const userList = [];

    this.state.list.forEach((user) => {
      if (user.userId === item.userId) {
        if (user.check) {
          user.check = false;
          inviteList = inviteList.filter(invitee => invitee.userId !== user.userId);
        } else {
          user.check = true;
          inviteList.push(user);
        }
      }
      userList.push(user);
    }, this);

    this.setState({ list: userList, inviteList });
  }

  onInvite = () => {
    if (this.state.inviteList.length > 0) {
      if (!this.state.channel) {
        sb.GroupChannel.createChannel(this.state.inviteList, false, (channel, error) => {
          if (error) {
            this.props.alertWithType('error', 'Error Creating Channel', error.message ? error.message : 'No connection');
            return;
          }
          this.props.navigation.navigate('Chat', {
            channel, name: this.channelTitle(channel.members), onHideChannel: this.props.navigation.state.params.onHideChannel, refresh: this.props.navigation.state.params.refresh, currentUser: sb.currentUser.userId,
          });
        });
      } else {
        const inviteIds = this.state.inviteList.map(user => user.userId);
        this.state.channel.inviteWithUserIds(inviteIds, (response, error) => {
          if (error) {
            this.props.alertWithType('error', 'Error Inviting Users', error.message ? error.message : 'No connection');
            return;
          }
          this.props.navigation.goBack();
        });
      }
    } else {
      this.props.alertWithType('info', 'No Users Selected', '');
    }
  }

  getUserList = () => {
    this.state.listQuery.next((response, error) => {
      if (error) {
        if (error.message && error.message !== 'Query in progress.' ? error.message : 'No connection') {
          this.props.alertWithType('error', 'Error Loading Users', error.message ? error.message : 'No connection');
        }
        return;
      }

      const responsee = response.filter((user) => {
        const userr = user;
        userr.check = false;
        return userr.userId !== sb.currentUser.userId;
      });

      this.setState({ list: this.state.list.concat(responsee) });
    });
  }

  channelTitle = (members) => {
    // const members = [];
    let title = '';

    if (members.count === 2) {
      title = members[1].userId;
    } else {
      for (let i = 0; i < members.length; i += 1) {
        if (members[i].userId !== sb.currentUser.userId) {
          title += `${members[i].userId}, `;
        }
      }
    }

    return (title.length > 15) ? `${title.substring(0, 15)}...` : title;
  }

  render() {
    return (
      <Container>
        <View style={styles.listContainer}>
          { this.props.friends.length > 0 ?
            <FlatList
              onEndReached={() => this.getUserList()}
              onEndReachedThreshold={PULLDOWNDISTANCE}
              data={this.state.list}
              keyExtractor={item => item.nickname}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { this.onUserPress(item); }}>
                  <View style={[styles.listItem, { backgroundColor: this.props.rowColor, borderColor: this.props.accent }]}>
                    <View style={styles.listIcon}>
                      <Image
                        style={styles.profileIcon}
                        source={{ uri: item.profileUrl.replace('http://', 'https://') }}
                        resizeMode="cover"
                        borderRadius={20}
                        indicator={CircleSnail}
                        indicatorProps={{ color: ['#00bc8c', '#40c4ff', '#ffab00'], size: 25 }}
                      />
                    </View>
                    <View style={styles.listInfo}>
                      <Text style={[styles.titleLabel, { color: this.props.text }]}>{item.nickname}</Text>
                    </View>
                    <View style={{
 flex: 2, flexDirection: 'row', alignItems: 'flex-end', marginRight: 10,
}}
                    >
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Icon size={30} style={{ opacity: (item.check === true) ? 1 : 0.2 }} name="ios-checkmark" color={this.props.accent} />
                      </View>
                      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Text
                          style={{
 textAlign: 'center',
                            fontSize: 12,
                            color: (item.connectionStatus === 'online') ? '#00bc8c' : '#fff',
                            fontWeight: (item.connectionStatus === 'online') ? 'bold' : 'normal',
}}
                        >{item.connectionStatus}
                        </Text>
                        <Text style={[styles.descText, { color: this.props.text }]}>{(item.lastSeenAt === 0) ? '-' : moment(item.lastSeenAt).format('MM/DD HH:mm')}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
             )}
            /> :
          null}
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  friends: state.profile.friendUsernames,
  rowColor: state.theme.rowColor,
  accent: state.theme.accent,
  text: state.theme.text,
});

export default connect(mapStateToProps)(connectAlert(InviteUser));
