"use client";
import Spline from '@splinetool/react-spline';

const ThreeDModel = () => {
  return (
    <div className="w-full h-[500px] lg:h-[600px]">
      <Spline
        scene="https://prod.spline.design/Yq8y885oPlH9dVOi/scene.splinecode" 
      />
    </div>
  );
};

export default ThreeDModel;
