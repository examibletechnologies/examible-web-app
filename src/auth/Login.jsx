import { useEffect, useState } from "react";
import "../styles/authCss/auth.css";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/public/logo.png";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "../global/slice";
import Input from "../shared/Input";
import Button from "../shared/Button";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const dispatch = useDispatch();
  const handleSubmit = async (e, data) => {
    if (!disabled && !googleLoading) {
      e.preventDefault();
      setLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}api/v1/student/login`,
          data,
        );
        dispatch(setUserToken(res?.data?.token));
        dispatch(setUser(res?.data?.data));
        if (res?.status === 200) {
          toast.success("Login successful!");
          setLoading(false);
          setTimeout(() => {
            if (location.state?.selectedPlan) {
              navigate("/make-payment", {
                state: {
                  selectedPlan: location.state?.selectedPlan,
                  amount: location.state?.amount,
                },
                replace: true,
              });
            } else {
              navigate("/overview", { replace: true });
            }
          }, 3000);
        }
      } catch (error) {
        if (
          error?.response?.data?.message ===
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ) {
        }
        setLoading(false);
        toast.error(error?.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    const { email, password } = inputValue;
    if (email && password.trim() !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputValue]);

  useEffect(() => {
    const { email, password } = inputValue;
    const isFormValid = email && password.trim() !== "";
    if (loading || googleLoading) {
      setDisabled(true);
    } else {
      setDisabled(!isFormValid);
    }
  }, [loading, googleLoading, inputValue]);

  const loginGoogleIcon = async () => {
    setGoogleLoading(true);
    setTimeout(() => {
      window.location.href = `${import.meta.env.VITE_BASE_URL}googleAuthenticate`;
      setGoogleLoading(false);
    }, 1000);
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
          <h1>Log in to Examible</h1>
        </div>
        <form className="form" onSubmit={(e) => handleSubmit(e, inputValue)}>
          <Input
            label="Email"
            type="email"
            name="email"
            onChange={handleChange}
            value={inputValue.email}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            placeholder="Enter your email"
            required
            style={{ marginBottom: 8 }}
          />
          <Input
            label="Password"
            name="password"
            onChange={handleChange}
            value={inputValue.password}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            placeholder="Enter your password"
            required
            isPassword
            extraLabel={
              <p
                className="forgotpassword"
                onClick={() => navigate("/forgetpassword")}
              >
                Forgot Password?
              </p>
            }
          />
          <div className="rememberme">
            <div className="checkbox">
              <input type="checkbox" className="checkboxtic" />
            </div>
            <label className="rememberlabel">Remember Me</label>
          </div>
          <Button
            type="submit"
            loading={loading}
            disabled={disabled || googleLoading}
            fullWidth
          >
            {loading ? "logging in..." : "Login"}
          </Button>
        </form>
        <span className="or-container">
          <div className="line"></div>
          <span className="or">Other login options</span>
          <div className="line"></div>
        </span>
        <Button
          IconComponent={FcGoogle}
          iconProps={{ className: "googleIcon" }}
          variant="secondary"
          fullWidth
          onClick={() => loginGoogleIcon()}
          disabled={loading || googleLoading}
          loading={googleLoading}
        >
          {googleLoading ? "please wait..." : "Continue with Google"}
        </Button>

        {/* <article className="forgotpassworddiv"> */}
        <p className="signuptext">
          Don't have an account?{" "}
          <span className="signupLink" onClick={() => navigate("/signup")}>
            click here to create one now
          </span>
        </p>
        {/* </article> */}
      </div>
    </div>
  );
};
export default Login;
