import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getApiNoAuth } from "../utils/api";
import { URLS } from "../utils/urls";
import { useToast } from "../utils/ToastContext";

interface InfoDataType {
  privacyPolicy: string;
  termsAndConditions?: string;
  aboutUs?: string;
  contactUs?: string;
  faq?: string;
  cancellationPolicy?: string;
  refundPolicy?: string;
  userAgreement?: string;
  referral?: any;
  loyaltyPoints?: any;
  banners?: string[];
}


const PrivacyPolicy = () => {
const [infoData, setInfoData] = useState<InfoDataType | null>(null);
    const { successToast, errorToast } = useToast();
  
   useEffect(()=>{
      window.scrollTo(0, 0);
    },[]);

   const fetchData = async () =>{
    try {
      const response = await getApiNoAuth(`${URLS.getInfoData}`);

      if(response.status === 200){
        const data = response?.data?.data;
        setInfoData(data);
      }
      else{
       errorToast("Something went wrong");
      }
    } catch (error) {
      console.log(error)
    }
   }
   useEffect(()=>{
    fetchData();
   },[])
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

       
        </div>

    
       <div className="prose prose-lg max-w-none">
          {infoData ? (
            <div
            className="terms-content"
              dangerouslySetInnerHTML={{
                __html: infoData.privacyPolicy,
              }}
            />
          ) : (
            <p className="text-gray-600">Loading...</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
