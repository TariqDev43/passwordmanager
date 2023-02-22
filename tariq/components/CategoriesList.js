import React, { memo, useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { BounceInDown, Layout } from 'react-native-reanimated';
import tw from 'tailwind-react-native-classnames';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import useSettings from '../Contexts/SettingContext';
import useTheme from '../Contexts/ThemeContext';
import ErrorModal from './ErrorModal';

const CategoriesList = ({ categoryIndex, item, navigate, deleteCategory, updateCategory }) => {
  /*   ALL STATES
   ********************************************* */
  //  all contexts
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();

  const [loading, setLoading] = useState(false);

  const [initialState, setInitialState] = useState(true);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  /*   ALL FUCNTIONS
   ********************************************* */

  useEffect(() => {
    setInitialState(false);
  }, []);

  return (
    <Animated.View
      layout={Layout.easing}
      entering={initialState ? BounceInDown.delay(categoryIndex * 100) : BounceInDown}
      style={[tw`flex-1 mx-1 `, { marginVertical: 5 }]}
    >
      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
      <TouchableOpacity
        style={[
          tw`py-4 px-2 rounded-lg flex-row items-center`,

          { backgroundColor: theme.bgColor, elevation: elevation ? elevationValue : 0 },
        ]}
        onLongPress={() => {
          updateCategory(item, categoryIndex);
        }}
        onPress={() => {
          navigate('Details', {
            item,
            categoryIndex,
          });
        }}
      >
        {/* ****** Icon  ******* */}
        <MaterialCommunityIcons
          name={item?.icon.icon.toLowerCase()}
          color={theme.mainColor}
          size={33}
        />
        {/* ******  Name  ******* */}
        <Text numberOfLines={1} style={[tw`flex-1 text-xs mx-2`, { color: theme.mainTextColor }]}>
          {item.category.toUpperCase()}
        </Text>
        {/* ******  3-Dots menu  ******* */}
        <TouchableOpacity
          onPress={() => {
            deleteCategory(item.category);
          }}
        >
          {!loading && <MaterialCommunityIcons name={'delete'} color={theme.mainColor} size={25} />}
          {loading && <ActivityIndicator />}
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default memo(CategoriesList);
