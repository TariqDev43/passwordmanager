import React from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useMemo } from 'react';
import { memo } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import { setDataToStorage } from '../services/storageService';

const ThemeContext = createContext({});

export const ThemeProvider = memo(({ children }) => {
  /* *************  States  **************** */
  const [themeMode, setThemeMode] = useState('light');
  const [mainColor, setMainColor] = useState('#0abdbf');
  const [selected, setSelected] = useState('Home');
  const LightTheme = {
    mainColor: mainColor,
    mainBgColor: '#F0F5F9',
    bgColor: '#ffffff',
    grey: 'lightgrey',
    mainTextColor: '#434242',
    oppositeTextColor: 'white',
    modalBg: '#ffffff',
  };
  const DarkTheme = {
    mainColor: mainColor,
    mainBgColor: 'black',
    bgColor: '#2C2A28',
    grey: 'lightgrey',
    mainTextColor: 'white',
    oppositeTextColor: 'black',
    modalBg: '#262626',
  };
  const GreyTheme = {
    mainColor: mainColor,
    mainBgColor: '#4b4a48',
    bgColor: '#5e5a57',
    grey: 'lightgrey',
    mainTextColor: 'white',
    oppositeTextColor: 'black',
    modalBg: '#262626',
  };

  const theme = themeMode == 'light' ? LightTheme : themeMode == 'dark' ? DarkTheme : GreyTheme;

  const changeTheme = useCallback((value) => {
    console.log(themeMode);
    console.log(value);

    setThemeMode(value);
    setDataToStorage('themeMode', value);
  });
  const changeColor = useCallback((val) => {
    setMainColor(val);
    setDataToStorage('mainColor', val);
  });
  const changeScreen = useCallback((val) => {
    setSelected(val);
  });
  const themeValues = useMemo(
    () => ({
      theme,
      setThemeMode,
      changeTheme,
      themeMode,
      changeColor,
      selected,
      changeScreen,
    }),
    [theme, themeMode, selected]
  );
  return <ThemeContext.Provider value={themeValues}>{children}</ThemeContext.Provider>;
});

export default function useTheme() {
  return useContext(ThemeContext);
}
