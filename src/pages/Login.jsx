import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';
import { fetchLatestUserProject } from '../api/projectAPI';

const LoginWrapper = styled.div`
  height: 100vh;
  background: url('/login_background.png') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', 'Open Sans', sans-serif;
`;

const LoginBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  border-radius: 24px;
  border: 1px solid rgba(123, 124, 124, 0.2);
  width: 360px;
  color: white;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  img {
    width: 64px;
    height: 64px;
  }

  h1 {
    margin: 0.5rem 0 0;
    font-size: 1.4rem;
    font-weight: bold;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #1e1e1e;
  color: white;
  outline: none;

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #007bff, #00c2ff);
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorMsg = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ForgotPassword = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: #cccccc;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #cccccc;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent form default reload
    try {
      const res = await loginUser({ email: email, password });
      console.log(res)
      const token = res.token;
      const userProject = await fetchLatestUserProject(token);
      const projectId = userProject._id;

      if (!token) throw new Error('Token not received');

      const decoded = jwtDecode(token);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(decoded));
      localStorage.setItem('projectId', projectId )
      
      navigate('/edit');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <LoginWrapper>
      <LoginBox>
        <Logo>
          <img src="/pagasa-logo.png" alt="PAGASA Logo" />
          <h1>PAGASA</h1>
          <p>Philippine Atmospheric, Geophysical and Astronomical Services Administration</p>
        </Logo>
        <Form onSubmit={handleLogin}>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ForgotPassword>Forgot password?</ForgotPassword>
          <Button type="submit">Log In</Button>
          <RegisterLink onClick={() => navigate('/register')}>
            Don't have an account? Register
          </RegisterLink>
        </Form>
      </LoginBox>
    </LoginWrapper>
  );
};

export default Login;
