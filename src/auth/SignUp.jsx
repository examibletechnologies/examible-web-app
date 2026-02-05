import { useState, useEffect } from "react";
import "../styles/authCss/auth.css";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/public/logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
import Button from "../shared/Button";
import Input from "../shared/Input";

const SignUp = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [inputValue, setInputValue] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function validatePassword(inputValue) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#;:_^'\(\)<>=+/"|,{}[\]¬`£~-])[A-Za-z\d@$!%*?&.#;:_^'\(\)<>=+/"|,{}[\]¬`£~-]{8,}$/;
    return passwordRegex.test(inputValue);
  }

  const validateField = (name, value) => {
    let error = "";

    if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
      } else if (value.length < 8 || value.length > 60) {
        error = "Password should be between 8 and 60 characters";
      } else if (!validatePassword(value)) {
        error =
          "Your password must contain an upper case, a lowercase, a special character and a number";
      } else if (value === inputValue.confirmPassword) {
        setErrorMessage({ ...errorMessage, confirmPassword: "" });
      } else {
        error = "";
      }
    }

    if (name === "fullName") {
      if (!value.trim()) {
        error = "Full name is required";
      } else if (!value.trim().includes(" ")) {
        error =
          "Full name must include at least two names (e.g., Benjamin Jacob)";
      }
    }
    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (value.length < 6 || value.length > 60) {
        error = "Email should be between 6 and 60 characters";
      } else if (!validateEmail(value)) {
        error = "Please enter a valid email address";
      }
    }

    if (name === "confirmPassword") {
      if (value !== inputValue.password) {
        error = "Passwords do not match";
      }
    }

    setErrorMessage((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setErrorMessage({ ...errorMessage, password: "" });
    }
  };

  const validateEmail = (inputValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputValue);
  };

  useEffect(() => {
    const { fullName, email, password, confirmPassword } = inputValue;
    if (
      fullName.trim() !== "" &&
      validateEmail(email) &&
      password.trim() !== "" &&
      password.length >= 8 &&
      password.length <= 60 &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputValue]);

  useEffect(() => {
    const { fullName, email, password, confirmPassword } = inputValue;
    const isFormValid =
      fullName.trim() !== "" &&
      validateEmail(email) &&
      password.trim() !== "" &&
      password.length >= 8 &&
      password.length <= 60 &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword;
    if (loading || googleLoading) {
      setDisabled(true);
    } else {
      setDisabled(!isFormValid);
    }
  }, [loading, googleLoading, inputValue]);

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    if (!disabled && !googleLoading) {
      setLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}api/v1/student`,
          data,
        );
        if (res?.status === 201) {
          toast.success("Signup Successful, Please check your email to verify");
          setLoading(false);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        if (
          error?.response?.data?.message ===
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ) {
          setErrorMessage({ ...errorMessage, password: "" });
        }
        setLoading(false);
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const googleIcon = async () => {
    setGoogleLoading(true);
    window.location.href = `${import.meta.env.VITE_BASE_URL}googleAuthenticate`;
  };

  return (
    <div className="signupMain">
      <div className="circle">
        <div className="innercircle"></div>
      </div>
      <div className="circle1">
        <div className="innercircle1"></div>
      </div>
      <div className="goldsmallcircle"></div>
      <div className="goldsmallcircle1"></div>
      <div className="closeicondiv">
        <img src={logo} onClick={() => navigate("/")} />
      </div>
      <div className="signupForm">
        <div className="signheader">
          <h1>Sign Up for Examible</h1>
          <p>Beat jamb with good grades at one sitting </p>
        </div>
        <Button
          IconComponent={FcGoogle}
          iconProps={{ className: "googleIcon" }}
          variant="secondary"
          fullWidth
          onClick={googleIcon}
          disabled={loading || googleLoading}
        >
          Continue with Google
        </Button>
        <span className="or-container">
          <div className="line"></div>
          <span className="or">or</span>
          <div className="line"></div>
        </span>
        <form className="form" onSubmit={(e) => handleSubmit(e, inputValue)}>
          <Input
            label="Full Name"
            name="fullName"
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            value={inputValue.fullName}
            error={errorMessage.fullName}
            type="text"
            onBlur={(e) => validateField(e.target.name, e.target.value)}
          />
          <Input
            label="Email"
            name="email"
            onChange={handleChange}
            required
            placeholder="Enter your email"
            value={inputValue.email}
            error={errorMessage.email}
            type="email"
            onBlur={(e) => validateField(e.target.name, e.target.value)}
          />
          <Input
            label="Password"
            name="password"
            onChange={handleChange}
            required
            placeholder="Enter your password"
            value={inputValue.password}
            error={errorMessage.password}
            isPassword
            onBlur={(e) => validateField(e.target.name, e.target.value)}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            value={inputValue.confirmPassword}
            error={errorMessage.confirmPassword}
            isPassword
            onBlur={(e) => validateField(e.target.name, e.target.value)}
          />
          <Button
            loading={loading}
            type="submit"
            disabled={disabled || googleLoading}
            fullWidth
          >
            {loading ? "loading..." : "Join For Free"}
          </Button>
        </form>
        <div className="alreadyhaveaccount">
          <h1>
            Already have an account?{" "}
            <em onClick={() => navigate("/login")}>click here to login now</em>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
