import { UPDATE_THEME } from '../actions/theme';

const initState = {
  backgroundPrimary: '#2c2929',
  accent: '#40c4ff',
  text: '#fff',
  rowColor: '#313131',
  header: '#40c4ff',
  gradient: '#73F7FF',
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_THEME:
      return {
        ...state,
        backgroundPrimary: action.backgroundPrimary,
        accent: action.accent,
        text: action.text,
        header: action.header,
        rowColor: action.rowColor,
        gradient: action.gradient,
      };
    default:
      return state;
  }
};

export default reducer;
