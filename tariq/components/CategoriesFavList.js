import React, { memo, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { BounceInDown, Layout, ZoomOutEasyDown } from 'react-native-reanimated';
import tw from 'tailwind-react-native-classnames';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import useSettings from '../Contexts/SettingContext';
import useTheme from '../Contexts/ThemeContext';
import ErrorModal from './ErrorModal';
import LottieView from 'lottie-react-native';
import * as Clipboard from 'expo-clipboard';
import useUser from '../Contexts/UserContext';
import { removeFromFav } from '../services/firebaseService';

const CategoriesFavList = ({ item }) => {
  /*   ALL STATES
   ********************************************* */
  //  all contexts
  const { theme } = useTheme();
  const { userName, updateAllFav, allCategory, updateAllCategories } = useUser();
  const { elevation, elevationValue } = useSettings();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [emailCopy, setEmailCopy] = useState(false);
  const [passwordCopy, setPasswordCopy] = useState(false);
  const copyRef = useRef(null);

  const [loading, setLoading] = useState(false);

  /*   ALL FUNCTIONS
   ********************************************* */
  const deleteFromFavList = async (category, data) => {
    try {
      setLoading(true);
      updateAllFav('remove', data);
      removeFromFav(userName, category, data, data.id);
      let newArrary = [...allCategory];
      newArrary.map((item, mainIndex) => {
        if (item.category === category) {
          let updatedFav = item.items;
          item.items.map((fav, index) => {
            if (fav.id === data.id) {
              updatedFav[index] = {
                ...fav,
                fav_icon: fav.fav_icon == 'heart' ? 'heart-outline' : 'heart',
              };
              updateAllCategories(mainIndex, updatedFav);
              return;
            }
          });
          return;
        }
      });
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Copy Error');
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
      layout={Layout.delay(300)}
      entering={BounceInDown}
      exiting={ZoomOutEasyDown}
      style={[
        tw`px-5 py-3 rounded-xl my-1 mx-1`,
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
      <View style={tw`flex-row justify-between items-center`}>
        <Text
          style={[tw`flex-1 text-lg font-semibold`, { color: theme.mainColor }]}
          numberOfLines={1}
        >
          {item?.account_name}
        </Text>
        <Text
          style={[tw`text-lg font-semibold mx-2`, { color: theme.mainColor }]}
          numberOfLines={1}
        >
          {item?.category.toUpperCase()}
        </Text>

        <TouchableOpacity
          onPress={() => {
            deleteFromFavList(item?.category, item);
          }}
        >
          {!loading && <MaterialCommunityIcons name={'heart'} color={theme.mainColor} size={25} />}
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
          <MaterialCommunityIcons
            onPress={() => Clipboard.setStringAsync(`${item?.password}`)}
            name='key'
            color={theme.mainColor}
            size={22}
          />
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
    </Animated.View>
  );
};

export default memo(CategoriesFavList);
