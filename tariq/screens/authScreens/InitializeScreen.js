import { View, Text, ActivityIndicator, Button } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import useTheme from "../../Contexts/ThemeContext";
import LottieView from "lottie-react-native";
import useUser from "../../Contexts/UserContext";
import {
  getUserData,
  getAllCategories,
  getCategoryByName,
} from "../../services/firebaseService";
import { async } from "@firebase/util";

const InitializeScreen = () => {
  /*   All states
   ********************************************* */
  const { theme } = useTheme();
  const [userInfo, setUserInfo] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoryInfo, setCategoriesInfo] = useState(null);
  const [favorites, setFavorites] = useState(null);
  const { changeUser } = useUser();
  const { user } = useUser();

  const uid = user.uid;
  /*   All functions
   ********************************************* */
  //userInfo
  const getUserInfo = async () => {
    try {
      const userData = await getUserData(uid);
      setUserInfo(userData.data());
    } catch (err) {
      console.log(err.message);
    }
  };

  //allCategories
  const getallCategories = async () => {
    try {
      const allCategories = await getAllCategories(uid);
      setCategories(allCategories);
      return allCategories;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  };

  // categoriesInfo
  const allCategoryInfo = async () => {
    const categgories = await getallCategories();
    const allCategoryInfoList = await categgories.reduce(
      async (promisedValue, item) => {
        const newItem = await promisedValue;
        const { category } = item;

        newItem[category] = await getCategoryByName(uid, category);
        return newItem;
      },
      {}
    );

    setCategoriesInfo(allCategoryInfoList);
    return allCategoryInfoList;
  };

  //   const allCategoryInfo = {};
  //   allCategories.map(async (item) => {
  //     let category = item.category;
  //     let i = await getCategoryByName(uid, category);
  //     allCategoryInfo[category] = i;
  //     console.log(allCategoryInfo);
  //   });
  //   console.log(allCategoryInfo);
  // };
  // getData();

  useEffect(() => {
    getUserInfo();
    allCategoryInfo();
  }, []);

  return (
    <View
      style={[
        tw`flex-1 justify-center items-center`,
        { backgroundColor: theme.mainBgColor },
      ]}
    >
      <View style={[tw`flex-row justify-between my-3 w-3/4`, {}]}>
        <Text style={[tw`text-xl font-semibold`, {}]}>Getting User Info</Text>
        <View style={[tw``, {}]}>
          {!userInfo && <ActivityIndicator color={theme.mainColor} />}
          {userInfo && (
            <LottieView
              loop={false}
              style={{ width: 30, height: 30 }}
              onAnimationFinish={() => console.log("UserInfo Done")}
              autoPlay
              source={require("../../assets/success.json")}
            />
          )}
        </View>
      </View>
      <View style={[tw`flex-row justify-between my-3 w-3/4`, {}]}>
        <Text style={[tw`text-xl font-semibold`, {}]}>Getting Categories</Text>
        <View style={[tw``, {}]}>
          {!categories && <ActivityIndicator color={theme.mainColor} />}
          {categories && (
            <LottieView
              loop={false}
              style={{ width: 30, height: 30 }}
              onAnimationFinish={() => console.log("Categories Done")}
              autoPlay
              source={require("../../assets/success.json")}
            />
          )}
        </View>
      </View>
      <View style={[tw`flex-row justify-between my-3 w-3/4`, {}]}>
        <Text style={[tw`text-xl font-semibold`, {}]}>
          Getting Category Info
        </Text>
        <View>
          {!categoryInfo && <ActivityIndicator color={theme.mainColor} />}
          {categoryInfo && (
            <LottieView
              loop={false}
              style={{ width: 30, height: 30 }}
              onAnimationFinish={() => console.log("Categories info Done")}
              autoPlay
              source={require("../../assets/success.json")}
            />
          )}
        </View>
      </View>
      <View style={[tw`flex-row justify-between my-3 w-3/4`, {}]}>
        <Text style={[tw`text-xl font-semibold`, {}]}>Getting Favorites</Text>
        {!favorites && <ActivityIndicator color={theme.mainColor} />}
        {favorites && (
          <LottieView
            loop={false}
            style={{ width: 30, height: 30 }}
            onAnimationFinish={() => console.log("Favorites Done")}
            autoPlay
            source={require("../../assets/success.json")}
          />
        )}
      </View>
      <Button title="Go Back" onPress={() => changeUser(null)} />
    </View>
  );
};

export default InitializeScreen;
