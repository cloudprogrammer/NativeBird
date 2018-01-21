import React, { Component } from 'react'; import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  PixelRatio,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import SendBird from 'sendbird';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons';
import ImageViewer from 'ImageViewer';
import ImagePicker from 'react-native-image-picker';
import Container from '../../components/container';

const ChatView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();

let sb = null;

const ipOptions = {
  title: 'Select Image To Send',
  mediaType: 'photo',
  allowsEditing: true,
  quality: 0.2,
  noData: true,
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  inputContainer: {
    height: 44,
    borderTopWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    flex: 1,
    padding: 5,
    margin: 0,
    fontSize: 17,
    borderRadius: 5,
  },
  photoButton: {
    marginTop: 11,
    marginRight: 10,
  },
  sendButton: {
    marginTop: 11,
    marginLeft: 10,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  listItemRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  adListItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    margin: 5,
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingRight: 10,
    overflow: 'hidden',
  },
  senderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  senderContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  senderText: {
    fontSize: 20,
  },
  dateText: {
    textAlign: 'center',
    fontSize: 22,
  },
  currentUserBubble: {
    alignSelf: 'flex-end',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    overflow: 'hidden',
    padding: 5,
  },
  messageBubble: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    borderRadius: 5,
    overflow: 'hidden',
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
});

class Chat extends Component {
  static navigationOptions = props => ({
    title: props.navigation.state.params.name,
  });

  static propTypes = ({
    accent: PropTypes.string,
    text: PropTypes.string,
    screenProps: PropTypes.object,
    alertWithType: PropTypes.func,
  });

  constructor(props) {
    super(props);
    sb = SendBird.getInstance();
    this.state = {
      channel: props.screenProps.messagesNav.state.params.channel,
      messageQuery:
      props.screenProps.messagesNav.state.params.channel.createPreviousMessageListQuery(),
      messages: [],
      imgsArr: [],
      currentUser: props.screenProps.messagesNav.state.params.currentUser,
      text: '',
      disabled: true,
      lastMessage: null,
      hasRendered: false,
      shown: false,
      index: 0,
      typing: {
        showTyping: false,
        userId: '',
      },
    };
  }

  componentDidMount() {
    if (!this.state.hasRendered) {
      this.state.hasRendered = true;

      this.getChannelMessage(false);
      if (this.state.channel.channelType === 'group') {
        this.state.channel.markAsRead();
      }

      const ChannelHandler = new sb.ChannelHandler();
      ChannelHandler.onMessageReceived = (channel, received) => {
        if (channel.url === this.state.channel.url) {
          const message = received;
          if (message.sender && message.sender.userId === this.state.lastMessage.sender.userId) {
            message.customType = 'continue';
          }
          const images = [];
          if (message.messageType === 'file') {
            images.push(message.url);
          }
          const newImages = images.concat(this.state.imgsArr);
          const messages = [];
          messages.push(message);
          const newMessageList = messages.concat(this.state.messages);
          this.setState({
            messages: newMessageList,
            imgsArr: newImages,
            lastMessage: message,
          });
          if (this.state.channel.channelType === 'group') {
            this.state.channel.markAsRead();
          }
        }
      };

      ChannelHandler.onTypingStatusUpdated = (channel) => {
        if (channel.url === this.state.channel.url) {
          if (channel.getTypingMembers().length === 0) {
            this.setState({
              typing: {
                showTyping: false,
                userId: '',
              },
            });
          } else {
            this.setState({
              typing: {
                showTyping: true,
                userId: channel.getTypingMembers()[0].userId,
              },
            });
          }
        }
      };

      sb.addChannelHandler('ChannelHandler', ChannelHandler);

      const ConnectionHandler = new sb.ConnectionHandler();
      ConnectionHandler.onReconnectSucceeded = () => {
        this.getChannelMessage(true);
        this.state.channel.refresh();
      };
      sb.addConnectionHandler('ConnectionHandler', ConnectionHandler);
    }
  }

  componentWillUnmount() {
    sb.removeChannelHandler('ChannelHandler');
    sb.removeConnectionHandler('ConnectionHandler');
  }

  onChangeText = (text) => {
    this.setState({
      text,
      disabled: !(text.trim().length > 0),
    });
    this.state.channel.startTyping();
    if (text.length <= 0) {
      this.state.channel.endTyping();
    }
  }

