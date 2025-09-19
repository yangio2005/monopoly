import React, { useState, useEffect, useRef } from 'react';
import './CalculatorInput.css';

const CalculatorInput = ({ value, onChange, onEqualsClick }) => {
  const [expression, setExpression] = useState(value ? String(value) : '');
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);
  const inputRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    if (isResultDisplayed && String(value) !== expression) {
      setExpression(String(value));
      setCursorPosition(String(value).length);
    }
  }, [value, isResultDisplayed, expression]);

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

    if (!isNaN(parseFloat(newValue)) && isFinite(parseFloat(newValue)) && !/[+\-*\/]/g.test(newValue)) {
      onChange(parseFloat(newValue));
    } else if (newValue === '') {
      onChange('');
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
    } else {
      newExpression = insertAtCursor(expression, String(num), cursorPosition);
      newCursorPosition = cursorPosition + String(num).length;
    }
    setExpression(newExpression);
    setCursorPosition(newCursorPosition);
  }; // Added closing brace here

  const handleOperatorClick = (op) => {
    let newExpression = expression;
    let newCursorPosition = cursorPosition;

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
  const handleEqualsClick = () => {
    if (expression) {
      try {
        const lastChar = expression.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
          setExpression('Error');
          onChange('');
          setIsResultDisplayed(true);
          return;
        }
        const result = eval(expression);
        setExpression(String(result));
        onChange(result);
        setIsResultDisplayed(true);
        setCursorPosition(String(result).length);
        if (onEqualsClick) {
          onEqualsClick(result);
        }
      } catch (e) {
        setExpression('Error');
        onChange('');
        setIsResultDisplayed(true);
        setCursorPosition('Error'.length);
      }
    }
  };

  const handleClearClick = () => {
    setExpression('');
    onChange('');
    setIsResultDisplayed(false);
    setCursorPosition(0);
  };

  const handleBackspaceClick = () => {
    let newExpression = expression;
    let newCursorPosition = cursorPosition;

    if (isResultDisplayed) {
      newExpression = '';
      setIsResultDisplayed(false);
      newCursorPosition = 0;
    } else if (cursorPosition > 0 && expression.length > 0) {
      newExpression = expression.slice(0, cursorPosition - 1) + expression.slice(cursorPosition);
      newCursorPosition = cursorPosition - 1;
    }
    setExpression(newExpression);
    setCursorPosition(newCursorPosition);
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
          <button type="button" className="btn btn-secondary span-2" onClick={() => handleNumberClick(0)}>0</button>

          <button type="button" className="btn btn-success" onClick={handleEqualsClick}>=</button>
          <button type="button" className="btn btn-info" onClick={() => handleOperatorClick('+')}>+</button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorInput;
