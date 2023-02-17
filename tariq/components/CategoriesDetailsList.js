import React, { memo, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { BounceInDown, Layout } from 'react-native-reanimated';
import tw from 'tailwind-react-native-classnames';
import { Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import useSettings from '../Contexts/SettingContext';
import useTheme from '../Contexts/ThemeContext';
import ErrorModal from './ErrorModal';
import useUser from '../Contexts/UserContext';
import { addToFav, removeCategoryDetails, removeFromFav } from '../services/firebaseService';
import LottieView from 'lottie-react-native';
import * as Clipboard from 'expo-clipboard';

const CategoriesDetailsList = ({ index, data, setSelectedItem, setShowAddModal, setText }) => {
  /*   ALL STATES
   ********************************************* */
  //  all Contexts
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();
  const { userName, fetchAllCategory, fetchAllFav } = useUser();

  const [loading, setLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

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
      setLoading(true);
      await removeCategoryDetails(userName, category, id);
      await onRefresh();
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message);
      setLoading(false);
    }
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

  const addToFavList = async (category) => {
    try {
      setFavLoading(true);
      await addToFav(userName, category, data, data.id);
      setFavLoading(false);
      await onRefresh();
      fetchAllFav(userName);
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message);
    }
  };
  const removeFromFavList = async (category) => {
    try {
      setFavLoading(true);
      await removeFromFav(userName, category, data, data.id);
      setFavLoading(false);
      await onRefresh();
      fetchAllFav(userName);
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message);
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
    <Animated.View
      layout={Layout}
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
            style={[tw`flex-1 text-lg font-semibold mr-2`, { color: theme.mainColor }]}
            numberOfLines={1}
          >
            {data.value.account_name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              // setShowErrorModal(true);
              // setModalTitle('Comming Soon');
              // setModalBody('add to fav comming soon..');
              data.value.fav_icon == 'heart-outline'
                ? addToFavList(data.value.category)
                : removeFromFavList(data.value.category);
            }}
          >
            {!favLoading && (
              <MaterialCommunityIcons
                name={data.value.fav_icon}
                color={theme.mainColor}
                size={23}
              />
            )}
            {favLoading && <ActivityIndicator />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedItem({ ...data.value, id: data.id });
              setShowAddModal(true);
              setText(data.value.account_name, data.value.email, data.value.password);
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
              deleteCategoryData(data.value.category, data.id);
            }}
          >
            {!loading && (
              <MaterialCommunityIcons name={'delete'} color={theme.mainColor} size={25} />
            )}
            {loading && <ActivityIndicator />}
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
              {data.value.email}
            </Text>
            {!emailCopy && (
              <TouchableOpacity>
                <MaterialCommunityIcons
                  style={tw`mx-1`}
                  onPress={() => copyEmailClipboard(`${data.value.email}`)}
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
              {data.value.password}
            </Text>
            {!passwordCopy && (
              <TouchableOpacity>
                <MaterialCommunityIcons
                  style={tw`mx-1`}
                  name='content-copy'
                  onPress={() => copyPasswordClipboard(`${data.value.password}`)}
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
    </Animated.View>
  );
};

export default memo(CategoriesDetailsList);
