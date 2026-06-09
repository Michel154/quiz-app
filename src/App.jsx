import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./test-style.css";
import Quiz from "./assets/components/Quiz";
import Timer from "./assets/components/Timer";
import Start from "./assets/components/Start";
import { FootballData } from "./assets/components/FootballData";

function App() {
  const [userName, setUsername] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [stop, setStop] = useState(false);
  const [earned, setEarned] = useState(" $ 0");
  const [data, setData] = useState([]);

  const useApi = false;

  useEffect(() => {
    if (useApi) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(
            "https://opentdb.com/api.php?amount=15&type=multiple",
          );
          const result = await response.json();

          const formattedData = result.results.map((item, index) => {
            const answers = [...item.incorrect_answers];
            const randomIndex = Math.floor(Math.random() * 4);
            answers.splice(randomIndex, 0, item.correct_answer);

            return {
              id: index + 1,
              question: decodeURIComponent(item.question),
              answers: answers.map((answer) => ({
                text: decodeURIComponent(answer),
                correct: answer === item.correct_answer,
              })),
            };
          });
          setData(formattedData);
        } catch (err) {
          console.error("Error fetching questions:", err);
        }
      };

      fetchQuestions();
    } else {
      const shuffledQuestions = [...FootballData]
        .sort(() => Math.random() - 0.5) // Blandar listan
        .slice(0, 15) // Väljer ut 15 stycken
        .map((question, index) => ({
          ...question,
          id: index + 1, // Ger dem nya ID:n 1-15 för att matcha pyramiden
        }));

      setData(shuffledQuestions);
    }
  }, [useApi, userName]); // Laddar om när en ny användare startar

  const moneyPyramid = useMemo(
    () =>
      [
        { id: 1, amount: "$ 100 " },
        { id: 2, amount: "$ 200 " },
        { id: 3, amount: "$ 300 " },
        { id: 4, amount: "$ 500 " },
        { id: 5, amount: "$ 1000 " },
        { id: 6, amount: "$ 2000 " },
        { id: 7, amount: "$ 4000 " },
        { id: 8, amount: "$ 8000 " },
        { id: 9, amount: "$ 16000 " },
        { id: 10, amount: "$ 32000 " },
        { id: 11, amount: "$ 64000 " },
        { id: 12, amount: "$ 125000 " },
        { id: 13, amount: "$ 250000 " },
        { id: 14, amount: "$ 500000 " },
        { id: 15, amount: "$ 1000000 " },
      ].reverse(),
    [],
  );

  useEffect(() => {
    if (questionNumber > 1) {
      const currentLevel = moneyPyramid.find(
        (m) => m.id === questionNumber - 1,
      );
      if (currentLevel) {
        setEarned(currentLevel.amount);
      }
    }
  }, [moneyPyramid, questionNumber]);

  return (
    <Router>
      <Routes>
        {/* STARTSIDAN (/) */}
        <Route
          path="/"
          element={
            <div className="app">
              <Start setUsername={setUsername} />
            </div>
          }
        />

        {/* QUIZSIDAN (/quiz) */}
        <Route
          path="/quiz"
          element={
            /* Skyddar sidan: Om man inte skrivit namn skickas man tillbaka till start */
            !userName ? (
              <Navigate to="/" />
            ) : (
              <div className="app">
                <div className="main">
                  {stop ? (
                    <div className="endScreen">
                      <h1 className="endText">Resultat för {userName}</h1>
                      <h2 className="earnedText">Du vann: {earned}</h2>
                      <button
                        className="restartBtn"
                        onClick={() => window.location.reload()}
                      >
                        Spela igen
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="top">
                        <div className="timer">
                          <Timer
                            setStop={setStop}
                            questionNumber={questionNumber}
                          />
                        </div>
                      </div>
                      <div className="bottom">
                        {data.length > 0 ? (
                          <Quiz
                            data={data}
                            setStop={setStop}
                            questionNumber={questionNumber}
                            setQuestionNumber={setQuestionNumber}
                          />
                        ) : (
                          <h2>Laddar frågor...</h2>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="pyramid">
                  <ul className="moneyList">
                    {moneyPyramid.map((m) => (
                      <li
                        key={m.id}
                        className={
                          questionNumber === m.id
                            ? "moneyListItem active"
                            : "moneyListItem"
                        }
                      >
                        <span className="moneyListItemNumber">{m.id}</span>
                        <span className="moneyListItemAmount">{m.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
