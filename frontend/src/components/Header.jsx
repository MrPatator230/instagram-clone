import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiPlusSquare, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { Logo } from './Logo';
import { useAuth } from '../hooks/useAuth.jsx';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 107, 53, 0.1);
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px var(--shadow-light);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 107, 53, 0.1);
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 10px 30px var(--shadow-light);
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dark);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--light-peach);
    color: var(--primary-orange);
    transform: translateY(-2px);
  }

  svg {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  color: var(--secondary-red);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(231, 76, 60, 0.1);
    transform: translateY(-2px);
  }

  svg {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  color: var(--primary-orange);
  padding: 8px;
  
  @media (max-width: 768px) {
    display: block;
  }

  svg {
    font-size: 24px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-dark);
  font-weight: 500;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
`;

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Link to="/" onClick={closeMobileMenu}>
          <Logo />
        </Link>

        <MobileMenuButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>

        <Navigation isOpen={isMobileMenuOpen}>
          <NavLink to="/" onClick={closeMobileMenu}>
            <FiHome />
            <span>Home</span>
          </NavLink>
          
          <NavLink to="/create" onClick={closeMobileMenu}>
            <FiPlusSquare />
            <span>Create</span>
          </NavLink>
          
          <NavLink to={`/profile/${user?.username}`} onClick={closeMobileMenu}>
            <FiUser />
            <span>Profile</span>
          </NavLink>

          <UserInfo>
            <span>Welcome, {user?.username}!</span>
          </UserInfo>

          <LogoutButton onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </LogoutButton>
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};