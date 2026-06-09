import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Start({ setUsername }) {
  const inputRef = useRef();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    const inputValue = inputRef.current.value.trim();

    if (inputValue) {
      setUsername(inputValue);
      navigate("/quiz");
    } else {
      setError(true); // Om fältet är tomt, visa texten
    }
  };

  return (
    <div className="start">
      <input
        placeholder="Enter your name"
        className="startInput"
        ref={inputRef}
        onChange={() => setError(false)}
      />
      <button className="startButton" onClick={handleClick}>
        Start Quiz
      </button>

      {/* Visas bara om error är sant */}
      {error && (
        <span
          style={{
            color: "#ff4d4d",
            marginTop: "10px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Please enter your name!
        </span>
      )}
    </div>
  );
}
