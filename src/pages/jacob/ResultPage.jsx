import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/dashboardCss/resultpage.css";

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state;

  const { correctCount, total, percentage, passed } = result;

  return (
    <div className="resultpagemain">
      <h2>🎉 Quiz Completed!</h2>
      <p>
        You scored <strong>{correctCount}</strong> out of
        <strong> {total}</strong>
      </p>
      <p>
        Percentage: <strong>{percentage}%</strong>
      </p>
      <p
        style={{
          color: passed ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        {passed ? "✅ You Passed!" : "❌ You Didn't Pass!"}
      </p>
      <button onClick={() => navigate("/past-questions")}>
        Back to dashboard
      </button>
    </div>
  );
};

export default ResultPage;
