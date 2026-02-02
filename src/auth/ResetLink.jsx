import { useLocation } from "react-router-dom";
import "../styles/authCss/resetlink.css";
import { CiMail } from "react-icons/ci";

const ResetLink = () => {
  const location = useLocation();
  const openMail = () => {
    const email = location.state?.email;
    if (!email) {
      window.location.href = "mailto:";
      return;
    }
    const domain = email.split("@")[1]?.toLowerCase() || "";

    if (domain.includes("gmail.com") || domain.includes("googlemail.com")) {
      window.open("https://mail.google.com", "_blank");
    } else if (domain.includes("yahoo")) {
      window.open("https://mail.yahoo.com", "_blank");
    } else if (
      domain.includes("outlook") ||
      domain.includes("hotmail") ||
      domain.includes("live") ||
      domain.includes("msn")
    ) {
      window.open("https://outlook.live.com", "_blank");
    } else if (domain.includes("icloud") || domain.includes("me.com")) {
      window.open("https://www.icloud.com/mail", "_blank");
    } else {
      window.location.href = `mailto:info@examible.com`;
    }
  };

  return (
    <main className="resetMain">
      <div className="resetcircle">
        <div className="resetinnercircle"></div>
      </div>
      <div className="resetcircle1">
        <div className="resetinnercircle1"></div>
      </div>
      <div className="resetgoldsmallcircle"></div>
      <div className="resetgoldsmallcircle1"></div>
      <div className="resetcirclepurple">
        <div className="resetgoldsmallcircle2"></div>
      </div>
      <section className="resetcontainer">
        <div className="resetheader">
          <h1>Check your email</h1>
          <p>
            We sent you an email with instructions for resetting your password
          </p>
        </div>
        <div className="reseticon">
          <CiMail className="mailIcon" />
        </div>
        <div className="btndiv">
          <button className="restlinkbtn" onClick={openMail}>
            Go to my mail
          </button>
        </div>
      </section>
    </main>
  );
};

export default ResetLink;
