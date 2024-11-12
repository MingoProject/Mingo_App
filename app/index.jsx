import { Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-jsemibold">Mingle</Text>
      <StatusBar style="auto" />
      <Link href="/welcome" style={{ color: "blue" }}>
        Go to Home
      </Link>
    </View>
  );
}
