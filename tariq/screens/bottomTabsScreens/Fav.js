import { memo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSettings from "../../Contexts/SettingContext";
import useTheme from "../../Contexts/ThemeContext";
import tw from "tailwind-react-native-classnames";

const Fav = () => {
  const { theme } = useTheme();
  const { elevation, elevationValue } = useSettings();

  return (
    <SafeAreaView
      style={[tw`px-6 flex-1 `, { backgroundColor: theme.mainBgColor }]}
    >
      {/* TopBar */}
      <View>
        <Text style={[tw`text-3xl font-bold`, { color: theme.mainColor }]}>
          Favorites
        </Text>
      </View>
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
    </SafeAreaView>
  );
};

export default memo(Fav);
