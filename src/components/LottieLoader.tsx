import React from 'react';
import Lottie from 'lottie-react';

interface LottieLoaderProps {
  animationData: object;
  loop?: boolean;
  style?: React.CSSProperties;
}

const LottieLoader: React.FC<LottieLoaderProps> = ({ animationData, loop = true, style }) => {
  return <Lottie animationData={animationData} loop={loop} style={style} />;
};

export default LottieLoader; 