const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const shareButton = document.getElementById('share-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const resultContainer = document.getElementById('result-container');
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const popupMessage = document.getElementById('popup-message');
const popupClose = document.getElementById('popup-close');

document.addEventListener('DOMContentLoaded', () => {
  resultContainer.classList.add('hide'); // Oculta el contenedor de resultados
});


popupClose.addEventListener('click', () => {
  popup.classList.add('hide'); // Oculta el modal al cerrarlo
});

function showPopup(correct, explanation) {
  popupTitle.innerText = correct ? "¡Correcto! 🎉" : "Incorrecto 😔";
  popupMessage.innerText = explanation;
  popup.classList.remove('hide'); // Muestra el modal
}


let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timeLeft = 15;
let timerInterval;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    setNextQuestion();
  } else {
    endGame(); // Llama a la función de fin del juego si no hay más preguntas
  }
});
shareButton.addEventListener('click', shareScore);

function startGame() {
  console.log("Juego iniciado");
  score = 0;
  scoreElement.innerText = score;
  startButton.style.display = 'none'; // Oculta el botón "Comenzar Juego"
  resultContainer.classList.add('hide'); // Oculta el contenedor de resultados
  popup.classList.add('hide'); // Asegúrate de que el popup esté oculto
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainerElement.style.display = 'block'; // Muestra el contenedor de preguntas
  setNextQuestion();
}




function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
  startTimer();
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearInterval(timerInterval);
  timeLeft = 15;
  timerElement.innerText = timeLeft;
  nextButton.style.display = 'none'; // Oculta el botón "Siguiente"
  answerButtonsElement.innerHTML = ''; // Limpia las respuestas anteriores
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      disableButtons();
      nextButton.style.display = 'block'; // Muestra el botón "Siguiente" al acabar el tiempo
    }
  }, 1000);
}

function selectAnswer(e) {
  clearInterval(timerInterval); // Detener el temporizador al seleccionar una respuesta
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === 'true';
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Obtén la explicación de la pregunta actual
  const explanation = currentQuestion.explanation;

  // Encuentra el texto de la respuesta correcta
  const correctAnswer = currentQuestion.answers.find(answer => answer.correct);
  const answerText = correctAnswer ? correctAnswer.text : "Respuesta no encontrada";

  // Construir el mensaje del popup
  const message = correct
    ? `¡Correcto! ${explanation}`
    : `Incorrecto. La respuesta correcta era: ${answerText}. ${explanation}`;
  
  // Mostrar el mensaje emergente
  showPopup(correct, message);

  setStatusClass(selectedButton, correct);

  if (correct) {
    score++;
    scoreElement.innerText = score;
  }

  disableButtons(); // Deshabilitar todos los botones de respuesta
  nextButton.style.display = 'block'; // Muestra el botón "Siguiente"
}




function disableButtons() {
  Array.from(answerButtonsElement.children).forEach(button => {
    button.disabled = true;
    const correct = button.dataset.correct === 'true';
    setStatusClass(button, correct);
  });
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct'); // Añade clase para respuesta correcta
  } else {
    element.classList.add('wrong'); // Añade clase para respuesta incorrecta
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}

function endGame() {
  console.log("Fin del juego");
  clearInterval(timerInterval);

  // Oculta el contenedor de preguntas
  questionContainerElement.style.display = 'none';

  // Oculta el contenedor principal
  const containerElement = document.querySelector('.container');
  containerElement.style.display = 'none';

  // Muestra el resultado final
  showFinalScore();

  // Muestra el botón de compartir
  shareButton.style.display = 'block';
}


function showFinalScore() {
  console.log("Mostrando puntaje final");
  const finalScoreMessage = document.getElementById('final-score-message');
  finalScoreMessage.innerText = `¡Felicitaciones! optuviste: ${score} respuestas correctas y el resto las aprendiste.`;
  resultContainer.style.display = 'flex'; // Muestra el contenedor de resultados
}

function shareScore() {
  console.log("Compartiendo puntaje");
  const canvas = document.createElement('canvas');
  canvas.width = 1080; // Tamaño para historia de IG
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  const background = new Image();
  background.src = 'mensaje.jpg'; // Fondo para la historia
  background.onload = () => {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡Eeiii muchas gracias por jugar!', canvas.width / 2, 200);

    ctx.fillStyle = '#2e8b57';
    ctx.font = 'bold 100px Arial';
    ctx.fillText(`Feliz navidad🎄`, canvas.width / 2, canvas.height / 2);
    // Mensaje de Navidad
    ctx.fillStyle = '#43d711';
    ctx.font = 'bold 50px Arial';
    ctx.fillText('Que todo lo lindo de la vida', canvas.width / 2, canvas.height / 2 + 100);
    ctx.fillText('siempre te encuentre💫', canvas.width / 2, canvas.height / 2 + 170);
   


      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'mensaje.jpg';
      link.click();
    };
  };


