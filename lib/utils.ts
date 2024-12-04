// timeUtils.js
export const getTimeAgo = (time: any) => {
  const now = Date.now(); // Lấy thời gian hiện tại dưới dạng mili giây
  const messageTime = new Date(time).getTime();

  // Kiểm tra xem messageTime có hợp lệ không
  if (isNaN(messageTime)) {
    return "Thời gian không hợp lệ";
  }

  const seconds = Math.floor((now - messageTime) / 1000);

  let interval = Math.floor(seconds / 31536000); // Số giây trong một năm
  if (interval >= 1)
    return interval === 1 ? "1 năm trước" : `${interval} năm trước`;

  interval = Math.floor(seconds / 2592000); // Số giây trong một tháng
  if (interval >= 1)
    return interval === 1 ? "1 tháng trước" : `${interval} tháng trước`;

  interval = Math.floor(seconds / 86400); // Số giây trong một ngày
  if (interval >= 1)
    return interval === 1 ? "1 ngày trước" : `${interval} ngày trước`;

  interval = Math.floor(seconds / 3600); // Số giây trong một giờ
  if (interval >= 1)
    return interval === 1 ? "1 giờ trước" : `${interval} giờ trước`;

  interval = Math.floor(seconds / 60); // Số giây trong một phút
  if (interval >= 1)
    return interval === 1 ? "1 phút trước" : `${interval} phút trước`;

  return "Vừa mới đây"; // Khi tin nhắn vừa mới được gửi
};

export const getTimestamp = (createdAt: string | Date): string => {
  const now = new Date();

  const createdAtDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  if (isNaN(createdAtDate.getTime())) {
    throw new Error("Invalid createdAt date");
  }

  const seconds = Math.floor((now.getTime() - createdAtDate.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000); // years

  if (interval >= 1) {
    return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000); // months
  if (interval >= 1) {
    return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400); // days
  if (interval >= 1) {
    return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600); // hours
  if (interval >= 1) {
    return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60); // minutes
  if (interval >= 1) {
    return interval === 1
      ? `${interval} minute ago`
      : `${interval} minutes ago`;
  }

  // seconds
  return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
};
