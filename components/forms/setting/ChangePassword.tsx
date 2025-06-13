import { useTheme } from "@/context/ThemeContext";
import { changePassword } from "@/lib/service/user.service";
import { colors } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, TextInput, View, Text, TouchableOpacity } from "react-native";

const ChangePassword = ({ toggleChangePasswordModal }: any) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { colorScheme } = useTheme();
  const [error, setError] = useState("");
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    const token: string | null = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }
    try {
      await changePassword(token, oldPassword, newPassword);
      Alert.alert("Success", "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      setError(error.message);
    }

    toggleChangePasswordModal();
  };

  return (
    <View>
      {error && (
        <View className="mb-4 text-sm text-red-500">
          <Text>{error}</Text>
        </View>
      )}
      <View className="mt-6 px-5">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="font-mmedium mb-2"
        >
          Old Password
        </Text>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
          className="border-gray-200 border rounded p-3"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        />

        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="font-mmedium mt-4 mb-2"
        >
          New Password
        </Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          className="border-gray-200 border rounded p-3"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        />

        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="font-mmedium mt-4 mb-2"
        >
          Confirm New Password
        </Text>
        <TextInput
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
          className="border-gray-200 border rounded p-3"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        />
      </View>
      <TouchableOpacity
        onPress={handleChangePassword}
        className="bg-primary-100 rounded p-3 mt-6 mx-6"
      >
        <Text className="text-white text-center font-mmedium">Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;
