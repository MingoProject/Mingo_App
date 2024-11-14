import Svg, { Path, Rect, Circle } from "react-native-svg";
import { useTheme } from "@react-navigation/native";
const SearchIcon = ({ size = 24, color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <Path
        d="M229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72"
        fill={color}
      />
    </Svg>
  );
};

const MessageIcon = ({ size = 24, color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <Path
        fill={color}
        d="M464 512a48 48 0 1 0 96 0a48 48 0 1 0-96 0m200 0a48 48 0 1 0 96 0a48 48 0 1 0-96 0m-400 0a48 48 0 1 0 96 0a48 48 0 1 0-96 0m661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.4 444.4 0 0 0-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.4 445.4 0 0 0-142 96.5c-40.9 41.3-73 89.3-95.2 142.8c-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 0 0 112 714v152a46 46 0 0 0 46 46h152.1A449.4 449.4 0 0 0 510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.5 444.5 0 0 0 142.8-95.2c41.3-40.9 73.8-88.7 96.5-142c23.6-55.2 35.6-113.9 35.9-174.5c.3-60.9-11.5-120-34.8-175.6m-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8c69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9c44.6 18.7 84.6 45.6 119 80c34.3 34.3 61.3 74.4 80 119c19.4 46.2 29.1 95.2 28.9 145.8c-.6 99.6-39.7 192.9-110.1 262.7"
      />
    </Svg>
  );
};

const PictureIcon = ({ size = 16, color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <Path
        fill={color}
        d="M512 128a384 384 0 1 0 0 768a384 384 0 0 0 0-768m0-64a448 448 0 1 1 0 896a448 448 0 0 1 0-896"
      />
      <Path
        fill={color}
        d="M640 288q64 0 64 64t-64 64t-64-64t64-64M214.656 790.656l-45.312-45.312l185.664-185.6a96 96 0 0 1 123.712-10.24l138.24 98.688a32 32 0 0 0 39.872-2.176L906.688 422.4l42.624 47.744L699.52 693.696a96 96 0 0 1-119.808 6.592l-138.24-98.752a32 32 0 0 0-41.152 3.456l-185.664 185.6z"
      />
    </Svg>
  );
};

const VideoIcon = ({ size = 24, color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        width="13.5"
        height="12"
        x="2.75"
        y="6"
        rx="3.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M16.25 9.74l3.554-1.77a1 1 0 0 1 1.446.895v6.268a1 1 0 0 1-1.447.895l-3.553-1.773z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Svg>
  );
};

const EmotionIcon = ({ size = 48, color = "currentColor" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Z"
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <Path
        d="M31 18v1m-14-1v1m14 12s-2 4-7 4-7-4-7-4"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const LikeIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
      d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"
    />
  </Svg>
);

const CommentIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M21.25 12a9.23 9.23 0 0 1-2.705 6.54A9.25 9.25 0 0 1 12 21.25a9.2 9.2 0 0 1-3.795-.81l-3.867.572a1.195 1.195 0 0 1-1.361-1.43l.537-3.923A8.9 8.9 0 0 1 2.75 12a9.23 9.23 0 0 1 2.705-6.54A9.25 9.25 0 0 1 12 2.75a9.26 9.26 0 0 1 6.545 2.71A9.24 9.24 0 0 1 21.25 12"
    />
  </Svg>
);

const ShareIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
      fill="none"
    />
    <Path
      fill={color}
      d="M10.114 4.491c.076-.795.906-1.45 1.743-.972c1.74 1.019 3.382 2.18 4.97 3.421c1.96 1.548 3.533 3.007 4.647 4.172c.483.507.438 1.308-.024 1.792a42 42 0 0 1-3.495 3.228c-1.938 1.587-3.945 3.125-6.13 4.358c-.741.418-1.544-.06-1.687-.801l-.017-.113l-.227-3.574c-1.816.038-3.574.662-4.98 1.823l-.265.222l-.128.104l-.247.192l-.12.088l-.23.16a5 5 0 0 1-.218.135l-.206.111C2.534 19.314 2 18.892 2 17c0-4.404 3.245-8.323 7.632-8.917l.259-.031zm1.909 1.474l-.192 3.472a.5.5 0 0 1-.447.47l-1.361.142c-3.065.366-5.497 2.762-5.948 5.894a9.95 9.95 0 0 1 5.135-1.912l.397-.023l1.704-.036a.5.5 0 0 1 .51.472l.197 3.596c1.603-1.021 3.131-2.196 4.664-3.45a44 44 0 0 0 2.857-2.595l-.258-.256l-.556-.533a48 48 0 0 0-3.134-2.693a46 46 0 0 0-3.568-2.548"
    />
  </Svg>
);
const MenuIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M46.003 36c1.103 0 1.997.888 1.997 2c0 1.105-.892 2-1.997 2H9.997A1.994 1.994 0 0 1 8 38c0-1.105.892-2 1.997-2zm0-10c1.103 0 1.997.888 1.997 2c0 1.105-.892 2-1.997 2H9.997A1.994 1.994 0 0 1 8 28c0-1.105.892-2 1.997-2zm0-10c1.103 0 1.997.888 1.997 2c0 1.105-.892 2-1.997 2H9.997A1.994 1.994 0 0 1 8 18c0-1.105.892-2 1.997-2z"
    />
  </Svg>
);
const ArrowIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M10.707 8.707a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L8.414 13H18a1 1 0 1 0 0-2H8.414z"
    />
  </Svg>
);

const CallIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      fill={color}
      d="M7.92 2.645l1.66-.5a3.25 3.25 0 0 1 3.903 1.779l1.033 2.298a3.25 3.25 0 0 1-.748 3.71l-1.805 1.683a.3.3 0 0 0-.054.073c-.189.386.098 1.417.997 2.975c1.014 1.756 1.797 2.45 2.16 2.343l2.369-.725a3.25 3.25 0 0 1 3.585 1.207l1.468 2.033a3.25 3.25 0 0 1-.4 4.262l-1.263 1.195a3.75 3.75 0 0 1-3.342.949c-3.517-.732-6.668-3.564-9.48-8.434C5.19 12.62 4.313 8.47 5.443 5.057a3.75 3.75 0 0 1 2.478-2.412m.434 1.436a2.25 2.25 0 0 0-1.487 1.447c-.974 2.941-.185 6.677 2.435 11.215c2.618 4.535 5.456 7.085 8.487 7.715a2.25 2.25 0 0 0 2.005-.57l1.262-1.194a1.75 1.75 0 0 0 .216-2.295l-1.468-2.034a1.75 1.75 0 0 0-1.93-.65l-2.375.727c-1.314.391-2.55-.704-3.892-3.03c-1.137-1.968-1.531-3.39-1.045-4.383q.142-.29.378-.511l1.805-1.683a1.75 1.75 0 0 0 .403-1.998L12.115 4.54a1.75 1.75 0 0 0-2.102-.958z"
    />
  </Svg>
);
const VideoCallIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.062 5.62a37 37 0 0 0-7.118-.055l-1.582.141A2.835 2.835 0 0 0 2.81 8.12a26.8 26.8 0 0 0 0 7.76a2.836 2.836 0 0 0 2.553 2.414l1.582.14a37 37 0 0 0 7.118-.054l.608-.064a2.845 2.845 0 0 0 2.493-2.272l3.047 1.618a.75.75 0 0 0 1.099-.597l.025-.284a55 55 0 0 0 0-9.563l-.025-.284a.75.75 0 0 0-1.1-.596l-3.046 1.618a2.845 2.845 0 0 0-2.493-2.272zM7.078 7.059a35.3 35.3 0 0 1 6.827.053l.608.064a1.346 1.346 0 0 1 1.19 1.143c.358 2.441.358 4.92 0 7.362a1.346 1.346 0 0 1-1.19 1.143l-.608.064a35.3 35.3 0 0 1-6.827.053l-1.582-.142a1.336 1.336 0 0 1-1.203-1.136a25.3 25.3 0 0 1 0-7.326A1.335 1.335 0 0 1 5.496 7.2zM17.36 9.55c.149 1.63.149 3.27 0 4.9l2.547 1.353a53 53 0 0 0 0-7.606z"
    />
  </Svg>
);
const InfoIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Circle
      cx="12"
      cy="9"
      r="1" // Bán kính của dấu chấm
      fill={color} // Màu cho dấu chấm
    />
  </Svg>
);

