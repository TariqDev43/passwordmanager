import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native-gesture-handler";
import { memo } from "react";
import useTheme from "../../Contexts/ThemeContext";
import useUser from "../../Contexts/UserContext";
import tw from "tailwind-react-native-classnames";

import ErrorModal from "../../components/ErrorModal";
import { serverTimestamp } from "firebase/database";
import {
  addCategoryDetails,
  updateCategoryDetails,
} from "../../services/firebaseService";
import CategoriesDetailsList from "../../components/CategoriesDetailsList";

const DetailsScreen = ({
  route: {
    params: { item, index },
  },
}) => {
  // ********** All states are shown here
  const { theme } = useTheme();
  const { userName, allCategory, fetchAllCategory } = useUser();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seletedItem, setSelectedItem] = useState(null);

  // const { changeUser } = useUser();

  //  Error Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  // Focus States
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [accountFocus, setAccountFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState("");

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // ********** Functions Below
  const setText = (accountText, emailText, passwordText) => {
    setAccount(accountText);
    setEmail(emailText);
    setPassword(passwordText);
  };

  const addCategoryData = async () => {
    if (account == "") {
      setShowErrorModal(true);
      setModalTitle("INPUT ERROR");
      setModalBody("Account is required");
      return;
    }
    if (password == "") {
      setShowErrorModal(true);
      setModalTitle("INPUT ERROR");
      setModalBody("Password is required");
      return;
    }
    if (email == "") {
      setShowErrorModal(true);
      setModalTitle("INPUT ERROR");
      setModalBody("Email is required");
      return;
    }
    const categoryDta = {
      category: item.category.toLowerCase(),
      email: email,
      account_name: account,
      password: password,
      fav_icon: "heart-outline",
      notes: "test notes",
      key: serverTimestamp(),
    };
    try {
      setLoading(true);
      const data = await addCategoryDetails(
        userName,
        item.category,
        categoryDta
      );
      setLoading(false);
      setShowAddModal(!showAddModal);
      await onRefresh();
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle("Error");
      setModalBody(err.message);
    }
  };
  const updateCategoryData = async () => {
    if (account == "") {
      setShowErrorModal(true);
      setModalTitle("INPUT ERROR");
      setModalBody("Account is required");
      return;
    }
    if (password == "") {
      setShowErrorModal(true);
      setModalTitle("INPUT ERROR");
      setModalBody("Password is required");
      return;
    }
    if (email == "") {
      setShowErrorModal(true);
      setModalTitle("INPUT ERROR");
      setModalBody("Email is required");
      return;
    }
    const categoryDta = {
      email: email,
      account_name: account,
      password: password,
    };

    try {
      setLoading(true);
      const data = await updateCategoryDetails(
        userName,
        item.category,
        categoryDta,
        seletedItem.id
      );
      setLoading(false);
      setShowAddModal(!showAddModal);
      await onRefresh();
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle("Error");
      setModalBody(err.message);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAllCategory(userName);
      setRefreshing(false);
      setText("", "", "");
      setSelectedItem(null);
      return true;
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle("Error");
      setModalBody(err.message.toString());
    }
  };

  // turning focus off
  const setFocusOff = () => {
    setAccountFocus(false);
    setEmailFocus(false);
    setPasswordFocus(false);
  };

  const categoryDetailsData = () => {
    if (allCategory && allCategory[index].value?.items) {
      const data = allCategory[index].value.items;
      let i = [];
      Object.keys(data).map((key) => {
        i.push({ id: key, value: data[key] });
      });
      setCategoryData(i);
    } else {
      setCategoryData(null);
    }
  };

  useEffect(() => {
    categoryDetailsData();
  }, [allCategory]);

  return (
    <SafeAreaView
      style={[tw`flex-1 px-6`, { backgroundColor: theme.mainBgColor }]}
    >
      {/* Error Modal */}

      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />

      {/* ************ Top Heading ************ */}
      <View style={tw`my-5 flex-row justify-between items-center`}>
        <Text style={[tw`text-2xl font-extrabold`, { color: theme.mainColor }]}>
          {item.category.toUpperCase()}
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
      {item && categoryData && allCategory && (
        <FlatList
          contentContainerStyle={{ paddingBottom: 160 }}
          data={categoryData}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          keyExtractor={(test) => test.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item: data, index }) => {
            return (
              // *******************  Main Div  *********************************

              <CategoriesDetailsList
                index={index}
                data={data}
                setText={setText}
                setSelectedItem={setSelectedItem}
                setShowAddModal={setShowAddModal}
                onRefresh={onRefresh}
              />
            );
          }}
        />
      )}

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
                    color={accountFocus ? theme.mainColor : theme.grey}
                    size={22}
                  />
                  <TextInput
                    placeholder="Account Name"
                    defaultValue={seletedItem?.account_name}
                    onChangeText={setAccount}
                    placeholderTextColor={
                      theme.themeMode == "dark" ? theme.grey : "darkgray"
                    }
                    style={[
                      tw`flex-1 mx-3 border-b-2
                  `,
                      {
                        borderBottomColor: accountFocus
                          ? theme.mainColor
                          : theme.grey,
                        color: theme.mainTextColor,
                      },
                    ]}
                    onFocus={() => setAccountFocus(true)}
                    onBlur={() => setAccountFocus(false)}
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
                    defaultValue={seletedItem?.email}
                    onChangeText={setEmail}
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
                    defaultValue={seletedItem?.password}
                    onChangeText={setPassword}
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
                  setSelectedItem(null);
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

              {!seletedItem && (
                <TouchableOpacity
                  style={[
                    tw` p-1 px-3 rounded`,
                    {
                      backgroundColor: theme.mainColor,
                      elevation: 3,
                    },
                  ]}
                  onPress={() => {
                    addCategoryData();
                    setFocusOff();
                  }}
                >
                  {!loading && (
                    <Text style={tw`font-bold text-xs m-1 text-white`}>
                      ADD
                    </Text>
                  )}
                  {loading && (
                    <View style={tw`m-1`}>
                      <ActivityIndicator color={"white"} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              {seletedItem && (
                <TouchableOpacity
                  style={[
                    tw` p-1 px-3 rounded`,
                    {
                      backgroundColor: theme.mainColor,
                      elevation: 3,
                    },
                  ]}
                  onPress={() => {
                    updateCategoryData();
                    setFocusOff();
                  }}
                >
                  {!loading && (
                    <Text style={tw`font-bold text-xs m-1 text-white`}>
                      UPDATE
                    </Text>
                  )}
                  {loading && (
                    <View style={tw`m-1`}>
                      <ActivityIndicator color={"white"} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default memo(DetailsScreen);
