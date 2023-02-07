import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/authScreens/Login.js";
import InitializeScreen from "./screens/authScreens/InitializeScreen";
import BottomNav from "./Navigators/bottomNav.js";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

import {
  getAllStorageKeys,
  getDataFromStorage,
  setDataToStorage,
} from "./services/storageService";

import { useLayoutEffect } from "react";
import { Text } from "react-native";
import useTheme from "./Contexts/ThemeContext.js";
import useSettings from "./Contexts/SettingContext.js";
import useUser from "./Contexts/UserContext.js";

const Main = () => {
  const Stack = createNativeStackNavigator();
  const [themeMode, setThemeMode] = useState(null);
  const { changeColor, themeMode: theme, changeTheme } = useTheme();
  const { changeElevationValue, changeElevation } = useSettings();

  const { user } = useUser();

  useLayoutEffect(() => {
    const keys = async () => {
      const keys = await getAllStorageKeys();
      if (keys.length == 0) {
        await setDataToStorage("themeMode", "light");
        await setDataToStorage("mainColor", "#0abdbf");
        await setDataToStorage("elevation", "true");
        await setDataToStorage("elevationValue", "1");
        setThemeMode("light");
        changeTheme("light");
      } else {
        const storageTheme = await getDataFromStorage("themeMode");
        const mainColor = await getDataFromStorage("mainColor");
        const elevation = await getDataFromStorage("elevation");
        const elevationValue = await getDataFromStorage("elevationValue");

        try {
          storageTheme == "light"
            ? setThemeMode("light")
            : setThemeMode("dark");
        } catch (error) {
          console.log(error.message);
        }
        try {
          storageTheme == "light" ? changeTheme("light") : changeTheme("dark");
        } catch (error) {
          console.log(error.message);
        }
        changeColor(mainColor);
        changeElevation(elevation);
        changeElevationValue(elevationValue);
      }
    };

    keys();
  }, []);
  const userExits = user;
  return (
    <NavigationContainer>
      {themeMode != null ? (
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {!userExits ? (
            <Stack.Screen name="Login" component={Login} />
          ) : (
            <>
              <Stack.Screen name="BottomNav" component={BottomNav} />
              <Stack.Screen name="Initialize" component={InitializeScreen} />
            </>
          )}
        </Stack.Navigator>
      ) : (
        <Text className="text-center">Loading...</Text>
      )}

      <StatusBar style={theme == "light" ? "dark" : "light"} />
    </NavigationContainer>
  );
};

export default Main;