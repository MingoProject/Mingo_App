import { Switch, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useTheme();

  return (
    <View
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <Text
        style={{
          color: colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng màu text phù hợp
        }}
      >
        Profile
      </Text>
      <Switch
        value={colorScheme === "dark"}
        onValueChange={toggleColorScheme}
      />
    </View>
  );
};

export default Profile;
