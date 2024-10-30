import React, { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card } from 'antd'; // Import Button, Form, Input, and Card from antd

const Login = () => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Context
  const { showNotification } = useNotification();
  const { login } = useAuth();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        // store the token and the userData in AuthContext
        login(data.token, data.userData);
        showNotification('Login successful', 'success');
        navigate('/', { replace: true });

      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Login failed', 'error');
      }
    } catch (error) {
      showNotification('An error occurred during login', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 20px' }}>
      <Card title="Login" bordered={true} style={{ width: 400 }}>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false} // Remove the red asterisk for required fields
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ fontSize: '16px' }}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize: '16px' }}

            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: '10px', textAlign: 'left' }}>
          <Link to="/forgot-password">Forgot Password</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;