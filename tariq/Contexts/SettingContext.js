import React from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { memo } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import { setDataToStorage } from '../services/storageService';

const SettingContext = createContext({});

export const SettingProvider = memo(({ children }) => {
  /*  All States
   ********************************************* */
  const [elevation, setElevation] = useState(true);
  const [elevationValue, setElevationValue] = useState(1);

  /*   Functions
   ********************************************* */

  // change Elevation
  const changeElevation = useCallback((val) => {
    setElevation(val);
    setDataToStorage('elevation', `${val}`);
  });

  // change ElevationValue
  const changeElevationValue = useCallback((val) => {
    let value = Math.floor(val);
    setElevationValue(value);
    setDataToStorage('elevationValue', `${value}`);
  }, []);

  const settingValues = useMemo(
    () => ({
      elevation,
      elevationValue,
      changeElevation,
      changeElevationValue,
    }),
    [elevation, elevationValue, changeElevation, changeElevationValue]
  );
  return <SettingContext.Provider value={settingValues}>{children}</SettingContext.Provider>;
});

export default function useSettings() {
  return useContext(SettingContext);
}
