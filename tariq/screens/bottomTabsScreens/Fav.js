import { memo, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useSettings from '../../Contexts/SettingContext';
import useTheme from '../../Contexts/ThemeContext';
import tw from 'tailwind-react-native-classnames';
import useUser from '../../Contexts/UserContext';
import ErrorModal from '../../components/ErrorModal';
import Animated from 'react-native-reanimated';

import * as Clipboard from 'expo-clipboard';

import CategoriesFavList from '../../components/CategoriesFavList';
import { RefreshControl } from 'react-native-gesture-handler';

const Fav = () => {
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();
  const { userName, allFav, fetchAllFav } = useUser();

  //  Error Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAllFav(userName);
      setRefreshing(false);
      return true;
    } catch (err) {
      setShowErrorModal(true);
      setModalTitle('Error');
      setModalBody(err.message.toString());
    }
  };

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
          showsVerticalScrollIndicator={false}
          numColumns={1}
          keyExtractor={(item) => item?.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item: data, index }) => {
            return (
              // *******************  Main Div  *********************************
              <View>{data && <CategoriesFavList data={data} />}</View>
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
