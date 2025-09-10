import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: ${props => props.size === 'large' ? '2rem' : '1.5rem'};
  color: var(--primary-orange);
`;

const LogoIcon = styled.div`
  width: ${props => props.size === 'large' ? '40px' : '32px'};
  height: ${props => props.size === 'large' ? '40px' : '32px'};
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${props => props.size === 'large' ? '24px' : '18px'};
  box-shadow: 0 4px 12px var(--shadow-medium);
`;

const LogoText = styled.span`
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.5px;
`;

export const Logo = ({ size = 'normal', showText = true }) => {
  return (
    <LogoContainer size={size}>
      <LogoIcon size={size}>
        🔥
      </LogoIcon>
      {showText && <LogoText>Ferrosocial</LogoText>}
    </LogoContainer>
  );
};