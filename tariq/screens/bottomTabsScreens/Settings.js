import { Switch, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import useTheme from '../../Contexts/ThemeContext';
import useSettings from '../../Contexts/SettingContext';
import tw from 'tailwind-react-native-classnames';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import useUser from '../../Contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import ColorPicker from '../../components/ColorPicker';

const Settings = () => {
  /*   ALL STATES
   ********************************************* */
  //  all contexts
  const { theme, themeMode, changeTheme } = useTheme();
  const { elevation, elevationValue, changeElevation, changeElevationValue, setSelectedScreen } =
    useSettings();
  const { userInfo } = useUser();

  const [settingsToggle, setSettingsToggle] = useState(elevation);

  const [slider, setSlider] = useState(parseInt(elevationValue));
  const [showColorModal, setShowColorModal] = useState(false);

  const navigation = useNavigation();

  const colorList = [
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

  function handleBackButtonClick() {
    setSelectedScreen('Home');
    navigation.goBack();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);

  const handleShadow = async () => {
    setSettingsToggle(!settingsToggle);
    changeElevation(!settingsToggle);
  };
  const handleSlider = useCallback((val) => {
    changeElevationValue(val);
  });

  return (
    <SafeAreaView style={[tw`px-6 flex-1  `, { backgroundColor: theme.mainBgColor }]}>
      {/* TopBar */}
      {!showColorModal && (
        <Animated.View entering={ZoomIn} exiting={ZoomOut} style={[tw`flex-1`, {}]}>
          <View
            style={[
              tw`mb-5 flex-row items-center rounded-xl h-1/5 mx-1 pl-32`,
              {
                elevation: elevation ? elevationValue : 0,
                // shadowColor: elevation ? theme.mainColor : theme.mainBgColor,
                backgroundColor: theme.mainColor,
              },
            ]}
          >
            <View style={[tw`absolute -left-6 `, {}]}>
              <LottieView
                loop
                autoPlay
                style={{ width: 130, height: 130 }}
                source={require('../../assets/boySmiling.json')}
              />
            </View>
            <View style={[tw``, {}]}>
              <Text numberOfLines={1} style={[tw`font-semibold text-white `]}>
                {userInfo.username.toUpperCase()}
              </Text>
              <Text numberOfLines={1} style={[tw`font-semibold   text-white`]}>
                {userInfo.email}
              </Text>
            </View>
          </View>

          {/* *********  Shadows *********** */}

          <View
            style={[
              tw`py-3 px-4 m-1 rounded-lg`,
              {
                elevation: elevation ? elevationValue : 0,
                // shadowColor: elevation ? theme.mainColor : theme.mainBgColor,
                backgroundColor: theme.bgColor,
              },
            ]}
          >
            <View style={tw`flex-row  items-center`}>
              <MaterialCommunityIcons name={'box-shadow'} color={theme.mainColor} size={35} />
              <Text
                style={[tw`text-lg font-extrabold flex-1 mx-2 `, { color: theme.mainTextColor }]}
              >
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
            {elevation && (
              <View style={tw`flex-row items-center`}>
                <MaterialCommunityIcons name={'box-shadow'} color={theme.mainColor} size={35} />
                <Text
                  style={[tw`text-lg font-extrabold flex-1 mx-2`, { color: theme.mainTextColor }]}
                >
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
            )}
          </View>

          {/* *********  Theme color *********** */}

          <View
            className=''
            style={[
              tw`py-3 px-4 m-1 my-2 rounded-lg flex-row items-center `,
              {
                elevation: elevation ? elevationValue : 0,
                // shadowColor: elevation ? theme.mainColor : theme.mainBgColor,

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
            style={[
              tw`py-2 px-4 m-1 my-2 rounded-lg flex-row items-center `,
              {
                elevation: elevation ? elevationValue : 0,
                // shadowColor: elevation ? theme.mainColor : theme.mainBgColor,
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
                style={[tw`py-2 rounded-xl flex-1 px-2  items-center`]}
              >
                <Text style={[tw``, { color: theme.mainColor }]}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  offset.value = 61;
                  changeTheme('dark');
                }}
                style={[tw`py-2 mx-1 rounded-xl flex-1 px-2  items-center`]}
              >
                <Text style={[tw``, { color: theme.mainColor }]}>Dark</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  offset.value = 115;
                  changeTheme('gray');
                }}
                style={[tw`py-2  rounded-xl flex-1 px-2   items-center`]}
              >
                <Text style={[tw``, { color: theme.mainColor }]}>Gray</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}

      {showColorModal && (
        <Animated.View
          entering={ZoomIn}
          exiting={ZoomOut}
          style={[tw`justify-center items-center  h-5/6`, {}]}
        >
          <ColorPicker colorList={colorList} />
          <View>
            <TouchableOpacity style={[tw`p-4`, {}]} onPress={() => setShowColorModal(false)}>
              <Text style={[tw``, { color: theme.mainTextColor }]}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Color Select Modal */}
    </SafeAreaView>
  );
};

export default Settings;
