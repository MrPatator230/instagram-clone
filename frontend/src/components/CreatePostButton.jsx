import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlusCircle } from 'react-icons/fi';

const CreateButtonContainer = styled.div`
  margin-bottom: 30px;
`;

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 8px 20px var(--shadow-medium);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px var(--shadow-medium);
  }

  svg {
    font-size: 20px;
  }
`;

const CreateText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

export const CreatePostButton = ({ onPostCreated }) => {
  return (
    <CreateButtonContainer>
      <CreateButton to="/create">
        <FiPlusCircle />
        <CreateText>Share a warm moment</CreateText>
      </CreateButton>
    </CreateButtonContainer>
  );
};