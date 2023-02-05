import React, { useState } from "react";
import { Text, View } from "react-native";
import LottieView from "lottie-react-native";

const Login = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <LottieView
        autoPlay="true"
        style={{
          width: 200,
          height: 200,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require("../../assets/boySmiling.json")}
      />
    </View>
  );
};

export default Login;
