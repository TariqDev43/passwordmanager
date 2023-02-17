import { Text, SafeAreaView } from 'react-native';
import { memo, useState } from 'react';
import useTheme from '../../Contexts/ThemeContext';
import tw from 'tailwind-react-native-classnames';
import ErrorModal from '../../components/ErrorModal';

const DetailsScreen = () => {
  // ********** All states are shown here
  // All Contexts
  const { theme } = useTheme();

  //  Error Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  /*   ALL FUNCTION
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
      <Text>Details Page</Text>
    </SafeAreaView>
  );
};

export default memo(DetailsScreen);
