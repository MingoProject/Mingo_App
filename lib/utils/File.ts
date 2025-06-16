import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";

export const prepareFileForUpload = async (
  fileUri: string,
  fileName: string
) => {
  try {
    const newUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.copyAsync({
      from: fileUri,
      to: newUri,
    });
    return newUri;
  } catch (error) {
    console.error("Error preparing file:", error);
    throw error;
  }
};

export const openWebFile = async (fileUrl: string) => {
  try {
    await WebBrowser.openBrowserAsync(fileUrl);
  } catch (error) {
    console.error("Error opening PDF:", error);
  }
};

export async function playSound(uri: string): Promise<void> {
  // Kiểm tra nếu đường dẫn tệp âm thanh hợp lệ
  if (!uri) {
    console.error("Vui lòng cung cấp đường dẫn tệp âm thanh hợp lệ.");
    return;
  }

  let sound: Audio.Sound | undefined;

  try {
    // Kiểm tra tính hợp lệ của URL
    const response = await fetch(uri, { method: "HEAD" });
    if (!response.ok) {
      console.error(
        `Tệp âm thanh không tồn tại hoặc không thể truy cập: HTTP ${response.status}`
      );
      return;
    }

    // Tạo instance của âm thanh
    const { sound: soundObject } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true } // Tự động phát khi tải xong
    );

    sound = soundObject;

    // Lắng nghe sự kiện hoàn thành phát âm thanh
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if ("didJustFinish" in status && status.didJustFinish) {
        sound?.unloadAsync(); // Giải phóng tài nguyên sau khi phát xong
      }
    });

    console.log("Đang phát âm thanh...");
  } catch (error) {
    console.error("Lỗi khi phát âm thanh:", error);
  }
}
