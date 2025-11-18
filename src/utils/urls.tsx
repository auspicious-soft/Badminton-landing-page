const baseUrl = "https://api.projectplayapp.com/api";
const userbaseUrl = "https://api.projectplayapp.com/api/user";
// const userbaseUrl = "https://3a42698d69ce.ngrok-free.app/api/user";

export const baseImgUrl = "https://playpadelpickel.s3.eu-north-1.amazonaws.com";

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const URLS = {
  socialLogin: `${baseUrl}/social-login`,
  normalLogin: `${baseUrl}/user-login`,
  signUp: `${baseUrl}/user-signup`,
  verifyOtp: `${baseUrl}/verify-otp`,
  resendOtp: `${baseUrl}/resend-otp`,
  getMatches: `${userbaseUrl}/get-open-matches`,
  getOpenMatchesById: (id: any) =>
    `${userbaseUrl}/open-matches-data-byId/${id}`,
  joinOpenMatch: `${userbaseUrl}/join-open-matches`,
  getAllVenues: `${userbaseUrl}/get-venues`,
  getFriends: `${userbaseUrl}/get-friends`,
  createGuestFriend: `${userbaseUrl}/create-guest`,
  getBookings: `${userbaseUrl}/my-matches`,
  getCourts: `${userbaseUrl}/get-courts`,
  createBooking: `${userbaseUrl}/book-court`,
  getDynamicPricing: `${userbaseUrl}/get-dynamic-price`,
  bookingPayment: `${userbaseUrl}/booking-payment`,
  getUserProfile: `${userbaseUrl}/get-user`,
  getUserTransactions: `${userbaseUrl}/user-transactions`,
  updateUserProfile: `${userbaseUrl}/update-user`,
  userUploadImage: `${userbaseUrl}/upload-image`,
  cancelBooking: `${userbaseUrl}/cancel-booking`,
  modifyBooking: `${userbaseUrl}/modify-booking`,
  uploadScore: `${userbaseUrl}/upload-score`,
  clubInfo: `${userbaseUrl}/club-status`,
  getNotifications: `${userbaseUrl}/user-notifications`,
  markAllNotificationsRead: `${userbaseUrl}/user-notifications`,

  submitPhoneNumber: `${userbaseUrl}/submit-phone`,
  verifyPhoneNumber: `${userbaseUrl}/verify-phone`,
  getInfoData:`${baseUrl}/get-applicaiton-info`
};
