import React, { memo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { BounceInDown } from 'react-native-reanimated';
import tw from 'tailwind-react-native-classnames';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import useSettings from '../Contexts/SettingContext';
import useTheme from '../Contexts/ThemeContext';
import { deleteSelectedDoc } from '../services/firebaseService';
import ErrorModal from './ErrorModal';

const CategoriesList = ({ uid, index, item, navigate, allCategoryInfo, onRefresh }) => {
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const deleteCategory = async (uid, category) => {
    try {
      setLoading(true);
      await deleteSelectedDoc(uid, category);
      setLoading(false);
      await onRefresh();
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message);
      setLoading(false);
    }
  };

  return (
    <Animated.View
      entering={BounceInDown.delay((index + 1) * 100)}
      style={[tw`flex-1 mx-1 `, { marginVertical: 5 }]}
    >
      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
      {allCategoryInfo && (
        <TouchableOpacity
          onPress={() => {
            navigate('Details', {
              item: allCategoryInfo[item.category],
              category: item.category,
            });
          }}
          style={[
            tw`py-4 px-2 rounded-lg flex-1 flex-row items-center`,
            {
              elevation: elevation ? elevationValue : 0,
              backgroundColor: theme.bgColor,
            },
          ]}
        >
          {/* ****** Icon  ******* */}
          <MaterialCommunityIcons name={item.icon} color={theme.mainColor} size={33} />
          {/* ******  Name  ******* */}
          <Text numberOfLines={1} style={[tw`flex-1 text-xs mx-2`, { color: theme.mainTextColor }]}>
            {item.category.toUpperCase()}
          </Text>
          {/* ******  3-Dots menu  ******* */}
          <TouchableOpacity
            onPress={() => {
              deleteCategory(uid, item.category);
            }}
          >
            {!loading && (
              <MaterialCommunityIcons name={'delete'} color={theme.mainColor} size={25} />
            )}
            {loading && <ActivityIndicator />}
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default memo(CategoriesList);