const questions = [
  { question: '¿Cuál es el verdadero origen de la fecha del 25 de diciembre?', 
    answers: [ { text: 'El nacimiento de Jesús.', correct: false }, { text: 'Fue elegido al azar por la Iglesia', correct: false }, { text: 'Coincide con la fiesta pagana Saturnalia', correct: true }, { text: 'Es el día más frío del año', correct: false } 
],explanation: "La Iglesia adoptó esta fecha para alinear la celebración cristiana con festivales paganos como Saturnalia y Sol Invictus, facilitando la conversión al cristianismo, de hecho Jesus no nacio el 25 de diciembre, realmente no se sabe con certeza." },
  { question: '¿De dónde proviene la tradición de decorar árboles de Navidad?', 
    answers: [ { text: 'Es una tradición romana.', correct: false }, { text: 'Los celtas decoraban robles en el solsticio de invierno', correct: true }, { text: 'Fue creada por la Reina Victoria', correct: false }, { text: 'Es una invención alemana moderna.', correct: false }
],explanation:"Los pueblos celtas decoraban árboles sagrados como parte de rituales paganos, y esta costumbre evolucionó en la tradición del árbol de Navidad." },
  { question: '¿Quién popularizó el árbol de Navidad en el mundo occidental?', 
    answers: [ { text: 'La Reina Victoria y el Príncipe Alberto', correct: true }, { text: 'Martín Lutero', correct: false }, { text: 'Los campesinos alemanes.', correct: false }, { text: 'La Iglesia Católica.', correct: false } 
],explanation:"La tradición alemana se volvió famosa mundialmente cuando la familia real británica colocó un árbol decorado en el Palacio de Buckingham en 1848." },
  { question: '¿En qué está inspirado Santa Claus?', 
    answers: [ { text: 'En un personaje de Coca-Cola', correct: false }, { text: 'En un campesino alemán', correct: false }, { text: 'En un rey medieval', correct: false }, { text: 'En el dios Odin y San Nicolás', correct: true } 
],explanation:"Santa Claus combina elementos del obispo cristiano San Nicolás y del dios nórdico Odin, quien viajaba en el cielo durante el solsticio." },
  { question: '¿Qué significan los colores rojo, verde y blanco en Navidad?',
    answers: [ { text: 'Sangre, vida y santidad', correct: false }, { text: 'No tienen un significado específico', correct: false }, { text: 'Fuego, bosque y nieve', correct: false }, { text: 'Amor, esperanza y pureza', correct: true } 
],explanation:"Los colores tienen raíces paganas y simbolizaban la sangre (rojo), la vida (verde) y la pureza (blanco) en rituales del solsticio de invierno." },
  { question: '¿Qué empresa popularizó la imagen moderna de Santa Claus?',
    answers: [ { text: 'Coca-Cola', correct: true }, { text: 'Pepsi', correct: false }, { text: 'Nestlé', correct: false }, { text: 'Disney', correct: false }
],explanation:"En los años 30, Coca-Cola usó a Santa Claus con su traje rojo y barba blanca en campañas publicitarias, fijando su imagen actual." },
  { question: '¿Qué tienen en lugar de Santa Claus en Islandia?', 
    answers: [ { text: 'Un oso polar mágico', correct: false }, { text: '13 "Yule Lads"', correct: true }, { text: 'Un gnomo gigante', correct: false }, { text: 'Una estrella de hielo', correct: false } 
],explanation:"Estos personajes traen regalos o roban comida, dependiendo del comportamiento de los niños. También tienen un gato gigante que devora a quienes no reciben ropa nueva." },
  { question: '¿Qué festividad romana influenció la tradición de intercambiar regalos?',
    answers: [ { text: 'Sol Invictus', correct: false }, { text: 'Saturnalia', correct: true }, { text: 'Lupercalia', correct: false }, { text: 'Bacanales', correct: false } 
],explanation:"Durante esta festividad, los romanos intercambiaban regalos, celebraban banquetes y descansaban, costumbres adoptadas en la Navidad." },
  { question: '¿Qué simbolizaba el muérdago en las tradiciones celtas?', 
    answers: [ { text: 'Fertilidad y protección', correct: true }, { text: 'Riqueza y longevidad"', correct: false }, { text: 'Guerra y victoria', correct: false }, { text: 'Amor y pasión', correct: false } 
], explanation:"Los celtas creían que el muérdago era una planta mágica que traía buena suerte y protegía contra el mal."},
  { question: '¿Qué figura navideña es conocida por secuestrar niños desobedientes?', 
    answers: [ { text: 'Belsnicke', correct: false }, { text: 'Perchta', correct: false }, { text: 'Krampus', correct: true }, { text: 'Grýla', correct: false } 
],explanation:"Krampus es una criatura demoníaca de la mitología alpina que acompaña a San Nicolás. Mientras él premia a los niños buenos, Krampus castiga a los malos, e incluso, según la leyenda, puede llevarlos al infierno en su saco. Esta tradición oscura aún se celebra en países como Austria y Alemania, donde desfiles de Krampus son parte de las festividades." }
];


function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerText = '❄';
  
    // Posición aleatoria en el ancho de la ventana
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's'; // Duración aleatoria de la animación
  
    document.body.appendChild(snowflake);
  
    // Eliminar el copo después de que termine la animación
    setTimeout(() => {
      snowflake.remove();
    }, 5000);
  }
  
  // Crear copos de nieve cada 300 ms
  setInterval(createSnowflake, 100);