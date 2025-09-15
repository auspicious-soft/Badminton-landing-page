import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coinImg from "../../assets/price.png";
import atm from "../../assets/atm-card.png";
import paddleImg from "../../assets/paddelimage.png";
import clock from "../../assets/watch.jpg";
import { ChevronDown, Plus, X } from "lucide-react";
import { getApi, postApi } from "../../utils/api";
import { loadRazorpayScript, URLS } from "../../utils/urls";
import { Player } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useToast } from "../../utils/ToastContext";
import coins from "../../assets/price.png";
import { useNotification } from "../../utils/NotificationContext";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY;

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface EquipmentItem {
  id: string;
  name: string;
  description: string;
}

interface EquipmentCounts {
  racket1: number;
  ball: number;
}

interface Data {
  _id: string;
  role: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  authType: string;
  countryCode: string | null;
  phoneNumber: string | null;
  profilePic: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  language: string;
  token: string;
  fcmToken: string[];
  productsLanguage: string[];
  country: string;
  location: {
    type: string;
    coordinates: number[];
  };
  referralUsed: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  totalMatches: number;
  totalFriends: number;
  playCoins: number;
  freeGameCount: number;
  loyaltyTier: string;
  loyaltyPoints: number;
  unreadChats: number;
  unreadNotifications: number;
  referrals: {
    code: string;
    expiryDate: string;
    usageCount: number;
    maxUsage: number;
    isActive: boolean;
    rewardCoins: number;
  };
}

interface PaymentOption {
  id: string;
  name: string;
  img?: string;
  img1?: string;
  img2?: string;
}

