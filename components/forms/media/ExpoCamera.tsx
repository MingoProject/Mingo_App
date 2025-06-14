import React, { useRef, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import VideoPlayer from "./VideoPlayer";
import { generateRandomNumberString } from "@/lib/utils";
import {
  CancelIcon,
  PlusIcon,
  SendIcon,
} from "@/components/shared/icons/Icons";
import { useTheme } from "@/context/ThemeContext";

const ExpoCamera = ({
  onClose,
  isSendNow,
  onSend,
  setSelectedMedia,
}: {
  onClose: () => void;
  isSendNow?: boolean;
  onSend?: () => void;
  setSelectedMedia: (uri: string, type: string, name: string) => void;
}) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [photoUri, setPhotoUri] = useState<string | undefined>("");
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | undefined>("");
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View
        className={`flex-1 items-center justify-center`}
        style={{ rowGap: 20 }}
      >
        <Text className={`font-helvetica-light text-14`}>
          We need your permission to show the camera
        </Text>

        <TouchableOpacity onPress={requestPermission}>
          <Text>Allow</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        // Ensure camera is ready before taking a picture
        const photo = await cameraRef.current.takePictureAsync({
          base64: true, // Optional: Get the base64 encoded image
        });
        setPhotoUri(photo?.uri);
        setSelectedMedia(
          photo?.uri!,
          "image",
          generateRandomNumberString(10) + ".jpg"
        );
        console.log("Photo taken: ", photo?.uri);
        console.log(
          photo?.uri!,
          "image",
          generateRandomNumberString(10)!,
          "selected media for check"
        );
      }
    } catch (error) {
      console.error("Error taking picture: ", error);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);

        setRecordingTime(0);

        const interval = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);

        setTimerInterval(interval);

        const video = await cameraRef.current.recordAsync({
          maxDuration: 60,
          codec: "avc1",
        });
        setVideoUri(video?.uri);
        setSelectedMedia(video?.uri!, "video", generateRandomNumberString(10)!);
        console.log("Video recording started: ", video?.uri);
      } catch (error) {
        console.error("Error starting video recording: ", error);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        console.log("stop!");
        await cameraRef.current.stopRecording();
        clearInterval(timerInterval!);
        setTimerInterval(null);
        setIsRecording(false);
        await cameraRef.current.resumePreview();
      } catch (error) {
        console.error("Error stopping video recording: ", error);
      }
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      takePicture();
    }
  };

  const handleLongPress = () => {
    startRecording();
  };

  console.log(photoUri, "photoUri");

  return (
    <View className=" h-screen w-full fixed">
      {photoUri != "" || videoUri != "" ? (
        <View className="flex items-center justify-center">
          {videoUri === "" ? (
            <Image className="w-full h-full fixed" source={{ uri: photoUri }} />
          ) : (
            <View className="fixed w-full h-full flex items-center justify-center">
              <VideoPlayer videoSource={videoUri!} />
            </View>
          )}
          <View className="absolute top-[20px] left-[20px]">
            <TouchableOpacity
              onPress={() => {
                setPhotoUri("");
                setVideoUri("");
              }}
            >
              <CancelIcon size={30} color={"#FFAABB"} />
            </TouchableOpacity>
          </View>
          <View className="absolute bottom-[40px] right-[20px]">
            {isSendNow ? (
              <TouchableOpacity
                onPress={() => {
                  onSend?.();
                  onClose();
                }}
              >
                <SendIcon size={40} color={"#FFAABB"} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onClose}>
                <CancelIcon size={40} color={iconColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          mode="picture"
        >
          <View className=" flex-1 flex justify-between items-center">
            <View className="flex-1 w-full flex flex-row justify-between item-center p-[20px]">
              <TouchableOpacity onPress={onClose}>
                <CancelIcon />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleCameraFacing}>
                <PlusIcon />
              </TouchableOpacity>
            </View>
            <View
              className="flex items-center justify-between mb-[40px]"
              style={{ rowGap: 10 }}
            >
              {isRecording && (
                <View className=" w-full flex items-center">
                  <Text className="text-white text-lg">
                    {Math.floor(recordingTime / 60)}:
                    {(recordingTime % 60).toString().padStart(2, "0")}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "red", // Thay "cardinal" bằng một màu hợp lệ
                  borderRadius: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handlePress}
                onLongPress={handleLongPress}
              />
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1, // Make camera fill available space
    width: "100%", // Full width of its container
    height: "100%", // Full height of its container
  },
});

export default ExpoCamera;
