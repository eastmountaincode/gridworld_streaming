import React, { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { showNotification } = useNotification();

    const navigate = useNavigate();

    const handleBack = () => {
        setStep(step - 1);
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:3001/api/auth/forgot-password/check-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
          const data = await response.json();
          if (response.ok) {
            setSecurityQuestion(data.securityQuestion);
            setStep(2);
          } else {
            showNotification(data.message, 'error');
          }
        } catch (error) {
          showNotification('An error occurred. Please try again.', 'error');
        }
      };
      

      const handleSecurityAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:3001/api/auth/forgot-password/answer-security-question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, answer: securityAnswer }),
          });
          const data = await response.json();
          if (response.ok) {
            setStep(3);
          } else {
            showNotification(data.message, 'error');
          }
        } catch (error) {
          showNotification('An error occurred. Please try again.', 'error');
        }
      };

      const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
          showNotification('Passwords do not match', 'error');
          return;
        }
        try {
          const response = await fetch('http://localhost:3001/api/auth/forgot-password/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword }),
          });
          const data = await response.json();
          if (response.ok) {
            showNotification('Password reset successful', 'success');
            navigate('/login', { replace: true });
          } else {
            showNotification(data.message, 'error');
          }
        } catch (error) {
          showNotification('An error occurred. Please try again.', 'error');
        }
      };

    return (
        <div>
            {step > 1 && (
                <button onClick={handleBack} className="back-button">
                    <FaArrowLeft /> Back
                </button>
            )}
            {step === 1 && (
                <form onSubmit={handleEmailSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <button type="submit" onClick={handleEmailSubmit}>Submit</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleSecurityAnswerSubmit}>
                    <p>{securityQuestion}</p>
                    <input
                        type="text"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        placeholder="Your answer"
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handlePasswordReset}>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
