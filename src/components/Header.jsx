import { useState } from "react";
import "../styles/header.css";
import menuBar from "../assets/navBar.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderLogo from "../assets/public/logo.png";
import { toast } from "react-toastify";
import Button from "../shared/Button";
import { IoReorderThreeOutline } from "react-icons/io5";

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
              variant="primary-outline"
              style={{ width: 89 }}
              size="sm"
            >
              Login
            </Button>
          </aside>
          {/* <div
            className="header-menuIcon"
            onClick={() => setShowDropdown(!showDropdown)}
          > */}
          <button
            class="menu-button"
            aria-label="Open Menu"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="2" width="36" height="36" rx="4" class="icon-bg" />

              <line x1="8" y1="12" x2="32" y2="12" class="line top" />
              <line x1="8" y1="20" x2="24" y2="20" class="line middle" />
              <line x1="8" y1="28" x2="32" y2="28" class="line bottom" />
            </svg>
          </button>
          {/* </div> */}
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
