import React, { useState, useMemo } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { X } from "lucide-react";
import { postApi } from "../../utils/api";
import { URLS } from "../../utils/urls";
import { useToast } from "../../utils/ToastContext";
import Loader from "./Loader";

interface Player {
  name: string;
  rating: number;
  imageUrl: string;
}

interface UploadScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  gameType: string;
  team1: Player[];
  team2: Player[];
  score?: {
    set1?: { team1: string; team2: string };
    set2?: { team1: string; team2: string };
    set3?: { team1: string; team2: string };
  };
  onScoreUpdate: () => void;
}

interface SetScore {
  team1: string;
  team2: string;
}

interface ScoreErrors {
  set1: string;
  set2: string;
  set3: string;
}

const UploadScoreModal: React.FC<UploadScoreModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  gameType,
  team1,
  team2,
  score = {},
  onScoreUpdate,
}) => {
  const [scores, setScores] = useState<{
    set1: SetScore;
    set2: SetScore;
    set3: SetScore;
  }>({
    set1: { team1: score.set1?.team1 || "", team2: score.set1?.team2 || "" },
    set2: { team1: score.set2?.team1 || "", team2: score.set2?.team2 || "" },
    set3: { team1: score.set3?.team1 || "", team2: score.set3?.team2 || "" },
  });
  const [errors, setErrors] = useState<ScoreErrors>({
    set1: "",
    set2: "",
    set3: "",
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const[loading, setLoading] = useState(false);
  const [allowApiHit, setAllowApiHit] = useState("");
  const {successToast, errorToast} = useToast()
  // Check if there are existing scores to determine button text
  const hasExistingScores = useMemo(() => {
    return (
      (score.set1 && (score.set1.team1 !== "" || score.set1.team2 !== "")) ||
      (score.set2 && (score.set2.team1 !== "" || score.set2.team2 !== "")) ||
      (score.set3 && (score.set3.team1 !== "" || score.set3.team2 !== ""))
    );
  }, [score]);

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const validateSet = (set: SetScore): string => {
    const team1Score = parseInt(set.team1);
    const team2Score = parseInt(set.team2);

    if (set.team1 === "" && set.team2 === "") {
      return "";
    }

    if (isNaN(team1Score) || isNaN(team2Score)) {
      return "Scores must be numeric values.";
    }
    if (team1Score < 0 || team2Score < 0) {
      return "Scores cannot be negative.";
    }

    const normalizedGameType = gameType.toLowerCase();
    if (normalizedGameType === "padel") {
      if (team1Score < 6 && team2Score < 6) {
        return "One team must win at least 6 games.";
      }
      const scoreDifference = Math.abs(team1Score - team2Score);
      if (team1Score === 7 && team2Score === 7) {
        return "Tiebreak cannot end in a 7-7 tie.";
      }
      if (team1Score > 7 || team2Score > 7) {
        return "Scores cannot exceed 7 games in a set.";
      }
      if (
        (team1Score >= 6 || team2Score >= 6) &&
        scoreDifference < 2 &&
        !(team1Score === 7 && team2Score >= 5 && team2Score <= 7) &&
        !(team2Score === 7 && team1Score >= 5 && team1Score <= 7)
      ) {
        return "Winning team must lead by 2 games, or win tiebreak 7-5 or higher.";
      }
    } else if (normalizedGameType === "pickleball") {
      if (team1Score < 11 && team2Score < 11) {
        return "One team must score at least 11 points.";
      }
      const scoreDifference = Math.abs(team1Score - team2Score);
      if (scoreDifference < 2 && (team1Score >= 11 || team2Score >= 11)) {
        return "Winning team must lead by at least 2 points.";
      }
    } else if (normalizedGameType === "pickleball-7") {
      if (team1Score < 7 && team2Score < 7) {
        return "One team must score at least 7 points.";
      }
      const scoreDifference = Math.abs(team1Score - team2Score);
      if (scoreDifference < 2 && (team1Score >= 7 || team2Score >= 7)) {
        return "Winning team must lead by at least 2 points.";
      }
    } else {
      return "Invalid game type.";
    }

    return "";
  };

  const handleScoreChange = (
    set: "set1" | "set2" | "set3",
    team: "team1" | "team2",
    value: string
  ) => {
    if (value === "" || /^[0-9]*$/.test(value)) {
      const updatedScores = {
        ...scores,
        [set]: {
          ...scores[set],
          [team]: value,
        },
      };
      setScores(updatedScores);

      setErrors((prev) => ({
        ...prev,
        [set]: validateSet(updatedScores[set]),
      }));
    }
  };

  const closeCancelModal = () => {
    setAllowApiHit("No");
    setShowCancelModal(false);
  };

  const isFormValid = useMemo(() => {
    const set1Error = validateSet(scores.set1);
    const set2Error = validateSet(scores.set2);
    const set3Error = validateSet(scores.set3);

    return (
      (scores.set1.team1 !== "" && scores.set1.team2 !== "" && !set1Error) ||
      (scores.set2.team1 !== "" && scores.set2.team2 !== "" && !set2Error) ||
      (scores.set3.team1 !== "" && scores.set3.team2 !== "" && !set3Error)
    );
  }, [scores, gameType]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }

    // If team2 has players, call API directly
    if (team2.length > 0) {
      setLoading(true)
      try {
        const response = await postApi(`${URLS.uploadScore}`, {
          bookingId,
          ...scores,
        });
        if (response.status === 200) {
          successToast(response.data.message);
          onScoreUpdate()
          onClose();
        } else {
        errorToast("Failed to upload scores");
              setLoading(false)

        }
      } catch (error:any) {
        errorToast(error?.response.data.message);
              setLoading(false)

      }
    } else {
      setShowCancelModal(true);
    }
  };

  const handleConfirmModal = async () => {
    setAllowApiHit("Yes");
    setShowCancelModal(false);
     setLoading(true)
    try {
      const response = await postApi(`${URLS.uploadScore}`, {
        bookingId,
        ...scores,
      });
      if (response.status === 200) {
        successToast(response.data.message);
        onScoreUpdate()
        onClose();
      } else {
        errorToast("Failed to upload scores");
         setLoading(false)
      }
    } catch (error:any) {
        errorToast(error?.response.data.message);
          setLoading(false)
    }
    finally{
        setLoading(false)
    }
  };

  const renderSetScoreInput = (set: "set1" | "set2" | "set3", setNumber: number) => (
    <div className="self-stretch flex flex-col justify-start items-start gap-2 sm:gap-2.5 bg-gray-100 p-4 rounded-[10px]">
      <div className="text-gray-900 text-base sm:text-lg font-semibold font-['Raleway']">
        Set {setNumber}
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="text-gray-600 text-sm font-medium font-['Raleway']">
            Team 1
          </div>
          <input
            type="text"
            value={scores[set].team1}
            onChange={(e) => handleScoreChange(set, "team1", e.target.value)}
            className="w-full px-3 py-2 rounded-md text-sm font-['Raleway'] bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter score"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="text-gray-600 text-sm font-medium font-['Raleway']">
            Team 2
          </div>
          <input
            type="text"
            value={scores[set].team2}
            onChange={(e) => handleScoreChange(set, "team2", e.target.value)}
            className="w-full px-3 py-2 rounded-md text-sm font-['Raleway'] bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter score"
          />
        </div>
      </div>
      {errors[set] && (
        <div className="text-red-600 text-xs font-medium font-['Raleway']">
          {errors[set]}
        </div>
      )}
    </div>
  );

  return (
   <>
    <AnimatePresence>

    {loading && <Loader fullScreen />}

      {isOpen && (
        <motion.div
          className="relative flex flex-col gap-3 sm:gap-4 w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 hover:text-red-600"
            onClick={onClose}
          >
            <X className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
          <div className="text-gray-900 text-lg sm:text-xl font-semibold font-['Raleway']">
            Upload {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Match Scores
          </div>
          <div className="w-full flex flex-col gap-3 sm:gap-4">
            {renderSetScoreInput("set1", 1)}
            {renderSetScoreInput("set2", 2)}
            {renderSetScoreInput("set3", 3)}
          </div>
          <div className="flex flex-row-reverse justify-between gap-3">
            <button
              className="px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] transition-colors duration-200 ${
                isFormValid
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              {hasExistingScores ? "Update Scores" : "Submit Scores"}
            </button>
          </div>
        </motion.div>
      )}

      {showCancelModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-0"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-lg sm:text-xl font-semibold font-['Raleway'] text-gray-800 mb-4">
              Confirm Scores
            </h2>
            <p className="text-sm sm:text-base font-['Raleway'] text-gray-600 mb-6">
              There is no player in Team 2. To upload the scores, Player 2 needs to be moved to Team 2. Click to confirm.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors duration-200"
                onClick={closeCancelModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] bg-dark-blue text-white hover:bg-blue-700 transition-colors duration-200"
                onClick={handleConfirmModal}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
   </>
  );
};

export default UploadScoreModal;