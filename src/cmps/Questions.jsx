import React, { useState, useEffect } from 'react'
import axios from 'axios';

export function Questions() {
    const [questions, setQuestions] = useState();
    const [currQuestion, setQuestion] = useState();
    const [currIdx, setIdx] = useState(1);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        getQuestions()
        
      }, []);

    const getQuestions = async () => {
        try {
            const res = await axios.get('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple');
            setQuestions(res.data.results);
            createAnswers(res.data.results[0].correct_answer, res.data.results[0].incorrect_answers);
            setQuestion(res.data.results[0]);
         } catch (err){
             console.log(err)
         }
     }

     const createAnswers = (rightAns, wrongAns) => {
        const readyAns = [];
        readyAns.push({ans: rightAns, isRight: true});
        wrongAns.map(ans => readyAns.push({ans, isRight: false}));
        setAnswers(readyAns);
     }

     const handleClick = (ev) => {
       ev.target.style = `background-color: ${ev.target.className}`;
       nextQuestion();
       setIdx(currIdx + 1);
       ev.target.style = `background-color: white`;
    }

     const nextQuestion = () => {
        setQuestion(questions[currIdx]);
        console.log('currIdx', currIdx)
        createAnswers(questions[currIdx].correct_answer, questions[currIdx].incorrect_answers)
     }


    return (
        <div className="game">
           {!questions && <h1>Loading...</h1>}
    {questions && currQuestion && <div>
      
        <h1>{currQuestion.category}</h1>
        <h3>{currQuestion.difficulty}</h3>
        <h2>{currQuestion.question}</h2>
    {answers && answers.map(ans => <button className={ans.isRight ? 'green' : 'red'} onClick={handleClick}>{ans.ans}</button>)}

    </div>
    }
        </div>
    )
}
