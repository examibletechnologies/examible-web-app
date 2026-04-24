import { useState } from "react";
import "../styles/header.css";
import menuBar from "../assets/navBar.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderLogo from "../assets/public/logo.png";
import Button from "../shared/Button";
import { HamburgerIcon } from "../assets/public/svg/common";

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
          <button
            className="menu-button"
            aria-label="Open Menu"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <HamburgerIcon />
          </button>
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
                variant="primary-outline"
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
