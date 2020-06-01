MentorQuiz = function (elementRef) {
    this.elementRef = elementRef;
    this.answers = {};
    this.quizContainer = htmlToElement('<div id="quizContainer"></div>');
    this.elementRef.appendChild(htmlToElement('<h1>Milline mentor oled Sina?</h1>'));
    this.elementRef.appendChild(this.quizContainer);
    this.questions.forEach(question => this.quizContainer.appendChild(this.createQuestionView(question)));
};

MentorQuiz.prototype.createQuestionView = function (question) {
    let questionContainer = htmlToElement(
        `<div class="questionContainer" data-question-id="${question.id}">
             <div style="background-color: #${question.color}">
                 <div>${question.question}</div>
             </div>
         </div>`);
    for (let answerNumber = 0; answerNumber < question.answers.length; answerNumber++) {
        const answer = question.answers[answerNumber];
        const answerElement = htmlToElement(
            `<div style="background-color: #${question.color}" 
                  data-answer-id="${answerNumber}" 
                  class="mentor-quiz-answer">
                 <div>${answer}</div>
             </div>`);
        answerElement.onclick = () => this.handleAnswerClick(answerElement);
        questionContainer.appendChild(answerElement)
    }
    return questionContainer;
};

MentorQuiz.prototype.handleAnswerClick = function (answerElement) {
    const questionContainer = answerElement.parentElement;
    const questionNumber = questionContainer.getAttribute('data-question-id');
    const answerNumber = answerElement.getAttribute('data-answer-id');
    questionContainer.classList.add('answered');
    answerElement.classList.add('active');
    this.setAnswer(questionNumber, answerNumber);
    const nextQuestionElement = questionContainer.nextElementSibling;
    if (nextQuestionElement == null) {
        this.calculateResults().then(this.showResult);
    } else {
        questionContainer.nextElementSibling.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
    }
};

MentorQuiz.prototype.showResult = function (result) {
    let container = htmlToElement(
        `<div>
             <div id="resultContainer">
                 <div class="resultImage" 
                      style="background: linear-gradient(to top, hsla(0, 0%, 0%, 0.8) 0%, hsla(0, 0%, 0%, 0) 33%), url('${result.image}') ${result.imagePosition}/cover no-repeat;">
                     <div>${result.name}</div>
                 </div>
                 <div class="resultText">${result.description}</div>
                 <div class="resultFooter">
                     <a href="https://docs.google.com/forms/d/1uc_xg8GuNd3iUdVT9oYb_zM_z2IKVHcK6Z5vM4iZ4_U">
                         Ole ise vastus, registreeru mentoriks!
                     </a>
                 </div>
             </div>
         </div>`);
    this.quizContainer.appendChild(container);
    container.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
};

MentorQuiz.prototype.setAnswer = function (questionNumber, answerNumber) {
    this.answers[questionNumber] = answerNumber;
};

MentorQuiz.prototype.setAnswer = function (questionNumber, answerNumber) {
    this.answers[questionNumber] = answerNumber;
};

MentorQuiz.prototype.calculateResults = function () {
    return fetch('/mentor-quiz/calculate-result', {
        method: 'post',
        body: JSON.stringify(this.answers)
    }).then(result => result.json());
};

MentorQuiz.prototype.questions = [
    {
        id: 0,
        question: 'Lemmik õppejõud?',
        color: '2A86FF',
        answers: ['Härmel Nestra', 'Kati Ain', 'Vambola', 'Toomas Plank']
    },
    {
        id: 1,
        question: 'Lemmik keel?',
        color: '864CB6',
        answers: ['Python', 'Java', 'LaTeX', 'HTML']
    },
    {
        id: 2,
        question: 'Ideaalne reede õhtu?',
        color: '7EF400',
        answers: ['linna jooma', 'tuttu ära', 'netflix & chill ;)', ' Zulrah grind']
    },
    {
        id: 3,
        question: 'Keskmine hinne?',
        color: '7E00F4',
        answers: ['0.5', 'keskmine', 'stipi saab kätte', 'cum laude squad']
    },
    {
        id: 4,
        question: 'Kodutööd esitad ära',
        color: '314CB6',
        answers: ['kodutööd?', 'teemant valmib surve all', 'kohe', 'küll keegi rühmas esitab']
    },
    {
        id: 5,
        question: 'Õhtusöögiks',
        color: 'A22BE1',
        answers: ['kokkad kogu ühikale', 'wolt', 'paastub', 'kiirnuudlid']
    },
    {
        id: 6,
        question: 'Õpid pigem',
        color: '00D106',
        answers: ['ainet korrates', 'ei', 'rahulikult', 'kursachatis']
    },
    {
        id: 7,
        question: 'Lemmik lokaal?',
        color: 'E94F37',
        answers: ['Illegaard', 'Säde', 'Shoot', 'raamatukogu']
    },
    {
        id: 8,
        question: 'Suhtestaatus?',
        color: '6610F2',
        answers: ['ära ei ütleks', 'keeruline', 'programmeerija', 'friendzoned']
    },
    {
        id: 9,
        question: 'Muusikamaitse?',
        color: 'FDCA40',
        answers: ['sa pole sellest kuulnud', 'nublu', 'vaikus', 'ainult aegumatu']
    },
    {
        id: 10,
        question: 'Lemmik aine?',
        color: '11D149',
        answers: ['OOP', 'MMP', 'DMT', 'AAR']
    },
    {
        id: 11,
        question: 'Ideaalne õhtu mentorgrupiga?',
        color: 'E1A22B',
        answers: ['Pythonrämmar', 'Dungeons & Dragons', 'sööks', 'Rannamaja maraton']
    }
];

function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}