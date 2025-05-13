import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import MyInput from "../../components/share/MyInput";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import MyButton from "../../components/share/MyButton";
import { useRouter } from "expo-router";
import { login, getMyProfile } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
  const { setProfile } = useAuth();
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const userData = { phoneNumber, password };

    try {
      const user = await login(userData);

      if (user) {
        await AsyncStorage.setItem("token", user.token);
        console.log(user.token);
        const decodedToken = JSON.parse(atob(user.token.split(".")[1]));
        const userId = decodedToken?.id;
        console.log(userId);
        await AsyncStorage.setItem("userId", userId);
        const profileData = await getMyProfile(userId);
        setProfile(profileData.userProfile);
        router.push("home");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className="w-full h-full p-4 bg-white flex flex-col justify-between"
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
          // flex: 1,
        }}
      >
        <View className="w-full flex-grow flex flex-col">
          <View className="w-full items-center justify-end pb-10 mt-40">
            <Text
              className="font-msemibold text-[50px]"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              Login
            </Text>
          </View>

          <View className="w-full">
            <View className="flex flex-col gap-6">
              <View className="relative">
                <View
                  className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[500]
                        : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                    flex: 1,
                  }}
                >
                  <Text
                    className="font-mregular text-[12px]"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[100],
                    }}
                  >
                    Phone Number
                  </Text>
                  {/* <View className="ml-1 pb-1">
                    <PlusIcon />
                  </View> */}
                </View>
                <MyInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Phone Number"
                  fontFamily="Montserrat-Regular"
                  borderRadius={8}
                  height={56}
                  fontSize={14}
                  borderColor={undefined}
                  backgroundColor={undefined}
                  fontWeight={undefined}
                  onSubmit={undefined}
                />
              </View>

              <View className="relative">
                <View
                  className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[500]
                        : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                    flex: 1,
                  }}
                >
                  <Text
                    className="font-mregular text-[12px]"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[100],
                    }}
                  >
                    Password
                  </Text>
                  {/* <View className="ml-1 pb-1">
                    <PlusIcon />
                  </View> */}
                </View>
                <MyInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  borderRadius={8}
                  fontFamily="Montserrat-Regular"
                  height={56}
                  fontSize={14}
                  borderColor={undefined}
                  backgroundColor={undefined}
                  fontWeight={undefined}
                  onSubmit={undefined}
                />
              </View>

              <View>
                <MyButton
                  title="Login"
                  borderRadius={8}
                  backgroundColor="#FFAABB"
                  fontSize={16}
                  color="white"
                  fontFamily="Montserrat-SemiBold"
                  onPress={handleSubmit}
                  padding={undefined}
                  paddingTop={undefined}
                  paddingBottom={undefined}
                  paddingLeft={undefined}
                  paddingRight={undefined}
                  borderColor={undefined}
                  fontWeight={undefined}
                  width={undefined}
                  isActive={undefined}
                />
              </View>

              <View className="px-2 flex flex-row justify-between items-center">
                <TouchableOpacity
                  onPressIn={() => {
                    setIsPressed(true);
                    router.push("forgot-password");
                  }}
                  onPressOut={() => setIsPressed(false)}
                >
                  <Text
                    className="font-mregular text-[14px]"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[100],
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Phần này sẽ luôn nằm cách đáy 16px */}
        <View className="w-full mb-10">
          <View className="flex flex-row items-center justify-center">
            <Text
              className="font-mbold  text-[16px]"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              Or
            </Text>
          </View>
          <View className="mt-4 w-full flex flex-row items-center justify-center">
            <Text
              className="font-mregular text-[16px] "
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              You don't have an account yet?{" "}
              <Text
                onPress={() => router.push("signup" as any)}
                className="font-mbold  text-[16px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
