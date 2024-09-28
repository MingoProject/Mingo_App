import React from "react";
import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons"; // Sử dụng Ionicons
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Sử dụng FontAwesome

const TabIcon = ({ icon, font, color, name, focused }) => {
  const IconComponent = font === "FontAwesome" ? FontAwesome : Icon; // Chọn bộ icon
  return (
    <View style={{ alignItems: "center", justifyContent: "center", gap: 2 }}>
      <IconComponent name={icon} size={24} color={color} />
      <Text
        style={{
          fontWeight: focused ? "font-msemibold" : "font-mregular",
          fontSize: 12,
          color: { color },
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#92898A",
        tabBarInactiveTintColor: "#92898A",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "home" : "home-outline"}
              font="Ionicons" // Sử dụng Ionicons cho tab Home
              color={color}
              focused={focused}
              name="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friend"
        options={{
          title: "Friend",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "people" : "people-outline"} // FontAwesome icons
              font="Ionicons" // Sử dụng FontAwesome cho tab Friend
              color={color}
              focused={focused}
              name="Friends"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "bell" : "bell-o"} // FontAwesome icons
              font="FontAwesome" // Sử dụng FontAwesome cho tab Friend
              color={color}
              focused={focused}
              name="Notifications"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "person" : "person-outline"} // FontAwesome icons
              font="Ionicons" // Sử dụng FontAwesome cho tab Friend
              color={color}
              focused={focused}
              name="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
