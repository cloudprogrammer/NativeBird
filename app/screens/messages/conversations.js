import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Modal,
  Image,
  Platform,
} from 'react-native';
import moment from 'moment';
import SendBird from 'sendbird';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Container from '../../components/container';
import { MoreIcon, MenuIcon } from '../../components/header';
import style from '../../assets/styles';

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    borderBottomWidth: 0.5,
    padding: 5,
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15,
    overflow: 'hidden',
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  titleLabel: {
    fontSize: 15,

    fontFamily: 'Dosis',
    fontSize: 19,
  },
  memberLabel: {

    fontFamily: 'Dosis',
    fontSize: 16,
  },
  descText: {
    textAlign: 'center',
    fontFamily: 'Dosis',
    fontSize: 15,
  },
});

class Conversations extends Component {
  static navigationOptions = props => ({
    headerRight: (
      <MoreIcon
        onPress={() => props.navigation.state.params.channelMenu()}
      />
    ),
    headerLeft: (
      <MenuIcon onPress={() => props.navigation.navigate('DrawerOpen')} />
    ),
  });

  constructor(props) {
    super(props);
    this.sb = SendBird.getInstance();
    this.state = {
      channelList: [],
      listQuery: this.sb.GroupChannel.createMyGroupChannelListQuery(),
      editMode: false,
      showModal: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ channelMenu: this.showMenu });
    const ChannelHandler = new this.sb.ChannelHandler();
    ChannelHandler.onChannelChanged = (channel) => {
      this.channelUpdate(channel);
    };

    this.sb.addChannelHandler('ChannelHandlerInList', ChannelHandler);

