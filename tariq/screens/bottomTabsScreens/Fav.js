import { memo, useEffect, useState } from 'react';
import { Text, View, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useSettings from '../../Contexts/SettingContext';
import useTheme from '../../Contexts/ThemeContext';
import tw from 'tailwind-react-native-classnames';
import useUser from '../../Contexts/UserContext';
import ErrorModal from '../../components/ErrorModal';
import Animated from 'react-native-reanimated';
import CategoriesFavList from '../../components/CategoriesFavList';
import { useNavigation } from '@react-navigation/native';
// import { RefreshControl } from 'react-native-gesture-handler';

const Fav = () => {
  /*   ALL STATES
   ********************************************* */
  //  all contexts
  const { theme } = useTheme();
  const { elevation, elevationValue, setSelectedScreen } = useSettings();
  const { allFav } = useUser();

  //  Error Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [favData, setFavData] = useState(allFav ? allFav : []);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  /*   ALL FUNCTIONS
   ********************************************* */
  function handleBackButtonClick() {
    setSelectedScreen('Home');
    navigation.goBack();
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);
  useEffect(() => {
    setFavData(allFav);
  }, [allFav]);
  return (
    <SafeAreaView style={[tw`px-6 flex-1 `, { backgroundColor: theme.mainBgColor }]}>
      {/* TopBar */}
      <View>
        <Text style={[tw`text-2xl font-bold mb-5`, { color: theme.mainColor }]}>Favorites</Text>
      </View>

      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
      {favData && favData.length > 0 && (
        <Animated.FlatList
          contentContainerStyle={{ paddingBottom: 160 }}
          data={favData}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          keyExtractor={(item) => item?.id}
          // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => {
            return (
              // *******************  Main Div  *********************************
              <View>
                {item && (
                  <CategoriesFavList item={item} favData={favData} setFavData={setFavData} />
                )}
              </View>
            );
          }}
        />
      )}
      {favData && favData.length == 0 && (
        <View
          style={[
            tw`h-1/3 my-6 rounded-2xl justify-center items-center p-8`,
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
