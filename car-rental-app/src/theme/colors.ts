/* ___ Colors sheet ___________________________________
    This file is were we declare colors, so that we 
    dont have to recreate colors throughout the appli-
    cation.
   ____________________________________________________*/

export const colors = {
  // Primary colors/Accent colors
  primary: '#FF6B1A',
  primaryPressed: '#DB5006',
  primaryText: '#C2410C',
  primarySoft: '#FFE3D1',
  primaryTint: '#FFF1E8',

  // Text color
  ink: '#15171C',
  textBody: '#3A3D44',
  textMuted: '#5B5E66',
  textSubtle: '#7A7D85',
  iconMuted: '#9A9CA1',

  // Background colors
  background: '#F5F5F3',
  surface: '#FFFFFF',
  border: '#E2E2DE',
  divider: '#EFEFEC',
  // unchecked checkbox/radio outline and the sheet's drag handle
  control: '#D6D6D2',
  handle: '#DDDDD9',
  // the dark upcoming-rental card
  inkSurface: '#24262C',
  inkBorder: '#2C2E35',
  inkMuted: '#A6A8AD',
  // dims the screen behind a bottom sheet
  overlay: 'rgba(21,23,28,0.4)',
} as const;
