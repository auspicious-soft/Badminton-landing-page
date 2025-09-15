import React, { useEffect, useState } from "react";
import DynamicTable from "../components/common/dynamicTable";
import { Eye } from "lucide-react";
import ProfileCard from "../components/profileCard/ProfileCard";
import { getApi, postApi, putApi } from "../utils/api";
import { baseImgUrl, URLS } from "../utils/urls";
import userImg from "../assets/dashboarduser.png";
import TransactionModal from "../components/common/TransactionModal";
import Loader from "../components/common/Loader";
import Pagination from "../components/common/Pagination";
import { useToast } from "../utils/ToastContext";
import { useAuth } from "../utils/AuthContext";

const headers = ["S No.", "Venues", "Amount", "Date", "Time", "Action"];

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

interface Transaction {
  _id: string;
  text: string;
  amount: number;
  status: string;
  method: string;
  notes: string[];
  playcoinsUsed: number;
  createdAt: string;
  transactionType: string;
  paymentMethod: string;
  paymentBreakdown: {
    totalAmount: number;
    moneyPaid: number;
    playcoinsUsed: number;
  };
}

function Account() {
  const [activeRowId, setActiveRowId] = useState<string | number | undefined>(
    undefined
  );
  const [userData, setUserdata] = useState<Data | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const limit = 12;
  const {successToast, errorToast} = useToast();
  const { updateUserData } = useAuth(); // 👈 import from your Auth context

  const handleRowClick = (id: string | number) => {
    setActiveRowId(id);
    const transaction = transactions.find((t) => t._id === id);
    setSelectedTransaction(transaction || null);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
    setActiveRowId(undefined);
  };

  const handleSave = async (data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    imageUrl?: string;
  }) => {
    if (Object.keys(data).length === 0) {
     errorToast("Nothing changed, nothing to update");
      return;
    }

    setLoading(true);
    try {
      // Prepare the data to send to the API
      const updateData = {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.email && { email: data.email }),
        ...(data.imageUrl && { profilePic: data.imageUrl }),
      };

      // Make the API call to update the user profile
      const response = await putApi(`${URLS.updateUserProfile}`, updateData);

      if (response.status === 200) {
      successToast( response.data.message);
        // Update local userData with the new values
        // setUserdata((prev) => ({
        //   ...prev!,
        //   ...(data.firstName && { firstName: data.firstName }),
        //   ...(data.lastName && { lastName: data.lastName }),
        //   ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        //   ...(data.email && { email: data.email }),
        //   ...(data.imageUrl && { profilePic: data.imageUrl }),
        // }));
          updateUserData({
        ...(data.firstName && { firstName: data.firstName }), // or use firstName+lastName merged
        ...(data.lastName && { lastName: data.lastName }), // keep if needed
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.email && { email: data.email }),
        ...(data.imageUrl && { profilePic: data.imageUrl }),
      });
      } else {
        errorToast("Failed to update profile");
      }
    } catch (error:any) {
      errorToast(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfileData = async () => {
    setLoading(true);
    try {
      const response = await getApi(`${URLS.getUserProfile}`);
      if (response.status === 200) {
        const uData = response?.data?.data;
        if (uData) {
          setUserdata(uData);
        } else {
          console.error("No user data found in response");
        }
      } else {
        console.error("API call failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfileData();
  }, []);

  useEffect(() => {
    const fetchUserTransactions = async () => {
      setLoading(true);
      try {
        const response = await getApi(
          `${URLS.getUserTransactions}?page=${currentPage}&limit=${limit}`
        );
        if (response.status === 200) {
          const transactionData = response.data.data.transactionHistory;
             const total = response.data.meta.total
             const tpages = response.data.totalPages
              setTotalItems(total);
          setTransactions(transactionData);
           setTotalPages(Math.ceil(total / limit));
        } else {
          console.error("API call failed with status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserTransactions();
  }, [currentPage]);

  const imageSrc = userData?.profilePic
    ? userData.profilePic.startsWith("https")
      ? userData.profilePic
      : `${baseImgUrl}/${userData.profilePic}`
    : "";

  const phoneNumber = userData?.phoneNumber ?? "";

  const transactionRows = transactions.map((transaction, index) => ({
    id: transaction._id,
    values: [
      (index + 1).toString(),
      transaction.text,
      transaction.amount,
      new Date(transaction.createdAt).toLocaleDateString(),
      Array.isArray(transaction.notes) ? transaction.notes.join(", ") : "-",
    ],
  }));

  const handleImageChange = () => {
    fetchUserProfileData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {loading && <Loader fullScreen />}
      <div className="main flex flex-col md:flex-row p-4 sm:p-6 gap-4 sm:gap-6 min-h-screen bg-slate-50/60">
        <div className="w-full md:w-1/3 lg:w-[30%]">
          <h2 className="text-dark-blue text-2xl sm:text-3xl font-semibold font-['Raleway'] mb-4">
            Profile
          </h2>
          <ProfileCard
            name={`${userData?.firstName || "Enter"} ${
              userData?.lastName || "name"
            }`.trim()}
            phoneNumber={phoneNumber}
            email={userData?.email ?? "john.doe@example.com"}
            imageSrc={imageSrc}
            onImageChange={handleImageChange}
            onSave={handleSave}
          />
        </div>
        <div className="w-full md:w-2/3 lg:w-[70%]">
          <h2 className="text-dark-blue text-2xl sm:text-3xl font-semibold font-['Raleway'] mb-4">
            Transactions
          </h2>
          <div className="overflow-x-auto">
            <DynamicTable
              headers={headers}
              rows={transactionRows}
              actionIcon={
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              }
              onActionClick={handleRowClick}
              activeRowId={activeRowId}
            />
          </div>
          <div className="mt-6 sm:mt-8">
           {totalItems > 0 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    totalItems={totalItems}
    itemsPerPage={limit}
    onPageChange={handlePageChange}
  />
)}
          </div>
          {selectedTransaction && (
            <TransactionModal
              transaction={selectedTransaction}
              onClose={handleCloseModal}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Account;
