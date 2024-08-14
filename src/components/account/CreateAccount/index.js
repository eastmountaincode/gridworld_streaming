import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useNotification } from '../../../context/NotificationContext';

const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  const navigate = useNavigate();

  // showNotification requires:
  // - message
  // - type (info, successs, warning, error)
  // - duration (ms)
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchSecurityQuestions();
  }, []);

  const fetchSecurityQuestions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/security_questions');
      const data = await response.json();
      const questions = data.records.map(record => record.question);
      setSecurityQuestions(questions);
    } catch (error) {
      console.error('Error fetching security questions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/create_account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          security_question: selectedQuestion,
          security_question_answer: securityAnswer,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Account created successfully
        showNotification('Account created successfully!', 'success', 5000);
        navigate('/');

      } else {
        // Handle errors
        if (data.message === 'Email already exists') {
          showNotification('This email is already registered. Please use a different email or try logging in.', 'error', 5000);
        } else {
          showNotification(`Account creation failed: ${data.message}`, 'error', 5000);
        }

      }
    } catch (error) {
      console.error('Error creating account:', error);
      // Handle network errors
    }
  };
  

  return (
    <div className="create-account" style={{textAlign: 'left'}}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {/* START FORM */}
        {/* EMAIL */}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* PASSWORD */}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* SECURITY QUESTION */}
        <div>
          <label htmlFor="security-question">Security Question:</label>
          <select
            id="security-question"
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            required
          >
            <option value="">Select a question</option>
            {securityQuestions.map((q, index) => (
              <option key={index} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="security-answer">Answer:</label>
          <input
            type="text"
            id="security-answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            required
          />
        </div>
        {/* END FORM */}
        <button type="submit">Create Account</button>
      </form>
      <button onClick={() => showNotification("hello", "success", 5000)}>notify</button>
    </div>
  );
};

export default CreateAccount;

