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
  ActivityIndicator,
} from 'react-native';

import { memo, useCallback, useEffect, useState } from 'react';
import { useMemo } from 'react';
import useTheme from '../../Contexts/ThemeContext';
import useUser from '../../Contexts/UserContext';
import useSettings from '../../Contexts/SettingContext';
import tw from 'tailwind-react-native-classnames';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addCategory } from '../../services/firebaseService';
import { RefreshControl } from 'react-native-gesture-handler';
import CategoriesList from '../../components/CategoriesList';
import ErrorModal from '../../components/ErrorModal';
import Animated, { Layout } from 'react-native-reanimated';

const Home = ({ navigation: { navigate } }) => {
  /*   All States
   ********************************************* */

  //  all contexts
  const { theme } = useTheme();
  const { userName, allCategory, fetchAllCategory } = useUser();
  const { elevation, elevationValue } = useSettings();

  // All Modal
  const [showModal, setShowModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);

  //  Error Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  // All Others
  const [isFocused, setIsFocused] = useState(false);
  const [icon, setIcon] = useState('heart');
  const [categoryText, setCategoryText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const iconList = useMemo(
    () => [
      { name: 'facebook', icon: 'facebook' },
      { name: 'instagram', icon: 'instagram' },
      { name: 'twitter', icon: 'twitter' },
      { name: 'netflix', icon: 'netflix' },
      { name: 'linkedin', icon: 'linkedin' },
      { name: 'google', icon: 'google' },
      { name: 'yahoo', icon: 'yahoo' },
      { name: 'git', icon: 'git' },
      { name: 'game', icon: 'gamepad-variant' },
      { name: 'heart', icon: 'heart' },
    ],
    [setIcon]
  );

  /*   All Functions
   ********************************************* */

  // ADD CATEGORY
  const addNewCategory = async () => {
    setLoading(true);
    if (categoryText === '') {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody('Please Enter Category Name');
      setLoading(false);
      return;
    }
    try {
      const data = await addCategory(userName, categoryText, icon);
      setShowModal(false);
      if (data) {
        const done = await onRefresh();
        if (done) {
          setLoading(false);
          setCategoryText('');
          setIcon('heart');
        }
      }
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

  const renderItem = useCallback(
    ({ item, index }) => (
      <CategoriesList
        index={index}
        item={item}
        onRefresh={onRefresh}
        allCategory={allCategory}
        navigate={navigate}
      />
    ),
    [allCategory]
  );
  return (
    <SafeAreaView
      className={`flex-1 `}
      style={[tw`flex-1 `, { backgroundColor: theme.mainBgColor }]}
    >
      {/* Error Modal */}

      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />

      {/* Heading */}
      <View style={tw`flex-row px-6 mt-6 justify-between items-center mb-2`}>
        <Text style={[tw`text-3xl font-extrabold`, { color: theme.mainColor }]}>Categories</Text>
        <TouchableOpacity onPress={() => setShowModal(!showModal)}>
          <MaterialCommunityIcons name='plus-circle' size={40} color={theme.mainColor} />
        </TouchableOpacity>
      </View>
      {/**************** Category Modal ******************************/}
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
        animationType='slide'
        transparent={true}
      >
        <Pressable
          style={tw`flex-1 justify-center items-center `}
          onPress={() => {
            Keyboard.dismiss();
            setShowModal(!showModal);
          }}
        >
          <Pressable onPress={() => setShowModal(true)}>
            <View
              style={[
                tw`p-5 rounded-xl w-72`,
                { elevation: 15 },
                { elevation: 15, backgroundColor: theme.modalBg },
              ]}
            >
              {/**************** Title ***********************/}
              <Text style={[tw`font-bold text-lg`, { color: theme.mainColor }]}>ADD CATEOGRY</Text>
              {/**************** Category text input ***********************/}
              <View style={tw`flex-row justify-between`}>
                <TextInput
                  color={theme.mainColor}
                  value={categoryText}
                  onChangeText={setCategoryText}
                  placeholderTextColor={theme.mainTextColor}
                  style={[
                    tw`border-b-2 my-7  flex-1`,
                    {
                      borderBottomColor: isFocused ? theme.mainColor : theme.grey,
                    },
                  ]}
                  placeholder={'Write category name..'}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <TouchableOpacity style={tw`self-center`} onPressOut={() => setShowIconModal(true)}>
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
                    <MaterialCommunityIcons name={icon} size={30} color={theme.mainColor} />
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
                  <Text style={[tw`font-bold text-xs m-1`, { color: theme.mainTextColor }]}>
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
                  onPress={() => addNewCategory()}
                >
                  {!loading && <Text style={tw`font-bold text-xs m-1 text-white`}>ADD</Text>}
                  {loading && (
                    <View style={tw`m-1`}>
                      <ActivityIndicator color={'white'} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      {/**************** Icon Modal ******************************/}
      <Modal
        visible={showIconModal}
        onRequestClose={() => setShowIconModal(!showIconModal)}
        animationType='fade'
        transparent={true}
      >
        <Pressable
          style={tw`justify-center flex-1 items-center `}
          onPress={() => {
            Keyboard.dismiss();
            setShowIconModal(!showIconModal);
          }}
        >
          <Pressable
            style={tw`w-64 h-1/2`}
            onPress={() => {
              setShowIconModal(true);
            }}
          >
            <View
              style={[
                tw`py-5 px-4 rounded-xl `,
                { elevation: 15, backgroundColor: theme.mainBgColor },
              ]}
            >
              <Text style={[tw`font-bold my-2 mx-1 text-lg `, { color: theme.mainColor }]}>
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
                    <Pressable onPressIn={() => setIcon(item.icon)} key={item.name}>
                      <View
                        style={[
                          tw`p-2 mx-1 mb-1 px-3 items-center justify-between flex-row rounded-lg `,
                          {
                            backgroundColor: icon == item.icon ? theme.mainColor : theme.bgColor,
                            elevation: elevation ? elevationValue : 0,
                          },
                        ]}
                      >
                        {/* *******  Text For scrollable select icons *********** */}
                        <Text
                          style={[
                            tw`text-xs`,
                            {
                              color: icon == item.icon ? 'white' : theme.mainTextColor,
                            },
                          ]}
                        >
                          {item.name.toUpperCase()}
                        </Text>
                        {/* *******  Icon inside scrollable select icons *********** */}
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={25}
                          color={icon == item.icon ? 'white' : theme.mainColor}
                        />
                      </View>
                    </Pressable>
                  );
                }}
              />
              {/**************** Buttons ***********************/}
              <View style={tw`flex-row justify-end  mx-1  items-center `}>
                <TouchableOpacity onPress={() => setShowIconModal(!showIconModal)} style={tw`p-1`}>
                  <Text style={[tw`font-bold text-xs`, { color: theme.mainColor }]}>
                    SELECT CATEGORY
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      {/**************** Main Scrollable Content ******************************/}
      <View style={tw`pb-16 px-5 py-2`}>
        <Animated.FlatList
          contentContainerStyle={{ paddingBottom: 160 }}
          data={allCategory}
          layout={Layout}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item) => item.category}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={renderItem}
        />
      </View>
      {/**************** Category Settings Modal ******************************/}
    </SafeAreaView>
  );
};

export default memo(Home);
