import { useState } from "react";
import "../styles/header.css";
import menuBar from "../assets/navBar.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderLogo from "../assets/public/logo.png";
import { toast } from "react-toastify";
import Button from "../shared/Button";

const Header = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <div className="header">
        <div className="header-holder">
          <div className="header-holderImg">
            <img
              src={HeaderLogo}
              alt="Examible"
              style={{ cursor: "pointer" }}
              onClick={() => nav("/")}
            />
          </div>
          <div className="header-holderText">
            <ul>
              {menuBar.map((item, index) => (
                <li
                  key={index}
                  className={location.pathname === item.link ? "active" : ""}
                  onClick={() => {
                    item.name === "Plans" &&
                      toast.info("Plans page is currently unavailable");
                  }}
                >
                  <Link
                    to={item?.link}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <aside className="header-holderButton">
            <Button
              variant="outline"
              onClick={() => nav("/signup")}
              style={{ width: 89 }}
              size="sm"
            >
              Sign Up
            </Button>
            <Button
              onClick={() => nav("/login")}
              style={{ width: 89 }}
              size="sm"
            >
              Login
            </Button>
          </aside>
          <div
            className="header-menuIcon"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <svg
              width="59"
              height="47"
              viewBox="0 0 59 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="57"
                height="45"
                rx="5"
                fill="white"
                stroke="#F2AE30"
                strokeWidth="2"
              />

              <path
                d="M11.6667 35H46.6667M11.6667 23.3333H46.6667M11.6667 11.6667H35"
                stroke="#F2AE30"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
      {showDropdown && (
        <div
          className="header-dropDown"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div
            className="header-dropDownHolder"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="headerDropdown-holderImg">
              <img
                src={HeaderLogo}
                alt="Examible"
                onClick={() => {
                  (nav("/"), setShowDropdown(!showDropdown));
                }}
              />
            </div>
            <div className="headerDropdown-holderText">
              <>
                {menuBar.map((item, index) => (
                  <li
                    key={index}
                    className={location.pathname === item.link ? "active" : ""}
                    onClick={() => {
                      item.name === "Pans" &&
                        toast.info("Plans page is currently unavailable");
                      setShowDropdown(!showDropdown);
                    }}
                  >
                    <Link
                      to={item.link}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </>
              <Button
                variant="outline"
                onClick={() => nav("/signup")}
                style={{ width: 89 }}
                size="sm"
              >
                Sign Up
              </Button>
              <Button
                onClick={() => nav("/login")}
                style={{ width: 89 }}
                size="sm"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
