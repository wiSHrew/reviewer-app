'use strict';

let questionsString = "";
let answersString = "";
let questions = [];
let choices = [];
let answers = [];
let indexes = [];

function processFile() {
    document.getElementById("questions").innerHTML = "";


    const input = document.getElementById('fileInput');
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function() {
    questionsString = reader.result;

    // split the file into blocks by the separator '---'
    let blocks = questionsString.split('---');

    for (let block of blocks) {
        block = block.trim();
        if (block === "") continue; // skip empty blocks

        // extract question
        let questionMatch = block.match(/question:\s*\d*\.\s*(.+)/i);
        if (questionMatch) questions.push(questionMatch[1].trim());

        // extract choices
        let choicesMatch = block.match(/choices:(.+)/i);
        if (choicesMatch) {
            let opts = choicesMatch[1].split(' -').filter(opt => opt.trim() !== "");
            opts = opts.map(opt => opt.trim());
            choices.push(opts);
        }

        // extract answer
        let answerMatch = block.match(/answer:\s*(.+)/i);
        if (answerMatch) answers.push(answerMatch[1].trim());
    }

    // check counts
    const output = document.getElementById("output");
    if (questions.length !== choices.length || questions.length !== answers.length) {
        output.textContent = "Mismatch: questions, choices, and answers counts are not equal";
        return;
    }
    else{
        output.textContent = file.name + " loaded! \nTotal Questions: " + questions.length + "\n o(^▽^)o";
    }

    console.log("Questions:", questions);
    console.log("Choices:", choices);
    console.log("Answers:", answers);

    for (let i = 0; i < questions.length; i++) {
        indexes.push(i);
    }

    indexes.sort(() => Math.random() - 0.5); // shuffle indexes

    // start the review
    for (let i = 0; i < indexes.length; i++) {
        displayQuestion(indexes[i], i);
    }
    };

    reader.readAsText(file);
}

function displayQuestion(index, i) {
    const mainDiv = document.getElementById("questions");

    // make a div
    const questionsDiv = document.createElement("div");
    questionsDiv.style.textAlign = "left";
    questionsDiv.style.fontFamily = "'Arial', serif";
    questionsDiv.style.fontSize = "25px";
    questionsDiv.class = "question-block";

    // add a horizontal line
    const hr = document.createElement("hr");
    mainDiv.appendChild(hr);

    // add numbering
    const number = document.createElement("h2");
    number.textContent = `Question ${i + 1}`;
    questionsDiv.appendChild(number);

    // display question
    const output = document.createElement("p");
    output.textContent = questions[index];
    questionsDiv.appendChild(output);

    // display choices
    const form = document.createElement("form");
    form.id = `choicesForm-${index}`;

    const letters = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 4; i++) {
        let letter = letters[i];

        const choice = document.createElement("input");
        choice.type = "radio";
        choice.name = "choice"; // group radios together
        choice.id = letter;
        choice.value = letter;
        choice

        const label = document.createElement("label");
        label.htmlFor = letter;
        label.textContent = choices[index][i];

        // put radio + label on the same line
        form.appendChild(choice);
        form.appendChild(label);
        form.appendChild(document.createElement("br"));
    }

    questionsDiv.appendChild(form);

    // create area for the answer feedback
    const answerh3 = document.createElement("h3");
    answerh3.id = "answer";
    questionsDiv.appendChild(answerh3);

    // add event listener directly to form
    form.addEventListener('change', function(event) {
        if (event.target.name === 'choice') {
            const selectedValue = event.target.value;

            lockRadios(form.id); // lock the radios

            const letterAns = answers[index].split('.')[0].toLowerCase();
            let response = answers[index];

            if (selectedValue === letterAns.trim()) {
                response = "Correct! o(〃＾▽＾〃)o \n\n" + response;
            } else {
                response = "Wrong! (╥﹏╥) \n\n" + response;
            }

            answerh3.textContent = response;
        }
    });

    // finally, show the question on screen
    mainDiv.appendChild(questionsDiv); // hide the main div
    // document.body.appendChild(questionsDiv);
}

function lockRadios(formId) {
    const form = document.getElementById(formId);
    const radios = form.querySelectorAll('input[name="choice"]');
    radios.forEach(r => r.disabled = true);
}