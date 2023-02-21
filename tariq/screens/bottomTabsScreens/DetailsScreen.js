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
import { useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, TextInput } from 'react-native-gesture-handler';
import { memo } from 'react';
import useTheme from '../../Contexts/ThemeContext';
import useUser from '../../Contexts/UserContext';
import tw from 'tailwind-react-native-classnames';
import ErrorModal from '../../components/ErrorModal';
import { serverTimestamp } from 'firebase/database';
import {
  addCategoryDetails,
  addToFav,
  updateCategoryDetails,
} from '../../services/firebaseService';
import CategoriesDetailsList from '../../components/CategoriesDetailsList';
import LottieView from 'lottie-react-native';
import * as Clipboard from 'expo-clipboard';
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

  // const onRefresh = async () => {
  //   try {
  //     setRefreshing(true);
  //     await fetchAllCategory(userName);
  //     setRefreshing(false);
  //     setText('', '', '');
  //     setSelectedItem(null);
  //   } catch (err) {
  //     setShowErrorModal(true);
  //     setModalTitle('Error');
  //     setModalBody(err.message.toString());
  //   }
  // };

  // turning focus off
  const setFocusOff = () => {
    setAccountFocus(false);
    setEmailFocus(false);
    setPasswordFocus(false);
  };

  // getsThe category Data and makes a list of loopable items
  // here receive the index of selected category from params
  // then gets the selected item details list form ListOfAll categories
  // const categoryDetailsData = () => {
  //   if (allCategory && allCategory[index].value?.items) {
  //     const data = allCategory[index].value.items;
  //     let i = [];
  //     Object.keys(data).map((key) => {
  //       i.push({ id: key, value: data[key] });
  //     });
  //     setCategoryData(null);
  //     setCategoryData(i);
  //     setLoading(false);
  //   } else {
  //     setCategoryData(null);
  //   }
  // };

  // useEffect(() => {
  //   categoryDetailsData();
  // }, [allCategory]);

  const addCategoryData = () => {
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
      addCategoryDetails(userName, item.category.toLowerCase(), newPassord, uid);
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

  const onRefresh = async () => {
    try {
      await fetchAllCategory(userName);
      return true;
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message.toString());
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1 px-6`, { backgroundColor: theme.mainBgColor }]}>
      {/* Error Modal */}

      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />

      {/* ************ Top Heading ************ */}
      <View style={tw`my-5 flex-row justify-between items-center`}>
        <Text
          style={[tw`text-2xl flex-1 font-extrabold mr-3`, { color: theme.mainColor }]}
          numberOfLines={1}
        >
          {/* {item.category.toUpperCase()} */}
          Category Name
        </Text>
        <TouchableOpacity onPress={() => setShowAddModal(!showAddModal)}>
          <MaterialCommunityIcons name='plus-box-outline' color={theme.mainColor} size={35} />
        </TouchableOpacity>
      </View>

      {/* ************ Main List ************ */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[tw`pb-20`, {}]}>
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
                  setSelectedIndex={setSelectedIndex}
                  categoryData={categoryData}
                  setCategoryData={setCategoryData}
                  setSelectedItem={setSelectedItem}
                  setShowAddModal={setShowAddModal}
                  setText={setText}
                />
              </Animated.View>
              // <Animated.View
              //   style={[tw`mb-2`, {}]}
              //   layout={Layout.delay(300)}
              //   entering={ZoomInEasyDown}
              //   exiting={ZoomOut}
              //   key={item.id}
              // >
              //   <View
              //     style={[
              //       tw`px-5 py-3 rounded-xl`,
              //       {
              //         backgroundColor: theme.bgColor,
              //         elevation: elevation ? elevationValue : 0,
              //       },
              //     ]}
              //   >
              //     {/* ******* Account Section ******* */}
              //     <View style={tw`flex-row items-center`}>
              //       <Text
              //         style={[tw`flex-1 text-lg font-semibold mr-2`, { color: theme.mainColor }]}
              //         numberOfLines={1}
              //       >
              //         {item?.account_name}
              //       </Text>
              //       <TouchableOpacity
              //         onPress={() => {
              //           setShowErrorModal(true);
              //           setModalTitle('Comming Soon');
              //           setModalBody('add to fav comming soon..');
              //           // item?.fav_icon == 'heart-outline'
              //           //   ? addToFavList(item?.category)
              //           //   : removeFromFavList(item?.category);
              //         }}
              //       >
              //         <MaterialCommunityIcons
              //           name={item?.fav_icon}
              //           color={theme.mainColor}
              //           size={23}
              //         />
              //       </TouchableOpacity>
              //       <TouchableOpacity
              //         onPress={() => {
              //           setSelectedItem({ ...item, id: item.id });
              //           setSelectedIndex(index);
              //           setShowAddModal(true);
              //           setText(item?.account_name, item?.email, item?.password);
              //         }}
              //       >
              //         <MaterialCommunityIcons
              //           name='square-edit-outline'
              //           color={theme.mainColor}
              //           size={23}
              //           style={tw`mx-2`}
              //         />
              //       </TouchableOpacity>
              //       <TouchableOpacity
              //         onPress={() => {
              //           deleteCategoryData(item?.category, item?.id);
              //         }}
              //       >
              //         <MaterialCommunityIcons name={'delete'} color={theme.mainColor} size={25} />
              //       </TouchableOpacity>
              //     </View>
              //     {/* ******* Hr underline ******* */}
              //     <View style={tw`border border-gray-200 mt-2 `}></View>

              //     {/* ******* Passwords Sections ******* */}
              //     <View style={tw`mt-4 `}>
              //       {/* ******* Email  ******* */}
              //       <View style={tw`flex-row items-center justify-between my-2`}>
              //         <MaterialCommunityIcons name='email' color={theme.mainColor} size={22} />
              //         <Text
              //           style={[tw`flex-1 mx-3`, { color: theme.mainTextColor }]}
              //           numberOfLines={1}
              //         >
              //           {item?.email}
              //         </Text>
              //         {!emailCopy && (
              //           <TouchableOpacity>
              //             <MaterialCommunityIcons
              //               style={tw`mx-1`}
              //               onPress={() => copyEmailClipboard(`${item?.email}`)}
              //               name='content-copy'
              //               color={theme.mainColor}
              //               size={22}
              //             />
              //           </TouchableOpacity>
              //         )}
              //         {emailCopy && (
              //           <LottieView
              //             autoPlay={false}
              //             loop={false}
              //             ref={copyRef}
              //             onAnimationFinish={async () => {
              //               setEmailCopy(false);
              //             }}
              //             style={[
              //               tw`ml-1 mr-2`,
              //               {
              //                 width: 22,
              //                 height: 22,
              //               },
              //             ]}
              //             source={require('../../assets/success.json')}
              //           />
              //         )}
              //       </View>
              //       {/* ******* Password  ******* */}
              //       <View style={tw`flex-row items-center justify-between my-2`}>
              //         <MaterialCommunityIcons name='key' color={theme.mainColor} size={22} />
              //         <Text
              //           style={[tw`flex-1 mx-3`, { color: theme.mainTextColor }]}
              //           numberOfLines={1}
              //         >
              //           {item?.password}
              //         </Text>
              //         {!passwordCopy && (
              //           <TouchableOpacity>
              //             <MaterialCommunityIcons
              //               style={tw`mx-1`}
              //               name='content-copy'
              //               onPress={() => copyPasswordClipboard(`${item?.password}`)}
              //               color={theme.mainColor}
              //               size={22}
              //             />
              //           </TouchableOpacity>
              //         )}
              //         {passwordCopy && (
              //           <LottieView
              //             autoPlay={false}
              //             loop={false}
              //             ref={copyRef}
              //             onAnimationFinish={async () => {
              //               setPasswordCopy(false);
              //             }}
              //             style={[
              //               tw`ml-1 mr-2`,
              //               {
              //                 width: 22,
              //                 height: 22,
              //               },
              //             ]}
              //             source={require('../../assets/success.json')}
              //           />
              //         )}
              //       </View>
              //     </View>
              //   </View>
              // </Animated.View>
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
              {/**************** Buttons ***********************/}
              {/* <View style={tw`flex-row justify-end items-center mt-2`}>
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
                <Text style={[tw`font-bold text-xs m-1`, { color: theme.mainTextColor }]}>
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
                  {!loading && <Text style={tw`font-bold text-xs m-1 text-white`}>ADD</Text>}
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
                  {!loading && <Text style={tw`font-bold text-xs m-1 text-white`}>UPDATE</Text>}
                  {loading && (
                    <View style={tw`m-1`}>
                      <ActivityIndicator color={'white'} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View> */}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default memo(DetailsScreen);
