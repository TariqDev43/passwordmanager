import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import ColorPicker, {
  Panel3,
  Swatches,
  Preview,
  OpacitySlider,
  BrightnessSlider,
} from 'reanimated-color-picker';
import useTheme from '../Contexts/ThemeContext';

export default function Color({ colorList }) {
  const { theme, changeColor } = useTheme();
  const [selectedColor, setSelectedColor] = useState(theme.mainColor);
  const onSelectColor = ({ hex }) => {
    setSelectedColor(hex);
    changeColor(hex);
  };

  return (
    <>
      <View style={styles.container}>
        <ColorPicker
          value={selectedColor}
          sliderThickness={30}
          thumbSize={30}
          thumbShape='circle'
          onComplete={onSelectColor}
          style={{ width: '75%', justifyContent: 'space-evenly' }}
        >
          <Panel3 style={styles.shadow} />

          <Swatches swatchStyle={styles.swatchStyle} colors={colorList} />
        </ColorPicker>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
    width: '100%',
    margin: 'auto',
  },
  previewStyle: {
    height: 50,
    borderRadius: 10,
  },
  swatchStyle: {
    borderRadius: 8,
    height: 30,
    width: 45,
    margin: 5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
