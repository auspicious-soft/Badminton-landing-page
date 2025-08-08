import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import userImg from "../../assets/user1book.png";
import { postApi, getApi } from "../../utils/api";
import { baseImgUrl, URLS } from "../../utils/urls";
import Loader from "./Loader";

interface Friend {
  id: string | number; // Consistent with Player interface
  name: string;
  image?: string | null;
  type: "user" | "guest" | "available";
}

interface SelectFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (friend: Friend) => void;
  friends: Friend[];
  selectedFriendIds: (string | number)[];
  onFriendsUpdate: (friends: Friend[]) => void;
}

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onAddGuest: (friend: Friend) => void;
  onFriendsUpdate: (friends: Friend[]) => void;
}

const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onAddGuest,
  onFriendsUpdate,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (firstName.trim()) {
      const fullName = lastName.trim() ? `${firstName} ${lastName}` : firstName;
      setLoading(true);
      try {
        const response = await postApi(URLS.createGuestFriend, { fullName });
        if (response.status === 200) {
          const newGuest: Friend = {
            id: response.data.data._id || String(Date.now()), // Ensure string ID
            name: fullName,
            image: null,
            type: "guest",
          };
          onAddGuest(newGuest);
          // Refetch friends API
          const friendsResponse = await getApi(
            `${URLS.getFriends}?status=friends-requests&search=`
          );
          if (
            friendsResponse?.status === 200 &&
            friendsResponse?.data?.success
          ) {
            const fetchedFriends = friendsResponse.data.data.friends.map(
              (friend: any) => ({
                id: friend._id,
                name: friend.fullName,
                image: friend.profilePic,
                type: friend.email ? "user" : "guest",
              })
            );
            onFriendsUpdate(fetchedFriends);
          }
          setFirstName("");
          setLastName("");
          onClose();
        }
      } catch (error) {
        console.error("Error adding guest:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
   <>
      {loading && <Loader fullScreen />}

    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-[400px] bg-white rounded-[20px] p-6 shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)] flex flex-col gap-4 "
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <div className="flex justify-between items-center">
              <button
                className="text-neutral-800 font-medium font-['Raleway']"
                onClick={onBack}
              >
                <ArrowLeft />
              </button>
              <X className="cursor-pointer text-gray-500" onClick={onClose} />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-neutral-800 text-lg font-semibold font-['Raleway']">
                Add Guest
              </h2>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSubmit}
                disabled={!firstName.trim()}
                className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
   </>
  );
};

const SelectFriendModal: React.FC<SelectFriendModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  friends,
  selectedFriendIds,
  onFriendsUpdate,
}) => {
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
const [loading, setLoading] = useState(false);
  return (
    <>
     {loading && <Loader fullScreen />}

      <AnimatePresence>
        {isOpen && !isGuestModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-[400px] bg-white rounded-[20px] p-6 shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)] flex flex-col gap-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-neutral-800 text-lg font-semibold font-['Raleway']">
                  Select a Friend
                </h2>
                <X className="cursor-pointer text-gray-500" onClick={onClose} />
              </div>
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto hide-scrollbar">
                {friends.map((friend) => {
                  const isDisabled = selectedFriendIds.includes(friend.id);
                  return (
                    <div
                      key={friend.id}
                      className={`flex items-center gap-4 p-2 rounded-lg transition ${
                        isDisabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "hover:bg-slate-100 cursor-pointer"
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          onSelect(friend);
                          onClose();
                        }
                      }}
                    >
                      <img
                        src={
                          friend.image
                            ? friend.image.startsWith("https://lh3")
                              ? friend.image
                              : `${baseImgUrl}/${friend.image}`
                            : userImg
                        }
                        alt={friend.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="text-neutral-800 font-medium font-['Raleway']">
                        {friend.name}
                      </div>
                      {isDisabled && (
                        <div className="ml-auto text-xs text-gray-400">
                          Added
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setIsGuestModalOpen(true)}
                className="w-full bg-dark-blue text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add as Guest
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AddGuestModal
        isOpen={isGuestModalOpen}
        onClose={() => {
          setIsGuestModalOpen(false);
          onClose();
        }}
        onBack={() => setIsGuestModalOpen(false)}
        onAddGuest={(friend) => {
          onSelect(friend);
        }}
        onFriendsUpdate={onFriendsUpdate}
      />
    </>
  );
};

export default SelectFriendModal;
