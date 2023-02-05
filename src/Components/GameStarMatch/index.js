import React, { useEffect, useState } from "react";
import StarDIsplay from "../starDisplay/StarDIsplay";
import { utils } from "../utils/utils"
import useGameState, { useuseGameState } from "../customHook/useGameState"

import "./index.css";


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

const PlayAgain = (props) => {
  return (
    <div className="game-done">
      <div className="message">
        {props.gameStatus === "lost" ? "GAME OVER" : "YOU WIN THE GAME"}
      </div>
      <button className="btnPlayAgain" onClick={props.onClick}>Play again</button>
    </div>
  );
};
const StartGame = (props) => {
  return (
    <div className="game-start">
      <button className="btnStart" onClick={props.onClick}>Start Game</button>
    </div>
  );
};

function GameStarMatch(props) {
  //using custom hook to manage the state of gamestarmatch component.
  const [stars, availableNums, candidateNums, secondsLeft, setGameState, setStartGame, startGame] =
    useGameState(utils);

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
    <div className="game" background="galaxy.jpg">
      <div className="container">

        <div className="title"> <h3> &#9733;&#9733; star war &#9733;&#9733;</h3></div>
        <div className="help">
          <h4>
            Pick one or more numbers that sum to the number of stars.
          </h4>
        </div>
        <div className="playGround">
          <div className="starDisplay">

            {gameStatus !== "active" ? (
              <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
            ) : startGame ? <StartGame onClick={() => {
              setStartGame(true)
            }} /> : (
              <StarDIsplay count={stars} />
            )}



          </div>
          <div className="timer"><p>Time remaining : {secondsLeft}s</p></div>
          <div className="numberDisplay">
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
      </div>
    </div>
  );
}

export default GameStarMatch;
