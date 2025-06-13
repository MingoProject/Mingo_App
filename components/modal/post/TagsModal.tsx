import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { CancelIcon } from "@/components/shared/icons/Icons";
import { useAuth } from "@/context/AuthContext";
import { UserBasicInfo } from "@/dtos/UserDTO";

interface TagModalProps {
  tags: UserBasicInfo[] | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const TagModal: React.FC<TagModalProps> = ({ tags, isOpen, onClose }) => {
  if (!isOpen) return null;
  const router = useRouter();
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const { profile } = useAuth();

  const navigateToUserProfile = (item: any) => {
    onClose();
    if (item === profile._id) {
      router.push(`/profile`);
    } else {
      router.push(`/user/${item}`);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[300],
            },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-mbold text-[20px]"
            >
              Tagged People
            </Text>
            <TouchableOpacity onPress={onClose}>
              <CancelIcon size={20} color={iconColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsList}>
            {tags?.map((tag) => (
              <TouchableOpacity
                key={tag._id}
                style={styles.tagItem}
                onPress={() => navigateToUserProfile(tag._id)}
              >
                <Image
                  source={{
                    uri:
                      tag.avatar ||
                      "https://i.pinimg.com/736x/6b/3e/a0/6b3ea0d4d36f00a044b54f8f051858ae.jpg",
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.tagText} className="font-mmedium">
                  {tag.firstName} {tag.lastName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    width: "90%",
    maxWidth: 400,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tagsList: {
    marginTop: 10,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  tagText: {
    fontSize: 16,
    color: colors.primary[100],
  },
});

export default TagModal;
