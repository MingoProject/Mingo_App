import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import Notifications from "../../components/notifications/Notifications.tsx";
// import { Notifications } from "../../components/share/data";
import { getNotifications } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pusher from "pusher-js/react-native";
import { useAuth } from "@/context/AuthContext";

const SearchIcon = ({ size = 24, color = "black", onPress }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      onPress={onPress}
    >
      <Path
        fill={color}
        d="m19.6 21-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
      />
    </Svg>
  );
};
const PUSHER_APP_KEY = process.env.EXPO_PUBLIC_NEXT_PUBLIC_PUSHER_APP_KEY;
const Notification = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isSearch, setIsSearch] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { profile } = useAuth();
  useEffect(() => {
    let isMounted = true;

    const initializeNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("User is not authenticated");
          return;
        }

        const res = await getNotifications(token);
        if (isMounted) {
          setNotifications(res);
        }
      } catch (err) {
        console.error(err);
      }
    };

    initializeNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: "ap1",
    });

    const userId = profile?._id;

    if (!userId) return;

    const notificationChannel = pusher.subscribe(`notifications-${userId}`);

    notificationChannel.bind("new-notification", (data) => {
      setNotifications((prev) => {
        const newNotification = {
          ...data.notification,
          senderId: data.sender,
        };

        if (
          prev.some((notification) => notification._id === newNotification._id)
        ) {
          return prev;
        }
        return [newNotification, ...prev];
      });
    });

    notificationChannel.bind("notification-deleted", (data) => {
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== data.notificationId)
      );
    });

    return () => {
      pusher.unsubscribe(`notifications-${userId}`);
      pusher.disconnect();
    };
  }, [profile?._id]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 4 : 52, // Android: 0, iOS: 12
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
      }}
    >
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "600",
            color:
              colorScheme === "dark" ? colors.dark[100] : colors["title-pink"], // Sử dụng giá trị màu từ file colors.js
          }}
        >
          Notifications
        </Text>
        {/* <SearchIcon size={28} color={iconColor} onPress={() => {}} /> */}
      </View>
      <ScrollView className="h-80">
        <Notifications
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </ScrollView>
    </View>
  );
};

export default Notification;
