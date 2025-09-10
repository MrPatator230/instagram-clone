import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Logo } from '../components/Logo';
import { useAuth } from '../hooks/useAuth.jsx';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--warm-cream) 0%, var(--light-peach) 100%);
`;

const RegisterCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px var(--shadow-medium);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const RegisterForm = styled.form`
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

const LoginLink = styled.div`
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

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const result = await register({
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
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
    <RegisterContainer>
      <RegisterCard>
        <Logo size="large" />
        <WelcomeText>Join Ferrosocial</WelcomeText>
        <SubText>Create an account to start sharing</SubText>
        
        <RegisterForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username *</Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email *</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name (optional)"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password *</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Create a secure password (min. 6 chars)"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </RegisterForm>

        <LoginLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};