interface PaymentCardProps {
  gameType?: string;
  address?: string;
  imageUrl?: string;
  playCoins?: number;
  bookingAmount?: number;
  equipmentCounts: EquipmentCounts;
  setEquipmentCounts: React.Dispatch<React.SetStateAction<EquipmentCounts>>;
  players: Player[];
  userData: any; // Replace with proper type if available
  selectedDateForBooking: Date | null;
  selectedCourtId: string | null;
  selectedTimes: string[];
  selectedGameType: string;
  selectedMatchType: string;
  skillLevel: number;
  onClose: () => void;
  VenueId?: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  gameType,
  address,
  imageUrl,
  bookingAmount,
  equipmentCounts,
  setEquipmentCounts,
  players,
  userData,
  selectedDateForBooking,
  selectedCourtId,
  selectedTimes,
  selectedGameType,
  selectedMatchType,
  skillLevel,
  onClose,
  VenueId,
}) => {
  const [isEquipmentOpen, setIsEquipmentOpen] = useState<boolean>(false);
  const [isCancellationOpen, setIsCancellationOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<{
    [key: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(bookingAmount);
  const [showDelayedLoader, setShowDelayedLoader] = useState(false);
  const { successToast, errorToast } = useToast();
  const navigate = useNavigate();
  const { refreshNotifications, fetchUserProfileData, mainData } =
    useNotification();
  const handleToggleEquipment = () => setIsEquipmentOpen(!isEquipmentOpen);
  const handleToggleCancellation = () =>
    setIsCancellationOpen(!isCancellationOpen);

  useEffect(() => {
    fetchUserProfileData();
  }, []);

  const handleCountChange = (item: string, delta: number) => {
    setEquipmentCounts((prev) => {
      const newCount = Math.max(0, prev[item as keyof EquipmentCounts] + delta);
      return {
        ...prev,
        [item]: newCount,
      };
    });
  };

  const equipmentItems: EquipmentItem[] = [
    { id: "racket1", name: "Racket", description: "Professional padel racket" },
    { id: "ball", name: "Ball", description: "Padel ball set" },
  ];

  const paymentOptions: PaymentOption[] = [
    { id: "razorpay", name: "UPI / Card", img: atm },
    { id: "playcoins", name: "Play Coins", img: coins },
    { id: "both", name: "Both", img: atm, img2: coins },
  ];

  const handleCheckboxChange = (id: string) => {
    setSelectedEquipment((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (selectedEquipment[id]) {
      setEquipmentCounts((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  const createBooking = async () => {
    setLoading(true);
    if (!selectedDateForBooking || !selectedCourtId || !selectedTimes) {
      return;
    }
    const team1 = players
      .slice(0, 2)
      .map((player, index) => {
        const playerType = `player${index + 1}`;
        if (index === 0) {
          return {
            playerId: userData?._id,
            playerType,
            rackets: equipmentCounts.racket1,
            balls: equipmentCounts.ball,
          };
        } else if (player.type === "user" || player.type === "guest") {
          return {
            playerId: player.id,
            playerType,
          };
        }
        return null;
      })
      .filter(Boolean);

    const team2 = players
      .slice(2, 4)
      .map((player, index) => {
        const playerType = `player${index + 3}`;
        if (player.type === "user" || player.type === "guest") {
          return {
            playerId: player.id,
            playerType,
          };
        }
        return null;
      })
      .filter(Boolean);

    try {
      const response = await postApi(`${URLS.createBooking}`, {
        bookingDate:
          selectedDateForBooking &&
          new Date(
            Date.UTC(
              selectedDateForBooking.getFullYear(),
              selectedDateForBooking.getMonth(),
              selectedDateForBooking.getDate()
            )
          ).toISOString(),
        venueId: VenueId,
        courtId: selectedCourtId,
        bookingSlots: selectedTimes,
        askToJoin: selectedGameType === "Public",
        isCompetitive: selectedMatchType === "Friendly" ? false : true,
        skillRequired: skillLevel,
        team1,
        team2,
        bookingType: "Complete",
      });

      if (response.status === 200) {
        await refreshNotifications();
      }
      return response;
    } catch (error) {
      return null; // ✅ Return null so you can handle failure gracefully
    }
  };

  const handlePayNow = async () => {
    if (!selectedPayment) {
      errorToast("Please Select Payment Method");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create the booking
      const bookingResponse = await createBooking();
      if (
        bookingResponse?.data?.data?.transaction?._id &&
        bookingResponse?.data?.data?.transaction?.amount
      ) {
        const transactionId = bookingResponse.data.data.transaction._id;

        // Step 2: Create Razorpay Order (only if not playcoins)
        const paymentResponse = await postApi(`${URLS.bookingPayment}`, {
          transactionId,
          method: selectedPayment,
        });

        if (paymentResponse.status !== 200) {
          errorToast("Failed to create payment. Please try again.");
          setLoading(false);
          return;
        }

        if (selectedPayment === "playcoins") {
          successToast("Booking confirmed using PlayCoins!");
          await fetchUserProfileData();
          onClose?.();
          setTimeout(() => {
            navigate("/my-bookings");
          }, 1000);
          setLoading(false);
          return;
        }

        if (
          paymentResponse.status === 200 &&
          paymentResponse?.data?.data?.razorpayOrderId
        ) {
          const { razorpayOrderId, currency } = paymentResponse.data.data;

          // Step 3: Load Razorpay script
          const loaded = await loadRazorpayScript();
          if (!loaded) {
            errorToast("Razorpay SDK failed to load. Are you online?");
            setLoading(false);
            return;
          }

          const options = {
            key: RAZORPAY_KEY_ID,
            amount: payableAmount * 100, // Razorpay expects amount in paise
            currency,
            name: "Paddle Play",
            description: "Court Booking Payment",
            order_id: razorpayOrderId,
            handler: async function () {
              successToast(
                "Payment successful. Your booking was created successfully!"
              );
              await fetchUserProfileData();
              onClose?.();
              setTimeout(() => {
                navigate("/my-bookings");
              }, 1000);
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
              },
            },
            prefill: {
              name: userData?.name || "",
              email: userData?.email || "",
              contact: userData?.phone || "",
            },
            theme: {
              color: "#3399cc",
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } else {
          errorToast("Failed to create Razorpay order. Please try again.");
          setLoading(false);
        }
      } else {
        errorToast("Failed to create booking. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
      errorToast(
        "An error occurred during payment initiation. Please try again."
      );
      setLoading(false);
    }
  };

  const isPlayCoinsDisabled =
    mainData !== null && bookingAmount !== undefined
      ? bookingAmount > mainData.playCoins
      : true;

  const isPaymentBothDisabled =
    mainData !== null && bookingAmount !== undefined
      ? bookingAmount <= mainData.playCoins
      : true;

  const payableAmount = (() => {
    if (!bookingAmount) return 0; // safeguard against undefined

    if (!selectedPayment) return bookingAmount;

    if (selectedPayment === "both") {
      return Math.max(bookingAmount - (mainData?.playCoins || 0), 0);
    }

    if (selectedPayment === "playcoins") {
      return 0; // fully covered by coins
    }

    return bookingAmount;
  })();

  return (
    <>
      {loading ? (
        <Loader fullScreen />
      ) : (
        <>
          <div className="relative mx-4 sm:mx-6 md:mx-8 lg:mx-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-4rem)] lg:max-w-[800px]">
            <button
              className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-white border-white rounded-full text-blue-900 hover:text-blue-600 shadow-lg p-2 sm:p-3 z-30"
              onClick={onClose}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="relative p-4 sm:p-6 lg:p-8 bg-white rounded-[20px] flex flex-col justify-start items-start gap-4 sm:gap-6 w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
              {/* Image Section */}
              <img
                className="w-full h-40 sm:h-60 rounded-[12px] object-cover"
                src={imageUrl}
                alt="Game"
              />

              {/* Game Type and Address */}
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-3">
                  <div className="text-gray-900 text-xl sm:text-2xl font-semibold font-['Raleway']">
                    {gameType} Game
                  </div>
                  <div className="text-gray-900 text-base sm:text-lg font-semibold font-['Raleway'] leading-tight">
                    {address}
                  </div>
                </div>
                <img
                  src={clock}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                  alt="Clock"
                />
              </div>

              {/* Equipment Section */}
              <div className="w-full p-4 sm:p-5 bg-zinc-100 rounded-lg flex flex-col justify-start items-start gap-4">
                <div className="w-full flex justify-between items-start">
                  <div className="flex justify-start items-center gap-3">
                    <div className="text-gray-900 text-sm sm:text-base font-semibold font-['Raleway'] leading-none">
                      Add Equipment
                    </div>
                    <div className="text-neutral-800 text-sm sm:text-base font-semibold font-['Raleway'] leading-none">
                      ⓘ
                    </div>
                  </div>
                  <motion.div
                    className="w-9 h-5 rounded-lg outline outline-1 outline-neutral-200 relative cursor-pointer bg-slate-50"
                    onClick={handleToggleEquipment}
                  >
                    <motion.div
                      className="w-5 h-5 bg-dark-blue rounded-lg"
                      animate={{ x: isEquipmentOpen ? 16 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </div>
                <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-200"></div>
                <AnimatePresence>
                  {isEquipmentOpen && (
                    <motion.div
                      className="w-full flex flex-col justify-start items-start gap-4 max-h-[300px] overflow-y-auto hide-scrollbar"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {equipmentItems.map((item) => {
                        const isSelected = selectedEquipment[item.id];
                        const count =
                          equipmentCounts[item.id as keyof EquipmentCounts];

                        return (
                          <div
                            key={item.id}
                            className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                          >
                            <div className="flex justify-start items-start gap-3">
                              <div
                                className={`w-4 h-4 rounded-[3px] border border-gray-500 flex items-center justify-center cursor-pointer ${
                                  isSelected ? "bg-blue-600" : "bg-slate-200"
                                }`}
                                onClick={() => handleCheckboxChange(item.id)}
                              >
                                {isSelected && (
                                  <div className="w-2 h-2 bg-white rounded-sm" />
                                )}
                              </div>
                              <div className="flex flex-col justify-center items-start gap-1.5">
                                <div className="text-gray-600 text-sm sm:text-base font-medium font-['Raleway']">
                                  {item.name}
                                </div>
                                <div className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway']">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="flex border-[0.5px] border-zinc-300">
                                {count === 0 ? (
                                  <div
                                    className="w-7 h-7 bg-slate-200 flex justify-center items-center cursor-pointer"
                                    onClick={() =>
                                      handleCountChange(item.id, 1)
                                    }
                                  >
                                    <span className="text-base">+</span>
                                  </div>
                                ) : (
                                  <>
                                    <div
                                      className="w-7 h-7 bg-slate-200 border-[0.5px] border-r-zinc-300 flex justify-center items-center cursor-pointer"
                                      onClick={() =>
                                        handleCountChange(item.id, -1)
                                      }
                                    >
                                      <span className="text-base">-</span>
                                    </div>
                                    <div className="w-7 h-7 bg-slate-200 text-gray-500 text-sm font-medium font-['Raleway'] flex justify-center items-center">
                                      <span>{count}</span>
                                    </div>
                                    <div
                                      className="w-7 h-7 bg-slate-200 border-[0.5px] border-l-zinc-300 flex justify-center items-center cursor-pointer"
                                      onClick={() =>
                                        handleCountChange(item.id, 1)
                                      }
                                    >
                                      <span className="text-base">+</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Payment Methods Section */}
              <div className="w-full p-4 sm:p-5 bg-zinc-100 rounded-lg flex flex-col justify-start items-start gap-4">
                <div className="w-full flex justify-between items-center">
                  <div className="flex-1 flex justify-between items-center">
                    <div className="text-gray-900 text-sm sm:text-base font-semibold font-['Raleway'] leading-none">
                      Select Payment Methods
                    </div>
                    <div className="text-neutral-800/0 text-sm sm:text-base font-semibold font-['Raleway'] leading-none">
                      ⓘ
                    </div>
                  </div>
                </div>
                <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-200"></div>
                <div className="self-stretch p-2 bg-slate-50 rounded-[999px] inline-flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="flex-1 flex justify-between items-center">
                      <div className="justify-center text-Primary-Font text-sm font-medium font-['Raleway'] leading-none p-2">
                        Available Play Coins
                      </div>
                      <span className="justify-center text-Primary-Font text-sm font-medium font-['Raleway'] leading-none">
                        {mainData && mainData.playCoins}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-5">
                  {paymentOptions.map((option) => {
                    const isDisabled =
                      (option.id === "playcoins" && isPlayCoinsDisabled) ||
                      (option.id === "both" && isPaymentBothDisabled);

                    return (
                      <div
                        key={option.id}
                        className={`w-full flex justify-between items-center gap-4 
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedPayment(option.id);
                          }
                        }}
                      >
                        <div className="flex justify-start items-center gap-5">
                          <motion.div className="w-5 h-5 bg-zinc-300 rounded-full relative flex justify-center items-center">
                            {selectedPayment === option.id && !isDisabled && (
                              <motion.div
                                className="w-3 h-3 bg-blue-600 rounded-full absolute"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </motion.div>
                          <div className="text-gray-600 text-sm sm:text-base font-medium font-['Raleway'] leading-none">
                            {option.name}
                          </div>
                        </div>
                        <div className="flex">
                          <img
                            className="w-9 h-6"
                            src={option.img}
                            alt="Payment"
                          />
                          {option.img2 && (
                            <>
                              <span>
                                <Plus />
                              </span>
                              <img
                                className="w-9 h-6"
                                src={option.img2}
                                alt="Payment"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cancellation Policy Section */}
              <div className="w-full px-3 py-5 bg-zinc-100 rounded-lg flex flex-col justify-start items-start gap-4">
                <div
                  className="w-full flex justify-between items-start cursor-pointer"
                  onClick={handleToggleCancellation}
                >
                  <div className="flex-1 flex justify-between items-center">
                    <div className="text-gray-900 text-sm sm:text-base font-semibold font-['Raleway'] leading-none">
                      Cancellation Policy
                    </div>
                    <motion.div
                      className="w-5 h-5 relative overflow-hidden"
                      animate={{ rotate: isCancellationOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-6 h-6 absolute outline-black" />
                    </motion.div>
                  </div>
                </div>
                <AnimatePresence>
                  {isCancellationOpen && (
                    <motion.div
                      className="w-full text-gray-600 text-sm sm:text-base font-medium font-['Raleway'] max-h-[200px] overflow-y-auto hide-scrollbar"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      You may cancel your booking up to 24 hours before the
                      scheduled time for a full refund.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pay Button */}
              <div
                className={`w-full h-12 sm:h-14 px-6 sm:px-44 py-4 bg-blue-600 rounded-lg flex justify-center items-center gap-3`}
              >
                <button
                  onClick={handlePayNow}
                  disabled={loading || !selectedPayment}
                  className={`text-white text-sm sm:text-base font-medium font-['Raleway'] w-full h-full rounded-lg 
    ${
      !selectedPayment || loading
        ? "cursor-not-allowed opacity-60"
        : "cursor-pointer"
    }`}
                >
                  {loading
                    ? "Processing..."
                    : selectedPayment === "playcoins"
                    ? "Pay with PlayCoins"
                    : `Pay ₹${payableAmount}`}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PaymentCard;
