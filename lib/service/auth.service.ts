const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function sendOTP(phoneNumber: string) {
  try {
    const response = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });
    if (!response.ok) {
      throw new Error("Error send otp");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to send otp:", error);
    throw error;
  }
}
