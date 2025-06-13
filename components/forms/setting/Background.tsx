import { useAuth } from "@/context/AuthContext";
import { uploadBackground } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";

const Background = ({ profileUser, setProfile }: any) => {
  const [isMe, setIsMe] = useState(false);
  const { profile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { colorScheme, toggleColorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  useEffect(() => {
    if (profile?._id && profile?._id === profileUser?._id) {
      setIsMe(true);
    }
  }, [profileUser?._id]);

  const uploadUserBackGround = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }
      const response = await uploadBackground(formData, token);
      if (response?.status) {
        console.log(response?.result.secure_url);
        setProfile((prevProfile: any) => ({
          ...prevProfile,
          background: response?.result.secure_url,
        }));
      }
    } catch (err) {
      console.error("Error uploading background:", err);
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
      await uploadUserBackGround(file as File);
      setShowModal(false);
    }
  };

  return (
    <View className="mt-4">
      <TouchableOpacity onPress={() => isMe && setShowModal(true)}>
        <Image
          source={{
            uri:
              profileUser?.background ||
              "https://i.pinimg.com/1200x/50/51/d4/5051d41e6bf1a0b3806f4ce4cc267cac.jpg",
          }}
          className="w-full h-[152px] rounded-lg"
        />
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
                colorScheme === "dark" ? colors.dark[400] : colors.light[400],
            }}
          >
            <Text
              className="text-lg font-bold mb-4"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              Background Options
            </Text>
            <TouchableOpacity
              className="py-3 border-b border-gray-300"
              onPress={() => {
                setShowModal(false);
                Alert.alert("View Avatar", "Here you can view the avatar.");
              }}
            >
              <Text className="text-center text-primary-100">
                View Background
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 mt-2" onPress={handlePickImage}>
              <Text className="text-center text-primary-100">
                Change Background
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

export default Background;
