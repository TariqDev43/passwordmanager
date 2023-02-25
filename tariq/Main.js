import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/authScreens/Login.js';
import InitializeScreen from './screens/authScreens/InitializeScreen';
import BottomNav from './Navigators/bottomNav.js';
import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import tw from 'tailwind-react-native-classnames';

import { getDataFromStorage, setDataToStorage } from './services/storageService';

import { View } from 'react-native';
import useTheme from './Contexts/ThemeContext.js';
import useSettings from './Contexts/SettingContext.js';
import useUser from './Contexts/UserContext.js';

const Main = () => {
  const Stack = createNativeStackNavigator();
  const [check, setCheck] = useState(null);
  const { changeColor, themeMode, mainColor, changeTheme } = useTheme();
  const { elevation, elevationValue, changeElevationValue, changeElevation } = useSettings();

  const { user } = useUser();

  const checkMainColor = useCallback(async () => {
    const mainColor = await getDataFromStorage('mainColor');
    if (mainColor) {
      changeColor(mainColor);
    } else {
      await setDataToStorage('mainColor', '#0abdbf');
      changeColor('#0abdbf');
    }
  }, []);
  const checkThemeMode = useCallback(async () => {
    const themeMode = await getDataFromStorage('themeMode');
    if (themeMode) {
      changeTheme(themeMode);
    } else {
      await setDataToStorage('themeMode', 'light');
      changeTheme('light');
    }
  }, []);
  const checkElevation = useCallback(async () => {
    const elevation = await getDataFromStorage('elevation');
    if (elevation) {
      changeElevation(elevation === 'true' ? true : false);
    } else {
      await setDataToStorage('elevation', 'true');
      changeElevation(true);
    }
  }, []);
  const checkElevationValue = useCallback(async () => {
    const elevationValue = await getDataFromStorage('elevationValue');
    if (elevationValue) {
      changeElevationValue(parseInt(elevationValue));
    } else {
      await setDataToStorage('elevationValue', '2');
      changeElevationValue(2);
    }
  }, []);

  useEffect(() => {
    // deleteAllStorageKeys();
    const keys = async () => {
      try {
        await checkMainColor();
        await checkThemeMode();
        await checkElevation();
        await checkElevationValue();
      } catch (err) {
        console.log(err.message);
      }
    };
    keys();
  }, []);

  useEffect(() => {
    if (!themeMode && !mainColor && !elevation && !elevationValue) {
      setCheck(true);
    }
  }, [themeMode, mainColor, elevation, elevationValue]);

  const userExits = user;
  return (
    <NavigationContainer>
      {check != null ? (
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
          {!userExits ? (
            <Stack.Screen name='Login' component={Login} />
          ) : (
            <>
              <Stack.Screen name='Initialize' component={InitializeScreen} />
              <Stack.Screen name='BottomNav' component={BottomNav} />
            </>
          )}
        </Stack.Navigator>
      ) : (
        <View style={[tw`flex-1 justify-center items-center`, {}]}>
          <LottieView
            autoPlay
            loop
            onAnimationFinish={async () => {
              setEmailCopy(false);
            }}
            style={[
              tw`ml-1 mr-2`,
              {
                width: 500,
                height: 500,
              },
            ]}
            source={require('./assets/loading.json')}
          />
        </View>
      )}

      <StatusBar style={themeMode == 'light' ? 'dark' : 'light'} />
    </NavigationContainer>
  );
};

export default Main;
