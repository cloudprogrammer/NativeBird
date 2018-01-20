import EStyleSheet from 'react-native-extended-stylesheet';

module.exports = EStyleSheet.create({
  // Text
  h1: {
    fontSize: 50,
  },
  h2: {
    fontSize: 40,
  },
  h3: {
    fontSize: 30,
  },
  p: {
    fontSize: 20,
  },
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bold',
  },
  textCenter: {
    textAlign: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  // Padding
  paddingTop: {
    paddingTop: 10,
  },
  // Inputs
  input: {
    padding: 5,
    borderRadius: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  // Progress
  progressContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    paddingBottom: 20,
  },
  aboutText: {
    fontSize: 20,
    textAlign: 'center',
  },
});
