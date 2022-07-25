import React from 'react';

interface Props {
  score: number;
}

const EasyWins = ({ score }: Props) => {
  let color = 'gray';
  if (score === 0) {
    color = 'red';
  } else if (score > 2) {
    color = 'green';
  } else if (score === 1) {
    color = 'orange';
  } else if (score === 2) {
    color = 'teal';
  }

  return <div className={`text-${color}-600 font-semibold`}>{score}</div>;
};

export default EasyWins;
