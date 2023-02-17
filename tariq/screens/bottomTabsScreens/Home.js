import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Keyboard,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Button,
} from 'react-native';

import { memo, useState } from 'react';
import useTheme from '../../Contexts/ThemeContext';
import useUser from '../../Contexts/UserContext';
import useSettings from '../../Contexts/SettingContext';
import tw from 'tailwind-react-native-classnames';
import ErrorModal from '../../components/ErrorModal';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const Home = () => {
  /*   All States
   ********************************************* */

  //  all contexts
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();
  const navigation = useNavigation();

  //  Error Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  /*   All Functions
   ********************************************* */

  return (
    <SafeAreaView
      style={[tw`flex-1 justify-center items-center`, { backgroundColor: theme.mainBgColor }]}
    >
      {/* Error Modal */}
      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
      <View
        style={[
          tw`p-10 rounded-3xl`,
          { backgroundColor: theme.bgColor, elevation: elevation ? elevationValue : 0 },
        ]}
      >
        <Button
          onPress={() => {
            navigation.navigate('Details');
          }}
          title='Go to details Page'
        />
      </View>
      {/**************** Category Settings Modal ******************************/}
    </SafeAreaView>
  );
};

export default memo(Home);
