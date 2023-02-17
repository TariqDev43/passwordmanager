import { memo, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useSettings from '../../Contexts/SettingContext';
import useTheme from '../../Contexts/ThemeContext';
import tw from 'tailwind-react-native-classnames';
import useUser from '../../Contexts/UserContext';
import ErrorModal from '../../components/ErrorModal';
import Animated, { BounceInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const Fav = () => {
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();
  const { userName, allFav, fetchAllFav } = useUser();

  //  Error Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  useEffect(() => {
    console.log(allFav.length);
  }, []);

  return (
    <SafeAreaView style={[tw`px-6 flex-1 `, { backgroundColor: theme.mainBgColor }]}>
      {/* TopBar */}
      <View>
        <Text style={[tw`text-3xl font-bold mb-5`, { color: theme.mainColor }]}>Favorites</Text>
      </View>

      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
      {allFav && allFav.length > 0 && (
        <Animated.FlatList
          contentContainerStyle={{ paddingBottom: 160 }}
          data={allFav}
          // extraData={categoryData}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          keyExtractor={(item) => item?.id}
          // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item: data, index }) => {
            return (
              // *******************  Main Div  *********************************

              <Animated.View
                entering={BounceInDown}
                style={[
                  tw`px-5 py-3 rounded-xl my-1 mx-1`,
                  {
                    backgroundColor: theme.bgColor,
                    elevation: elevation ? elevationValue : 0,
                  },
                ]}
              >
                {/* ******* Account Section ******* */}
                <View style={tw`flex-row justify-between items-center`}>
                  <Text
                    style={[tw`flex-1 text-lg font-semibold`, { color: theme.mainColor }]}
                    numberOfLines={1}
                  >
                    {data.value.account_name}
                  </Text>
                  <Text
                    style={[tw`text-lg font-semibold`, { color: theme.mainColor }]}
                    numberOfLines={1}
                  >
                    {data.value.category.toUpperCase()}
                  </Text>
                  {/* <TouchableOpacity
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
                  </TouchableOpacity> */}
                </View>

                {/* ******* Hr underline ******* */}
                <View style={tw`border border-gray-200 mt-2 `}></View>

                {/* ******* Passwords Sections ******* */}
                <View style={tw`mt-4 `}>
                  {/* ******* Email  ******* */}
                  <View style={tw`flex-row items-center justify-between my-2`}>
                    <MaterialCommunityIcons name='email' color={theme.mainColor} size={22} />
                    <Text
                      style={[tw`flex-1 mx-3`, { color: theme.mainTextColor }]}
                      numberOfLines={1}
                    >
                      {data.value.email}
                    </Text>
                    <TouchableOpacity>
                      <MaterialCommunityIcons
                        style={tw`mx-1`}
                        onPress={() => Clipboard.setStringAsync(`${data.value.email}`)}
                        name='content-copy'
                        color={theme.mainColor}
                        size={22}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* ******* Password  ******* */}
                  <View style={tw`flex-row items-center justify-between my-2`}>
                    <MaterialCommunityIcons
                      onPress={() => Clipboard.setStringAsync(`${data.value.password}`)}
                      name='key'
                      color={theme.mainColor}
                      size={22}
                    />
                    <Text
                      style={[tw`flex-1 mx-3`, { color: theme.mainTextColor }]}
                      numberOfLines={1}
                    >
                      {data.value.password}
                    </Text>
                    <TouchableOpacity>
                      <MaterialCommunityIcons
                        style={tw`mx-1`}
                        name='content-copy'
                        color={theme.mainColor}
                        size={22}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            );
          }}
        />
      )}
      {allFav && allFav.length == 0 && (
        <View
          style={[
            tw`h-1/2 my-6 rounded-2xl justify-center items-center p-8`,
            {
              elevation: elevation ? elevationValue : 0,
              backgroundColor: theme.bgColor,
            },
          ]}
        >
          <Text
            style={[
              tw`
          text-lg font-semibold opacity-50 text-center
          `,
              { color: theme.mainTextColor },
            ]}
          >
            Your Favorite passwords will be shown here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default memo(Fav);
