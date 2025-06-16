import React from "react";
import { View, ViewStyle } from "react-native";
import { RTCView } from "react-native-webrtc";

type RTCVideoContainerProps = {
  stream: MediaStream;
  style?: ViewStyle;
};

const RTCVideoContainer: React.FC<RTCVideoContainerProps> = ({
  stream,
  style,
}) => {
  if (!stream) return null;
  return (
    <RTCView
      streamURL={(stream as any).toURL()}
      style={[{ width: "100%", height: 200, backgroundColor: "#000" }, style]}
      objectFit="cover"
    />
  );
};

export default RTCVideoContainer;
