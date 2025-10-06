'use strict';

let questionsString = "";
let answersString = "";
let questions = [];
let choices = [];
let answers = [];
let index = 0;

function processFile() {
  const input = document.getElementById('fileInput');
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function() {
    questionsString = reader.result;
    document.getElementById('output').textContent = questionsString;
    
    // split questions, choices and answers
    answersString = questionsString.split('AnswerKey')[1];
    questions = questionsString.split('AnswerKey')[1].split('\n');
    answers = answersString.split('\n');

    let allysa = [];
    // clean empty lines
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].trim() === "") continue;
        allysa.push(questions[i]);
    }
    questions = allysa;
    allysa = [];

    // separate choices
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].includes('A.') || questions[i].includes('B.') || questions[i].includes('C.') || questions[i].includes('D.')) {
            choices.push(questions[i]);
            allysa.push(i);
        }
    }
    // remove choices from questions
    for (let i = 0; i < allysa.length; i++) {
        questions.splice(allysa[i], 1);
    }

    // clean empty lines
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].trim() === "") continue;
        allysa.push(answers[i]);
    }
    answers = allysa;
    allysa = [];

    // start the review
    const button = document.getElementById("next");
    button.hidden = false;
    index = 0;
    console.log(questions[0]);
    // displayQuestions()
  };

  reader.readAsText(file);
}

function displayQuestion() {
  const output = document.getElementById('output');
  output.textContent = questions[index] + "\n";
}