    const ConnectionHandler = new this.sb.ConnectionHandler();
    ConnectionHandler.onReconnectSucceeded = () => {
      this.refreshChannelList();
    };
    this.sb.addConnectionHandler('ConnectionHandlerInList', ConnectionHandler);
    this.getChannelList();
  }

  componentWillUnmount() {
    this.sb.removeAllChannelHandlers();
    this.sb.removeAllConnectionHandlers();
  }

  onChannelPress = (channel) => {
    if (this.state.editMode) {
      Alert.alert(
        'Edit',
        null,
        [
          {
            text: 'leave',
            onPress: () => {
              channel.leave((response, error) => {
                if (error) {
                  this.props.alertWithType('error', 'Error Leaving Channel', error.message ? error.message : 'No connection');
                  return;
                }
                this.onHideChannel(channel);
              });
            },
          },
          {
            text: 'hide',
            onPress: () => {
              channel.hide((response, error) => {
                if (error) {
                  this.props.alertWithType('error', 'Error Hiding Channel', error.message ? error.message : 'No connection');
                  return;
                }
                this.onHideChannel(channel);
              });
            },
          },
          { text: 'Cancel' },
        ],
      );
    } else {
      this.props.navigation.navigate('Chat', {
        name: this.channelTitle(channel.members),
        channel,
        onHideChannel: this.onHideChannel,
        refresh: this.refresh,
        currentUser: this.sb.currentUser.userId,
      });
    }
  }

  onHideChannel = (channel) => {
    this.setState({ channelList: this.state.channelList.filter(ch => channel.url !== ch.url) });
  }

  getChannelList = () => {
    if (this.state.channelList.length === 0) {
      this.setState({ animating: true });
    }
    this.state.listQuery.next((channelList, error) => {
      if (error) {
        return;
      }
      const newList = this.state.channelList.concat(channelList);
      this.setState({ channelList: newList, loading: false, animating: false });
    });
  }

  channelUpdate = (channel) => {
    if (!channel) return;

    // const exist = false;
    const list = this.state.channelList.filter(ch => channel.url !== ch.url);

    list.unshift(channel);

    this.setState({
      channelList: list,
    });
  }

  refresh = (channel) => {
    this.channelUpdate(channel);
  }

  channelTitle = (members) => {
    let title = '';

    for (let i = 0; i < members.length; i += 1) {
      if (members[i].userId !== this.sb.currentUser.userId) {
        if (i === members.length - 1) {
          title += `${members[i].userId}`;
        } else {
          title += `${members[i].userId}, `;
        }
      }
    }
    return title;
  }

  channelIcon = (members) => {
    let repUser;

    for (let i = 0; i < members.length; i += 1) {
      if (members[i].userId !== this.sb.currentUser.userId) {
        repUser = members[i];
      }
    }

    if (repUser) {
      return repUser.profileUrl;
    }
    return '';
  }

  refreshChannelList = () => {
    const listQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
    listQuery.next((channelList, error) => {
      if (error) {
        return;
      }
      this.setState({ listQuery, channelList, loading: false });
    });
  }

  showMenu = () => {
    this.setState({ showModal: true });
  }

  menu = () => (
    <Modal transparent visible={this.state.showModal} animationType="fade">
      <View style={{
          backgroundColor: this.state.showModal ? 'rgba(0, 0, 0, 0.75)' : null, flex: this.state.showModal ? 1 : null, position: 'relative', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%',
        }}
      >
        <View style={{
            backgroundColor: this.props.accent, height: 'auto', width: '50%', borderRadius: 5, justifyContent: 'center', paddingVertical: 5,
          }}
        >
          <TouchableOpacity onPress={() => this.setState({ editMode: !this.state.editMode, showModal: false })} >
            <View style={[styles.button, { backgroundColor: this.props.background }]}>
              <Text style={[style.p, { color: this.props.text }, style.textCenter]}>{this.state.editMode ? 'Done Editing' : 'Edit' }</Text>
            </View>
          </TouchableOpacity>
          { !this.state.editMode ?
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('InviteUser', { onHideChannel: this.onHideChannel, refresh: this.refreshChannelList });
                  this.setState({ showModal: false });
                }}
              >
                <View style={[styles.button, { backgroundColor: this.props.background }]}>
                  <Text style={[style.p, { color: this.props.text }, style.textCenter]}>Create</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ showModal: false })}>
                <View style={[styles.button, { backgroundColor: this.props.background }]}>
                  <Text style={[style.p, { color: this.props.text }, style.textCenter]}>Done</Text>
                </View>
              </TouchableOpacity>
            </View>
          :
          null }
        </View>
      </View>
    </Modal>
  )

  render() {
    return (
      <Container>
        <StatusBar transulcent barStyle="light-content" backgroundColor={this.props.header} />
        { this.menu() }
        <View style={styles.listContainer}>
          <FlatList
            onEndReached={() => this.getChannelList()}
            onEndReachedThreshold={70}
            data={this.state.channelList}
            keyExtractor={item => item.url}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              (
                <TouchableOpacity onPress={() => this.onChannelPress(item)} key={item.url}>
                  <View style={[styles.listItem, { backgroundColor: this.props.rowColor, borderColor: this.props.accent }]}>
                    <View style={styles.listIcon}>
                      <Image
                        style={styles.channelIcon}
                        source={require('../../components/profileImage/avatarplaceholder.png')}
                      />
                    </View>
                    <View style={styles.listInfo}>
                      <View style={{ marginRight: 5, flex: 1 }} >
                        <Text style={[styles.titleLabel, { color: this.props.text }]} numberOfLines={1} >{this.channelTitle(item.members)}</Text>
                        <Text style={[styles.memberLabel, { color: this.props.text }]} numberOfLines={1}>{
                        item.lastMessage && item.lastMessage.messageType === 'file' ?
                        'Picture' :
                        item.lastMessage && item.lastMessage.message
                        }
                        </Text>
                      </View>
                      <View style={{
                          flex: 0, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'flex-end',
                        }}
                      >
                        <Text style={{ color: this.props.accent, fontFamily: 'Dosis', fontSize: 15 }}>
                          {item.unreadMessageCount}
                        </Text>
                        <Text style={[styles.descText, { color: this.props.text }]}>
                          {(!item.lastMessage || item.lastMessage.createdAt === 0) ? '-' : moment(item.lastMessage.createdAt).format('MM/DD h:mma')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }
            ListEmptyComponent={() =>
              (
                <View style={{
                  flex: 1, alignItems: 'center', paddingTop: '25%', paddingBottom: '25%',
                }}
                >
                  { !this.state.loading ?
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ color: this.props.text, fontSize: 20 }}>No Messages</Text>
                    </View> :
                null }
                </View>)}
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
  background: state.theme.backgroundPrimary,
  header: state.theme.header,
});

export default connect(mapStateToProps)(Conversations);
