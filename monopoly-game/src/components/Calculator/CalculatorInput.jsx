import React, { useState, useEffect, useRef } from 'react';
import { evaluate } from 'mathjs';
import './CalculatorInput.css';

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
  }; // Added closing brace here

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

  return (
    <div className="calculator card p-2 bg-dark text-white border-secondary">
      <div className="card-body p-0">
        <input
          type="text"
          className="form-control text-end mb-2 bg-dark text-white border-secondary"
          value={expression}
          onChange={handleInputChange}
          onSelect={handleInputSelect}
          ref={inputRef}
          style={{ fontSize: '1.2rem', height: '45px' }}
        />
        {calculatedResult !== null && (
          <div className="text-end text-muted mb-2" style={{ fontSize: '0.8rem' }}>
            Bill: {calculatedResult}
          </div>
        )}
        <div className="d-grid gap-1 calculator-grid">
          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick(7)}>7</button>
          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick(8)}>8</button>
          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick(9)}>9</button>
          <button type="button" className="btn btn-info" onClick={() => handleOperatorClick('/')}>/</button>

          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick(4)}>4</button>
          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick(5)}>5</button>
          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick(6)}>6</button>
          <button type="button" className="btn btn-info" onClick={() => handleOperatorClick('*')}>*</button>

          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick(1)}>1</button>
          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick(2)}>2</button>
          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick(3)}>3</button>
          <button type="button" className="btn btn-info" onClick={() => handleOperatorClick('-')}>-</button>

          <button type="button" className="btn btn-danger" onClick={handleClearClick}>C</button>
          <button type="button" className="btn btn-secondary" onClick={handleBackspaceClick}>DEL</button>
          <button type="button" className="btn btn-secondary span-2" onClick={() => handleNumberClick('0')}>0</button>
          <button type="button" className="btn btn-secondary" onClick={() => handleNumberClick('000')}>000</button>
          <button type="button" className="btn btn-secondary" onClick={handleDecimalClick}>.</button>

          <button type="button" className="btn btn-success" onClick={handleEqualsClick}>=</button>
          <button type="button" className="btn btn-info" onClick={() => handleOperatorClick('+')}>+</button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorInput;
