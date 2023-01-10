import React, { useEffect, useState } from "react";
import "./index.css";

// Math science
const utils = {
  // Sum an array
  sum: (arr) => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

const colors = {
  used: "lightgreen",
  wrong: "lightcoral",
  selected: "deepskyblue",
  candidate: "deepskyblue",
};

const PlayNumber = (props) => (
  <button
    className="number"
    style={{ backgroundColor: colors[props.status] }}
    onClick={() => {
      props.onClick(props.number, props.status);
    }}
  >
    {props.number}
  </button>
);

const StarDisplay = (props) => (
  <>
    {utils.range(1, props.count).map((starId) => (
      <div key={starId} className="star" />
    ))}
  </>
);

const PlayAgain = (props) => {
  return (
    <div className="game-done">
      <div className="message">
        {props.gameStatus === "lost" ? "GAME OVER" : "YOU WIN THE GAME"}
      </div>
      <button onClick={props.onClick}>Play again</button>
    </div>
  );
};

//custom hooks.
const useGameState = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidatesNums] = useState([]);
  const [secondsLeft, setSecondLeft] = useState(10);

  //sideEffect timer
  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondLeft(secondsLeft - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }

    return () => {};
  });

  const setGameState = (newCandidateNums) => {
    if (utils.sum(newCandidateNums) !== stars) {
      //if candidate number is not equal to starnumber just add new candidate number in array.
      setCandidatesNums(newCandidateNums);
    } else {
      //if candidate number is equal to star number remove the candidate number from available number as new star will generate.
      const newAvailableNums = availableNums.filter(
        (n) => !newCandidateNums.includes(n)
      );
      //redraw the star but only draw the number of star that are playable.
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      //also reset the candidate number array.
      setCandidatesNums([]);
    }
  };
  return {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  };
};

function GameStarMatch(props) {
  //using custom hook to manage the state of gamestarmatch component.
  const { stars, availableNums, candidateNums, secondsLeft, setGameState } =
    useGameState();

  //other logic.
  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  //current game status.
  const gameStatus =
    availableNums.length === 0 ? "won" : secondsLeft === 0 ? "lost" : "active";

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) return "used";
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? "wrong" : "candidate";
    }
    return "available";
  };

  const onNumberClick = (number, currentStatus) => {
    // if used do nothing.
    if (gameStatus !== "active" || currentStatus == "used") return;
    //candidate nums
    // if number is pressed and is status= available directly put it as candidate but if that number is pressed and status = wrong remove it
    //from the candidate. the logic to display number as red flag is by summng the candidate number is less display blue if greted display red
    // and if equal remove from available num and display green and re print new stars.

    const newCandidateNums =
      currentStatus === "available"
        ? candidateNums.concat(number)
        : candidateNums.filter((cn) => cn !== number);

    setGameState(newCandidateNums);
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== "active" ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
          ) : (
            <StarDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map((number) => (
            <PlayNumber
              key={number}
              number={number}
              status={numberStatus(number)}
              onClick={onNumberClick}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time remaining : {secondsLeft}s</div>
    </div>
  );
}

export default GameStarMatch;
