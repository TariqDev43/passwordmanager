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
  // const [userInfo, setUserInfo] = useState(null);
  // const [categories, setCategories] = useState(null);
  // const [categoryInfo, setCategoriesInfo] = useState(null);
  // const [favorites, setFavorites] = useState(null);
  const {
    changeUser,
    userInfo,
    allCategories,
    allCategoryInfo,
    allFav,
    getUserInfo,
    refreshAllCategoryInfo,
    refreshAllFav,
  } = useUser();
  const navigation = useNavigation();
  /*   All functions
   ********************************************* */

  useEffect(() => {
    const getData = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log(userInfo);
        await refreshAllCategoryInfo();
        await refreshAllFav();
      } catch (err) {
        console.log(err.message);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (userInfo != null && allCategories != null && allCategoryInfo != null && allFav != null) {
      navigation.navigate('BottomNav');
    }
  }, [userInfo, allCategories, allCategoryInfo, allFav]);

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
          Getting Categories
        </Text>
        <View style={[tw``, {}]}>
          {!allCategories && <ActivityIndicator color={theme.mainColor} />}
          {allCategories && (
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
          {!allCategoryInfo && <ActivityIndicator color={theme.mainColor} />}
          {allCategoryInfo && (
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
          Getting Favorites
        </Text>
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
      <Button title='Go Back' onPress={() => changeUser(null)} />
    </View>
  );
};

export default memo(InitializeScreen);
