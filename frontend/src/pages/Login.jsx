import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Logo } from '../components/Logo';
import { useAuth } from '../hooks/useAuth.jsx';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--warm-cream) 0%, var(--light-peach) 100%);
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px var(--shadow-medium);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-dark);
  font-size: 14px;
`;

const Input = styled.input`
  padding: 16px;
  border: 2px solid var(--light-peach);
  border-radius: 12px;
  font-size: 16px;
  background: var(--white);
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--primary-orange);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  &::placeholder {
    color: var(--text-light);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px var(--shadow-medium);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.1);
  color: var(--secondary-red);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-top: -10px;
`;

const SignUpLink = styled.div`
  margin-top: 20px;
  color: var(--text-light);
  font-size: 14px;

  a {
    color: var(--primary-orange);
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const WelcomeText = styled.h2`
  color: var(--text-dark);
  margin-top: 20px;
  font-size: 24px;
  font-weight: 600;
`;

const SubText = styled.p`
  color: var(--text-light);
  margin-top: 8px;
  font-size: 16px;
`;

export const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login({
      username: formData.username,
      password: formData.password
    });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo size="large" />
        <WelcomeText>Welcome Back!</WelcomeText>
        <SubText>Sign in to continue sharing warm moments</SubText>
        
        <LoginForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username or Email</Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username or email"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </SubmitButton>
        </LoginForm>

        <SignUpLink>
          Don't have an account? <Link to="/register">Sign up</Link>
        </SignUpLink>
      </LoginCard>
    </LoginContainer>
  );
};