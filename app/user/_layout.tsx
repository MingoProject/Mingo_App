import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";

const AuthLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Montserrat-Black": require("../../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraLight": require("../../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Thin": require("../../assets/fonts/Montserrat-Thin.ttf"),
    "JosefinSans-SemiBold": require("../../assets/fonts/JosefinSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }),
    [fontsLoaded, error];

  if (!fontsLoaded && !error) return null;
  return (
    <Stack initialRouteName="[id]">
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
