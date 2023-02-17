import { Button, Keyboard, Pressable, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { memo, useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import useTheme from '../../Contexts/ThemeContext';
import useUser from '../../Contexts/UserContext';
import useSettings from '../../Contexts/SettingContext';
import tw from 'tailwind-react-native-classnames';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const Settings = () => {
  /*   ALL STATES
   ********************************************* */
  //  all contexts
  const { theme, changeColor, themeMode, changeTheme } = useTheme();
  const { elevation, elevationValue, changeElevation, changeElevationValue } = useSettings();
  const { changeUser } = useUser();

  const [settingsToggle, setSettingsToggle] = useState(elevation === 'true' ? true : false);

  const [slider, setSlider] = useState(parseInt(elevationValue));
  const [showColorModal, setShowColorModal] = useState(false);

  const colorList = [
    '#0abdbf',
    '#AA00FF',

    '#FF6D00',
    '#BF360C',
    'orange',

    '#69F0AE',
    '#FDD835',

    '#1b5e20',
    '#26A69A',
    '#64DD17',
    '#2196F3',
    'hotpink',
  ];

  // Ranimated
  const offset = useSharedValue(themeMode == 'light' ? 5 : themeMode == 'dark' ? 61 : 115);

  const themeStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(offset.value) }],
  }));

  useEffect(() => {
    offset.value = themeMode == 'light' ? 5 : themeMode == 'dark' ? 61 : 115;
  }, [themeMode]);

  /*   ALL FUNCTIONS
   ********************************************* */

  const handleShadow = async () => {
    setSettingsToggle(!settingsToggle);
    changeElevation(!settingsToggle);
  };
  const handleSlider = useCallback((val) => {
    changeElevationValue(val);
  });

  return (
    <SafeAreaView style={[tw`px-6 flex-1 `, { backgroundColor: theme.mainBgColor }]}>
      {/* TopBar */}
      <View style={tw`mb-5`}>
        <Text style={[tw`text-3xl font-extrabold`, { color: theme.mainColor }]}>Settings</Text>
      </View>
      {/* *********  Shadows *********** */}
      <View
        style={[
          tw`py-6 px-4 m-1 rounded-lg`,
          {
            elevation: elevation ? elevationValue : 0,
            shadowColor: elevation ? theme.mainColor : theme.mainBgColor,
            backgroundColor: theme.bgColor,
          },
        ]}
      >
        <View style={tw`flex-row  items-center`}>
          <MaterialCommunityIcons name={'box-shadow'} color={theme.mainColor} size={35} />
          <Text style={[tw`text-lg font-extrabold flex-1 mx-2 `, { color: theme.mainTextColor }]}>
            Shadow
          </Text>
          <Switch
            trackColor={{ false: theme.mainBgColor, true: theme.mainColor }}
            ios_backgroundColor='#3e3e3e'
            thumbColor={theme.grey}
            onValueChange={() => {
              handleShadow();
            }}
            value={settingsToggle}
          />
        </View>
        <View style={tw`flex-row items-center`}>
          <MaterialCommunityIcons name={'box-shadow'} color={theme.mainColor} size={35} />
          <Text style={[tw`text-lg font-extrabold flex-1 mx-2`, { color: theme.mainTextColor }]}>
            Value
          </Text>
          <Slider
            style={{ width: 150, height: 40 }}
            minimumValue={1}
            maximumValue={5}
            minimumTrackTintColor={theme.mainColor}
            maximumTrackTintColor={theme.mainColor}
            onValueChange={handleSlider}
            value={slider}
            thumbTintColor={theme.mainColor}
          />
        </View>
      </View>

      {/* *********  Theme color *********** */}
      <View
        className=''
        style={[
          tw`py-6 px-4 m-1 my-2 rounded-lg flex-row items-center `,
          {
            elevation: elevation ? elevationValue : 0,
            shadowColor: elevation ? theme.mainColor : theme.mainBgColor,

            backgroundColor: theme.bgColor,
          },
        ]}
      >
        <Ionicons name={'color-palette-outline'} color={theme.mainColor} size={35} />
        <Text style={[tw`text-lg font-extrabold flex-1 mx-2`, { color: theme.mainTextColor }]}>
          Theme Color
        </Text>
        <TouchableOpacity onPress={() => setShowColorModal(!showColorModal)}>
          <MaterialCommunityIcons name={'circle'} color={theme.mainColor} size={35} />
        </TouchableOpacity>
      </View>
      {/* *********  Theme Mode *********** */}
      <View
        className=''
        style={[
          tw`py-2 px-4 m-1 my-2 rounded-lg flex-row items-center `,
          {
            elevation: elevation ? elevationValue : 0,
            shadowColor: elevation ? theme.mainColor : theme.mainBgColor,

            backgroundColor: theme.bgColor,
          },
        ]}
      >
        <Ionicons
          name={themeMode == 'light' ? 'moon' : 'sunny'}
          size={28}
          color={theme.mainColor}
        />
        <Text style={[tw`text-lg font-extrabold flex-1 mx-2`, { color: theme.mainTextColor }]}>
          Theme
        </Text>
        <View
          style={[
            tw`py-1 rounded-xl flex-row justify-evenly items-center`,
            { backgroundColor: theme.mainBgColor, width: 180 },
          ]}
        >
          <Animated.View
            style={[
              tw`absolute  py-5 rounded-xl `,
              {
                width: 60,
                left: 0,
                backgroundColor: theme.bgColor,
                transform: [{ translateX: offset.value }],
              },
              themeStyles,
            ]}
          ></Animated.View>
          <TouchableOpacity
            onPress={() => {
              offset.value = 5;
              changeTheme('light');
            }}
            style={[tw`py-2 rounded-xl`]}
          >
            <Text style={[tw``, { color: theme.mainColor }]}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              offset.value = 61;
              changeTheme('dark');
            }}
            style={[tw`py-2 mx-1 rounded-xl`]}
          >
            <Text style={[tw``, { color: theme.mainColor }]}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              offset.value = 115;
              changeTheme('gray');
            }}
            style={[tw`py-2 rounded-xl`]}
          >
            <Text style={[tw``, { color: theme.mainColor }]}>Gray</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* *********  Logout  *********** */}
      <View
        className=''
        style={[
          tw`py-2 px-4 m-1 my-2 rounded-lg flex-row items-center `,
          {
            elevation: elevation ? elevationValue : 0,
            shadowColor: elevation ? theme.mainColor : theme.mainBgColor,

            backgroundColor: theme.bgColor,
          },
        ]}
      >
        <MaterialCommunityIcons name={'logout'} size={28} color={theme.mainColor} />
        <Text style={[tw`text-lg font-extrabold flex-1 mx-2`, { color: theme.mainTextColor }]}>
          Theme
        </Text>
        <Button onPress={() => changeUser(null)} title='logout' />
      </View>
      {/* Color Select Modal */}
      <Modal
        visible={showColorModal}
        onRequestClose={() => setShowColorModal(!showColorModal)}
        animationType='fade'
        transparent={true}
      >
        <Pressable
          style={tw`justify-center flex-1 items-center`}
          onPress={() => Keyboard.dismiss()}
        >
          <View
            style={[
              tw`pt-2 pb-5 px-4 rounded-xl w-64 justify-between `,
              { elevation: 36, backgroundColor: theme.mainBgColor },
            ]}
          >
            <View className='flex-row justify-between items-center'>
              <Text style={[tw`font-bold  text-lg `, { color: theme.mainColor }]}>Colors</Text>
            </View>
            {/* *******  Lopping icons here *********** */}
            <View style={tw`flex-row flex-wrap my-2 justify-center`}>
              {colorList.map((i) => {
                return (
                  <TouchableOpacity onPressIn={() => changeColor(i)} key={i}>
                    <MaterialCommunityIcons name={'circle'} size={62} color={i} />
                  </TouchableOpacity>
                );
              })}
            </View>
            {/**************** Buttons ***********************/}
            <View style={tw`flex-row justify-end mt-2 px-5 items-center `}>
              <TouchableOpacity onPress={() => setShowColorModal(!showColorModal)}>
                <Text style={[tw`font-bold text-xs`, { color: theme.mainColor }]}>
                  SELECT COLOR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default memo(Settings);
