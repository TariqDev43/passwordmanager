import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/authScreens/Login.js";
import BottomNav from "./Navigators/bottomNav.js";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

import {
  deleteAllStorageKeys,
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
  const { changeColor, themeMode: theme } = useTheme();
  const { changeElevationValue, changeElevation } = useSettings();
  const { userStatus } = useUser();

  useLayoutEffect(() => {
    deleteAllStorageKeys();
    const keys = async () => {
      const keys = await getAllStorageKeys();
      if (keys.length == 0) {
        await setDataToStorage("themeMode", "light");
        await setDataToStorage("mainColor", "#FF6D00");
        await setDataToStorage("elevation", "true");
        await setDataToStorage("elevationValue", "1");
        setThemeMode("light");
      } else {
        const theme = await getDataFromStorage("themeMode");
        const mainColor = await getDataFromStorage("mainColor");
        const elevation = await getDataFromStorage("elevation");
        const elevationValue = await getDataFromStorage("elevationValue");

        setThemeMode(theme);
        try {
          theme == "light" ? setThemeMode("light") : setThemeMode("dark");
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
  const user = userStatus;
  return (
    <NavigationContainer>
      {themeMode != null ? (
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {!user ? (
            <Stack.Screen name="Login" component={Login} />
          ) : (
            <Stack.Screen name="BottomNav" component={BottomNav} />
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
