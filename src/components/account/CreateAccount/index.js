import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { Button, Form, Input, Select, Card } from 'antd';

const { Option } = Select;

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
  // - duration (ms) (optional)
  const { showNotification } = useNotification();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchSecurityQuestions();
  }, []);

  const fetchSecurityQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/security-questions`);
      const data = await response.json();
      const questions = data.records.map(record => record.question);
      setSecurityQuestions(questions);
    } catch (error) {
      console.error('Error fetching security questions:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          security_question: values.securityQuestion,
          security_question_answer: values.securityAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Account created successfully
        showNotification('Account created successfully!', 'success');
        navigate('/');
      } else {
        // Handle errors
        if (data.message === 'Email already exists') {
          showNotification('This email is already registered. Please use a different email or try logging in.', 'error', 5000);
        } else {
          showNotification(`Account creation failed: ${data.message}`, 'error');
        }
      }
    } catch (error) {
      console.error('Error creating account:', error);
      // Handle network errors
      showNotification('An error occurred. Please try again.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 20px' }}>
      <Card title="Create Account" bordered={true} style={{ width: 400 }}>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          {/* EMAIL */}
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
          {/* PASSWORD */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          {/* SECURITY QUESTION */}
          <Form.Item
            label="Security Question"
            name="securityQuestion"
            rules={[{ required: true, message: 'Please select a security question' }]}
          >
            <Select
              value={selectedQuestion}
              onChange={(value) => setSelectedQuestion(value)}
            >
              <Option value="">Select a question</Option>
              {securityQuestions.map((q, index) => (
                <Option key={index} value={q}>
                  {q}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Answer"
            name="securityAnswer"
            rules={[{ required: true, message: 'Please enter your answer' }]}
          >
            <Input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
            />
          </Form.Item>
          {/* END FORM */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAccount;