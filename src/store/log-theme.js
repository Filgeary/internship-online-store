export const themeLight = {
  color1: '#777',
  color2: '#333',
  color3: '#d77332',
  color4: '#2fa827',
};

export const themeDark = {
  color1: '#d4d4d4',
  color2: '#e3e3e3',
  color3: '#d77332',
  color4: '#2fa827',
};

export const theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ? themeDark
  : themeLight;