import { useEffect, useState } from "react";
import PasswordResetPage from "./PasswordResetPage";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [isVerify, setIsVerify] = useState(false);
  const { token } = useParams();
  const nav = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/v1/reset_password/student/verify/${token}`,
      );
      if (res?.status === 200) {
        setIsVerify(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setTimeout(() => {
        nav("/login");
      }, 3000);
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return <>{!isVerify ? <Loading /> : <PasswordResetPage />}</>;
};

export default ResetPassword;
