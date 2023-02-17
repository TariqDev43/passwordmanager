import { Button, Text, View } from 'react-native';
import useTheme from '../../Contexts/ThemeContext';
import useUser from '../../Contexts/UserContext';
import tw from 'tailwind-react-native-classnames';

const Login = () => {
  /*   ALL States
   ********************************************* */

  // theme
  const { changeUser } = useUser();
  const { theme } = useTheme();

  /*   All Function
   ********************************************* */
  return (
    <View style={[tw`flex-1 justify-center items-center`, {}]}>
      <Button
        onPress={() => {
          changeUser('Tariq');
        }}
        title={'login'}
      />
    </View>
  );
};

export default Login;
