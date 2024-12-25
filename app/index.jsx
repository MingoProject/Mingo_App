import React, { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { getMyProfile } from "@/lib/service/user.service";

export default function App() {
  const router = useRouter();
  const { setProfile } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("userId");
        if (token) {
          const profileData = await getMyProfile(userId);
          setProfile(profileData.userProfile);
          router.push("/home");
        } else {
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={require("../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")}
        className="w-full h-full"
      />
    </View>
  );
}
