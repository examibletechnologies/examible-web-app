import "../../styles/dashboardCss/subscription.css";
import YearlyPayment from "../jacob/YearlyPayment";
const Subscription = () => {
  return (
    <main className="subscriptionmain">
      <div className="sebcontainer">
        <div className="subdivheader">
          <h1>Payment Plan</h1>
          <span>
            Your Path to <em>300+</em> Starts Here: <br /> Select a Plan
          </span>
        </div>
        <YearlyPayment />

        <div className="subfootercontainer">
          <div className="subfooter">
            <span>
              Try our Basic Plan at no cost, or upgrade to our Exam Ready Plan
              for the ultimate JAMB prep experience. Get full access to past
              questions, mock exams, and smart study tools – all at the best
              value for your money.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Subscription;
