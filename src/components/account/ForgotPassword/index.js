import React, { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card } from 'antd'; // Import Button, Form, Input, and Card from antd

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showNotification } = useNotification();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();

  const handleBack = () => {
    setStep(step - 1);
  }

  const handleEmailSubmit = async (values) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
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

  const handleSecurityAnswerSubmit = async (values) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/answer-security-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, answer: values.answer }),
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

  const handlePasswordReset = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword: values.newPassword }),
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
    <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 20px' }}>
      <Card title="Forgot Password" bordered={true} style={{ width: 400 }}>
        {step > 1 && (
          <Button onClick={handleBack} icon={<FaArrowLeft />} style={{ marginBottom: '20px' }}>
            Back
          </Button>
        )}
        {step === 1 && (
          <Form onFinish={handleEmailSubmit} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
        {step === 2 && (
          <Form onFinish={handleSecurityAnswerSubmit} layout="vertical">
            <p>{securityQuestion}</p>
            <Form.Item
              label="Answer"
              name="answer"
              rules={[{ required: true, message: 'Please enter your answer' }]}
            >
              <Input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
        {step === 3 && (
          <Form onFinish={handlePasswordReset} layout="vertical">
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, message: 'Please enter your new password' }]}
            >
              <Input.Password
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your new password' }]}
            >
              <Input.Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;