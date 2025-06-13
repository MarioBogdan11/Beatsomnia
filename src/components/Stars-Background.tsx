import React from "react";

const STAR_COUNT = 80;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const StarsBackground: React.FC = () => {
  const stars = Array.from({ length: STAR_COUNT }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${randomBetween(0, 100)}vw`,
      top: `${randomBetween(0, 100)}vh`,
      width: `${randomBetween(1, 2.5)}px`,
      height: `${randomBetween(1, 2.5)}px`,
      animationDelay: `${randomBetween(0, 3)}s`
    };
    return <div className="star" style={style} key={i} />;
  });

  return (
    <div className="stars-bg" aria-hidden="true">
      {stars}
    </div>
  );
};

export default StarsBackground;