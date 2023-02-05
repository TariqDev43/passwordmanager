import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { memo, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

import { useNavigation } from "@react-navigation/native";
import useTheme from "../Contexts/ThemeContext";

const BaseNavigation = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selected, setSelected] = useState("home");
  const nav = [
    {
      icon: "home",
      path: "Home",
    },
    {
      icon: "heart",
      path: "Fav",
    },
    {
      icon: "cog",
      path: "Settings",
    },
  ];
  return (
    <View
      style={[
        tw`absolute self-center bottom-5 rounded-2xl 
      flex-row py-1 w-4/6 px-1`,
        { ...styles.navShadow, backgroundColor: theme.mainColor },
      ]}
    >
      {nav.map((i) => (
        <TouchableOpacity
          onPressIn={() => {
            navigation.navigate(i.path);
            setSelected(i.icon);
          }}
          key={i.icon}
          style={tw`justify-center py-1 items-center flex-1`}
        >
          <View style={[tw`w-3/4 px-2`]}>
            <View
              style={[
                tw`py-2 justify-center items-center rounded-full`,
                {
                  backgroundColor:
                    i.icon == selected ? "white" : theme.mainColor,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={i.icon == selected ? i.icon : `${i.icon}-outline`}
                size={30}
                color={i.icon == selected ? theme.mainColor : "white"}
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default memo(BaseNavigation);
