import React, { useEffect, useState } from 'react';


const useGameState = (utils) => {
    const [stars, setStars] = useState(utils.random(1, 9));
    const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
    const [candidateNums, setCandidatesNums] = useState([]);
    const [secondsLeft, setSecondLeft] = useState(10);
    const [startGame, setStartGame] = useState(false)
    //sideEffect timer
    useEffect(() => {
        if (startGame && secondsLeft > 0 && availableNums.length > 0) {
            const timerId = setTimeout(() => {
                setSecondLeft(secondsLeft - 1);
            }, 1000);

            return () => clearTimeout(timerId);
        }

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
    return [
        stars,
        availableNums,
        candidateNums,
        secondsLeft,
        setGameState,
        startGame,
        setStartGame
    ];
};

export default useGameState;