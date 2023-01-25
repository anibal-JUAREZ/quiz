//variables


let rSection;
let showEveryAnswers;
let resultatBtn;
let play;
let allTheAnswers;
let nextBtn;
let gameInformation=[];
let score=0;
let item=0;
let timerCount=10;
let cronometre;
let rightResponse=0;
let answerSection;
let answerStatement;



//getting elements inside the DOM
let timer=document.getElementById('timer');
let gameSection=document.getElementById('quizz-section');
let btnClose=document.getElementById('btn_close');
let scoreperQuestion=document.getElementById('score');
let imgTimer=document.getElementById('img-timer');



//getting all the questions from json file 
fetch(`/questions.json`)
.then (function(response){
    return response.json();
})
.then(function(resultat){
    gameInformation=resultat;
    //show the first question
    showQuestion(item);
    //begin the timer
    cronoTimer();
})

//function to check if the answer is right or wrong
function checkingAnswer(e){
    
    clearInterval(cronometre);
    let element=e.currentTarget;
    let state=e.currentTarget.getAttribute('data-answer');
    let item=e.currentTarget.getAttribute('data-item');
    
    

    if(state=='correct'){
        element.classList.add("correct");
        allTheAnswers.forEach(answer=>{
          answer.style.pointerEvents="none";
        });
        
        score+=10;
        scoreperQuestion.textContent =`Score : ${score} points`;
        nextBtn.disabled=false;
        rightResponse++;
        
    }else {
        element.classList.add("incorrect");
        
        nextBtn.disabled=false;
        allTheAnswers.forEach(answer=>{
            answer.style.pointerEvents="none";
            if(answer.getAttribute('data-answer')=='correct'){
                answer.classList.add('correct')
            }
        })
    }

    
    rSection.textContent=gameInformation[item].explication;
  
    rSection.style.display="block";
    allTheAnswers.forEach(answer=>{
        answer.style.pointerEvents="none";
        
    })
    if(item>=gameInformation.length-1){
        nextBtn.disabled=true;
        resultatBtn.style.display="block";
    }
}

/**
 * show the next question
 * @param {event} e 
 */
function next(e){
   
    timerCount=10;
    timer.innerText=`${timerCount}`;
    //wait 2 seconds to begin the timer
    setTimeout("cronoTimer()",200);

    item ++;
    if(item<gameInformation.length){
        showQuestion(item);
    }
    
    
   
    
}

/**
 * function to show one question
 * @param {integer} item 
 */
function showQuestion(item){
    const shuffledArray = gameInformation[item].answers.sort(() => 0.5 - Math.random());
    gameSection.innerHTML="";
    gameSection.innerHTML +=`
        <h2 class="question">Question ${item + 1}</h2>
        <p class="question-statement">${gameInformation[item].question}</p>
        <img class="w-50" src="/assets/images/${gameInformation[item].image}" class="img-fluid" alt="${gameInformation[item].alt}">
        <div id ="answers" class="row"></div>
        <p id="explication">Explication</p>
        <div class="d-flex flex-column align-items-center">
        <button id="next" type ="button" class="btn-quizz col-3">Suivant</button>
        <button id ="resultat" type ="button" class="btn-quizz col-3 mt-2">Résultat</button>
        </div>
    
      
    `;
    showEveryAnswers=document.getElementById('answers');
    showEveryAnswers.innerHTML="";
    shuffledArray.forEach(oneAnswer=>{
        
        showEveryAnswers.innerHTML+=`
            <p class="answer col-6" data-item="${item}" data-answer="${oneAnswer.state}">${oneAnswer.statement}</p>
        `
    })

    rSection=document.getElementById('explication');
    rSection.style.display="none";
  
    allTheAnswers=document.querySelectorAll('.answer');
    
    allTheAnswers.forEach(answer=>{
        answer.addEventListener('click',checkingAnswer);
    })

    resultatBtn=document.getElementById('resultat');
    resultatBtn.addEventListener('click',showResultat);
    nextBtn=document.getElementById('next');
   
    nextBtn.addEventListener('click',next);
    nextBtn.disabled=true;
    
}

/**
 * function to show the timer
 */
function showSeconds(){
    
    timerCount--;
    timer.innerText=`${timerCount}`;
    //avoid user to click on another answer once the timer has finished
    if(timerCount==0){
        clearInterval(cronometre);
        allTheAnswers.forEach(answer=>{
          answer.style.pointerEvents="none";
        })
        //call the function to show the right answer after the time has finished
        showTheRightAnswer();
        
        


    }

}

/**
 * function to show the correct answer 
 */
function showTheRightAnswer(){
    allTheAnswers.forEach(answer=>{
        
        if(answer.getAttribute('data-answer')=='correct'){
            answer.classList.add('correct')
        }
    })

    //show the explanation once the user has chosen an answer
    rSection.textContent=gameInformation[item].explication;
    rSection.style.display="block";
    //verify if the the last question or not
    if(item>=gameInformation.length-1){
        nextBtn.disabled=true;
        resultatBtn.style.display="block";
    }else{
        nextBtn.disabled=false;
    }
    

}


/**
 * function to begin the timer
 */
function cronoTimer(){
    cronometre=setInterval(showSeconds,1000);
}

/**
 * function to show the resultat
 */
 function showResultat(){
    timer.innerText="";
    scoreperQuestion.innerText="";
    imgTimer.style.display="none"
    gameSection.innerHTML="";
    gameSection.innerHTML +=`
    <div class="row">
        <div class="col-sm-12">
          <div class="card opacity-75">
            <div class="card-body">
              <h5 class="card-title">Merci pour votre participation</h5>
              <p class="card-text">Votre score est de ${rightResponse}/${gameInformation.length}</p>
              <p class="card-text">Soit ${score} points</p>
              <button id="play" type="button" class="btn-quizz">Jouer à nouveau</button>

          </div>
        </div>
      </div>
    </div>
  `;
    
    //button to play again
    play=document.getElementById('play');
    play.addEventListener('click',playAgain);

    
     
 }

 /**
  * function to play again
  */
 function playAgain(){
    window.location.reload()
 }

 

