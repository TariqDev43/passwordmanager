import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Fav from '../screens/bottomTabsScreens/Fav.js';
import Settings from '../screens/bottomTabsScreens/Settings.js';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BaseNavigation from '../components/BaseNavigation';
import HomeNav from './HomeNav';
import useTheme from '../Contexts/ThemeContext.js';
import tw from 'tailwind-react-native-classnames';
import useUser from '../Contexts/UserContext.js';
import { useNavigation } from '@react-navigation/native';

const BottomNav = () => {
  /*  ALL STATES
   ********************************************* */
  //  all contexts
  const { theme, changeTheme, themeMode } = useTheme();
  const { changeUser } = useUser();

  const Tabs = createBottomTabNavigator();
  // const navigation = useNavigation();
  /*   ALL FUNCTIONS
   ********************************************* */
  const UpdateTheme = async () => {
    // navigation.goBack();
    themeMode == 'light' ? changeTheme('dark') : changeTheme('light');
  };
  return (
    <>
      {/* TopBar */}
      <SafeAreaView style={[tw`px-6 `, { backgroundColor: theme.mainBgColor }]}></SafeAreaView>
      {/* Screens  */}
      <View style={[tw`flex-1 bg-red-500`]}>
        <Tabs.Navigator
          initialRouteName='Home'
          tabBar={(props) => <BaseNavigation {...props} />}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tabs.Screen name='HomeNav' component={HomeNav} />
          <Tabs.Screen name='Fav' component={Fav} />
          <Tabs.Screen name='Settings' component={Settings} />
        </Tabs.Navigator>
      </View>
    </>
  );
};

export default BottomNav;
