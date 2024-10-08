import { Switch, Text, View } from "react-native";
import React from "react";
import { useColorScheme } from "nativewind";

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <View className="dark:bg-black">
      <Text>Profile</Text>
      <Switch
        value={colorScheme == "dark"}
        onChange={toggleColorScheme}
      ></Switch>
    </View>
  );
};

export default Profile;
