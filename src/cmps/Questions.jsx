import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Utils } from '../services/utils';
import { StorageService } from '../services/storageService';

export function Questions() {
  const [questions, setQuestions] = useState();
  const [currQuestion, setQuestion] = useState();
  const [currIdx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [btnDiable, setBtnDiable] = useState(true);
  const [score, setScore] = useState(0);
  const [hScore, setHighScore] = useState(0);
  const [lvl, setLvl] = useState(1);


  useEffect(() => {
    getQuestions(30, 'easy');
    getHighScore()
  }, []);

 

  const getQuestions = async (amount, difficulty) => {
    try {
      const res = await axios.get(
        `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
      );
      setQuestions(res.data.results);
      createAnswers(
        res.data.results[0].correct_answer,
        res.data.results[0].incorrect_answers
      );
      setQuestion(res.data.results[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const createAnswers = (rightAns, wrongAns) => {
    const ansArray = [];
    ansArray.push({ ans: rightAns, isRight: true });
    wrongAns.map((ans) => ansArray.push({ ans, isRight: false }));
    const readyAns = Utils.shuffleArray(ansArray);
    setAnswers(readyAns);
  };

  const handleClick = (ev) => {
    setIdx(currIdx + 1);
    
    let clr;
    if (ev.target.className === 'right') {
      clr = '#3eca3e';
      setScore(score + 1);
      if (score + 1 > hScore)  {
        setHighScore(score + 1);
        StorageService.saveScore('score', score + 1);
      }
    } else {
      clr = '#da424c';
      setScore(0);
      setLvl(1);
    }
    setBtnBgc(ev.target, clr, 0);
    setBtnDiable(false);
    setBtnBgc(ev.target, 'eeeeee', 2000);
    setTimeout(() => {
      nextQuestion();
      setBtnDiable(true);
    }, 2000);
  };

  const setBtnBgc = (target, color, sec) => {
    setTimeout(() => {
      target.style = `background-color: ${color}`;
    }, sec);
  };

  const nextQuestion = () => {
      
      if (currIdx === questions.length - 1) {
          setLvl( lvl + 1);
          getQuestions(5, 'easy');
          setIdx(0)
          return;
        }
    
    setQuestion(questions[currIdx + 1]);
    createAnswers(
      questions[currIdx + 1].correct_answer,
      questions[currIdx + 1].incorrect_answers
    );

  };

  const getHighScore = () => {
    const score = StorageService.loadScore('score');
    score ? setHighScore(score) : setHighScore(0);
  }

  return (
    <div>
      {!questions && <h1>Loading...</h1>}
      {questions && currQuestion && (
        <div className="game">
          <div className="question-area">
            <h2>{currQuestion.category}</h2>
            <h3>{currQuestion.difficulty}</h3>
            <h1>{Utils.replaceSentence(currQuestion.question)}</h1>
          </div>

          <div className="score">
            <h2>{score}</h2>
            <h2>highest score: {hScore}</h2>
            <h2>level: {lvl}</h2>
          </div>

          <div className="ans-area">
            {answers &&
              answers.map((ans, idx) => (
                <button
                  key={idx}
                  disabled={!btnDiable}
                  className={ans.isRight ? 'right' : 'wrong'}
                  onClick={handleClick}
                >
                  {Utils.replaceSentence(ans.ans)}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
