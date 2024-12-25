import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const UserCard = ({ item }: any) => {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const { profile } = useAuth();
  const navigateToUserProfile = (item: any) => {
    if (item === profile._id) {
      router.push(`/profile`);
    } else {
      router.push(`/user/${item}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigateToUserProfile(item._id)}
      className="mx-2"
      style={[
        styles.card,
        {
          backgroundColor:
            colorScheme === "dark" ? colors.dark[400] : colors.light[700],
        },
      ]}
    >
      <Image
        source={{
          uri:
            item.avatar ||
            "https://i.pinimg.com/736x/53/fa/f6/53faf62829a9c44c082d15460c2b1c65.jpg",
        }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View>
        <Text
          style={[
            styles.name,
            {
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            },
          ]}
          className="font-mmedium text-sm"
        >
          {item.firstName} {item.lastName}
        </Text>
        {item.nickName ? (
          <Text
            style={[
              styles.name,
              {
                fontStyle: "italic",
                color: colors.primary[100],
              },
            ]}
            className="font-mmedium text-sm mt-1"
          >
            {item.nickName}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    // shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    // fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default UserCard;
