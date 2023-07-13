const _pregunta = document.getElementById('pregunta');
const _opciones = document.querySelector('.quizOpciones');
const _verifica = document.getElementById('verificaRespuesta');
const _jueganuevamente = document.getElementById('juegaNuevamente');
const _result = document.getElementById('resultado');
const _correctScore = document.getElementById('respuestaCorrecta');
const _totalPregunta = document.getElementById('totalPregunta');

let correctAnswer = "", respuestaCorrecta = askedCount = 0, totalQuestion = 10;

async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}
function eventListeners(){
    _verifica.addEventListener('click', checkAnswer);
    _jueganuevamente.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _totalPregunta.textContent = totalPregunta;
    _correctScore.textContent = respuestaCorrecta;
});


function showQuestion(data){
    _verifica.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length +  1)),  0, correctAnswer);

    _pregunta.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    _opciones.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}

function selectOption(){
    _opciones.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_opciones.querySelector('.selected')){
                const activeOption = _opciones.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

function checkAnswer(){
    _verifica.disabled = true;
    if(_opciones.querySelector('.selected')){
        let selectedAnswer = _opciones.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            respuestaCorrecta++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Respuesta Correcta!</p>`;
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Respuesta Incorrecta!</p> <small><b>Respuesta Correcta: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Por favor selecciona una opcion!</p>`;
        _verifica.disabled = false;
    }
}
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}


function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        setTimeout(function(){
            console.log("");
        }, 5000);
        _result.innerHTML += `<p>Tu puntaje es ${respuestaCorrecta}.</p>`;
        _jueganuevamente.style.display = "block";
        _verifica.style.display = "none";
    }

    else {
    setTimeout(function(){
        loadQuestion();
    }, 800);
}
function setCount(){
    _totalPregunta.textContent = totalPregunta;
    _correctScore.textContent = respuestaCorrecta;
}
function restartQuiz(){
    respuestaCorrecta = askedCount = 0;
    _jueganuevamente.style.display = "none";
    _verifica.style.display = "block";
    _verifica.disabled = false;
    setCount();
    loadQuestion();
}
}