const CameraIcon = ({ size = 50, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 50 50" fill="none">
    <Path
      fill={color}
      d="M39 38H11c-1.7 0-3-1.3-3-3V17c0-1.7 1.3-3 3-3h6c.2 0 .5-.2.6-.3l1.1-2.2c.4-.8 1.4-1.4 2.3-1.4h8c.9 0 1.9.6 2.3 1.4l1.1 2.2c.1.2.4.3.6.3h6c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3M11 16c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h28c.6 0 1-.4 1-1V17c0-.6-.4-1-1-1h-6c-.9 0-1.9-.6-2.3-1.4l-1.1-2.2c-.1-.2-.4-.4-.6-.4h-8c-.2 0-.5.2-.6.3l-1.1 2.2c-.4.9-1.4 1.5-2.3 1.5z"
    />
    <Path
      fill={color}
      d="M25 34c-5 0-9-4-9-9s4-9 9-9s9 4 9 9s-4 9-9 9m0-16c-3.9 0-7 3.1-7 7s3.1 7 7 7s7-3.1 7-7s-3.1-7-7-7"
    />
    <Circle cx="35" cy="18" r="1" fill={color} />
    <Path
      fill={color}
      d="M12 12h4v1h-4zm13 9v-1c-2.8 0-5 2.2-5 5h1c0-2.2 1.8-4 4-4"
    />
  </Svg>
);
const ImageIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M16.24 3.5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h8.5a5 5 0 0 0 5-5v-7a5 5 0 0 0-5-5"
    />
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m2.99 17l2.75-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.49 1.93"
    />
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M7.99 10.17a1.66 1.66 0 1 0 0-3.32a1.66 1.66 0 0 0 0 3.32"
    />
  </Svg>
);
const PlusIcon = ({ size = 50, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 50 50" fill="none">
    <Path
      fill={color}
      d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"
    />
    <Path fill={color} d="M16 24h18v2H16z" />
    <Path fill={color} d="M24 16h2v18h-2z" />
  </Svg>
);

const MicroIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      width="6"
      height="11"
      x="9"
      y="3"
      rx="3"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M19 11a7 7 0 1 1-14 0m7 7v3"
    />
  </Svg>
);

const SendIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      d="M22 3L2 11l18.5 8zM10 20.5l3-4.5m2.5-6.5L9 14l.859 6.012c.078.546.216.537.306-.003L11 15z"
    />
  </Svg>
);

const UserIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="6" r="4" fill="none" stroke={color} strokeWidth="1.5" />
    <Path
      d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

const NotificationIcon = ({ size = 56, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fill={color}
      d="M8 17a.5.5 0 0 1 1 0a1 1 0 1 0 2 0a.5.5 0 0 1 1 0a2 2 0 1 1-4 0"
    />
    <Path
      fill={color}
      fillRule="evenodd"
      d="M17.5 14.5a2.96 2.96 0 0 0-1.5-2.575V9a5.5 5.5 0 0 0-5.5-5.5h-1A5.5 5.5 0 0 0 4 9v2.925A2.96 2.96 0 0 0 2.5 14.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2M15 12.558l.295.133l.055.024A1.96 1.96 0 0 1 16.5 14.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1c0-.769.45-1.467 1.15-1.784l.055-.025l.295-.133V9a4.5 4.5 0 0 1 4.5-4.5h1A4.5 4.5 0 0 1 15 9z"
      clipRule="evenodd"
    />
    <Path fill={color} d="M9.5 1.5a.5.5 0 0 1 1 0V4a.5.5 0 0 1-1 0z" />
  </Svg>
);
const NotificationOffIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fill={color}
      d="M8 17a.5.5 0 0 1 1 0a1 1 0 1 0 2 0a.5.5 0 0 1 1 0a2 2 0 1 1-4 0"
    />
    <Path
      fill={color}
      fillRule="evenodd"
      d="M17.5 14.5a2.96 2.96 0 0 0-1.5-2.575V9a5.5 5.5 0 0 0-5.5-5.5h-1A5.5 5.5 0 0 0 4 9v2.925A2.96 2.96 0 0 0 2.5 14.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2M15 12.558l.295.133l.055.024A1.96 1.96 0 0 1 16.5 14.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1c0-.769.45-1.467 1.15-1.784l.055-.025l.295-.133V9a4.5 4.5 0 0 1 4.5-4.5h1A4.5 4.5 0 0 1 15 9z"
      clipRule="evenodd"
    />
    <Path
      fill={color}
      d="M9.5 1.5a.5.5 0 0 1 1 0V4a.5.5 0 0 1-1 0zm-8.35.378a.514.514 0 0 1 .728-.727l16.971 16.971a.514.514 0 0 1-.727.727z"
    />
  </Svg>
);

const FileIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M19.903 8.586a1 1 0 0 0-.196-.293l-6-6a1 1 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a1 1 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a1 1 0 0 0-.051-.259q-.014-.048-.033-.093M16.586 8H14V5.414zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10z"
    />
    <Path fill={color} d="M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z" />
  </Svg>
);

const ReportIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm-2.75 8L3 15.75v-7.5L8.25 3h7.5L21 8.25v7.5L15.75 21zm.85-2h5.8l4.1-4.1V9.1L14.9 5H9.1L5 9.1v5.8zm2.9-7"
    />
  </Svg>
);

const BlockIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2M4 12c0-1.846.634-3.542 1.688-4.897l11.209 11.209A7.95 7.95 0 0 1 12 20c-4.411 0-8-3.589-8-8m14.312 4.897L7.103 5.688A7.95 7.95 0 0 1 12 4c4.411 0 8 3.589 8 8a7.95 7.95 0 0 1-1.688 4.897"
    />
  </Svg>
);

const TrashIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
    />
  </Svg>
);

const SettingsIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
  >
    <Path d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17ZM18.41 14l.8.9l-1.28 2.22l-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24l-1.3-2.21l.8-.9a3 3 0 0 0 0-4l-.8-.9l1.28-2.2l1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24l1.28 2.22l-.8.9a3 3 0 0 0 0 3.98m-6.77-6a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2" />
  </Svg>
);
const SaveIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    <Path d="M16.25 21v-4.765a1.59 1.59 0 0 0-1.594-1.588H9.344a1.59 1.59 0 0 0-1.594 1.588V21m8.5-17.715v2.362a1.59 1.59 0 0 1-1.594 1.588H9.344A1.59 1.59 0 0 1 7.75 5.647V3m8.5.285A3.2 3.2 0 0 0 14.93 3H7.75m8.5.285c.344.156.661.374.934.645l2.382 2.375A3.17 3.17 0 0 1 20.5 8.55v9.272A3.18 3.18 0 0 1 17.313 21H6.688A3.18 3.18 0 0 1 3.5 17.823V6.176A3.18 3.18 0 0 1 6.688 3H7.75" />
  </Svg>
);
const HistoryIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
  >
    <Path
      strokeWidth="0.5"
      fill={color}
      d="M13.26 3C8.17 2.86 4 6.95 4 12H2.21c-.45 0-.67.54-.35.85l2.79 2.8c.2.2.51.2.71 0l2.79-2.8a.5.5 0 0 0-.36-.85H6c0-3.9 3.18-7.05 7.1-7c3.72.05 6.85 3.18 6.9 6.9c.05 3.91-3.1 7.1-7 7.1c-1.61 0-3.1-.55-4.28-1.48a.994.994 0 0 0-1.32.08c-.42.42-.39 1.13.08 1.49A8.86 8.86 0 0 0 13 21c5.05 0 9.14-4.17 9-9.26c-.13-4.69-4.05-8.61-8.74-8.74m-.51 5c-.41 0-.75.34-.75.75v3.68c0 .35.19.68.49.86l3.12 1.85c.36.21.82.09 1.03-.26c.21-.36.09-.82-.26-1.03l-2.88-1.71v-3.4c0-.4-.34-.74-.75-.74"
    />
  </Svg>
);

const PostIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    strokeWidth="0.5"
  >
    <Path
      strokeWidth="0.25"
      fill={color}
      d="M3 21V3h18v18zm15-4H6v1.5h12zM6 15.5h12V14H6zM6 12h12V6H6zm0 5v1.5zm0-1.5V14zM6 12V6zm0 2v-2zm0 3v-1.5z"
    />
  </Svg>
);

const FriendIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill={color}
  >
    <Path d="M3 4a1 1 0 1 1 2 0a1 1 0 0 1-2 0m1-2a2 2 0 1 0 0 4a2 2 0 0 0 0-4m4 2.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0M8.5 3a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M1 8.25C1 7.56 1.56 7 2.25 7h3.5C6.44 7 7 7.56 7 8.25v.048a1 1 0 0 1-.008.109a2 2 0 0 1-.045.26a2.2 2.2 0 0 1-.355.768C6.168 10.018 5.378 10.5 4 10.5s-2.168-.482-2.592-1.065a2.2 2.2 0 0 1-.4-1.028L1 8.297zm1 .026l.002.027q.004.043.023.129c.027.113.082.264.192.415c.2.276.66.653 1.783.653s1.582-.377 1.783-.653A1.2 1.2 0 0 0 6 8.277V8.25A.25.25 0 0 0 5.75 8h-3.5a.25.25 0 0 0-.25.25zM8.499 10q-.531-.002-.933-.1a2.9 2.9 0 0 0 .383-.942q.232.04.55.042c.89 0 1.228-.272 1.36-.437a.7.7 0 0 0 .14-.316v-.005A.25.25 0 0 0 9.749 8H7.986a2.24 2.24 0 0 0-.365-1H9.75c.69 0 1.25.56 1.25 1.25v.017a1 1 0 0 1-.007.093a1.67 1.67 0 0 1-.352.827c-.369.46-1.03.813-2.141.813" />
  </Svg>
);
const MediaIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    strokeWidth="3"
  >
    <Path
      strokeWidth="1.5"
      d="M9.462 13h8.692l-2.758-3.654l-2.454 3.077l-1.588-1.884zm-5.846 6.77q-.672 0-1.144-.473Q2 18.825 2 18.154V7.077h1v11.077q0 .269.173.442t.443.173H19v1zm3-3q-.672 0-1.144-.473Q5 15.825 5 15.154V4.616q0-.672.472-1.144T6.616 3h4.961l2 2h6.808q.67 0 1.143.472q.472.472.472 1.144v8.538q0 .671-.472 1.143t-1.144.472zm0-1h13.769q.269 0 .442-.174q.173-.173.173-.442V6.616q0-.27-.173-.443T20.385 6h-7.21l-2-2h-4.56q-.269 0-.442.173T6 4.616v10.538q0 .269.173.442t.443.173m-.616 0V4z"
    />
  </Svg>
);

const ThreeDot = ({ size = 24, color = "currentColor" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ fill: color }}
    >
      <Path d="M7 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0" />
    </Svg>
  );
};

const ProfileIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill="none"
      d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
    />
    <Path
      fill={color}
      d="M20 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2H4v14h16zm-3 10a1 1 0 0 1 .117 1.993L17 17H7a1 1 0 0 1-.117-1.993L7 15zm-7-8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm7 4a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2zm-7-2H8v2h2zm7-2a1 1 0 0 1 .117 1.993L17 9h-3a1 1 0 0 1-.117-1.993L14 7z"
    />
  </Svg>
);

const KeyIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
  >
    <Path
      d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
      stroke={color}
    />
    <Circle cx="16.5" cy="7.5" r="0.5" fill={color} />
  </Svg>
);
export {
  SearchIcon,
  MessageIcon,
  PictureIcon,
  VideoIcon,
  EmotionIcon,
  LikeIcon,
  CommentIcon,
  ShareIcon,
  MenuIcon,
  ArrowIcon,
  CallIcon,
  VideoCallIcon,
  InfoIcon,
  CameraIcon,
  ImageIcon,
  PlusIcon,
  MicroIcon,
  SendIcon,
  UserIcon,
  NotificationIcon,
  NotificationOffIcon,
  FileIcon,
  ReportIcon,
  BlockIcon,
  TrashIcon,
  SettingsIcon,
  SaveIcon,
  HistoryIcon,
  PostIcon,
  FriendIcon,
  MediaIcon,
  ProfileIcon,
  KeyIcon,
  ThreeDot,
};
