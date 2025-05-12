import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import Notifications from "../../components/notifications/Notifications";
// import { Notifications } from "../../components/share/data";
import { getNotifications } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pusher from "@pusher/pusher-websocket-react-native";
import { useAuth } from "@/context/AuthContext";

const PUSHER_APP_KEY = process.env.EXPO_PUBLIC_NEXT_PUBLIC_PUSHER_APP_KEY;
const Notification = () => {
  const { colorScheme } = useTheme();
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
          colorScheme === "dark" ? colors.dark[300] : colors.light[300], // Sử dụng giá trị màu từ file colors.js
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
