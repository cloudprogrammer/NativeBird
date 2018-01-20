export const UPDATE_THEME = 'UPDATE_THEME';

export const updateTheme = (backgroundPrimary, accent, text, header, rowColor, gradient) => ({
  type: UPDATE_THEME,
  backgroundPrimary,
  accent,
  text,
  header,
  rowColor,
  gradient,
});
