import React, { useState, useEffect, useRef } from 'react';
import { evaluate } from 'mathjs';

const CalculatorInput = ({ value, onValueChange, onCalculatedValue }) => {
  const [expression, setExpression] = useState(value ? String(value) : '');
  const [calculatedResult, setCalculatedResult] = useState(null);
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);
  const inputRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    // Update internal expression if external value changes
    if (String(value) !== expression) {
      setExpression(String(value));
      setCalculatedResult(null); // Clear calculated result if external value changes
      setIsResultDisplayed(false);
    }
  }, [value]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, expression]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setExpression(newValue);
    setCursorPosition(e.target.selectionStart);
    setIsResultDisplayed(false);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const handleInputSelect = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const insertAtCursor = (mainString, stringToInsert, cursorPos) => {
    return mainString.slice(0, cursorPos) + stringToInsert + mainString.slice(cursorPos);
  };

  const handleNumberClick = (num) => {
    let newExpression;
    let newCursorPosition;

    if (isResultDisplayed || expression === '0') {
      newExpression = String(num);
      newCursorPosition = newExpression.length;
      setIsResultDisplayed(false);
      setCalculatedResult(null);
    } else {
      newExpression = insertAtCursor(expression, String(num), cursorPosition);
      newCursorPosition = cursorPosition + String(num).length;
    }
    setExpression(newExpression);
    setCursorPosition(newCursorPosition);
    if (onValueChange) {
      onValueChange(newExpression);
    }
  };

  const handleOperatorClick = (op) => {
    let newExpression = expression;
    let newCursorPosition = cursorPosition;

    // Prevent adding operator if expression is empty, unless it's a minus sign for negative numbers
    if (!expression && op !== '-') {
      return;
    }

    if (isResultDisplayed) {
      newExpression = expression + op;
      newCursorPosition = newExpression.length;
      setIsResultDisplayed(false);
    } else {
      const lastChar = expression.slice(cursorPosition - 1, cursorPosition);
      const nextChar = expression.slice(cursorPosition, cursorPosition + 1);

      if (['+', '-', '*', '/'].includes(op)) {
        // Prevent inserting operator if cursor is after an operator
        if (['+', '-', '*', '/'].includes(lastChar) && cursorPosition > 0) {
          newExpression = expression.slice(0, cursorPosition - 1) + op + expression.slice(cursorPosition);
        } else if (['+', '-', '*', '/'].includes(nextChar) && cursorPosition < expression.length) {
          newExpression = expression.slice(0, cursorPosition) + op + expression.slice(cursorPosition + 1);
          newCursorPosition = cursorPosition + op.length;
        } else {
          newExpression = insertAtCursor(expression, op, cursorPosition);
          newCursorPosition = cursorPosition + op.length;
        }
      } else {
        newExpression = insertAtCursor(expression, op, cursorPosition);
        newCursorPosition = cursorPosition + op.length;
      }
    }
    setExpression(newExpression);
    setCursorPosition(newCursorPosition);
  };

  const handleDecimalClick = () => {
    let newExpression = expression;
    let newCursorPosition = cursorPosition;

    if (isResultDisplayed) {
      newExpression = '0.';
      newCursorPosition = 2;
      setIsResultDisplayed(false);
    } else {
      // Prevent multiple decimals in a single number segment
      const parts = newExpression.substring(0, cursorPosition).split(/[+\-*\/]/);
      const currentNumber = parts[parts.length - 1];
      if (!currentNumber.includes('.')) {
        newExpression = insertAtCursor(newExpression, '.', cursorPosition);
        newCursorPosition = cursorPosition + 1;
      }
    }
    setExpression(newExpression);
    setCursorPosition(newCursorPosition);
  };
  const handleEqualsClick = () => {
    if (expression) {
      try {
        const lastChar = expression.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
          setExpression('Error');
          if (onValueChange) {
            onValueChange('Error');
          }
          if (onCalculatedValue) {
            onCalculatedValue(null);
          }
          setIsResultDisplayed(true);
          setCalculatedResult(null);
          return;
        }

        let result;
        // Check if the expression is a simple integer (Flow 1 - part 1)
        if (/^\d+$/.test(expression)) {
          result = parseInt(expression, 10);
        } else {
          // Evaluate the expression (Flow 1 - part 2)
          result = evaluate(expression);
        }

        // Ensure the result is an integer (Flow 1 - part 3)
        if (typeof result === 'number' && !Number.isInteger(result)) {
          result = Math.floor(result); // Or Math.round(result) depending on game rules
        }

        setExpression(String(result));
        setCalculatedResult(result);
        setIsResultDisplayed(true);
        setCursorPosition(String(result).length);
        if (onCalculatedValue) {
          onCalculatedValue(result);
        }
      } catch (e) {
        setExpression('Error');
        setIsResultDisplayed(true);
        setCursorPosition('Error'.length);
        if (onCalculatedValue) {
          onCalculatedValue(null);
        }
        setCalculatedResult(null);
      }
    }
  };

  const handleClearClick = () => {
    setExpression('');
    setCalculatedResult(null);
    setIsResultDisplayed(false);
    setCursorPosition(0);
    if (onValueChange) {
      onValueChange('');
    }
    if (onCalculatedValue) {
      onCalculatedValue(null);
    }
  };

  const handleBackspaceClick = () => {
    let newExpression = expression;
    let newCursorPosition = cursorPosition;

    if (isResultDisplayed) {
      setIsResultDisplayed(false);
      newExpression = '';
      newCursorPosition = 0;
      setCalculatedResult(null);
    } else if (cursorPosition > 0 && expression.length > 0) {
      newExpression = expression.slice(0, cursorPosition - 1) + expression.slice(cursorPosition);
      newCursorPosition = cursorPosition - 1;
    } else {
      newExpression = expression;
      newCursorPosition = cursorPosition;
    }
    setExpression(newExpression);
    setCursorPosition(newCursorPosition);
    if (onValueChange) {
      onValueChange(newExpression);
    }
    if (newExpression === '') {
      if (onCalculatedValue) {
        onCalculatedValue(null);
      }
    }
  };

  const Button = ({ onClick, children, className = '', variant = 'default' }) => {
    const variants = {
      default: 'bg-gray-800 text-cyan-400 border-gray-700 hover:bg-gray-700 hover:border-cyan-500 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]',
      operator: 'bg-gray-900 text-purple-400 border-gray-800 hover:bg-gray-800 hover:border-purple-500 hover:shadow-[0_0_10px_rgba(192,132,252,0.3)]',
      action: 'bg-red-900/30 text-red-400 border-red-900/50 hover:bg-red-900/50 hover:border-red-500 hover:shadow-[0_0_10px_rgba(248,113,113,0.3)]',
      success: 'bg-green-900/30 text-green-400 border-green-900/50 hover:bg-green-900/50 hover:border-green-500 hover:shadow-[0_0_10px_rgba(74,222,128,0.3)]',
    };

    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          relative overflow-hidden p-4 text-xl font-mono font-bold border rounded-lg transition-all duration-200 active:scale-95
          ${variants[variant]}
          ${className}
        `}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      </button>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-1 bg-gradient-to-b from-cyan-500/20 to-purple-500/20 rounded-2xl backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="bg-gray-900/90 p-4 rounded-xl border border-white/5">
        {/* Display Screen */}
        <div className="relative mb-4 p-4 bg-black rounded-lg border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
          <input
            type="text"
            className="w-full bg-transparent text-right text-3xl font-mono text-cyan-400 placeholder-cyan-900 focus:outline-none"
            value={expression}
            onChange={handleInputChange}
            onSelect={handleInputSelect}
            ref={inputRef}
            placeholder="0"
          />
          {calculatedResult !== null && (
            <div className="text-right text-purple-400 font-mono text-sm mt-1 animate-pulse">
              Bill: {calculatedResult}
            </div>
          )}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          <Button onClick={() => handleNumberClick(7)}>7</Button>
          <Button onClick={() => handleNumberClick(8)}>8</Button>
          <Button onClick={() => handleNumberClick(9)}>9</Button>
          <Button onClick={() => handleOperatorClick('/')} variant="operator">/</Button>

          <Button onClick={() => handleNumberClick(4)}>4</Button>
          <Button onClick={() => handleNumberClick(5)}>5</Button>
          <Button onClick={() => handleNumberClick(6)}>6</Button>
          <Button onClick={() => handleOperatorClick('*')} variant="operator">*</Button>

          <Button onClick={() => handleNumberClick(1)}>1</Button>
          <Button onClick={() => handleNumberClick(2)}>2</Button>
          <Button onClick={() => handleNumberClick(3)}>3</Button>
          <Button onClick={() => handleOperatorClick('-')} variant="operator">-</Button>

          <Button onClick={handleClearClick} variant="action">C</Button>
          <Button onClick={handleBackspaceClick} variant="action">DEL</Button>
          <Button onClick={() => handleNumberClick('0')}>0</Button>
          <Button onClick={() => handleOperatorClick('+')} variant="operator">+</Button>

          <Button onClick={() => handleNumberClick('000')} className="col-span-2">000</Button>
          <Button onClick={handleDecimalClick}>.</Button>
          <Button onClick={handleEqualsClick} variant="success">=</Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorInput;
