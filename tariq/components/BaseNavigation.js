import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

import { useNavigation } from '@react-navigation/native';
import useTheme from '../Contexts/ThemeContext';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const BaseNavigation = () => {
  /*   ALL STATES
   ********************************************* */
  //  all states
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [selected, setSelected] = useState('home');

  // All animation
  const offset = useSharedValue(15);

  const animatedNavStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(offset.value, { duration: 200 }) }],
    };
  });
  /*   ALL FUNCTIONS
   ********************************************* */

  const nav = [
    {
      icon: 'home',
      path: 'Home',
    },
    {
      icon: 'heart',
      path: 'Fav',
    },
    {
      icon: 'cog',
      path: 'Settings',
    },
  ];
  return (
    <View
      style={[
        tw`absolute justify-evenly self-center bottom-5 rounded-2xl 
      flex-row py-1 px-1`,
        { backgroundColor: theme.mainColor, width: 240 },
      ]}
    >
      <Animated.View
        style={[
          tw`bg-white px-7 left-0 py-5 rounded-xl self-center absolute `,
          { transform: [{ translateX: offset.value }] },
          animatedNavStyle,
        ]}
      ></Animated.View>
      {nav.map((i) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(i.path);
            setSelected(i.icon);
            offset.value = i.icon == 'home' ? 15 : i.icon == 'heart' ? 93 : 168;
          }}
          key={i.icon}
          style={[tw`my-2 flex-1 justify-center items-center`, {}]}
        >
          <MaterialCommunityIcons
            name={i.icon == selected ? i.icon : `${i.icon}-outline`}
            size={30}
            color={i.icon == selected ? theme.mainColor : 'white'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default memo(BaseNavigation);
