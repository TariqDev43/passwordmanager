import React, { memo, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { BounceInDown } from "react-native-reanimated";
import tw from "tailwind-react-native-classnames";
import { Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import useSettings from "../Contexts/SettingContext";
import useTheme from "../Contexts/ThemeContext";
import ErrorModal from "./ErrorModal";
import useUser from "../Contexts/UserContext";
import { removeCategoryDetails } from "../services/firebaseService";

const CategoriesList = ({
  index,
  data,
  onRefresh,
  setSelectedItem,
  setShowAddModal,
  setText,
}) => {
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const { userName } = useUser();

  const deleteCategoryData = async (category, id) => {
    try {
      setLoading(true);
      await removeCategoryDetails(userName, category, id);
      setLoading(false);
      await onRefresh();
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle("Error");
      setModalBody(err.message);
      setLoading(false);
    }
  };

  return (
    <Animated.View
      entering={BounceInDown.delay((index + 1) * 50)}
      style={[tw`flex-1 mx-1 `, { marginVertical: 5 }]}
    >
      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
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
            {data.value.account_name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowErrorModal(true);
              setModalTitle("Comming Soon");
              setModalBody("add to fav comming soon..");
            }}
          >
            <MaterialCommunityIcons
              name={data.value.fav_icon}
              color={theme.mainColor}
              size={23}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedItem({ ...data.value, id: data.id });
              setShowAddModal(true);
              setText(
                data.value.account_name,
                data.value.email,
                data.value.password
              );
            }}
          >
            <MaterialCommunityIcons
              name="square-edit-outline"
              color={theme.mainColor}
              size={23}
              style={tw`mx-2`}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              deleteCategoryData(data.value.category, data.id);
            }}
          >
            {!loading && (
              <MaterialCommunityIcons
                name={"delete"}
                color={theme.mainColor}
                size={25}
              />
            )}
            {loading && <ActivityIndicator />}
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
              {data.value.email}
            </Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                style={tw`mx-1`}
                onPress={() => Clipboard.setStringAsync(`${data.value.email}`)}
                name="content-copy"
                color={theme.mainColor}
                size={22}
              />
            </TouchableOpacity>
          </View>
          {/* ******* Password  ******* */}
          <View style={tw`flex-row items-center justify-between my-2`}>
            <MaterialCommunityIcons
              onPress={() => Clipboard.setStringAsync(`${data.value.password}`)}
              name="key"
              color={theme.mainColor}
              size={22}
            />
            <Text
              style={[tw`flex-1 mx-3`, { color: theme.mainTextColor }]}
              numberOfLines={1}
            >
              {data.value.password}
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
    </Animated.View>
  );
};

export default memo(CategoriesList);
