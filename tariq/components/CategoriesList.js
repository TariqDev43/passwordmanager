import React, { memo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { BounceInDown, Layout } from 'react-native-reanimated';
import tw from 'tailwind-react-native-classnames';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import useSettings from '../Contexts/SettingContext';
import useTheme from '../Contexts/ThemeContext';
import { removeCategory } from '../services/firebaseService';
import ErrorModal from './ErrorModal';
import useUser from '../Contexts/UserContext';

const CategoriesList = ({ index, item, onRefresh, allCategory, navigate }) => {
  /*   ALL STATES
   ********************************************* */
  //  all contexts
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();
  const { userName } = useUser();

  const [loading, setLoading] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  /*   ALL FUCNTIONS
   ********************************************* */
  const deleteCategory = async (category) => {
    try {
      setLoading(true);
      await removeCategory(userName, category);
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
      layout={Layout}
      entering={BounceInDown.delay(index + 1 * 100)}
      style={[tw`flex-1 mx-1 `, { marginVertical: 5 }]}
    >
      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
      {allCategory && (
        <TouchableOpacity
          onPress={() => {
            navigate('Details', {
              item,
              index,
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
          <MaterialCommunityIcons
            name={item?.value.info.icon.toLowerCase()}
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
