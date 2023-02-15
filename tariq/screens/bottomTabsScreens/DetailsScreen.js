import { View, Text, SafeAreaView, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, TextInput } from 'react-native-gesture-handler';
import { memo } from 'react';
import useTheme from '../../Contexts/ThemeContext';
import useSettings from '../../Contexts/SettingContext';
import useUser from '../../Contexts/UserContext';
import tw from 'tailwind-react-native-classnames';

import ErrorModal from '../../components/ErrorModal';
import { serverTimestamp } from 'firebase/database';
import { addCategoryDetails } from '../../services/firebaseService';
import CategoriesDetailsList from '../../components/CategoriesDetailsList';

const DetailsScreen = ({
  route: {
    params: { item },
  },
}) => {
  // ********** All states are shown here
  const { theme } = useTheme();
  const { userName, allCategory, fetchAllCategory } = useUser();
  const { elevation, elevationValue } = useSettings();
  const [categoryData, setCategoryData] = useState(null);

  // const { changeUser } = useUser();

  //  Error Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  // Focus States
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [hintFocus, setHintFocus] = useState(false);

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // ********** Functions Below

  const addCategoryData = async () => {
    const categoryDta = {
      category: item.category.toLowerCase(),
      email: 'abc@example.com',
      account_name: 'example hint',
      password: 'examplepassword',
      fav_icon: 'heart-outline',
      notes: 'test notes',
      key: serverTimestamp(),
    };
    try {
      const data = await addCategoryDetails(userName, item.category, categoryDta);
      console.log(data);
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAllCategory(userName);
      setRefreshing(false);
      return true;
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message.toString());
    }
  };

  // turning focus off
  const setFocusOff = () => {
    setHintFocus(false);
    setEmailFocus(false);
    setPasswordFocus(false);
  };

  useEffect(() => {
    console.log();
    if (item.value?.items) {
      console.log('exists');
      const data = item.value.items;
      let i = [];
      Object.keys(data).map((key) => {
        i.push({ id: key, value: data[key] });
      });
      setCategoryData(i);
    }
  }, []);

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
        <Text style={[tw`text-2xl font-extrabold`, { color: theme.mainColor }]}>
          {item.category.toUpperCase()}
        </Text>
        <TouchableOpacity onPress={() => setShowAddModal(!showAddModal)}>
          <MaterialCommunityIcons name='plus-box-outline' color={theme.mainColor} size={35} />
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item: data, index }) => {
            return (
              // *******************  Main Div  *********************************

              <CategoriesDetailsList index={index} data={data} onRefresh={onRefresh} />
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
            style={[tw`p-5 rounded-xl w-4/5 `, { backgroundColor: theme.modalBg, elevation: 15 }]}
            onPress={() => {
              Keyboard.dismiss();
              setFocusOff();
            }}
          >
            {/* ************  Main Content *********************  */}
            <View>
              <View style={tw`flex-row `}>
                <Text
                  style={[tw`flex-1 text-xl font-semibold`, { color: theme.mainColor }]}
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
                    name='account'
                    color={hintFocus ? theme.mainColor : theme.grey}
                    size={22}
                  />
                  <TextInput
                    placeholder='Account Name'
                    placeholderTextColor={theme.themeMode == 'dark' ? theme.grey : 'darkgray'}
                    style={[
                      tw`flex-1 mx-3 border-b-2
                  `,
                      {
                        borderBottomColor: hintFocus ? theme.mainColor : theme.grey,
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
                    name='email'
                    color={emailFocus ? theme.mainColor : theme.grey}
                    size={22}
                  />
                  <TextInput
                    className=''
                    placeholder='Enter Email'
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
                <Text style={[tw`font-bold text-xs m-1`, { color: theme.mainTextColor }]}>
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
                  addCategoryData();
                  setFocusOff();
                }}
              >
                <Text style={tw`font-bold text-xs m-1 text-white`}>ADD</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default memo(DetailsScreen);
