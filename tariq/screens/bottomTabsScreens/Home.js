import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Keyboard,
  TextInput,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo, useEffect, useState } from "react";
import { useMemo } from "react";
import useTheme from "../../Contexts/ThemeContext";
import useUser from "../../Contexts/UserContext";
import useSettings from "../../Contexts/SettingContext";
import tw from "tailwind-react-native-classnames";
import Animated, { BounceInDown } from "react-native-reanimated";

const Home = ({ navigation: { navigate } }) => {
  /*   All States
   ********************************************* */
  //  all contexts
  const { theme } = useTheme();
  const { allCategories, allCategoryInfo } = useUser();
  const { elevation, elevationValue } = useSettings();

  // All Modal
  const [showModal, setShowModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [showCategorySettingsModal, setShowCategorySettingsModal] =
    useState(false);

  // All Others
  const [isFocused, setIsFocused] = useState(false);
  const [icon, setIcon] = useState("heart");
  const iconList = useMemo(
    () => [
      { name: "facebook", icon: "facebook" },
      { name: "instagram", icon: "instagram" },
      { name: "twitter", icon: "twitter" },
      { name: "netflix", icon: "netflix" },
      { name: "linkedin", icon: "linkedin" },
      { name: "google", icon: "google" },
      { name: "yahoo", icon: "yahoo" },
      { name: "git", icon: "git" },
      { name: "game", icon: "gamepad-variant" },
      { name: "heart", icon: "heart" },
    ],
    [setIcon]
  );

  // const my_data = [
  //   { id: 1, icon: "facebook", category: "Facebook", delete: "delete" },
  //   { id: 22, icon: "facebook", category: "facebook", delete: "delete" },
  //   { id: 23, icon: "facebook", category: "facebook", delete: "delete" },
  //   { id: 2, icon: "facebook", category: "facebook", delete: "delete" },
  //   { id: 3, icon: "instagram", category: "instagram", delete: "delete" },
  //   { id: 4, icon: "twitter", category: "twitter", delete: "delete" },
  //   { id: 5, icon: "netflix", category: "netflix", delete: "delete" },
  //   { id: 6, icon: "linkedin", category: "linkedin", delete: "delete" },
  //   { id: 7, icon: "google", category: "google", delete: "delete" },
  //   { id: 8, icon: "yahoo", category: "yahoo", delete: "delete" },
  //   { id: 9, icon: "git", category: "git", delete: "delete" },
  //   {
  //     id: 10,
  //     icon: "gamepad-variant",
  //     category: "Game",
  //     delete: "delete",
  //   },
  //   { id: 11, icon: "heart", category: "heart", delete: "delete" },
  // ];

  useEffect(() => {
    // console.log(allCategoryInfo["instagram"]);
  }, []);

  return (
    <SafeAreaView
      className={`flex-1 `}
      style={[tw`flex-1 `, { backgroundColor: theme.mainBgColor }]}
    >
      {/* Heading */}
      <View style={tw`flex-row px-6 mt-6 justify-between items-center mb-2`}>
        <Text style={[tw`text-3xl font-extrabold`, { color: theme.mainColor }]}>
          Categories
        </Text>
        <TouchableOpacity onPress={() => setShowModal(!showModal)}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={40}
            color={theme.mainColor}
          />
        </TouchableOpacity>
      </View>
      {/**************** Category Modal ******************************/}
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
        animationType="slide"
        transparent={true}
      >
        <Pressable
          style={tw`flex-1 justify-center items-center `}
          onPress={() => Keyboard.dismiss()}
        >
          <View
            style={[
              tw`p-5 rounded-xl w-72 `,
              { elevation: 15, backgroundColor: theme.modalBg },
            ]}
          >
            {/**************** Title ***********************/}
            <Text style={[tw`font-bold text-lg`, { color: theme.mainColor }]}>
              ADD CATEOGRY
            </Text>
            {/**************** Category text input ***********************/}
            <View style={tw`flex-row justify-between`}>
              <TextInput
                color={theme.mainColor}
                placeholderTextColor={theme.mainTextColor}
                style={[
                  tw`border-b-2 my-7  flex-1`,
                  {
                    borderBottomColor: isFocused ? theme.mainColor : theme.grey,
                  },
                ]}
                placeholder={"Write category name.."}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <TouchableOpacity
                style={tw`self-center`}
                onPressOut={() => setShowIconModal(true)}
              >
                <View
                  style={[
                    tw`rounded-full p-1 border-2`,
                    {
                      elevation: 3,
                      borderColor: theme.mainColor,
                      backgroundColor: theme.bgColor,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={icon}
                    size={30}
                    color={theme.mainColor}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/**************** Buttons ***********************/}
            <View style={tw`flex-row justify-end mt-3 items-center `}>
              <TouchableOpacity
                style={[
                  tw`mx-2 p-1 px-2 rounded `,
                  { backgroundColor: theme.bgColor, elevation: 2 },
                ]}
                onPress={() => setShowModal(!showModal)}
              >
                <Text
                  style={[
                    tw`font-bold text-xs m-1`,
                    { color: theme.mainTextColor },
                  ]}
                >
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tw`p-1 px-3 rounded`,
                  {
                    backgroundColor: theme.mainColor,
                    elevation: 3,
                  },
                ]}
                onPress={() => setShowModal(!showModal)}
              >
                <Text style={tw`font-bold text-xs m-1 text-white`}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      {/**************** Icon Modal ******************************/}
      <Modal
        visible={showIconModal}
        onRequestClose={() => setShowIconModal(!showIconModal)}
        animationType="fade"
        transparent={true}
      >
        <Pressable
          style={tw`justify-center flex-1 items-center `}
          onPress={() => Keyboard.dismiss()}
        >
          <View
            style={[
              tw`py-5 px-4 rounded-xl w-64 h-1/2`,
              { elevation: 15, backgroundColor: theme.mainBgColor },
            ]}
          >
            <Text
              style={[
                tw`font-bold my-2 mx-1 text-lg `,
                { color: theme.mainColor },
              ]}
            >
              SELECT ICON
            </Text>
            {/* *******  Lopping icons here *********** */}
            <FlatList
              data={iconList}
              style={tw`mb-2`}
              keyExtractor={(item, index) => index}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => setIcon(item.icon)}
                    key={item.name}
                    style={[
                      tw`p-2 mx-1 mb-1 px-3 items-center justify-between flex-row rounded-lg `,
                      {
                        backgroundColor:
                          icon == item.icon ? theme.mainColor : theme.bgColor,
                        elevation: elevation ? elevationValue : 0,
                      },
                    ]}
                  >
                    {/* *******  Text For scrollable select icons *********** */}
                    <Text
                      style={[
                        tw`text-xs`,
                        {
                          color:
                            icon == item.icon ? "white" : theme.mainTextColor,
                        },
                      ]}
                    >
                      {item.name.toUpperCase()}
                    </Text>
                    {/* *******  Icon inside scrollable select icons *********** */}
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={25}
                      color={icon == item.icon ? "white" : theme.mainColor}
                    />
                  </TouchableOpacity>
                );
              }}
            />
            {/**************** Buttons ***********************/}
            <View style={tw`flex-row justify-end  mx-1  items-center `}>
              <TouchableOpacity
                onPress={() => setShowIconModal(!showIconModal)}
                style={tw`p-1`}
              >
                <Text
                  style={[tw`font-bold text-xs`, { color: theme.mainColor }]}
                >
                  SELECT CATEGORY
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      {/**************** Main Scrollable Content ******************************/}
      <View style={tw`pb-16 px-5 py-2`}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 160 }}
          data={allCategories}
          showsVerticalScrollIndicator={false}
          eyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item, index }) => {
            return (
              // *******************  Main Div  *********************************

              <Animated.View
                entering={BounceInDown}
                style={tw`flex-1 mx-1 my-1 `}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigate("Details", {
                      item: allCategoryInfo[item.category],
                      category: item.category,
                    })
                  }
                  style={[
                    tw`py-4 px-2 rounded-lg flex-1 flex-row items-center`,
                    {
                      elevation: elevation ? elevationValue : 0,
                      backgroundColor: theme.bgColor,
                    },
                  ]}
                >
                  {/* ****** Icon  ******* */}
                  <MaterialCommunityIcons
                    name={item.icon}
                    color={theme.mainColor}
                    size={33}
                  />
                  {/* ******  Name  ******* */}
                  <Text
                    numberOfLines={1}
                    style={[
                      tw`flex-1 text-xs mx-2`,
                      { color: theme.mainTextColor },
                    ]}
                  >
                    {item.category.toUpperCase()}
                  </Text>
                  {/* ******  3-Dots menu  ******* */}
                  <MaterialCommunityIcons
                    name={"dots-vertical"}
                    color={theme.mainColor}
                    size={25}
                    onPress={() => {
                      setShowCategorySettingsModal(true);
                    }}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          k
        />
      </View>
      {/**************** Category Settings Modal ******************************/}
    </SafeAreaView>
  );
};

export default memo(Home);
