import { PenIcon } from "@/components/icons/Icons";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { updateUserBio } from "@/lib/service/user.service";
import { colors } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";

const Bio = ({ profileUser, setProfile }: any) => {
  const { colorScheme, toggleColorScheme } = useTheme();
  const [showEdit, setShowEdit] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const { profile } = useAuth();
  const [bio, setBio] = useState(profileUser.bio);

  const handleSave = async () => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      const params = {
        bio,
      };

      const response = await updateUserBio(params, token);

      if (response?.status) {
        setProfile((prevProfile: any) => ({
          ...prevProfile,
          bio: response?.newProfile.bio,
        }));
        setShowEdit(false);
      } else {
        console.error("Failed to update user information");
      }
    } catch (err) {
      console.error("Error updating user information:", err);
    }
  };

  useEffect(() => {
    if (profile._id && profile._id === profileUser._id) {
      setIsMe(true);
    }
  }, [profileUser._id]);
  return (
    <View className="p-3 w-[266px]">
      <Text
        style={{
          color: colorScheme === "dark" ? colors.dark[100] : colors.light[500],
        }}
        className="font-mregular text-[14px] "
      >
        {profileUser.bio || "No bio"}
      </Text>
      {isMe && (
        <TouchableOpacity className="ml-auto" onPress={() => setShowEdit(true)}>
          <PenIcon size={23} color={colors.primary[100]} />
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEdit}
        onRequestClose={() => setShowEdit(false)}
      >
        <View
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700],
            flex: 1,
          }}
          className="pt-10"
        >
          <View className="flex-1 justify-center items-center">
            <View
              className="mt-4 py-4 px-6"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700],
                flex: 1,
              }}
            >
              <View className="flex-row h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 mb-4">
                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  Update Bio
                </Text>
                <TouchableOpacity
                  className="ml-auto mt-1"
                  onPress={() => setShowEdit(false)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginBottom: 20,
                      color: colors.primary[100],
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                value={bio}
                onChangeText={setBio}
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? colors.dark[300]
                      : colors.light[700],
                  padding: 10,
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                  marginBottom: 15,
                }}
                placeholder="Enter your new bio"
                placeholderTextColor={
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500]
                }
                className="border border-gray-400 rounded-lg"
              />
              <TouchableOpacity onPress={handleSave}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.primary[100],
                    textAlign: "center",
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Bio;
