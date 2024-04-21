import { React, useState, useEffect } from "react";
import "./styles.css";

export default function TicTacToe() {
  const [value, setValue] = useState(
    Array(9)
      .fill()
      .map((_, idx) => ({
        value: "",
        enabled: true,
        index: idx,
        moveNumber: 0,
      }))
  );
  const [currentTurn, setCurrentTurn] = useState("O");
  const [moveCount, setMoveCount] = useState(0);
  const [winner, setWinner] = useState("");
  const onClickBox = (e, index) => {
    e.preventDefault();
    if (!value[index].enabled) {
      return;
    }
    let tempArr = [...value];
    tempArr[index].value = currentTurn;
    tempArr[index].enabled = false;
    tempArr[index].moveNumber = moveCount + 1;
    setValue(tempArr);
    setCurrentTurn(currentTurn === "O" ? "X" : "O");
    setMoveCount(moveCount + 1);
  };

  useEffect(() => {
    const winner = checkWinner();
    if (!winner) {
      let moves = value
        .filter((el) => el.value !== "")
        .sort((a, b) => a.moveNumber - b.moveNumber);

      if (
        moves.filter((el) => el.value === "O").length > 3 &&
        currentTurn === "X"
      ) {
        revertMove("O");
      }

      if (
        moves.filter((el) => el.value === "X").length > 3 &&
        currentTurn === "O"
      ) {
        revertMove("X");
      }
    }

    if (winner) {
      setWinner(winner);
    }
  }, [value, currentTurn]);

  const revertMove = (player) => {
    let tempArr = [...value];
    let earliestMove = tempArr
      .filter((el) => el.value === player && el.enabled === false)
      .sort((a, b) => a.moveNumber - b.moveNumber)[0];
    if (earliestMove) {
      earliestMove.value = "";
      earliestMove.enabled = true;
      earliestMove.moveNumber = 0;
      setValue(tempArr);
    }
  };

  const checkWinner = () => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (
        value[a].value &&
        value[a].value === value[b].value &&
        value[a].value === value[c].value
      ) {
        return value[a].value;
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3">
        {value.map((val, index) => (
          <div
            onClick={(e) => onClickBox(e, index)}
            key={index}
            className={`box bg-blue-500 text-white text-4xl ${
              val.enabled ? "opacity-1" : "opacity-50"
            }`}
          >
            {val.value}
          </div>
        ))}
      </div>
      {winner && <div>{winner} Wins!!!</div>}
      <span className="text-2xl mt-8">{currentTurn}'s turn</span>
    </div>
  );
}
