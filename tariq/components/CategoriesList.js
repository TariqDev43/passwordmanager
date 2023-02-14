import React, { memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { BounceInDown } from 'react-native-reanimated';
import tw from 'tailwind-react-native-classnames';
import { View, Text, TouchableOpacity } from 'react-native';
import useSettings from '../Contexts/SettingContext';
import useTheme from '../Contexts/ThemeContext';
import { deleteSelectedDoc } from '../services/firebaseService';

const CategoriesList = ({ uid, index, item, navigate, allCategoryInfo, onRefresh }) => {
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();

  const deleteCategory = async (uid, category, id) => {
    try {
      const data = await deleteSelectedDoc(uid, category, id);
      await onRefresh();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Animated.View
      entering={BounceInDown.delay((index + 1) * 200)}
      style={[tw`flex-1 mx-1 `, { marginVertical: 5 }]}
    >
      {allCategoryInfo && (
        <TouchableOpacity
          onPress={() =>
            navigate('Details', {
              item: allCategoryInfo[item.category],
              category: item.category,
            })
          }
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
              deleteCategory(uid, item.category, item.id);
            }}
          >
            <MaterialCommunityIcons name={'delete'} color={theme.mainColor} size={25} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default memo(CategoriesList);
