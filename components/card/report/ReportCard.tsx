import { CommentReportCreateDTO, ReportCreateDTO } from "@/dtos/reportDTO";
import {
  createCommentReport,
  createReport,
} from "@/lib/service/report.service";

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CancelIcon,
  CircleFillIcon,
  CircleTickIcon,
} from "@/components/shared/icons/Icons";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";

// Danh sách nội dung chia theo mục
const categorizedReportOptions = [
  {
    category: "HÀNH VI PHẠM TỘI VÀ BẠO LỰC",
    options: [
      "Hành vi phạm tội và bạo lực",
      "Cấu kết gây hại và cổ xúy tội ác",
      "Cá nhân và tổ chức nguy hiểm",
    ],
  },
  {
    category: "SỰ AN TOÀN",
    options: [
      "Hành vi gian lận, lừa đảo và lừa gạt",
      "Hàng hóa và dịch vụ bị hạn chế",
      "Bạo lực và khích nộ",
    ],
  },
  {
    category: "NỘI DUNG PHẢN CẢM",
    options: [
      "Nội dung phản cảm",
      "Hoạt động tình dục và ảnh khỏa thân người lớn",
      "Hành vi gạ gẫm tình dục người lớn và ngôn ngữ khiêu dâm",
    ],
  },
  {
    category: "TÍNH TOÀN VẸN VÀ TÍNH XÁC THỰC",
    options: [
      "Tính toàn vẹn của tài khoản",
      "Cam đoan về danh tính thực",
      "An ninh mạng",
    ],
  },
  {
    category: "TÔN TRỌNG QUYỀN SỞ HỮU TRÍ TUỆ",
    options: [
      "Vi phạm quyền sở hữu trí tuệ của bên thứ ba",
      "Sử dụng giấy phép và quyền sở hữu trí tuệ của Mingo",
    ],
  },
  {
    category: "YÊU CẦU VÀ QUYẾT ĐỊNH LIÊN QUAN ĐẾN NỘI DUNG",
    options: ["Yêu cầu của người dùng", "Thông tin sai lệch", "Spam"],
  },
];

const ReportCard = ({
  onClose,
  type,
  entityId,
  reportedId,
  postId,
}: {
  onClose: () => void;
  type: string;
  entityId: string;
  reportedId: string;
  postId?: string;
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const { colorScheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setLoading(true);
    setError("");

    const token = await AsyncStorage.getItem("token"); // Dùng AsyncStorage thay cho localStorage
    const userId = await AsyncStorage.getItem("userId");

    if (!token) {
      setError("Authentication is required");
      setLoading(false);
      return;
    }

    try {
      const reportPayload: ReportCreateDTO = {
        createdById: userId || "",
        title: "Báo cáo vi phạm",
        content: selectedOption,
        reportedId: reportedId || "", // Sử dụng ObjectId đã import
        reportedEntityId: entityId.toString(),
        entityType: type,
      };

      const reportCommentPayload: CommentReportCreateDTO = {
        createdById: userId || "",
        title: "Báo cáo vi phạm",
        content: selectedOption,
        reportedId: reportedId || "", // Sử dụng ObjectId đã import
        reportedEntityId: entityId.toString(),
        entityType: type,
        parentReportEntityId: postId || "",
      };

      if (type === "comment") {
        await createCommentReport(reportCommentPayload, token);
      } else {
        await createReport(reportPayload, token);
      }

      Alert.alert("Successfully reported!");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Lỗi khi tạo báo cáo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.background} onPress={onClose} />

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>NỘI DUNG</Text>
          <TouchableOpacity onPress={onClose}>
            <CancelIcon size={28} color={iconColor} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {categorizedReportOptions.map((category, catIndex) => (
            <View key={catIndex} style={styles.category}>
              <Text style={styles.categoryTitle}>{category.category}</Text>
              {category.options.map((option, optIndex) => (
                <TouchableOpacity
                  key={optIndex}
                  style={styles.option}
                  onPress={() => setSelectedOption(option)}
                >
                  {selectedOption === option ? (
                    <CircleFillIcon size={20} color="#FFAABB" />
                  ) : (
                    <CircleTickIcon size={20} color="gray" />
                  )}
                  <Text
                    style={styles.optionText}
                    numberOfLines={0}
                    className="pb-1"
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.confirmButton,
              !selectedOption && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!selectedOption || loading}
          >
            <Text style={styles.confirmText}>
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 10,
  },
  category: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "semibold",
    color: "#FFAABB",
  },
  option: {
    flexDirection: "row", // Căn chỉnh icon và text theo chiều ngang
    alignItems: "center", // Căn chỉnh theo chiều dọc
    marginVertical: 5,
    padding: 10,
    flexWrap: "wrap", // Cho phép nội dung xuống dòng nếu quá dài
  },
  optionText: {
    fontSize: 14,
    marginLeft: 10, // Khoảng cách giữa icon và chữ
    flex: 1, // Khi sử dụng flex, text sẽ chiếm hết không gian còn lại
    flexWrap: "wrap", // Đảm bảo text có thể xuống dòng khi cần
  },
  overlay: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFAABB",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelText: {
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#FFAABB",
  },
  confirmText: {
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default ReportCard;
