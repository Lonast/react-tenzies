import React, { useEffect, useState } from "react";
import Dice from "./components/Die";
import "./index.css";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
function App(props) {
  const [dice, setDice] = useState(rand());
  const [tenzies, setTenzies] = useState(false);
  const [btn, setBtn] = useState("Roll");
  const [times, setTimes] = useState(0);
  const [tm, setTm] = useState(0);
  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value == firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setBtn("New Game");
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 10 + 1),
      isHeld: false,
      id: nanoid(),
    };
  }
  function rand() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((prevVal) =>
        prevVal.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(rand());
      setBtn("Roll");
      setTm(0);
    }
    setTimes((prevVal) => prevVal + 1);
  }
  function holdDice(id) {
    if (!tm) {
      setTm(Date.now());
    }
    setDice((prevVal) =>
      prevVal.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  return (
    <main>
      {tenzies && <Confetti />}
      {tenzies ? (
        <div>
          <h1 className="attempts">Your Attempts: {times}</h1>
          <h1 className="attempts">
            Your Time:{" "}
            {Math.round(Date.now() / 1000 - tm / 1000) < 60
              ? `${(Date.now() / 1000 - tm / 1000).toFixed(2)} secs`
              : `${(Date.now() / 1000 / 60 - tm / 1000 / 60).toFixed(2)} mins`}
          </h1>
        </div>
      ) : (
        <div>
          <h1 className="title">Tenzies</h1>
          <p className="instructions">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
        </div>
      )}
      <div className="container">
        {dice.map((item, index) => {
          return (
            <Dice
              hold={holdDice}
              isHeld={item.isHeld}
              key={item.id}
              id={item.id}
              value={item.value}
            />
          );
        })}
      </div>
      <button onClick={rollDice} className="btn">
        {btn}
      </button>
    </main>
  );
}

export default App;
