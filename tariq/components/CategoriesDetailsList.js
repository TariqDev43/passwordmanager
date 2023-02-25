import React, { memo, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import { Text, TouchableOpacity, View } from 'react-native';
import useSettings from '../Contexts/SettingContext';
import useTheme from '../Contexts/ThemeContext';
import ErrorModal from './ErrorModal';
import useUser from '../Contexts/UserContext';
import { removeCategoryDetails } from '../services/firebaseService';
import LottieView from 'lottie-react-native';
import * as Clipboard from 'expo-clipboard';

const CategoriesDetailsList = ({
  categoryIndex,
  setNotes,
  setShowNotes,
  item,
  index,
  addToFavList,
  setSelectedIndex,
  categoryData,
  setCategoryData,
  setSelectedItem,
  setShowAddModal,
  setText,
}) => {
  /*   ALL STATES
   ********************************************* */
  //  all Contexts
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();
  const { userName, updateAllCategories } = useUser();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [emailCopy, setEmailCopy] = useState(false);
  const [passwordCopy, setPasswordCopy] = useState(false);
  const copyRef = useRef(null);

  /*   ALL FUNCTIONS
   ********************************************* */
  const deleteCategoryData = async (category, id) => {
    try {
      let newArray = categoryData.filter((item) => item.id !== id);
      setCategoryData(newArray);
      updateAllCategories(categoryIndex, newArray);
      await removeCategoryDetails(userName, category, id);
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message);
      setLoading(false);
    }
  };

  const copyEmailClipboard = async (val) => {
    try {
      setEmailCopy(true);
      await Clipboard.setStringAsync(val);
      copyRef.current?.play();
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Copy Error');
      setModalBody(err.message);
    }
  };

  const copyPasswordClipboard = async (val) => {
    try {
      setPasswordCopy(true);
      await Clipboard.setStringAsync(val);
      copyRef.current?.play();
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Copy Error');
      setModalBody(err.message);
    }
  };

  return (
    <View
      style={[
        tw`px-5 py-3 rounded-xl`,
        {
          backgroundColor: theme.bgColor,
          elevation: elevation ? elevationValue : 0,
        },
      ]}
    >
      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
      {/* ******* Account Section ******* */}
      <View style={tw`flex-row items-center`}>
        <Text
          style={[tw`flex-1 text-xs font-semibold mr-2`, { color: theme.mainColor }]}
          numberOfLines={1}
        >
          {item?.account_name}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setNotes(item.notes ? item.notes : '');
            setSelectedItem({ ...item, id: item.id });
            setSelectedIndex(index);
            setShowNotes(true);
            setText(item?.account_name, item?.email, item?.password);
          }}
        >
          <MaterialCommunityIcons
            style={[tw`mr-1`, {}]}
            name={'file-document-outline'}
            color={theme.mainColor}
            size={23}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            item?.fav_icon == 'heart-outline'
              ? addToFavList(index, item?.category, 'heart')
              : addToFavList(index, item?.category, 'heart-outline');
          }}
        >
          <MaterialCommunityIcons name={item?.fav_icon} color={theme.mainColor} size={23} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedItem({ ...item, id: item.id });
            setSelectedIndex(index);
            setShowAddModal(true);
            setText(item?.account_name, item?.email, item?.password);
          }}
        >
          <MaterialCommunityIcons
            name='square-edit-outline'
            color={theme.mainColor}
            size={23}
            style={tw`mx-2`}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            deleteCategoryData(item?.category, item?.id);
          }}
        >
          <MaterialCommunityIcons name={'delete'} color={theme.mainColor} size={25} />
        </TouchableOpacity>
      </View>
      {/* ******* Hr underline ******* */}
      <View style={tw`border border-gray-200 mt-2 `}></View>

      {/* ******* Passwords Sections ******* */}
      <View style={tw`mt-4 `}>
        {/* ******* Email  ******* */}
        <View style={tw`flex-row items-center justify-between my-2`}>
          <MaterialCommunityIcons name='email' color={theme.mainColor} size={22} />
          <Text style={[tw`flex-1 mx-3`, { color: theme.mainTextColor }]} numberOfLines={1}>
            {item?.email}
          </Text>
          {!emailCopy && (
            <TouchableOpacity>
              <MaterialCommunityIcons
                style={tw`mx-1`}
                onPress={() => copyEmailClipboard(`${item?.email}`)}
                name='content-copy'
                color={theme.mainColor}
                size={22}
              />
            </TouchableOpacity>
          )}
          {emailCopy && (
            <LottieView
              autoPlay={false}
              loop={false}
              ref={copyRef}
              onAnimationFinish={async () => {
                setEmailCopy(false);
              }}
              style={[
                tw`ml-1 mr-2`,
                {
                  width: 22,
                  height: 22,
                },
              ]}
              source={require('../assets/success.json')}
            />
          )}
        </View>
        {/* ******* Password  ******* */}
        <View style={tw`flex-row items-center justify-between my-2`}>
          <MaterialCommunityIcons name='key' color={theme.mainColor} size={22} />
          <Text style={[tw`flex-1 mx-3`, { color: theme.mainTextColor }]} numberOfLines={1}>
            {item?.password}
          </Text>
          {!passwordCopy && (
            <TouchableOpacity>
              <MaterialCommunityIcons
                style={tw`mx-1`}
                name='content-copy'
                onPress={() => copyPasswordClipboard(`${item?.password}`)}
                color={theme.mainColor}
                size={22}
              />
            </TouchableOpacity>
          )}
          {passwordCopy && (
            <LottieView
              autoPlay={false}
              loop={false}
              ref={copyRef}
              onAnimationFinish={async () => {
                setPasswordCopy(false);
              }}
              style={[
                tw`ml-1 mr-2`,
                {
                  width: 22,
                  height: 22,
                },
              ]}
              source={require('../assets/success.json')}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(CategoriesDetailsList);
