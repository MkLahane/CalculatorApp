import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState, useRef } from 'react';
import { ReactComponent as Chevron } from './icons/chevron.svg';
import { ReactComponent as BackSpace } from './icons/backspace.svg';
import { isNumber, isPuncutation, replaceStar, isEmpty, checkForValidQuestion } from './Util';
import { isCompositeComponentWithType } from 'react-dom/test-utils';

firebase.initializeApp({
  apiKey: "AIzaSyD3US69mOIPMJYTW5xBU6xIGiSAfeU3s7U",
  authDomain: "calculatorapp-e32f5.firebaseapp.com",
  databaseURL: "https://calculatorapp-e32f5.firebaseio.com",
  projectId: "calculatorapp-e32f5",
  storageBucket: "calculatorapp-e32f5.appspot.com",
  messagingSenderId: "311097083794",
  appId: "1:311097083794:web:44a0429e7eb21b2a3ca34b",
  measurementId: "G-4B4N9WD6KB"
});

const firestore = firebase.firestore();
const math = require('mathjs');

function App() {
  const calculationsDivRef = useRef(null);
  const calculationsRef = firestore.collection('calculations');
  const query = calculationsRef.orderBy('createdAt', "desc").limit(10);
  const [calculationsData] = useCollectionData(query);
  const [calculations, setCalculations] = useState([]);
  const inputBoxRef = useRef(null);
  const [username, setUsername] = useState("null");
  const usernameDivRef = useRef(null);
  const usernameDivBackRef = useRef(null);
  const userDivRef = useRef(null);
  const usernameInputRef = useRef(null);

  useEffect(() => {
    calculationsDivRef.current.scrollTop = calculationsDivRef.current.scrollHeight;
    if (calculationsData !== undefined) {
      setCalculations(calculationsData.reverse());
    }
  }, [calculationsData]);
  const computeAnswer = () => {
    let question = inputBoxRef.current.value;
    if (!checkForValidQuestion(question)) {
      return;
    }
    try {
      question = replaceStar(question);
      let answer = math.evaluate(question);

      if (answer === undefined || answer === null || isNaN(answer)) {
        inputBoxRef.current.value = "";
      } else {
        answer = (answer % 1 === 0) ? answer : answer.toFixed(3);
        inputBoxRef.current.value = answer;
        if (question !== null) {
          sendAnswer(question + " = " + answer);
        }
      }
    } catch (err) {

    }

  };
  const sendAnswer = async (ans) => {
    await calculationsRef.add({
      'calculation': ans,
      'createdAt': firebase.firestore.FieldValue.serverTimestamp(),
      'username': username
    });
  };
  const handleInput = (e) => {
    if (e.key == "Enter") {
      computeAnswer();
    }
  };

  const handleChange = (e) => {
    let lastChar = e.target.value[e.target.value.length - 1];
    if (lastChar === '*') {
      e.target.value = e.target.value.substring(0, e.target.value.length - 1);
      e.target.value += 'x';
    } else {
      if (!(isNumber(lastChar) || isPuncutation(lastChar))) {
        e.target.value = e.target.value.substring(0, e.target.value.length - 1);
      }
    }
  };
  const submitUsername = () => {
    let _username = usernameInputRef.current.value;
    if (isEmpty(_username)) {
      return;
    }
    userDivRef.current.value = _username;
    setUsername(_username);
    usernameDivBackRef.current.classList.add('added');
    usernameDivRef.current.classList.add('added');
    userDivRef.current.classList.add('visible');
  };
  const clampUsername = (e) => {
    e.target.value = e.target.value.substring(0, 10);
  };
  return (
    <div className="App">
      <div ref={usernameDivBackRef} className="username-background added"></div>
      <div ref={usernameDivRef} className="username added">
        <div className="username-div">
          <input ref={usernameInputRef} placeholder="Enter name..." onChange={clampUsername}>
          </input>
          <div className="icon-div" onClick={submitUsername}>
            <Chevron className="icon"></Chevron>
          </div>
        </div>
        <p>limit 10 characters</p>
      </div>
      <div className="data">
        <div className="user" ref={userDivRef}>
          <p>{username}</p>
        </div>
        <div ref={calculationsDivRef} className="p-calcs-parent">
          {
            calculations && calculations.map((c, cindex) =>
              <div className="p-calcs" key={cindex}>
                <h3>{c.username}</h3>
                <p>{c.calculation}</p>
              </div>
            )}
        </div>

      </div>
      <div className="calculator">
        <div className="answer">
          <input type="text" ref={inputBoxRef} placeholder="Enter here.." onKeyDown={handleInput} onChange={handleChange}></input>
        </div>
        <div className="numpads">
          <div onClick={() => { inputBoxRef.current.value += '0' }}><p>0</p></div>
          <div onClick={() => { inputBoxRef.current.value += '1' }}><p>1</p></div>
          <div onClick={() => { inputBoxRef.current.value += '2' }}><p>2</p></div>
          <div onClick={() => { inputBoxRef.current.value += '3' }}><p>3</p></div>
          <div onClick={() => { inputBoxRef.current.value += '4' }}><p>4</p></div>
          <div onClick={() => { inputBoxRef.current.value += '5' }}><p>5</p></div>
          <div onClick={() => { inputBoxRef.current.value += '6' }}><p>6</p></div>
          <div onClick={() => { inputBoxRef.current.value += '7' }}><p>7</p></div>
          <div onClick={() => { inputBoxRef.current.value += '8' }}><p>8</p></div>
          <div onClick={() => { inputBoxRef.current.value += '9' }}><p>9</p></div>
          <div onClick={() => { inputBoxRef.current.value += '+' }}><p>+</p></div>
          <div onClick={() => { inputBoxRef.current.value += '-' }}><p>-</p></div>
          <div onClick={() => { inputBoxRef.current.value += '/' }}><p>/</p></div>
          <div onClick={() => { inputBoxRef.current.value += '^' }}><p>^</p></div>
          <div onClick={() => { inputBoxRef.current.value += 'x' }}><p>x</p></div>
          <div onClick={() => { computeAnswer() }}><p>=</p></div>
          <div onClick={() => { inputBoxRef.current.value += '.' }}><p>.</p></div>
          <div onClick={() => { inputBoxRef.current.value += '(' }}><p>(</p></div>
          <div onClick={() => { inputBoxRef.current.value += ')' }}><p>)</p></div>
          <div onClick={() => { inputBoxRef.current.value += 'sin(' }}><p>sin</p></div>
          <div onClick={() => { inputBoxRef.current.value += 'cos(' }}><p>cos</p></div>
          <div onClick={() => { inputBoxRef.current.value += 'sqrt(' }}><p>sqrt</p></div>
          <div onClick={() => {
            inputBoxRef.current.value =
              inputBoxRef.current.value.substring(0, inputBoxRef.current.value.length - 1)
          }} className="backspace"><BackSpace className="backspace-icon"></BackSpace></div>


          <div className="C" onClick={() => { inputBoxRef.current.value = '' }}><p>C</p></div>
        </div>
      </div>

    </div >
  );
}

export default App;
