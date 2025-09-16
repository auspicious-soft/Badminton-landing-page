import React, { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { postApi } from "../../utils/api";
import { baseImgUrl, URLS } from "../../utils/urls";
import { useToast } from "../../utils/ToastContext";
import { motion } from "framer-motion";

interface ProfileCardProps {
  name: string;
  phoneNumber: string;
  email: string;
  imageSrc: string;
  onImageChange: () => void;
  onSave: (data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    imageUrl?: string;
  }) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  phoneNumber,
  email,
  imageSrc,
  onImageChange,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name,
    phoneNumber,
    email,
  });
  const [imgError, setImgError] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editState, setEditState] = useState(false)
  const [loading, setLoading] = useState(false);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialData = useRef({ name, phoneNumber, email, imageSrc });
  const { successToast, errorToast } = useToast();
  useEffect(() => {
    setFormData({ name, phoneNumber, email });
    setImgError(false);
    initialData.current = { name, phoneNumber, email, imageSrc };
  }, [name, phoneNumber, email, imageSrc]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updates: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      email?: string;
      imageUrl?: string;
    } = {};

    // Split name into firstName and lastName
    const [formFirstName, ...formLastNameParts] = formData.name
      .trim()
      .split(" ");
    const formLastName = formLastNameParts.join(" ") || undefined;
    const [initialFirstName, ...initialLastNameParts] = initialData.current.name
      .trim()
      .split(" ");
    const initialLastName = initialLastNameParts.join(" ") || undefined;

    // Check for changed fields
    if (formFirstName !== initialFirstName) {
      updates.firstName = formFirstName;
    }
    if (formLastName !== initialLastName) {
      updates.lastName = formLastName;
    }
    if (formData.phoneNumber !== initialData.current.phoneNumber) {
      updates.phoneNumber = formData.phoneNumber;
    }
    if (formData.email !== initialData.current.email) {
      updates.email = formData.email;
    }
    if (uploadedImgUrl && uploadedImgUrl !== initialData.current.imageSrc) {
      updates.imageUrl = uploadedImgUrl;
    }

    if (Object.keys(updates).length === 0) {
      console.log("Nothing changed, nothing to update");
      return;
    }

    onSave(updates);
    setHasChanges(false);
        setEditState(false); // close edit mode after saving

  };

  const handleImageError = () => {
    console.error("Image failed to load:", imageSrc);
    setImgError(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    try {
      const response = await postApi(`${URLS.userUploadImage}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image upload response:", response.data);

      if (response.status === 200 && onImageChange) {
        onImageChange();
        const ImUr = response.data.data.imageKey;
        setUploadedImgUrl(ImUr);
        successToast("Your Image Uploaded successfully. Save to Update it.");
      } else {
        setUploadedImgUrl("");
      }
    } catch (err: any) {
      errorToast(err?.response.data.message || "Failed To Upload Image.");
      setUploadedImgUrl("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const [formFirstName, ...formLastNameParts] = formData.name
      .trim()
      .split(" ");
    const formLastName = formLastNameParts.join(" ") || undefined;
    const [initialFirstName, ...initialLastNameParts] = initialData.current.name
      .trim()
      .split(" ");
    const initialLastName = initialLastNameParts.join(" ") || undefined;

    const changed = Boolean(
      formFirstName !== initialFirstName ||
        formLastName !== initialLastName ||
        formData.phoneNumber !== initialData.current.phoneNumber ||
        formData.email !== initialData.current.email ||
        (uploadedImgUrl && uploadedImgUrl !== initialData.current.imageSrc)
    );

    setHasChanges(changed);
  }, [formData, uploadedImgUrl]);


  const EditMode = () => setEditState(true);

  return (
    <>
      {loading ? (
  <div className="flex justify-center items-center h-40 w-full bg-white rounded-lg">
      <motion.svg
        className="w-12 h-12"
        viewBox="0 0 50 50"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#3B82F6" // blue
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="90 150" // creates arc instead of full circle
          fill="none"
        />
      </motion.svg>
    </div>
) : (
        <>
          <div className="bg-zinc-100 rounded-[20px] p-6 flex flex-col gap-6">
            {/* Image Section */}
            <div className="relative w-full h-64">
              <img
                className="w-full h-full rounded-[10px] object-cover"
                src={
                  uploadedImgUrl
                    ? `${baseImgUrl}/${uploadedImgUrl}`
                    : !imageSrc || imgError
                    ? "https://placehold.co/441x285"
                    : imageSrc.startsWith("https")
                    ? imageSrc
                    : `${baseImgUrl}/${imageSrc}`
                }
                alt="Profile"
                onError={handleImageError}
              />
              { editState && 
                <div
                className="absolute bottom-4 right-4 px-5 py-4 bg-white rounded-3xl inline-flex justify-center items-center gap-2.5 cursor-pointer"
                onClick={triggerFileInput}
              >
                <Pencil className="w-3 h-3" />
                <div className="text-black text-sm font-medium font-['Raleway']">
                  Change Image
                </div>
              </div>
              }
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Form Fields Section */}
            <div className="flex flex-col gap-4">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="self-stretch text-black text-xs font-medium font-['Raleway']">
                  Name
                </label>
                <div className="px-3.5 py-2.5 bg-white rounded-[39px]">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  readOnly={!editState}
                  className={`w-full h-6 text-black text-xs font-medium font-['Raleway'] bg-transparent outline-none ${
                    !editState ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>
              </div>

              {/* Phone Number Field */}
              {/* <div className="flex flex-col gap-2">
          <label className="self-stretch text-black text-xs font-medium font-['Raleway']">
            Phone Number
          </label>
          <div className="self-stretch px-3.5 py-2.5 bg-white rounded-[39px] inline-flex flex-col justify-start items-start gap-2.5">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
            readOnly
              className="w-full h-6 text-black text-xs font-medium font-['Raleway'] bg-transparent outline-none cursor cursor-not-allowed"
            />
          </div>
        </div> */}

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="self-stretch text-black text-xs font-medium font-['Raleway']">
                  Email
                </label>
                <div className="self-stretch px-3.5 py-2.5 bg-white rounded-[39px] inline-flex flex-col justify-start items-start gap-2.5">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full h-6 text-black text-xs font-medium font-['Raleway'] bg-transparent outline-none cursor cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            {!editState ? (
            <div
              className="px-4 py-4 bg-gray-600 rounded-3xl inline-flex justify-center items-center gap-2.5 cursor-pointer"
              onClick={EditMode}
            >
              <div className="text-white text-sm font-medium font-['Raleway']">
                Edit
              </div>
            </div>
          ) : (
            hasChanges && (
              <div
                className="px-4 py-4 bg-blue-600 rounded-3xl inline-flex justify-center items-center gap-2.5 cursor-pointer"
                onClick={handleSubmit}
              >
                <div className="text-white text-sm font-medium font-['Raleway']">
                  Save
                </div>
              </div>
            )
          )}
          </div>
        </>
      )}
    </>
  );
};

export default ProfileCard;