  onPhoto = () => {
    if (Platform.OS === 'android') {
      sb.disableStateChange();
    }
    ImagePicker.showImagePicker(ipOptions, (response) => {
      if (Platform.OS === 'android') {
        sb.enableStateChange();
      }
      if (response.error) {
        this.props.alertWithType('error', 'Something Went Wrong', response.error);
      } else {
        const source = { uri: response.uri };

        if (response.name) {
          source.name = response.fileName;
        } else {
          const paths = response.uri.split('/');
          source.name = paths[paths.length - 1];
        }

        if (response.type) {
          source.type = response.type;
        }

        Image.getSize(response.uri, () => {
          this.state.channel.sendFileMessage(source, (message, error) => {
            if (error) {
              this.props.alertWithType('error', 'Error Sending Picture', error.message ? error.message : 'No connection');
              return;
            }
            const images = [];
            images.push(message.url);
            const messages = [];
            messages.push(message);
            if (
              this.state.lastMessage &&
                message.createdAt - this.state.lastMessage.createdAt >
                  1000 * 60 * 60
            ) {
              messages.push({
                isDate: true,
                createdAt: message.createdAt,
                messageId: message.createdAt,
              });
            }

            const newImages = images.concat(this.state.imgsArr);
            const newMessageList = messages.concat(this.state.messages);
            this.setState({
              messages: newMessageList,
              imgsArr: newImages,
            });
            this.state.lastMessage = message;
          });
        });
      }
    });
  }

  getChannelMessage = (refresh) => {
    if (refresh) {
      this.state.messageQuery = this.state.channel.createPreviousMessageListQuery();
      this.state.messages = [];
      this.state.imgsArr = [];
    }

    if (!this.state.messageQuery.hasMore) {
      return;
    }
    this.state.messageQuery.load(20, false, (response, error) => {
      if (error) {
        return;
      }

      const messages = [];
      const images = [];
      for (let i = 0; i < response.length; i += 1) {
        const curr = response[i];
        if (i > 0) {
          const prev = response[i - 1];
          if (curr.sender.userId === prev.sender.userId) {
            curr.customType = 'continue';
          }
          if (curr.messageType === 'file') {
            images.push(curr.url);
          }
          if (curr.createdAt - prev.createdAt > 1000 * 60 * 60) {
            if (i > 1 && !messages[i - 2].hasOwnProperty('isDate')) {
              messages.splice(i - 1, 0, {
                isDate: true,
                createdAt: prev.createdAt,
                messageId: prev.createdAt,
              });
            }
          }
        }
        messages.push(curr);
        this.state.lastMessage = curr;
      }
      const newImages = this.state.imgsArr.concat(images);
      const newMessageList = this.state.messages.concat(messages.reverse());
      this.setState({
        messages: newMessageList,
        imgsArr: newImages,
      });
    });
  }

  sendMessage = () => {
    this.state.channel.endTyping();
    if (!this.state.text) {
      return;
    }

    const offlineMessages = [];
    offlineMessages.push({
      messageType: 'user',
      message: this.state.text,
      sender: {
        userId: this.state.currentUser,
      },
      customType: this.state.lastMessage && (this.state.currentUser === this.state.lastMessage.sender.userId) ? 'continue' : null,
    });
    this.setState({ disabled: true, messages: offlineMessages.concat(this.state.messages), text: '' });

    this.state.channel.sendUserMessage(
      this.state.text,
      '',
      (message, error) => {
        const newMessage = message;
        if (error) {
          this.props.alertWithType('error', 'Error Sending Message', error.message ? error.message : 'No connection');
          return;
        }
        const messages = [];
        if (
          (this.state.lastMessage &&
          newMessage.createdAt - this.state.lastMessage.createdAt > 1000 * 60 * 60) ||
          !this.state.lastMessage
        ) {
          messages.push({
            isDate: true,
            createdAt: newMessage.createdAt,
            messageId: newMessage.createdAt,
          });
        }

        const newMessageList = messages.concat(this.state.messages);
        this.setState({
          messages: newMessageList,
        });
        this.setState({ text: '', disabled: true, lastMessage: newMessage });
      },
    );
  }

  textMessage = item => (
    <View
      key={item.messageId}
      style={[item.sender.userId === this.state.currentUser ? styles.listItemRight : styles.listItem, { transform: [{ scaleY: -1 }], paddingTop: item.customType === 'continue' ? 2 : 20 }]}
    >
      {item.sender.userId !== this.state.currentUser && !item.customType ?
        <View style={[styles.listIcon]}>
          <Image
            style={styles.senderIcon}
            key={item.sender.profileUrl}
            source={{ uri: item.sender.profileUrl.replace('http://', 'https://') }}
            resizeMode="cover"
            borderRadius={20}
          />
        </View> : null}
      <View style={[styles.senderContainer]}>
        {!item.customType && item.sender.userId !== this.state.currentUser ?
          <Text style={[styles.senderText, { color: this.props.text, textAlign: item.sender.userId === this.state.currentUser ? 'right' : 'left' }]}>
            {item.sender.nickname}
          </Text> : null}
        <Text
          style={[
            styles.senderText,
            item.sender.userId === this.state.currentUser ?
            styles.currentUserBubble : styles.messageBubble,
            {
            color: '#fff',
            textAlign: item.sender.userId === this.state.currentUser ? 'right' : 'left',
            backgroundColor: item.sender.userId === this.state.currentUser ? this.props.accent : '#000',
            marginLeft: item.customType &&
            item.sender.userId !== this.state.currentUser ? 50 : 0,
          },
        ]}
          selectable
          selectionColor={this.props.accent}
        >
          {item.message}
        </Text>
      </View>
    </View>
  );

