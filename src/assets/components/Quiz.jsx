import React, { useEffect, useState } from "react";

export default function Quiz({
  data,
  setStop,
  questionNumber,
  setQuestionNumber,
}) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState("answer");
  const [showCorrect, setShowCorrect] = useState(false);
  

  useEffect(() => {
    setQuestion(data[questionNumber - 1]);
    setShowCorrect(false); // Återställ inför varje ny fråga
  }, [data, questionNumber]);

  const delay = (duration, callback) => {
    setTimeout(() => {
      callback();
    }, duration);
  };

  const handleClick = (a) => {
    setSelectedAnswer(a);
    setClassName("answer active");

    // 1. Efter 1 sekund: Visa om spelarens val var rätt (grön) eller fel (röd)
    delay(1000, () => {
      setClassName(a.correct ? "answer correct" : "answer wrong");
    });

    // 2. Om svaret var fel: Vänta till 3.5 sekunder och avslöja då det rätta svaret mjukt
    if (!a.correct) {
      delay(3500, () => {
        setShowCorrect(true);
      });
    }

    // 3. Efter totalt 5 sekunder: Gå vidare till nästa fråga eller avsluta spelet
    delay(5500, () => {
      if (a.correct) {
        if (questionNumber === 15) {
          setStop(true);
        } else {
          setQuestionNumber((prev) => prev + 1);
          setSelectedAnswer(null);
        }
      } else {
        setStop(true);
      }
    });
  };

  return (
    <div className="quiz">
      <div className="question">{question?.question}</div>
      <div className={`answers ${selectedAnswer ? "disabled" : ""}`}>
        {question?.answers.map((a, index) => {
          let currentClass = "answer";

          if (selectedAnswer) {
            if (selectedAnswer === a) {
              // Den klickade knappen får statusen active/correct/wrong
              currentClass = className;
            } else if (a.correct && showCorrect) {
              // Om spelaren svarat fel visas det rätta svaret här efter delayen
              currentClass = "answer correct";
            }
          }

          return (
            <div
              key={index}
              className={currentClass}
              onClick={() => !selectedAnswer && handleClick(a)}
            >
              {a.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}