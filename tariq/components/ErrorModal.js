import { View, Text, Modal, Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import tw from 'tailwind-react-native-classnames';
import useTheme from '../Contexts/ThemeContext';
// theme

const ErrorModal = ({ show, setShow, modalTitle, modalBody }) => {
  const { theme } = useTheme();
  return (
    <Modal animationType='fade' transparent={true} visible={show}>
      <View style={[tw`flex-1 justify-center items-center`]}>
        <Pressable
          style={[tw`p-5 rounded-2xl w-64`, { backgroundColor: theme.modalBg, elevation: 100 }]}
          onPress={() => {
            setShow(false);
          }}
        >
          <View style={tw``}>
            <View style={[tw``, {}]}>
              <Text style={[tw`font-semibold text-lg`, { color: theme.mainTextColor }]}>
                {modalTitle}
              </Text>
              <View style={[tw`border-b-2`, { borderBottomColor: theme.grey }]}></View>
            </View>
            <View style={[tw`py-5`, {}]}>
              <Text style={[tw`text-base `, { color: theme.mainTextColor }]}>{modalBody}</Text>
            </View>
          </View>
          {/**************** Buttons ***********************/}
          <View style={tw`flex-row justify-end  mx-1  items-center `}>
            <TouchableOpacity onPress={() => setShow(false)} style={tw`p-1`}>
              <Text style={[tw`font-bold text-xs`, { color: theme.mainColor }]}>Okay</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
};

export default ErrorModal;
