import { useAuth } from "@/context/AuthContext";
import { uploadAvatar } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { ItemChat } from "@/dtos/MessageDTO";
import { uploadGroupAvatar } from "@/lib/service/message.service";

const ChangeAvatar = ({
  groupData,
  setGroupData,
}: {
  groupData: ItemChat;
  setGroupData: any;
}) => {
  const [isMe, setIsMe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { colorScheme, toggleColorScheme } = useTheme();

  const uploadUserAvatar = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }
      const response = await uploadGroupAvatar(formData, groupData.id, token);
      if (response?.status) {
        console.log(response?.result.secure_url);
        setGroupData((prevProfile: any) => ({
          ...prevProfile,
          avatar: response?.result.secure_url,
        }));
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const file = {
        uri,
        type: `image/${uri.split(".").pop()}`,
        name: `avatar.${uri.split(".").pop()}`,
      };
      await uploadUserAvatar(file as File);
      setShowModal(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => isMe && setShowModal(true)}>
        <View className="h-[105px] w-[105px] overflow-hidden rounded-full">
          <Image
            source={{
              uri: groupData.avatarUrl || "/assets/images/default-user.png",
            }}
            style={{ width: 105, height: 105, borderRadius: 20 }}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          className="bg-black/50"
        >
          <View
            className=" rounded-lg p-5 w-[80%]"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700],
            }}
          >
            <Text
              className="text-lg font-bold mb-4"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              Avatar Options
            </Text>
            <TouchableOpacity
              className="py-3 border-b border-gray-300"
              onPress={() => {
                setShowModal(false);
                Alert.alert("View Avatar", "Here you can view the avatar.");
              }}
            >
              <Text className="text-center text-primary-100">View Avatar</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 mt-2" onPress={handlePickImage}>
              <Text className="text-center text-primary-100">
                Change Avatar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3 mt-4"
              onPress={() => setShowModal(false)}
            >
              <Text className="text-center text-gray-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChangeAvatar;
