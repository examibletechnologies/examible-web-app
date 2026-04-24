import { useEffect, useState } from "react";
import "../../styles/dashboardCss/viewpastquestion.css";
import {
  IoIosArrowRoundBack,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  setPastQuestionsOption,
  clearPastQuestionsOption,
} from "../../global/slice";
import { useNavigate } from "react-router-dom";
import { getAiResponse } from "../../config/Api";
import { ClipLoader } from "react-spinners";
import { useExamibleContext } from "../../context/ExamibleContext";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { toast } from "react-toastify";

const ViewPastQuestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const calculateScore = () => {
    const correctCount = Object.values(pastQuestionsOption).filter(
      (entry) => entry?.isCorrect,
    ).length;

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 50;
    return { correctCount, total, percentage, passed };
  };

  const year = useSelector((state) => state.year);
  const subject = useSelector((state) => state.exam);
  const user = useSelector((state) => state.user);
  const questions = useSelector((state) => state.pastQuestions) || [];
  const pastQuestionsOption = useSelector((state) => state.pastQuestionsOption);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion,
  );

  const { handleShowUserFeedback, setShowAiResponseModal, setAIResponse } =
    useExamibleContext();

  const getAnswerText = (answerLetter, options) => {
    if (
      !options ||
      !Array.isArray(options) ||
      typeof answerLetter !== "string" ||
      answerLetter.length === 0
    ) {
      return "";
    }

    const cleanedLetter = answerLetter.trim().toUpperCase().charAt(0); // <- sanitize input
    const index = cleanedLetter.charCodeAt(0) - 65;

    if (index < 0 || index >= options.length) return "";

    const mappedAnswer = options[index];
    return mappedAnswer;
  };

  const handleOptionClick = (
    questionIndex,
    selectedOption,
    correctAnswerLetter,
    options,
  ) => {
    const correctAnswer = getAnswerText(correctAnswerLetter, options);

    dispatch(
      setPastQuestionsOption({
        questionIndex,
        selectedOption,
        isCorrect: String(selectedOption) === String(correctAnswer),
        correctAnswerText: correctAnswer,
      }),
    );
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(questions.length / questionsPerPage)) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
      setCount((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      dispatch(clearPastQuestionsOption());
    }
  }, [dispatch, questions]);

  useEffect(() => {
    if (count === 1) {
      setTimeout(() => {
        handleShowUserFeedback();
      }, 20000);
    }
  }, [count]);

  const handleViewExplanation = async (
    questionNum,
    question,
    passage,
    options,
    subheadingA,
    subheadingB,
    diagramUrlA,
    diagramUrlB,
    id,
  ) => {
    if (questionNum > 5 && user?.plan === "Freemium") {
      toast.error("Please Subscribe before you can access this feature");
      return;
    }
    setLoading(id);
    try {
      const res = await getAiResponse(
        year,
        subject,
        questionNum,
        question,
        passage,
        options,
        subheadingA,
        subheadingB,
        diagramUrlA,
        diagramUrlB,
      );
      if (res) {
        setLoading(null);
        setAIResponse(res.data.aiResponse);
        setShowAiResponseModal(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(null);
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(null);
    }
  };

  let questionDetails;

  return (
    <main className="viewpastquestionmain">
      <div className="viewpastquestionheader">
        <IoIosArrowRoundBack
          size={40}
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <span>Jamb UTME Question</span>
      </div>
      <div className="viewpastquestionmainheader">
        <h1>
          {subject} <em>Past Question</em>({year})
        </h1>
      </div>
      {currentQuestions?.length > 0 ? (
        currentQuestions?.map((item, index) => {
          let newItem = {
            subheadingA: item?.subheadingA || "",
            subheadingB: item?.subheadingB || "",
            diagramUrlA: item?.diagramUrlA || "",
            diagramUrlB: item?.diagramUrlB || "",
          };
          if (index === 0) {
            questionDetails = item;
          } else {
            if (questionDetails.subheadingA === item.subheadingA) {
              newItem.subheadingA = "";
            } else {
              newItem.subheadingA = item.subheadingA;
            }
            if (questionDetails.subheadingB === item.subheadingB) {
              newItem.subheadingB = "";
            } else {
              newItem.subheadingB = item.subheadingB;
            }
            if (questionDetails.diagramUrlA === item.diagramUrlA) {
              newItem.diagramUrlA = "";
            } else {
              newItem.diagramUrlA = item.diagramUrlA;
            }
            if (questionDetails.diagramUrlB === item.diagramUrlB) {
              newItem.diagramUrlB = "";
            } else {
              newItem.diagramUrlB = item.diagramUrlB;
            }
            questionDetails = item;
          }
          return (
            <div className="answerquestiondiv" key={index}>
              {newItem?.subheadingA && (
                <h1 className="subheading">
                  <Latex>{item?.subheadingA}</Latex>
                </h1>
              )}
              {newItem?.diagramUrlA && (
                <img src={item?.diagramUrlA} className="question-diagram" />
              )}
              {newItem?.subheadingB && (
                <h1 className="subheading">
                  <Latex>{item?.subheadingB}</Latex>
                </h1>
              )}
              {newItem?.diagramUrlB && (
                <img src={item?.diagramUrlB} className="question-diagram" />
              )}
              <h1 className="questiontext">
                <span>{indexOfFirstQuestion + index + 1}</span>.{" "}
                <span>{<Latex>{item?.question}</Latex>}</span>
              </h1>
              <ul className="answeroption">
                {item.options.map((option, optionindex) => {
                  const userAnswer =
                    pastQuestionsOption[indexOfFirstQuestion + index];
                  const correctAnswer = getAnswerText(
                    item.answer,
                    item.options,
                  );

                  let optionClass = "";
                  if (userAnswer) {
                    if (option === userAnswer.selectedOption) {
                      optionClass = userAnswer.isCorrect
                        ? "correct-option"
                        : "wrong-option";
                    } else if (
                      !userAnswer.isCorrect &&
                      option === correctAnswer
                    ) {
                      optionClass = "correct-answer";
                    }
                  }
                  return (
                    <li
                      key={optionindex}
                      className={optionClass}
                      onClick={() =>
                        handleOptionClick(
                          indexOfFirstQuestion + index,
                          option,
                          item.answer,
                          item.options || [],
                        )
                      }
                      style={{
                        pointerEvents: userAnswer ? "none" : "auto",
                        cursor: userAnswer ? "not-allowed" : "pointer",
                      }}
                    >
                      <span className="letterdoption">
                        {`${String.fromCharCode(65 + optionindex)}.`}
                      </span>
                      <span>
                        <Latex>{option}</Latex>
                      </span>
                    </li>
                  );
                })}
                <div className="aswer-airesponse">
                  <p
                    className="pastanswer"
                    style={{
                      color: pastQuestionsOption[indexOfFirstQuestion + index]
                        ?.isCorrect
                        ? "green"
                        : "red",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {pastQuestionsOption[indexOfFirstQuestion + index]
                      ? pastQuestionsOption[indexOfFirstQuestion + index]
                          .isCorrect
                        ? "✅ Correct!"
                        : "❌ Wrong! "
                      : ""}
                  </p>
                  {pastQuestionsOption[indexOfFirstQuestion + index] && (
                    <button
                      className="viewmore-btn"
                      disabled={loading}
                      onClick={() =>
                        handleViewExplanation(
                          item.number,
                          item.question,
                          item.passage,
                          item.options,
                          item.subheadingA,
                          item.subheadingB,
                          item.diagramUrlA,
                          item.diagramUrlB,
                          index,
                        )
                      }
                    >
                      {loading === index ? (
                        <ClipLoader color="black" size={16} />
                      ) : (
                        "view explanation"
                      )}
                    </button>
                  )}
                </div>
              </ul>
            </div>
          );
        })
      ) : (
        <p className="pastquestionanswer">
          No questions available. please try again
        </p>
      )}

      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <IoIosArrowBack size={25} />
          Previous
        </button>
        <span className="pagination-info">
          page {currentPage} of {Math.ceil(questions.length / questionsPerPage)}
        </span>
        {currentPage === Math.ceil(questions.length / questionsPerPage) ? (
          <button
            onClick={() => {
              const result = calculateScore();
              navigate("/past-questions/result", {
                state: result,
              });
            }}
            className="pagination-button1"
          >
            Finish
          </button>
        ) : (
          <button onClick={handleNextPage} className="pagination-button1">
            Next
            <IoIosArrowForward size={25} />
          </button>
        )}
      </div>
    </main>
  );
};

export default ViewPastQuestion;
