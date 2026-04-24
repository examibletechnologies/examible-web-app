import { useState } from "react";
import "../../styles/dashboardCss/mockResult.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { cancelExam } from "../../global/slice";
import { useLocation, useNavigate } from "react-router-dom";
import { GrStatusGood } from "react-icons/gr";
import { GiCancel } from "react-icons/gi";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { getAiResponse } from "../../config/Api";
import { useExamibleContext } from "../../context/ExamibleContext";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

const MockResult = () => {
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const user = useSelector((state) => state.user);
  const exam = useSelector((state) => state.exam);
  const mockYear = useSelector((state) => state.mockYear);
  const [intialCount, setIntialCount] = useState(0);
  const [finalCount, setFinalCount] = useState(5);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(null);
  const location = useLocation();

  const { setShowAiResponseModal, setAIResponse } = useExamibleContext();

  const nextSeries = () => {
    setIntialCount(intialCount + 5);
    setFinalCount(finalCount + 5);
    window.scrollTo(0, 0);
  };

  const previousSeries = () => {
    setIntialCount(intialCount - 5);
    setFinalCount(finalCount - 5);
    window.scrollTo(0, 0);
  };

  const performance =
    (exam?.reduce((acc, item, index) => {
      if (!item?.score) {
        acc = acc + 0;
      } else {
        acc = acc + item?.score;
      }
      return acc;
    }, 0) /
      2 /
      mockExamQuestions?.length) *
    100;

  const retryExam = () => {
    dispatch(cancelExam());
    nav("/mock-exam");
  };

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
        mockYear,
        location.state.subject,
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
      setLoading(null);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(null);
    }
  };

  let questionDetails;

  return (
    <div className="mockResult">
      <h2>
        <span style={{ color: "#804bf2" }}>Mock Exam</span> (Jamb CBT Practice)
      </h2>
      <h2>Questions & Answers </h2>
      <h5>You Scored {performance.toFixed(0)} out of 100</h5>
      <div className="mockResult-holder">
        {mockExamQuestions
          ?.slice(intialCount, finalCount)
          .map((item, index) => {
            let newItem = {
              subheadingA: item?.subheadingA,
              subheadingB: item?.subheadingB,
              diagramUrlA: item?.diagramUrlA,
              diagramUrlB: item?.diagramUrlB,
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
              <main key={index}>
                {newItem?.subheadingA && (
                  <h2>
                    <Latex>{item?.subheadingA}</Latex>
                  </h2>
                )}
                {newItem?.diagramUrlA && (
                  <img src={item?.diagramUrlA} alt="Diagram loading..." />
                )}
                {newItem?.subheadingB && (
                  <h3>
                    <Latex>{item?.subheadingB}</Latex>
                  </h3>
                )}
                {newItem?.diagramUrlB && (
                  <img src={item?.diagramUrlB} alt="Diagram loading..." />
                )}
                <header>
                  <span>{item?.number}</span>. <Latex>{item?.question}</Latex>
                </header>
                <ul>
                  {item?.options[0] && (
                    <li>
                      <p>
                        <Latex>
                          {item?.options[0]?.startsWith("A.")
                            ? item?.options[0]
                            : "A. " + item?.options[0]}
                        </Latex>
                      </p>
                      <nav
                        style={{
                          display:
                            exam.slice(intialCount, finalCount)?.[index]
                              ?.option === "A"
                              ? "flex"
                              : "none",
                        }}
                      >
                        {exam.slice(intialCount, finalCount)?.[index]?.score ===
                        0 ? (
                          <GiCancel fontSize={25} color="red" />
                        ) : (
                          <GrStatusGood fontSize={25} color="green" />
                        )}
                      </nav>
                    </li>
                  )}
                  {item?.options[1] && (
                    <li>
                      <p>
                        <Latex>
                          {item?.options[1]?.startsWith("B.")
                            ? item?.options[1]
                            : "B. " + item?.options[1]}
                        </Latex>
                      </p>
                      <nav
                        style={{
                          display:
                            exam.slice(intialCount, finalCount)?.[index]
                              ?.option === "B"
                              ? "flex"
                              : "none",
                        }}
                      >
                        {exam.slice(intialCount, finalCount)?.[index]?.score ===
                        0 ? (
                          <GiCancel fontSize={25} color="red" />
                        ) : (
                          <GrStatusGood fontSize={25} color="green" />
                        )}
                      </nav>
                    </li>
                  )}
                  {item?.options[2] && (
                    <li>
                      <p>
                        <Latex>
                          {item?.options[2]?.startsWith("C.")
                            ? item?.options[2]
                            : "C. " + item?.options[2]}
                        </Latex>
                      </p>
                      <nav
                        style={{
                          display:
                            exam.slice(intialCount, finalCount)?.[index]
                              ?.option === "C"
                              ? "flex"
                              : "none",
                        }}
                      >
                        {exam.slice(intialCount, finalCount)?.[index]?.score ===
                        0 ? (
                          <GiCancel fontSize={25} color="red" />
                        ) : (
                          <GrStatusGood fontSize={25} color="green" />
                        )}
                      </nav>
                    </li>
                  )}
                  {item?.options[3] && (
                    <li>
                      <p>
                        <Latex>
                          {item?.options[3]?.startsWith("D.")
                            ? item?.options[3]
                            : "D. " + item?.options[3]}
                        </Latex>
                      </p>
                      <nav
                        style={{
                          display:
                            exam.slice(intialCount, finalCount)?.[index]
                              ?.option === "D"
                              ? "flex"
                              : "none",
                        }}
                      >
                        {exam.slice(intialCount, finalCount)?.[index]?.score ===
                        0 ? (
                          <GiCancel fontSize={25} color="red" />
                        ) : (
                          <GrStatusGood fontSize={25} color="green" />
                        )}
                      </nav>
                    </li>
                  )}
                  {item?.options[4] && (
                    <li>
                      <p>
                        <Latex>
                          {item?.options[4]?.startsWith("E.")
                            ? item?.options[3]
                            : "E. " + item?.options[4]}
                        </Latex>
                      </p>
                      <nav
                        style={{
                          display:
                            exam.slice(intialCount, finalCount)?.[index]
                              ?.option === "E"
                              ? "flex"
                              : "none",
                        }}
                      >
                        {exam.slice(intialCount, finalCount)?.[index]?.score ===
                        0 ? (
                          <GiCancel fontSize={25} color="red" />
                        ) : (
                          <GrStatusGood fontSize={25} color="green" />
                        )}
                      </nav>
                    </li>
                  )}
                </ul>
                <>
                  <div className="mockResult-scores">
                    {item?.answer ===
                    exam.slice(intialCount, finalCount)?.[index]?.answer ? (
                      <footer>You got the answer</footer>
                    ) : (
                      <footer>The answer is {item?.answer}</footer>
                    )}
                    <button
                      onClick={() => {
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
                        );
                      }}
                      disabled={loading}
                    >
                      {loading === index ? (
                        <ClipLoader color="black" size={16} />
                      ) : (
                        "view explanation"
                      )}
                    </button>
                  </div>
                </>
              </main>
            );
          })}
      </div>
      <div className="mockResult-button">
        <button
          style={{ display: intialCount > 0 ? "flex" : "none" }}
          className="mockResult-more"
          onClick={() => previousSeries()}
        >
          <IoIosArrowBack color="#88DDFF" fontSize={25} /> Previous
        </button>
        <button
          className="mockResult-retry"
          style={{
            display:
              intialCount === 0 || finalCount === mockExamQuestions?.length
                ? "flex"
                : "none",
          }}
          onClick={() => retryExam()}
        >
          Retry Quiz
        </button>
        <button
          className="mockResult-more"
          style={{
            display: finalCount < mockExamQuestions?.length ? "flex" : "none",
          }}
          onClick={() => nextSeries()}
        >
          See More
          <IoIosArrowForward color="#88DDFF" fontSize={25} />
        </button>
      </div>
    </div>
  );
};

export default MockResult;
