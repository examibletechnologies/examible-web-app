import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { FaCalculator, FaTimes } from "react-icons/fa";
import "../styles/calculator.css";

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  // Dragging states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef(null);

  const handlePointerDown = (e) => {
    // Only allow left click for mouse events
    if (e.type === "mousedown" && e.button !== 0) return;

    setIsDragging(true);
    setHasMoved(false);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragStart.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const rawX = clientX - dragStart.current.x;
      const rawY = clientY - dragStart.current.y;
      let newX = rawX;
      let newY = rawY;

      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth;
        const height = wrapperRef.current.offsetHeight;
        const offsetLeft = wrapperRef.current.offsetLeft;
        const offsetTop = wrapperRef.current.offsetTop;
        const padding = 10;

        let minX = padding - offsetLeft;
        let maxX = window.innerWidth - padding - width - offsetLeft;

        let minY = padding - offsetTop;
        let maxY = window.innerHeight - padding - height - offsetTop;

        if (minX > maxX) minX = maxX;
        if (minY > maxY) minY = maxY;

        if (newX > maxX) newX = maxX;
        if (newX < minX) newX = minX;
        if (newY > maxY) newY = maxY;
        if (newY < minY) newY = minY;
      }

      // Only consider it a drag if moved more than 3px
      if (Math.abs(rawX - position.x) > 3 || Math.abs(rawY - position.y) > 3) {
        setHasMoved(true);
      }

      setPosition({
        x: newX,
        y: newY,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove, {
        passive: false,
      });
      window.addEventListener("touchend", handlePointerUp);
    }

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging]);

  useLayoutEffect(() => {
    const adjustBounds = () => {
      if (!wrapperRef.current) return;
      const width = wrapperRef.current.offsetWidth;
      const height = wrapperRef.current.offsetHeight;
      const offsetLeft = wrapperRef.current.offsetLeft;
      const offsetTop = wrapperRef.current.offsetTop;
      const padding = 10;

      let minX = padding - offsetLeft;
      let maxX = window.innerWidth - padding - width - offsetLeft;

      let minY = padding - offsetTop;
      let maxY = window.innerHeight - padding - height - offsetTop;

      if (minX > maxX) minX = maxX;
      if (minY > maxY) minY = maxY;

      setPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        if (newX > maxX) newX = maxX;
        if (newX < minX) newX = minX;
        if (newY > maxY) newY = maxY;
        if (newY < minY) newY = minY;

        if (newX !== prev.x || newY !== prev.y) {
          return { x: newX, y: newY };
        }
        return prev;
      });
    };

    adjustBounds();
    window.addEventListener("resize", adjustBounds);
    return () => window.removeEventListener("resize", adjustBounds);
  }, [isOpen]);

  const toggleOpen = () => {
    if (!hasMoved) {
      setIsOpen(true);
    }
  };

  const handleButtonClick = (value) => {
    // Prevents building up error text if an operation fails
    if (input === "Error") {
      setInput(value);
    } else {
      setInput((prev) => prev + value);
    }
  };

  const handleClear = () => {
    setInput("");
  };

  const handleCalculate = () => {
    if (!input) return;
    try {
      // Filter out anything that isn't a valid math character to ensure safe evaluation
      const sanitizedInput = input.replace(/[^-()\d/*+.]/g, "");
      // Evaluate the math expression safely
      const result = new Function("return " + sanitizedInput)();
      setInput(String(result));
    } catch (error) {
      setInput("Error");
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`calculator-wrapper ${isOpen ? "open" : ""}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {!isOpen && (
        <button
          className="calc-toggle-btn"
          onClick={toggleOpen}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          title="Open Calculator"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <FaCalculator size={24} />
        </button>
      )}

      {isOpen && (
        <div className="calculator-container">
          <div
            className="calculator-header"
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
          >
            <span>Calculator</span>
            <FaTimes
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title="Close Calculator"
            />
          </div>
          <div className="calculator-display">{input || "0"}</div>
          <div className="calculator-keypad">
            <button onClick={handleClear} className="calc-btn clear">
              C
            </button>
            <button onClick={() => handleButtonClick("(")} className="calc-btn">
              (
            </button>
            <button onClick={() => handleButtonClick(")")} className="calc-btn">
              )
            </button>
            <button
              onClick={() => handleButtonClick("/")}
              className="calc-btn operator"
            >
              &divide;
            </button>

            <button onClick={() => handleButtonClick("7")} className="calc-btn">
              7
            </button>
            <button onClick={() => handleButtonClick("8")} className="calc-btn">
              8
            </button>
            <button onClick={() => handleButtonClick("9")} className="calc-btn">
              9
            </button>
            <button
              onClick={() => handleButtonClick("*")}
              className="calc-btn operator"
            >
              &times;
            </button>

            <button onClick={() => handleButtonClick("4")} className="calc-btn">
              4
            </button>
            <button onClick={() => handleButtonClick("5")} className="calc-btn">
              5
            </button>
            <button onClick={() => handleButtonClick("6")} className="calc-btn">
              6
            </button>
            <button
              onClick={() => handleButtonClick("-")}
              className="calc-btn operator"
            >
              &minus;
            </button>

            <button onClick={() => handleButtonClick("1")} className="calc-btn">
              1
            </button>
            <button onClick={() => handleButtonClick("2")} className="calc-btn">
              2
            </button>
            <button onClick={() => handleButtonClick("3")} className="calc-btn">
              3
            </button>
            <button
              onClick={() => handleButtonClick("+")}
              className="calc-btn operator"
            >
              +
            </button>

            <button
              onClick={() => handleButtonClick("0")}
              className="calc-btn zero"
            >
              0
            </button>
            <button onClick={() => handleButtonClick(".")} className="calc-btn">
              .
            </button>
            <button onClick={handleCalculate} className="calc-btn equal">
              =
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
