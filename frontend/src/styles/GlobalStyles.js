import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #FDF2E9 0%, #FAE5D3 100%);
    color: #2C3E50;
    line-height: 1.6;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
  }

  :root {
    /* Warm color palette for Ferrosocial */
    --primary-orange: #FF6B35;
    --secondary-red: #E74C3C;
    --accent-yellow: #F39C12;
    --warm-cream: #FDF2E9;
    --light-peach: #FAE5D3;
    --soft-coral: #FF8A65;
    --deep-orange: #D84315;
    --warm-gray: #5D4E75;
    --light-gray: #F8F9FA;
    --text-dark: #2C3E50;
    --text-light: #7F8C8D;
    --white: #FFFFFF;
    --shadow-light: rgba(255, 107, 53, 0.1);
    --shadow-medium: rgba(255, 107, 53, 0.2);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--warm-cream);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--soft-coral);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-orange);
  }
`;