/** @jsxImportSource @emotion/react */
import {keyframes} from '@emotion/react';
import styled from '@emotion/styled';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const AnimatedBackground = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(270deg, #50dcff, #fa5aff, #64ffda);
  background-size: 600% 600%;
  animation: ${gradientAnimation} 16s ease infinite;
`;

export default AnimatedBackground;