  imageMessage = item => (
    <View key={item.messageId}>
      <TouchableOpacity
        onPress={() => {
          this.setState({ index: this.state.imgsArr.indexOf(item.url), shown: true });
        }}
      >
        <View
          style={[item.sender.userId === this.state.currentUser ? styles.listItemRight : styles.listItem, { transform: [{ scaleY: -1 }], paddingTop: item.customType === 'continue' ? 2 : 20 }]}
        >
          {item.sender.userId !== this.state.currentUser && !item.customType ?
            <View style={[styles.listIcon]}>
              <Image
                style={styles.senderIcon}
                key={item.sender.profileUrl}
                source={{
                  uri: item.sender.profileUrl.replace(
            'http://',
            'https://',
          ),
                }}
                resizeMode="cover"
                borderRadius={20}
              />
            </View> :
      null}
          <View style={styles.senderContainer}>
            {!item.customType && item.sender.userId !== this.state.currentUser ?
              <Text
                style={[styles.senderText, {
                  color: this.props.text,
                  textAlign: item.sender.userId === this.state.currentUser ? 'right' : 'left',
                  marginLeft: item.customType &&
                item.sender.userId !== this.state.currentUser ? 50 : 0,
                }]}
              >
                {item.sender.nickname}
              </Text> :
        null}
            <Image
              style={{
                width: '50%',
                height: 250,
                borderRadius: 10,
                overflow: 'hidden',
                marginLeft: item.customType &&
              item.sender.userId !== this.state.currentUser ? 50 : 0,
                alignSelf: item.sender.userId === this.state.currentUser ? 'flex-end' : 'flex-start',
}}
              key={item.url}
              source={{
                uri: item.url.replace('http://', 'https://'),
              }}
              resizeMode="cover"
              borderRadius={10}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )

  dateMessage = item => (
    <View
      key={item.createdAt}
      style={[
        styles.listItem,
      { transform: [{ scaleY: -1 }] },
        {
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          marginVertical: 20,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            borderColor: this.props.accent,
            borderBottomWidth: 2,
            flex: 1,
            paddingRight: 5,
          }}
        />
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={[styles.dateText, { color: this.props.text }]}>
            {moment(item.createdAt).calendar()}
          </Text>
        </View>
        <View
          style={{
            borderColor: this.props.accent,
            borderBottomWidth: 2,
            flex: 1,
            paddingLeft: 5,
          }}
        />
      </View>
    </View>
  )

  render() {
    return (
      <Container>
        <ImageViewer
          shown={this.state.shown}
          imageUrls={this.state.imgsArr}
          onClose={() => this.setState({
            shown: false,
          })}
          index={this.state.index}
        />
        <ChatView behavior="padding" style={styles.container} keyboardOffset={-64} >
          <View style={[styles.chatContainer, { transform: [{ scaleY: -1 }] }]}>
            <FlatList
              onEndReached={() => this.getChannelMessage(false)}
              onEndReachedThreshold={75}
              data={this.state.messages}
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.messageId}
              renderItem={({ item }) => {
                if (item.hasOwnProperty('isDate')) {
                  return this.dateMessage(item);
                } else if (item.messageType === 'user') {
                  return this.textMessage(item);
                } else if (item.messageType === 'file') {
                  return this.imageMessage(item);
                } return null;
              }}
            />
          </View>
          {
            this.state.typing.showTyping ?
              <View>
                <Text style={{ color: this.props.text, backgroundColor: 'transparent', paddingLeft: 10 }} >
                  {`${this.state.typing.userId} is typing...`}
                </Text>
              </View>
            :
            null
          }
          <View style={[styles.inputContainer, { borderColor: this.props.accent }]}>
            <TouchableOpacity onPress={() => this.onPhoto()}>
              <Icon name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'} color={this.props.accent} size={30} />
            </TouchableOpacity>
            <TextInput
              style={[styles.textInput, {
                backgroundColor: 'transparent',
                color: this.props.accent,
              }]}
              placeholder="Type a message..."
              placeholderTextColor={this.props.accent}
              onChangeText={this.onChangeText}
              value={this.state.text}
              multiline
              autoFocus={false}
              autoCapitalize="none"
              blurOnSubmit={false}
              maxLength={1000}
              selectionColor={this.props.accent}
              underlineColorAndroid="transparent"
              disableFullscreenUI
            />
            <TouchableOpacity
              style={[styles.sendButton]}
              onPress={this.sendMessage}
              disabled={this.state.disabled}
            >
              <Text style={{ color: this.state.disabled ? '#9e9e9e' : this.props.accent, fontSize: 17 }} allowFontScaling>
                send
              </Text>
            </TouchableOpacity>
          </View>
        </ChatView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  friends: state.profile.friendUsernames,
  accent: state.theme.accent,
  background: state.theme.backgroundPrimary,
  text: state.theme.text,
});

export default connect(mapStateToProps)(Chat);
