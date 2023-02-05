import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { memo } from "react";
import useTheme from "../../Contexts/ThemeContext";
import useSettings from "../../Contexts/SettingContext";
import tw from "tailwind-react-native-classnames";

const DetailsScreen = ({
  route: {
    params: {
      params: { item },
    },
  },
}) => {
  // ********** All states are shown here
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();

  // Focus States
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [hintFocus, setHintFocus] = useState(false);

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // ********** Functions Below

  // turning focus off
  const setFocusOff = () => {
    setHintFocus(false);
    setEmailFocus(false);
    setPasswordFocus(false);
  };

  return (
    <SafeAreaView
      style={[tw`flex-1 px-6`, { backgroundColor: theme.mainBgColor }]}
    >
      {/* ************ Top Heading ************ */}
      <View style={tw`my-5 flex-row justify-between items-center`}>
        <Text style={[tw`text-2xl font-extrabold`, { color: theme.mainColor }]}>
          {item.CategoryName.toUpperCase()}
        </Text>
        <TouchableOpacity onPress={() => setShowAddModal(!showAddModal)}>
          <MaterialCommunityIcons
            name="plus-box-outline"
            color={theme.mainColor}
            size={35}
          />
        </TouchableOpacity>
      </View>

      {/* ************ Main List ************ */}
      <View>
        {/* ******* Main Container ******* */}
        <View
          style={[
            tw`px-5 py-3 rounded-xl`,
            {
              backgroundColor: theme.bgColor,
              elevation: elevation ? elevationValue : 0,
            },
          ]}
        >
          {/* ******* Account Section ******* */}
          <View style={tw`flex-row items-center`}>
            <Text
              style={[
                tw`flex-1 text-lg font-semibold`,
                { color: theme.mainColor },
              ]}
              numberOfLines={1}
            >
              Account Name
            </Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="heart-outline"
                color={theme.mainColor}
                size={23}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="square-edit-outline"
                color={theme.mainColor}
                size={23}
                style={tw`mx-2`}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="delete-outline"
                color={theme.mainColor}
                size={23}
              />
            </TouchableOpacity>
          </View>

          {/* ******* Hr underline ******* */}
          <View style={tw`border border-gray-200 mt-2 `}></View>

          {/* ******* Passwords Sections ******* */}
          <View style={tw`my-4 mt-4 `}>
            {/* ******* Email  ******* */}
            <View style={tw`flex-row items-center justify-between my-2`}>
              <MaterialCommunityIcons
                name="email"
                color={theme.mainColor}
                size={22}
              />
              <Text
                style={[tw`flex-1 mx-3`, { color: theme.mainTextColor }]}
                numberOfLines={1}
              >
                a@b.example.com
              </Text>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  style={tw`mx-1`}
                  name="content-copy"
                  color={theme.mainColor}
                  size={22}
                />
              </TouchableOpacity>
            </View>
            {/* ******* Password  ******* */}
            <View style={tw`flex-row items-center justify-between my-2`}>
              <MaterialCommunityIcons
                name="key"
                color={theme.mainColor}
                size={22}
              />
              <Text
                style={[tw`flex-1 mx-3`, { color: theme.mainTextColor }]}
                numberOfLines={1}
              >
                examplePassword
              </Text>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  style={tw`mx-1`}
                  name="content-copy"
                  color={theme.mainColor}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* *********** ALL Models Below ************* */}
      <Modal
        visible={showAddModal}
        transparent
        onRequestClose={() => setShowAddModal(!showAddModal)}
      >
        {/* ************  Modal Background Container  */}
        <View style={tw`justify-center items-center flex-1`}>
          {/* ************  Modal main Container  */}
          <Pressable
            style={[
              tw`p-5 rounded-xl w-4/5 `,
              { backgroundColor: theme.modalBg, elevation: 15 },
            ]}
            onPress={() => {
              Keyboard.dismiss();
              setFocusOff();
            }}
          >
            {/* ************  Main Content *********************  */}
            <View>
              <View style={tw`flex-row `}>
                <Text
                  style={[
                    tw`flex-1 text-xl font-semibold`,
                    { color: theme.mainColor },
                  ]}
                  numberOfLines={1}
                >
                  ADD INFO
                </Text>
              </View>

              {/* ***********  Passwords Sections  ************** */}
              <View style={tw`my-4 mt-3 `}>
                {/* ******* Account Section  ******* */}
                <View style={tw`flex-row items-center justify-between mb-2 `}>
                  <MaterialCommunityIcons
                    name="account"
                    color={hintFocus ? theme.mainColor : theme.grey}
                    size={22}
                  />
                  <TextInput
                    placeholder="Account Name"
                    placeholderTextColor={
                      theme.themeMode == "dark" ? theme.grey : "darkgray"
                    }
                    style={[
                      tw`flex-1 mx-3 border-b-2
                    `,
                      {
                        borderBottomColor: hintFocus
                          ? theme.mainColor
                          : theme.grey,
                        color: theme.mainTextColor,
                      },
                    ]}
                    onFocus={() => setHintFocus(true)}
                    onBlur={() => setHintFocus(false)}
                  />
                </View>
                {/* ******* Email  ******* */}
                <View style={tw`flex-row items-center justify-between my-3 `}>
                  <MaterialCommunityIcons
                    name="email"
                    color={emailFocus ? theme.mainColor : theme.grey}
                    size={22}
                  />
                  <TextInput
                    className=""
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
                <View
                  style={tw`flex-row items-center justify-between my-3 mb-2 `}
                >
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
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                  />
                </View>
              </View>
            </View>
            {/**************** Buttons ***********************/}
            <View style={tw`flex-row justify-end items-center mt-2`}>
              <TouchableOpacity
                style={[
                  tw`mx-2 p-1 px-2 rounded `,
                  { backgroundColor: theme.bgColor, elevation: 2 },
                ]}
                onPress={() => {
                  setShowAddModal(!showAddModal);
                  setFocusOff();
                }}
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
                  tw` p-1 px-3 rounded`,
                  {
                    backgroundColor: theme.mainColor,
                    elevation: 3,
                  },
                ]}
                onPress={() => {
                  setShowAddModal(!showAddModal);
                  setFocusOff();
                }}
              >
                <Text className="font-bold text-xs m-1 text-white">ADD</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default memo(DetailsScreen);
