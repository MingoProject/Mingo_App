import React from "react";
import { View, Image, StyleSheet } from "react-native";

// Thay vì nhận các đối số, chúng ta nhận 'props' và giải nén 'users' và 'ongoingCall' từ đó
const RemoteAvatar = ({
  users,
  ongoingCall,
  receiverAva,
}: {
  users: any;
  ongoingCall: any;
  receiverAva: any;
}) => {
  // Kiểm tra nếu người dùng không phải là người gọi

  return (
    <View style={styles.avatarContainer}>
      {ongoingCall?.participants.caller ? (
        <View style={styles.remoteAvatar}>
          <Image
            source={{ uri: ongoingCall?.participants.caller?.profile.avatar }}
            style={styles.avatarImage}
          />
        </View>
      ) : (
        // Nếu là người gọi, hiển thị avatar của người gọi
        <View style={styles.remoteAvatar}>
          <Image source={{ uri: receiverAva }} style={styles.avatarImage} />
        </View>
      )}
    </View>
  );
};

// Định nghĩa style cho các phần tử
const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  remoteAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40, // Bo tròn để tạo hình tròn cho avatar
    overflow: "hidden", // Cắt phần dư ra ngoài hình tròn
  },
  avatarImage: {
    width: "100%", // Đảm bảo ảnh chiếm toàn bộ kích thước của View
    height: "100%",
    resizeMode: "cover", // Cắt ảnh nếu cần thiết để vừa với View
  },
});

export default RemoteAvatar;
