import { View, Text, ActivityIndicator, Button } from 'react-native';
import React, { memo, useEffect } from 'react';
import tw from 'tailwind-react-native-classnames';
import useTheme from '../../Contexts/ThemeContext';
import LottieView from 'lottie-react-native';
import useUser from '../../Contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const InitializeScreen = () => {
  /*   All states
   ********************************************* */
  const { theme } = useTheme();

  const {
    userName,
    changeUser,
    userInfo,
    allCategory,
    fetchUserInfo,
    fetchAllCategory,
    allFav,
    fetchAllFav,
  } = useUser();
  const navigation = useNavigation();
  /*   All functions
   ********************************************* */

  useEffect(() => {
    const getData = async () => {
      try {
        fetchUserInfo(userName);
        fetchAllCategory(userName);
        fetchAllFav(userName);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (userName) {
      getData();
    }
  }, [userName]);

  useEffect(() => {
    if (userInfo != null && allCategory != null && allFav != null) {
      navigation.navigate('BottomNav');
    }
  }, [userInfo, allCategory, allFav]);

  return (
    <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: theme.mainBgColor }]}>
      <View style={[tw`flex-row justify-between my-3 w-3/4`, {}]}>
        <Text style={[tw`text-xl font-semibold`, { color: theme.mainTextColor }]}>
          Getting User Info
        </Text>
        <View style={[tw``, {}]}>
          {!userInfo && <ActivityIndicator color={theme.mainColor} />}
          {userInfo && (
            <LottieView
              loop={false}
              style={{ width: 30, height: 30 }}
              autoPlay
              source={require('../../assets/success.json')}
            />
          )}
        </View>
      </View>

      <View style={[tw`flex-row justify-between my-3 w-3/4`, {}]}>
        <Text style={[tw`text-xl font-semibold`, { color: theme.mainTextColor }]}>
          Getting Category Info
        </Text>
        <View>
          {!allCategory && <ActivityIndicator color={theme.mainColor} />}
          {allCategory && (
            <LottieView
              loop={false}
              style={{ width: 30, height: 30 }}
              autoPlay
              source={require('../../assets/success.json')}
            />
          )}
        </View>
      </View>

      <View style={[tw`flex-row justify-between my-3 w-3/4`, {}]}>
        <Text style={[tw`text-xl font-semibold`, { color: theme.mainTextColor }]}>
          Getting Favs
        </Text>
        <View>
          {!allFav && <ActivityIndicator color={theme.mainColor} />}
          {allFav && (
            <LottieView
              loop={false}
              style={{ width: 30, height: 30 }}
              autoPlay
              source={require('../../assets/success.json')}
            />
          )}
        </View>
      </View>

      <Button title='Go Back' onPress={() => changeUser(null)} />
    </View>
  );
};

export default memo(InitializeScreen);
