import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import tw from 'tailwind-react-native-classnames';
import Animated, {
  BounceInLeft,
  BounceInRight,
  FadeIn,
  FadeOut,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import useTheme from '../../Contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import useUser from '../../Contexts/UserContext';
import { createUser, login } from '../../services/firebaseService';
import ErrorModal from '../../components/ErrorModal';

const Login = () => {
  /*   ALL States
   ********************************************* */
  const [passowrdShow, setPasswordShow] = useState(true);

  const [registerPasswordShow, setRegisterPasswordShow] = useState(true);
  const [registerConfirmPasswordShow, setRegisterConfirmPasswordShow] = useState(true);

  const [loginPage, setLoginPage] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);
  const [successRegister, setSuccessRegister] = useState(false);
  const loginSuccess = useRef(null);
  const registerSuccess = useRef(null);
  const { changeUser } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalBody, setModalBody] = useState(null);

  // Login Fiels
  const [loginEmail, setLoginEmail] = useState(null);
  const [loginPassword, setLoginPassword] = useState(null);

  // Register Fiels
  const [username, setUsername] = useState(null);
  const [registerEmail, setRegisterEmail] = useState(null);
  const [registerPassword, setRegisterPassword] = useState(null);
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState(null);

  // theme
  const { theme } = useTheme();

  // login States
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  // register States
  const [registerEmailFocus, setRegisterEmailFocus] = useState(false);
  const [registerPasswordFocus, setRegisterPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  // turning focus off
  const setFocusOff = () => {
    setEmailFocus(false);
    setPasswordFocus(false);
    setUsernameFocus(false);
    setRegisterEmailFocus(false);
    setRegisterPasswordFocus(false);
    setConfirmPasswordFocus(false);
  };

  // Error Modal
  const [showModal, setShowModal] = useState(false);

  /*   All Function
   ********************************************* */

  const loginFunc = async () => {
    if (loginEmail == null) {
      setShowModal(true);
      setModalTitle('Login Error');
      setModalBody('Email Is Required');
      return;
    }
    if (loginPassword == null) {
      setShowModal(true);
      setModalTitle('Login Error');
      setModalBody('Password Is Required');
      return;
    }
    setFocusOff();
    try {
      setLoginLoading(true);
      // const user = await login('a@b.com', 'abc123');
      const user = await login(loginEmail, loginPassword);
      if (user.uid) {
        setLoginLoading(false);
        setSuccessLogin(true);
        loginSuccess.current?.play();
        setUserInfo(user);
      } else {
        setLoginLoading(false);
        setModalTitle('Login Error');
        setModalBody('user not returned');
      }
    } catch (err) {
      setLoginLoading(false);
      setShowModal(true);
      setModalTitle('Login Error');
      let loginErrMsg;
      if (err.message.includes('wrong-password')) {
        loginErrMsg = 'Wrong Password';
      } else if (err.message.includes('invalid-email')) {
        loginErrMsg = 'Invalid Email';
      } else if (err.message.includes('user-not-found')) {
        loginErrMsg = 'User not found.\nPlease create an account first';
      } else {
        loginErrMsg = err.message;
      }
      setModalBody(loginErrMsg);
    }
  };
  const registerFunc = async () => {
    setFocusOff();
    if (username == null) {
      setShowModal(true);
      setModalTitle('Register Error');
      setModalBody('Username Is Required');
      return;
    }
    if (registerEmail == null) {
      setShowModal(true);
      setModalTitle('Register Error');
      setModalBody('Email Is Required');
      return;
    }
    if (registerPassword == null) {
      setShowModal(true);
      setModalTitle('Register Error');
      setModalBody('Password Is Required');
      return;
    }
    if (registerConfirmPassword == null) {
      setShowModal(true);
      setModalTitle('Register Error');
      setModalBody('Confirm Password Is Required');
      return;
    }
    if (registerPassword != registerConfirmPassword) {
      setShowModal(true);
      setModalTitle('Register Error');
      setModalBody('Passwords Do Not Match');
      return;
    }
    try {
      setLoginLoading(true);
      // const user = await createUser('a@b.com', 'abc123', 'test');
      const user = await createUser(registerEmail, registerPassword, username);
      if (user.error) {
        setShowModal(true);
        setModalTitle('Login Error');
        setModalBody(user.error.message);
        setLoginLoading(false);
        return;
      }
      if (user.uid) {
        setLoginLoading(false);
        setSuccessRegister(true);
        registerSuccess.current?.play();
        setUserInfo(user);
      } else {
        setShowModal(true);
        setModalTitle('Register Error');
        setModalBody('user not returned');
      }
    } catch (err) {
      setSuccessRegister(false);
      setLoginLoading(false);
      setShowModal(true);
      setModalTitle('Register Error');
      let registerErrMsg;
      if (err.message.includes('email-already-in-use')) {
        registerErrMsg = 'Email Already In Use';
      } else if (err.message.includes('invalid-email')) {
        registerErrMsg = 'Invalid Email';
      } else {
        registerErrMsg = err.message;
      }
      setModalBody(registerErrMsg);
    }
  };

  return (
    <ImageBackground
      style={[tw` flex-1  justify-center  `, { backgroundColor: theme.mainBgColor }]}
      source={require('../../assets/bg.png')}
    >
      <ErrorModal
        show={showModal}
        setShow={setShowModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />

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
            autoPlay
            loop
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
            style={[tw`flex-1 justify-end z-0 `, {}]}
          >
            <Pressable
              style={[
                tw` rounded-full absolute  bottom-12 right-10 z-50 self-center`,
                {
                  elevation: successLogin ? 0 : 5,
                },
              ]}
              onPress={loginFunc}
            >
              <LinearGradient
                style={[tw`${successLogin ? 'p-0' : 'p-4'} rounded-full `, {}]}
                colors={['#4FACFE', '#21ECA0']}
                start={{ x: -1, y: 0 }}
                end={{ x: 2, y: 0 }}
              >
                <Animated.View>
                  {!loginLoading && !successLogin && (
                    <AntDesign name='arrowright' size={30} color='white' />
                  )}
                  {loginLoading && !successLogin && (
                    <ActivityIndicator
                      size='small'
                      style={[tw`m-2`, { transform: [{ scale: 1.5 }] }]}
                      color='white'
                    />
                  )}
                  {successLogin && (
                    <LottieView
                      autoPlay={false}
                      loop={false}
                      ref={loginSuccess}
                      onAnimationFinish={async () => {
                        setSuccessLogin(false);
                        changeUser(userInfo);
                      }}
                      style={[
                        {
                          width: 60,
                          height: 60,
                        },
                      ]}
                      source={require('../../assets/success.json')}
                    />
                  )}
                </Animated.View>
              </LinearGradient>
            </Pressable>
            <Animated.View>
              <View
                style={[
                  tw` mr-16 rounded-r-full`,
                  {
                    backgroundColor: theme.bgColor,
                    elevation: 8,
                  },
                ]}
              >
                <View style={tw` ml-4 my-5 mr-12`}>
                  {/* ******* Email  ******* */}
                  <View style={tw`flex-row items-center justify-between mt-3 mb-2 `}>
                    <MaterialCommunityIcons
                      name='email'
                      color={emailFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      placeholder='Enter Email'
                      value={loginEmail}
                      onChangeText={setLoginEmail}
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
                      value={loginPassword}
                      onChangeText={setLoginPassword}
                      placeholder='Enter Password'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2`,
                        {
                          borderBottomColor: passwordFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      secureTextEntry={passowrdShow ? true : false}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                    />
                    <MaterialCommunityIcons
                      onPress={() => {
                        setPasswordShow(!passowrdShow);
                      }}
                      name={passowrdShow ? 'eye-off' : 'eye'}
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
                  setFocusOff();
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
            <Pressable
              style={[
                tw` rounded-full absolute  left-10 z-50 self-center`,
                {
                  bottom: 94,
                  elevation: successRegister ? 0 : 5,
                },
              ]}
              onPress={registerFunc}
            >
              <LinearGradient
                style={[tw`${successRegister ? 'p-0' : 'p-4'}  rounded-full `, {}]}
                colors={['#4FACFE', '#21ECA0']}
                start={{ x: -1, y: 0 }}
                end={{ x: 2, y: 0 }}
              >
                {!loginLoading && !successRegister && (
                  <Animated.View exiting={FadeOut.duration(200)}>
                    <AntDesign name='check' size={30} color='white' />
                  </Animated.View>
                )}
                {loginLoading && !successRegister && (
                  <Animated.View entering={FadeIn.duration(800)}>
                    <ActivityIndicator
                      size='small'
                      style={[tw`m-2`, { transform: [{ scale: 1.5 }] }]}
                      color='white'
                    />
                  </Animated.View>
                )}
                {successRegister && (
                  <LottieView
                    autoPlay={false}
                    loop={false}
                    ref={registerSuccess}
                    onAnimationFinish={async () => {
                      setSuccessRegister(false);
                      changeUser(userInfo);
                    }}
                    style={[
                      {
                        width: 60,
                        height: 60,
                      },
                    ]}
                    source={require('../../assets/success.json')}
                  />
                )}
              </LinearGradient>
            </Pressable>
            <Animated.View>
              <View
                style={[
                  tw` ml-16 rounded-l-full`,
                  {
                    backgroundColor: theme.bgColor,
                    elevation: 8,
                  },
                ]}
              >
                <View style={tw` mr-4 my-5 ml-16`}>
                  {/* ******* Username  ******* */}
                  <View style={tw`flex-row  items-center justify-between mt-3 mb-2 `}>
                    <MaterialCommunityIcons
                      name='account'
                      color={usernameFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      value={username}
                      onChangeText={setUsername}
                      placeholder='Enter Username'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2 `,
                        {
                          borderBottomColor: usernameFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      onFocus={() => setUsernameFocus(true)}
                      onBlur={() => setUsernameFocus(false)}
                    />
                  </View>
                  {/* ******* Email  ******* */}
                  <View style={tw`flex-row  items-center justify-between mt-3 mb-2 `}>
                    <MaterialCommunityIcons
                      name='email'
                      color={registerEmailFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      value={registerEmail}
                      onChangeText={setRegisterEmail}
                      placeholder='Enter Email'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2 `,
                        {
                          borderBottomColor: registerEmailFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      onFocus={() => setRegisterEmailFocus(true)}
                      onBlur={() => setRegisterEmailFocus(false)}
                    />
                  </View>
                  {/* ******* Password  ******* */}
                  <View style={tw`flex-row items-center justify-between mt-3 mb-2 `}>
                    <MaterialCommunityIcons
                      name='key'
                      color={registerPasswordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      value={registerPassword}
                      onChangeText={setRegisterPassword}
                      placeholder='Enter Password'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2 `,
                        {
                          borderBottomColor: registerPasswordFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      secureTextEntry={registerPasswordShow ? true : false}
                      onFocus={() => setRegisterPasswordFocus(true)}
                      onBlur={() => setRegisterPasswordFocus(false)}
                    />
                    <MaterialCommunityIcons
                      onPress={() => {
                        setRegisterPasswordShow(!registerPasswordShow);
                      }}
                      name={registerPasswordShow ? 'eye-off' : 'eye'}
                      color={passwordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                  </View>
                  {/* ******* Confirm Password  ******* */}
                  <View style={tw`flex-row items-center justify-between mt-3 mb-5 `}>
                    <MaterialCommunityIcons
                      name='key'
                      color={confirmPasswordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      value={registerConfirmPassword}
                      onChangeText={setRegisterConfirmPassword}
                      placeholder='Enter Confirm Password'
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2 `,
                        {
                          borderBottomColor: confirmPasswordFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      secureTextEntry={registerConfirmPasswordShow ? true : false}
                      onFocus={() => setConfirmPasswordFocus(true)}
                      onBlur={() => setConfirmPasswordFocus(false)}
                    />
                    <MaterialCommunityIcons
                      onPress={() => {
                        setRegisterConfirmPasswordShow(!registerConfirmPasswordShow);
                      }}
                      name={registerConfirmPasswordShow ? 'eye-off' : 'eye'}
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
                  setFocusOff();
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
