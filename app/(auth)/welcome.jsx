import { Text, View } from "react-native";
import React from "react";
import MyButton from "../../components/share/MyButton";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  return (
    <View>
      <MyButton title="sign up" onPress={() => router.push("signup")}>
        SignUp
      </MyButton>
      <MyButton title="sign in" onPress={() => router.push("signin")}>
        SignIn
      </MyButton>
    </View>
  );
};

export default Welcome;
