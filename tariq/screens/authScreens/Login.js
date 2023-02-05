import React, { useState } from "react";
import {
  Button,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import tw from "tailwind-react-native-classnames";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import useTheme from "../../Contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Login = () => {
  /*   ALL States
   ********************************************* */
  const [passowrd, setPassword] = useState(true);

  // theme
  const { theme } = useTheme();

  // Animated Values
  const opacity = useSharedValue(true);

  // Focus States
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [hintFocus, setHintFocus] = useState(false);

  // turning focus off
  const setFocusOff = () => {
    setHintFocus(false);
    setEmailFocus(false);
    setPasswordFocus(false);
  };

  /*   All Function
   ********************************************* */
  const loginDiv = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value ? 1 : 0, { duration: 1000 }),

    // transform: [
    //   {
    //     translateY: withRepeat(
    //       withSequence(
    //         withTiming(-15),
    //         withDelay(1500, withTiming(0)),
    //         withTiming(-15)
    //       ),
    //       -1
    //     ),
    //   },
    // ],
  }));

  const loginFunc = () => {
    setFocusOff();
    Keyboard.dismiss();
  };

  return (
    // <ImageBackground
    //   style={tw` flex-1 justify-center items-center `}
    //   source={require("../../assets/bg.png")}
    // >
    <View
      style={[
        tw`flex-1 justify-center items-center `,
        {
          backgroundColor: theme.mainBgColor,
        },
      ]}
    >
      {/*  Main Div
       *********************************************  */}

      <View
        style={[tw`absolute top-8`, { backgroundColor: theme.mainBgColor }]}
      >
        <LottieView
          autoPlay="true"
          style={[
            {
              width: 200,
              height: 200,
            },
          ]}
          source={require("../../assets/key.json")}
          // source={require("../../assets/boySmiling.json")}
        />
      </View>
      <Animated.View
        style={[
          tw`w-5/6 rounded-xl  `,
          {
            elevation: 8,
            backgroundColor: theme.bgColor,
          },
          loginDiv,
        ]}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            setFocusOff();
          }}
          style={[tw`pt-8 pb-7 px-4 `, {}]}
        >
          <Text
            style={[
              tw`text-center font-extrabold text-3xl`,
              { color: theme.mainColor },
            ]}
          >
            LOGIN
          </Text>
          <View style={tw`my-8  mx-2 `}>
            {/* ******* Email  ******* */}
            <View style={tw`flex-row items-center justify-between mb-5 mt-2 `}>
              <MaterialCommunityIcons
                name="email"
                color={emailFocus ? theme.mainColor : theme.grey}
                size={22}
              />
              <TextInput
                placeholder="Enter Email"
                placeholderTextColor={
                  theme.themeMode == "dark" ? theme.grey : "darkgray"
                }
                style={[
                  tw`flex-1 mx-3 border-b-2
                    `,
                  {
                    borderBottomColor: emailFocus
                      ? theme.mainColor
                      : theme.grey,
                    color: theme.mainTextColor,
                  },
                ]}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </View>
            {/* ******* Password  ******* */}
            <View style={tw`flex-row items-center justify-between mt-5`}>
              <MaterialCommunityIcons
                name="key"
                color={passwordFocus ? theme.mainColor : theme.grey}
                size={22}
              />
              <TextInput
                placeholder="Enter Password"
                placeholderTextColor={
                  theme.themeMode == "dark" ? theme.grey : "darkgray"
                }
                style={[
                  tw`flex-1 mx-3 border-b-2
                    `,
                  {
                    borderBottomColor: passwordFocus
                      ? theme.mainColor
                      : theme.grey,
                    color: theme.mainTextColor,
                  },
                ]}
                secureTextEntry={passowrd ? true : false}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <MaterialCommunityIcons
                onPress={() => {
                  setPassword(!passowrd);
                }}
                name={passowrd ? "eye-off" : "eye"}
                color={passwordFocus ? theme.mainColor : theme.grey}
                size={22}
              />
            </View>
          </View>
          {/**************** Buttons ***********************/}
          <View style={tw`flex-row justify-end items-center mt-2`}>
            <TouchableOpacity
              style={[
                tw` py-2 px-3 rounded`,
                {
                  backgroundColor: theme.mainColor,
                  elevation: 3,
                },
              ]}
              onPress={() => {
                loginFunc();
              }}
            >
              <Text style={[tw`font-semibold text-base text-white`, {}]}>
                LOGIN
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Animated.View>
      {/* </ImageBackground> */}
    </View>
  );
};

export default Login;
