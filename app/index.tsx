import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { getMyProfile } from "@/lib/service/user.service";
import { Redirect } from "expo-router";

export default function App() {
  const [ready, setReady] = useState(false);
  const [redirectTo, setRedirectTo] = useState<null | string>(null);
  const { setProfile } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("userId");
        if (token && userId) {
          const profileData = await getMyProfile(userId);
          setProfile(profileData.userProfile);
          setRedirectTo("/(tabs)/home");
        } else {
          setRedirectTo("/signin");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setRedirectTo("/signin");
      } finally {
        setReady(true);
      }
    };

    checkAuth();
  }, []);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Image
          source={require("../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")}
          className="w-full h-full"
        />
      </View>
    );
  }

  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  return null;
}
