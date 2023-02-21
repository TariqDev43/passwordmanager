import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { memo } from 'react';
import useTheme from '../../Contexts/ThemeContext';
import useUser from '../../Contexts/UserContext';
import tw from 'tailwind-react-native-classnames';
import ErrorModal from '../../components/ErrorModal';
import { serverTimestamp } from 'firebase/database';
import {
  addCategoryDetails,
  updateCategoryDetails,
  addToFav,
} from '../../services/firebaseService';
import CategoriesDetailsList from '../../components/CategoriesDetailsList';
import Animated, { Layout, ZoomInEasyDown, ZoomOut } from 'react-native-reanimated';
import useSettings from '../../Contexts/SettingContext';
import uuid from 'react-native-uuid';

const DetailsScreen = ({
  route: {
    params: { item, categoryIndex },
  },
}) => {
  // ********** All states are shown here
  // All Contexts
  const { theme } = useTheme();
  const { userName, allCategory, fetchAllCategory, updateAllCategories } = useUser();
  const { elevation, elevationValue } = useSettings();

  //  All Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  // All animations
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Focus States
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [accountFocus, setAccountFocus] = useState(false);

  // Texts related States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState('');

  // Update Selection
  const [seletedItem, setSelectedItem] = useState(null);
  const [seletedIndex, setSelectedIndex] = useState(null);
  const [categoryData, setCategoryData] = useState(
    allCategory[categoryIndex].items ? allCategory[categoryIndex].items : []
  );

  useEffect(() => {
    setCategoryData(allCategory[categoryIndex].items ? allCategory[categoryIndex].items : []);
  }, [allCategory]);

  // ********** Functions Below
  const getUid = () => {
    const uid = uuid.v1();
    return uid;
  };

  // const addCategoryData = async () => {
  //   if (account == '') {
  //     setShowErrorModal(true);
  //     setModalTitle('INPUT ERROR');
  //     setModalBody('Account is required');
  //     return;
  //   }
  //   if (password == '') {
  //     setShowErrorModal(true);
  //     setModalTitle('INPUT ERROR');
  //     setModalBody('Password is required');
  //     return;
  //   }
  //   if (email == '') {
  //     setShowErrorModal(true);
  //     setModalTitle('INPUT ERROR');
  //     setModalBody('Email is required');
  //     return;
  //   }
  //   const categoryDta = {
  //     category: item.category.toLowerCase(),
  //     email: email,
  //     account_name: account,
  //     password: password,
  //     fav_icon: 'heart-outline',
  //     notes: 'test notes',
  //     key: serverTimestamp(),
  //   };

  //   try {
  //     setLoading(true);
  //     // console.log(item.value);
  //     const uid = getUid();
  //     let items_data = {};
  //     items_data[uid] = categoryDta;

  //     const newAddedValue = allCategory[index];
  //     newAddedValue.value.items[uid] = categoryDta;
  //     // console.log(JSON.stringify(newTest));

  //     // console.log(
  //     //   JSON.stringify({
  //     //     category: item.category,
  //     //     value: {
  //     //       info: { icon: item.value.info.icon },
  //     //       items: items_data,
  //     //     },
  //     //   })
  //     // );
  //     updateAllCategories(categoryIndex, newAddedValue);
  //     categoryDetailsData();
  //     addCategoryDetails(userName, item.category, categoryDta, uid);

  //     setLoading(false);
  //     setShowAddModal(!showAddModal);
  //     // await onRefresh();
  //   } catch (err) {
  //     setShowErrorModal(true);
  //     setModalTitle('Error');
  //     setModalBody(err.message);
  //   }
  // };

  // const updateCategoryData = async () => {
  //   if (account == '') {
  //     setShowErrorModal(true);
  //     setModalTitle('INPUT ERROR');
  //     setModalBody('Account is required');
  //     return;
  //   }
  //   if (password == '') {
  //     setShowErrorModal(true);
  //     setModalTitle('INPUT ERROR');
  //     setModalBody('Password is required');
  //     return;
  //   }
  //   if (email == '') {
  //     setShowErrorModal(true);
  //     setModalTitle('INPUT ERROR');
  //     setModalBody('Email is required');
  //     return;
  //   }
  //   const categoryDta = {
  //     email: email,
  //     account_name: account,
  //     password: password,
  //   };

  //   try {
  //     setLoading(true);
  //     const data = await updateCategoryDetails(
  //       userName,
  //       item.category,
  //       categoryDta,
  //       seletedItem.id
  //     );
  //     setLoading(false);
  //     setShowAddModal(!showAddModal);
  //     await onRefresh();
  //   } catch (err) {
  // setShowErrorModal(true);
  // setModalTitle('Error');
  // setModalBody(err.message);
  //   }
  // };
  // Updates textFields to contains selected items text for updateing
  const updateCategoryData = () => {
    let newPassord = {
      ...seletedItem,
      email: email,
      account_name: account,
      password: password,
    };
    let newArray = categoryData;
    newArray[seletedIndex] = newPassord;
    setCategoryData(newArray);
    updateAllCategories(categoryIndex, newArray);
    updateCategoryDetails(userName, seletedItem.category, newPassord, seletedItem.id);
    setShowAddModal(false);
  };
  const setText = (accountText, emailText, passwordText) => {
    setAccount(accountText);
    setEmail(emailText);
    setPassword(passwordText);
  };

  // turning focus off
  const setFocusOff = () => {
    setAccountFocus(false);
    setEmailFocus(false);
    setPasswordFocus(false);
  };

  const addCategoryData = () => {
    if (account == '') {
      setShowErrorModal(true);
      setModalTitle('INPUT ERROR');
      setModalBody('Account is required');
      return;
    }
    if (password == '') {
      setShowErrorModal(true);
      setModalTitle('INPUT ERROR');
      setModalBody('Password is required');
      return;
    }
    if (email == '') {
      setShowErrorModal(true);
      setModalTitle('INPUT ERROR');
      setModalBody('Email is required');
      return;
    }

    const uid = getUid();
    try {
      // Locally Adding Category
      let newPassord = {
        category: item.category.toLowerCase(),
        id: uid,
        email: email,
        account_name: account,
        password: password,
        fav_icon: 'heart-outline',
        notes: 'test notes',
        key: serverTimestamp(),
      };
      let newArray = [...categoryData, newPassord];
      setCategoryData(newArray);
      updateAllCategories(categoryIndex, newArray);
      // Adding in Firebase
      addCategodryDetails(userName, item.category.toLowerCase(), newPassord, uid);
      setShowAddModal(!showAddModal);
    } catch (err) {
      deleteCategoryData(id);
      setShowAddModal(!showAddModal);
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message);
    }
  };

  const deleteCategoryData = (category, id) => {
    let newArray = categoryData.filter((item) => item.id !== id);
    setCategoryData(newArray);
    updateAllCategories(categoryIndex, newArray);
  };

  const addToFavList = (index, category, icon) => {
    try {
      let newArray = [...categoryData];
      let data = {
        ...newArray[index],
        fav_icon: icon,
      };
      newArray[index] = data;
      setCategoryData(newArray);
      updateAllCategories(categoryIndex, newArray);

      addToFav(userName, category, data, data.id);
      // setFavLoading(true);
      // setFavLoading(false);
      // await onRefresh();
      // fetchAllFav(userName);
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message);
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1 px-4`, { backgroundColor: theme.mainBgColor }]}>
      {/* Error Modal */}

      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />

      {/* ************ Top Heading ************ */}
      <View style={tw`my-5 px-2 flex-row justify-between items-center`}>
        <Text
          style={[tw`text-2xl flex-1 font-extrabold mr-3`, { color: theme.mainColor }]}
          numberOfLines={1}
        >
          {item.category.toUpperCase()}
        </Text>
        <TouchableOpacity onPress={() => setShowAddModal(!showAddModal)}>
          <MaterialCommunityIcons name='plus-box-outline' color={theme.mainColor} size={35} />
        </TouchableOpacity>
      </View>

      {/* ************ Main List ************ */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[tw`pb-20 px-2`, {}]}>
          {categoryData &&
            categoryData.map((item, index) => (
              <Animated.View
                style={[tw`mb-2`, {}]}
                layout={Layout.delay(300)}
                entering={ZoomInEasyDown}
                exiting={ZoomOut}
                key={item.id}
              >
                <CategoriesDetailsList
                  categoryIndex={categoryIndex}
                  item={item}
                  index={index}
                  addToFavList={addToFavList}
                  setSelectedIndex={setSelectedIndex}
                  categoryData={categoryData}
                  setCategoryData={setCategoryData}
                  setSelectedItem={setSelectedItem}
                  setShowAddModal={setShowAddModal}
                  setText={setText}
                />
              </Animated.View>
            ))}
        </View>
      </ScrollView>

      {/* *********** ALL Models Below ************* */}
      <Modal
        visible={showAddModal}
        transparent
        onRequestClose={() => setShowAddModal(!showAddModal)}
      >
        {/* ************  Modal Background Container  */}
        <Pressable
          style={[tw`justify-center items-center flex-1`]}
          onPress={() => {
            Keyboard.dismiss();
            setShowAddModal(false);
            setFocusOff();
          }}
        >
          <Pressable
            onPress={() => setShowAddModal(true)}
            style={[tw`p-5 rounded-xl w-4/5`, { backgroundColor: theme.modalBg, elevation: 15 }]}
          >
            {/* ************  Modal main Container  */}
            <View onPress={() => setShowAddModal(true)}>
              {/* ************  Main Content *********************  */}
              <View>
                <View style={tw`flex-row items-center`}>
                  <Text
                    style={[tw`flex-1 text-xl font-semibold`, { color: theme.mainColor }]}
                    numberOfLines={1}
                  >
                    ADD INFO
                  </Text>

                  <View style={tw`flex-row justify-end items-center`}>
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
                      <MaterialCommunityIcons
                        name='close'
                        color={passwordFocus ? theme.mainColor : theme.grey}
                        size={22}
                      />
                      {/* <Text style={[tw`font-bold text-xs m-1`, { color: theme.mainTextColor }]}>
                      Close
                    </Text> */}
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
                          <MaterialCommunityIcons name='plus' color={'white'} size={22} />
                        )}
                        {/* {!loading && <Text style={tw`font-bold text-xs m-1 text-white`}>ADD</Text>} */}
                        {loading && (
                          <View style={tw`m-1`}>
                            <ActivityIndicator color={'white'} />
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
                        {/* {!loading && <Text style={tw`font-bold text-xs m-1 text-white`}>UPDATE</Text>} */}
                        {!loading && (
                          <MaterialCommunityIcons
                            name='plus'
                            color={passwordFocus ? theme.mainColor : theme.grey}
                            size={22}
                          />
                        )}
                        {loading && (
                          <View style={tw`m-1`}>
                            <ActivityIndicator color={'white'} />
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* ***********  Passwords Sections  ************** */}
                <View style={tw`my-4 mt-3 `}>
                  {/* ******* Account Section  ******* */}
                  <View style={tw`flex-row items-center justify-between mb-2 `}>
                    <MaterialCommunityIcons
                      name='account'
                      color={accountFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      placeholder='Account Name'
                      defaultValue={seletedItem?.account_name}
                      onChangeText={setAccount}
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2
                  `,
                        {
                          borderBottomColor: accountFocus ? theme.mainColor : theme.grey,
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
                      name='email'
                      color={emailFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      className=''
                      placeholder='Enter Email'
                      defaultValue={seletedItem?.email}
                      onChangeText={setEmail}
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
                  <View style={tw`flex-row items-center justify-between my-3 mb-2 `}>
                    <MaterialCommunityIcons
                      name='key'
                      color={passwordFocus ? theme.mainColor : theme.grey}
                      size={22}
                    />
                    <TextInput
                      placeholder='Enter Password'
                      defaultValue={seletedItem?.password}
                      onChangeText={setPassword}
                      placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                      style={[
                        tw`flex-1 mx-3 border-b-2
                  `,
                        {
                          borderBottomColor: passwordFocus ? theme.mainColor : theme.grey,
                          color: theme.mainTextColor,
                        },
                      ]}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default memo(DetailsScreen);
