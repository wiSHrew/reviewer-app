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
    questions = questionsString.split('AnswerKey')[0].split('\n');
    answers = answersString.split('\n');

    let allysa = [];
    // clean empty lines
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].trim() === "") continue;
        if (questions[i].trim().includes("Question")) continue;
        allysa.push(questions[i]);
    }
    questions = allysa;
    allysa = [];

    // separate choices
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].includes('A. ') || questions[i].includes('B. ') || questions[i].includes('C. ') || questions[i].includes('D. ')) {
            choices.push(questions[i]);
            allysa.push(i);
        }
    }
    allysa.sort((a, b) => b - a);
    // remove choices from questions
    for (let i = 0; i < allysa.length; i++) {
        questions.splice(allysa[i], 1);
    }
    allysa = [];

    // group the choices by 4
    for (let i = 0; i < choices.length; i += 4) {
        let group = choices.slice(i, i + 4);
        allysa.push(group);
    }
    choices = allysa;
    allysa = [];

    // clean empty lines
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].trim() === "") continue;
        allysa.push(answers[i]);
    }
    answers = allysa;
    allysa = [];

    // start the review
    document.getElementById("choicesForm").hidden = false;
    document.getElementById("next").hidden = false;
    nextQuestion(index);

    console.log(questions);
    console.log(choices);
    console.log(answers);
  };

  reader.readAsText(file);
}

function nextQuestion() {
    index++;
    if (index < questions.length) {
        displayQuestion(index);
    } else {
        document.getElementById("output").textContent = "End of questions! \\(0^◇^0)/";
        document.getElementById("choicesForm").hidden = true;
        document.getElementById("next").hidden = true;
        document.getElementById("answer").hidden = true;
    }
}

function displayQuestion(index) {
    // reset form
    unlockRadios();

    // display question
    const output = document.getElementById('output');
    output.textContent = questions[index] + "\n";

    // display choices
    const letters = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 4; i++) {
        let letter = letters[i];
        const labelElement = document.querySelector(`label[for="${letter}"]`);
        labelElement.textContent = choices[index][i];
    }

    // wait for user input and check answer
    document.getElementById('choicesForm').addEventListener('change', function(event) {
        if (event.target.name === 'choice') {
            const selectedValue = event.target.value;
            console.log('You selected:', selectedValue);
            let letterAns = answers[index].split('.')[0].toLowerCase();
            let answer = answers[index].split(letterAns);
            if (selectedValue === letterAns.trim()) {
                answer = "Correct! o(〃＾▽＾〃)o\n" + answer;
            }
            else {
                answer = "Wrong! (╥﹏╥)\n" + answer;
            }
            document.getElementById("answer").textContent = answer;
            lockRadios();
        }
    });
}


function lockRadios() {
    const radios = document.querySelectorAll('input[name="choice"]');
    radios.forEach(r => r.disabled = true);
    document.getElementById("next").disabled = false;
}

function unlockRadios() {
    const radios = document.querySelectorAll('input[name="choice"]');
    radios.forEach(r => r.disabled = false);
    radios.forEach(r => r.checked = false);
    document.getElementById("next").disabled = true;
    document.getElementById("answer").textContent = "";
}
