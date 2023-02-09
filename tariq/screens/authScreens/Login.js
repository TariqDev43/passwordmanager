import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import tw from 'tailwind-react-native-classnames';
import Animated, {
  BounceIn,
  BounceInLeft,
  BounceInRight,
  BounceOutLeft,
  BounceOutRight,
  FadeIn,
  FadeOut,
  FlipInEasyX,
  FlipInEasyY,
  FlipOutEasyX,
  FlipOutEasyY,
  FlipOutYLeft,
  FlipOutYRight,
  RollInRight,
  SlideOutLeft,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import useTheme from '../../Contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import useUser from '../../Contexts/UserContext';
import { createUser, login } from '../../services/firebaseService';

const Login = () => {
  /*   ALL States
   ********************************************* */
  const [passowrd, setPassword] = useState(true);
  const [confirmPassowrd, setConfirmPassword] = useState(true);
  const [loginPage, setLoginPage] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { changeUser } = useUser();

  // theme
  const { theme } = useTheme();

  // Animated Values
  const opacity = useSharedValue(true);

  // Focus States
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  // turning focus off
  const setFocusOff = () => {
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

  const loginFunc = async () => {
    try {
      setLoginLoading(true);
      const user = await login();
      setLoginLoading(false);
      setSuccess(true);
      setTimeout(() => {
        changeUser(user);
      }, 5000);
    } catch (err) {
      console.log(err.message);
    }
  };
  const registerFunc = async () => {
    try {
      setLoginLoading(true);
      const user = await createUser('test_username', 'a@b.com', 'abc123', 'test_name');
      changeUser(user);
    } catch (err) {
      console.log(err.message + 'this');
    }
  };

  return (
    <ImageBackground
      style={[tw` flex-1  justify-center  `, { backgroundColor: theme.mainBgColor }]}
      source={require('../../assets/bg.png')}
    >
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
          setFocusOff();
        }}
        style={[tw` flex-1 justify-center  `, {}]}
      >
        {/*  Main Div  Animated Logo
         *********************************************  */}
        <View style={[tw`absolute self-center top-24`]}>
          <LottieView
            autoPlay='true'
            style={[
              {
                width: 250,
                height: 250,
              },
            ]}
            source={require('../../assets/key.json')}
          />
        </View>

        {/*  Login Page
         *********************************************  */}
        {loginPage && (
          <Animated.View
            entering={BounceInLeft.duration(1000)}
            exiting={SlideOutLeft.duration(300)}
            style={[tw`flex-1 justify-end relative`, {}]}
          >
            {/* {success && (
              <Pressable
                style={[
                  tw` rounded-full absolute  z-10 self-center`,
                  {
                    backgroundColor: !success && theme.mainColor,
                    elevation: success ? 0 : 5,
                  },
                ]}
              >
                
              </Pressable>
            )} */}

            <Pressable
              // bottom-4 left-48
              style={[
                tw` rounded-full absolute  ${
                  success ? 'bottom-4 left-48' : 'bottom-12 right-11'
                } z-50 self-center`,
                {
                  elevation: success ? 0 : 5,
                },
              ]}
              onPress={loginFunc}
            >
              {!success && (
                <Animated.View exiting={FadeOut.duration(100)}>
                  <LinearGradient
                    style={[tw`p-4 rounded-full `, {}]}
                    colors={['#4FACFE', '#21ECA0']}
                    start={{ x: -1, y: 0 }}
                    end={{ x: 2, y: 0 }}
                  >
                    {!loginLoading && !success && (
                      <Animated.View exiting={FadeOut.duration(200)}>
                        <AntDesign name='arrowright' size={30} color='white' />
                      </Animated.View>
                    )}

                    {loginLoading && !success && (
                      <Animated.View
                        entering={FadeIn.duration(800)}
                        exiting={FadeOut.duration(100)}
                      >
                        <ActivityIndicator
                          size='small'
                          style={[tw`m-2`, { transform: [{ scale: 1.5 }] }]}
                          color='white'
                        />
                      </Animated.View>
                    )}
                  </LinearGradient>
                </Animated.View>
              )}
              {success && (
                <>
                  {!loginLoading && !success && (
                    <Animated.View exiting={FadeOut.duration(200)}>
                      <AntDesign name='arrowright' size={30} color='white' />
                    </Animated.View>
                  )}
                  {success && (
                    <Animated.View exiting={FadeOut.duration(200)}>
                      <LottieView
                        autoPlay
                        style={[
                          {
                            width: 130,
                            height: 130,
                          },
                        ]}
                        source={require('../../assets/success.json')}
                      />
                    </Animated.View>
                  )}
                  {loginLoading && !success && (
                    <Animated.View entering={FadeIn.duration(800)}>
                      <ActivityIndicator
                        size='small'
                        style={[tw`m-2`, { transform: [{ scale: 1.5 }] }]}
                        color='white'
                      />
                    </Animated.View>
                  )}
                </>
              )}
            </Pressable>

            <Animated.View style={tw`z-10`}>
              <View
                style={[
                  tw` mr-16 rounded-r-full`,
                  {
                    backgroundColor: theme.bgColor,
                    elevation: 8,
                    shadowColor: 'grey',
                  },
                ]}
              >
                <View style={tw` ml-4 my-5 mr-12`}>
                  {/* ******* Email  ******* */}
                  <View style={tw`flex-row  items-center justify-between mt-3 mb-2 `}>
                    <MaterialCommunityIcons
                      name='email'
                      color={emailFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      placeholder='Enter Email'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2 `,
                        {
                          borderBottomColor: emailFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                    />
                  </View>
                  {/* ******* Password  ******* */}
                  <View style={tw`flex-row items-center justify-between mt-4 mb-5 `}>
                    <MaterialCommunityIcons
                      name='key'
                      color={passwordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      placeholder='Enter Password'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2`,
                        {
                          borderBottomColor: passwordFocus ? theme.mainColor : theme.grey,
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
                      name={passowrd ? 'eye-off' : 'eye'}
                      color={passwordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        )}
        {/*  Buttons
         *********************************************  */}
        {loginPage && (
          <Animated.View
            entering={BounceInRight.duration(1300)}
            exiting={SlideOutRight.duration(300)}
            style={[tw`h-1/3 mt-5   `, {}]}
          >
            <Animated.View style={[tw`mt-8 ml-16 items-end`]}>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-l-full p-3 pr-6 w-4/6`,
                  {
                    backgroundColor: theme.mainColor,
                    elevation: 6,
                  },
                ]}
                onPressIn={() => {
                  setLoginPage(!loginPage);
                }}
              >
                <Text style={[tw`font-semibold text-center text-lg text-white`, {}]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}

        {/*  Register
         *********************************************  */}
        {!loginPage && (
          <Animated.View
            entering={BounceInRight.duration(1000)}
            exiting={SlideOutRight.duration(300)}
            style={[tw`flex-1 justify-end`, {}]}
          >
            <TouchableOpacity
              style={[
                tw` rounded-full absolute bg-red-200 bottom-28 left-11 z-50 self-center`,
                {
                  backgroundColor: theme.mainColor,
                  elevation: 5,
                },
              ]}
              onPress={registerFunc}
            >
              <LinearGradient
                style={[tw`p-4 rounded-full `, {}]}
                colors={['#4FACFE', '#21ECA0']}
                start={{ x: -1, y: 0 }}
                end={{ x: 2, y: 0 }}
              >
                {!loginLoading && (
                  <Animated.View exiting={FadeOut.duration(200)}>
                    <AntDesign name='check' size={30} color='white' />
                  </Animated.View>
                )}
                {loginLoading && (
                  <Animated.View entering={FadeIn.duration(800)}>
                    <ActivityIndicator
                      size='small'
                      style={[tw`m-2`, { transform: [{ scale: 1.5 }] }]}
                      color='white'
                    />
                  </Animated.View>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <Animated.View>
              <View
                style={[
                  tw` ml-16 rounded-l-full`,
                  {
                    backgroundColor: theme.bgColor,
                    elevation: 8,
                    shadowColor: 'grey',
                  },
                ]}
              >
                <View style={tw` mr-4 my-5 ml-16`}>
                  {/* ******* UserName  ******* */}
                  <View style={tw`flex-row  items-center justify-between mt-3 mb-2 `}>
                    <MaterialCommunityIcons
                      name='account'
                      color={emailFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      placeholder='Enter Username'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2
            `,
                        {
                          borderBottomColor: emailFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                    />
                  </View>
                  {/* ******* Email  ******* */}
                  <View style={tw`flex-row  items-center justify-between mt-3 mb-2 `}>
                    <MaterialCommunityIcons
                      name='email'
                      color={emailFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      placeholder='Enter Email'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2
            `,
                        {
                          borderBottomColor: emailFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                    />
                  </View>
                  {/* ******* Password  ******* */}
                  <View style={tw`flex-row items-center justify-between mt-4 mb-2 `}>
                    <MaterialCommunityIcons
                      name='key'
                      color={passwordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      placeholder='Enter Password'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2 `,
                        {
                          borderBottomColor: passwordFocus ? theme.mainColor : theme.grey,
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
                      name={passowrd ? 'eye-off' : 'eye'}
                      color={passwordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                  </View>
                  {/* ******* Confirm Password  ******* */}
                  <View style={tw`flex-row items-center justify-between mt-4 mb-5 `}>
                    <MaterialCommunityIcons
                      name='key'
                      color={confirmPasswordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      placeholder='Enter Password'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2 `,
                        {
                          borderBottomColor: confirmPasswordFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      secureTextEntry={confirmPassowrd ? true : false}
                      onFocus={() => setConfirmPasswordFocus(true)}
                      onBlur={() => setConfirmPasswordFocus(false)}
                    />
                    <MaterialCommunityIcons
                      onPress={() => {
                        setConfirmPassword(!confirmPassowrd);
                      }}
                      name={confirmPassowrd ? 'eye-off' : 'eye'}
                      color={confirmPasswordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        )}
        {/*  Buttons
         *********************************************  */}
        {!loginPage && (
          <Animated.View
            entering={BounceInLeft.duration(1300)}
            exiting={SlideOutLeft.duration(100)}
            style={[tw`h-1/6 mt-5 mb-24`, {}]}
          >
            <Animated.View style={[tw`mt-8  mr-16`]}>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-r-full p-3 pr-6 w-1/2`,
                  {
                    backgroundColor: theme.mainColor,
                    elevation: 6,
                  },
                ]}
                onPressIn={() => {
                  setLoginPage(!loginPage);
                }}
              >
                <Text style={[tw`font-semibold text-center text-lg text-white`, {}]}>
                  Login Page
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </Pressable>
    </ImageBackground>
  );
};

export default Login;
