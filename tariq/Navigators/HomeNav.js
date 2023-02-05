import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { memo } from "react";
import DetailsScreen from "../screens/bottomTabsScreens/DetailsScreen";
import Home from "../screens/bottomTabsScreens/Home";
const HomeNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <>
      {/* TopBar */}
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default memo(HomeNav);
