// Simuler une base de données d'utilisateurs avec une couleur de profil
const users = [
    { username: 'LUCAS', password: '12123', color: 'blue' },
    { username: 'PAUL', password: 'Paul14', color: 'green' },
    { username: 'admin', password: 'password', color: 'red' }
];

// Les jours de la semaine
const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// Programmes d'entraînement
const programs = {
    salle: {
        'Lundi': [
            { name: "Développé couché (haltères ou barre)", details: "4 séries de 8-12 répétitions" },
            { name: "Développé incliné (haltères)", details: "3 séries de 10-15 répétitions" },
            { name: "Écarté couché (haltères)", details: "3 séries de 12-15 répétitions" },
            { name: "Dips (sur un banc ou la chaise romaine si disponible)", details: "3 séries jusqu'à l'échec" },
            { name: "Extensions triceps (haltère)", details: "3 séries de 12-15 répétitions" }
        ],
        'Mardi': [
            { name: "Tractions (prise pronation)", details: "4 séries jusqu'à l'échec" },
            { name: "Rowing barre", details: "4 séries de 8-12 répétitions" },
            { name: "Rowing haltère (un bras)", details: "3 séries de 10-15 répétitions par bras" },
            { name: "Curl barre", details: "3 séries de 10-15 répétitions" },
            { name: "Curl haltères (en alternance)", details: "3 séries de 12-15 répétitions par bras" }
        ],
        'Mercredi': [
            { name: "Repos", details: "Laissez vos muscles se reposer pour qu'ils puissent se reconstruire." }
        ],
        'Jeudi': [
            { name: "Squat (avec la barre sur le dos)", details: "4 séries de 8-12 répétitions" },
            { name: "Fentes (avec haltères)", details: "3 séries de 10-15 répétitions par jambe" },
            { name: "Leg curl (sur le banc)", details: "3 séries de 12-15 répétitions" },
            { name: "Développé militaire (haltères)", details: "3 séries de 8-12 répétitions" },
            { name: "Élévations latérales (haltères)", details: "3 séries de 12-15 répétitions" },
            { name: "Rowing menton (barre)", details: "3 séries de 10-15 répétitions" }
        ],
        'Vendredi': [
            { name: "Repos", details: "Laissez vos muscles se reposer pour qu'ils puissent se reconstruire." }
        ],
        'Samedi': [
            { name: "Repos ou séance optionnelle", details: "Vous pouvez prendre deux jours de repos complets ou faire une séance de rappel pour un groupe musculaire que vous souhaitez développer davantage." }
        ],
        'Dimanche': [
            { name: "Repos ou séance optionnelle", details: "Vous pouvez prendre deux jours de repos complets ou faire une séance de rappel pour un groupe musculaire que vous souhaitez développer davantage." }
        ]
    }
};

// Récupérer les éléments HTML
const loginPopup = document.getElementById('loginPopup');
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');
const accueilPage = document.getElementById('accueilPage');
const bandeau = document.querySelector('.bandeau');
const logoutBtn = document.getElementById('logoutBtn');
const quickLoginButtons = document.querySelectorAll('.quick-login-container button');
const mainContent = document.querySelector('.content-accueil');
const resetGraphBtn = document.getElementById('resetGraphBtn');
const bandeauTitle = document.getElementById('bandeauTitle');

const backArrow = document.createElement('button');
backArrow.id = 'backArrow';
backArrow.innerHTML = '&#8592;';

const dayPopup = document.getElementById('dayPopup');
const dayPopupTitle = document.getElementById('dayPopupTitle');
const dayPopupContent = document.getElementById('dayPopupContent');
const dayPopupCloseBtn = dayPopup.querySelector('.close-btn');

let myChart;
let timer;
let startTime;
let elapsedTime = 0;
let isTimerRunning = false;
let timeDisplayElement;
let currentDay;
let currentUser;

let weeklyWorkoutTimes = {};

function startTimer() {
    if (!isTimerRunning) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(updateTimer, 1000);
        isTimerRunning = true;
    }
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (timeDisplayElement) {
        timeDisplayElement.textContent = `Temps écoulé : ${formattedTime}`;
    }
}

function stopTimer() {
    clearInterval(timer);
    isTimerRunning = false;
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    if (timeDisplayElement) {
        timeDisplayElement.textContent = 'Temps écoulé : 00:00';
    }
}

function handleLogin(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        message.textContent = 'Connexion réussie ! Redirection...';
        message.style.color = 'green';
        setTimeout(() => {
            loginPopup.style.display = 'none';
            accueilPage.classList.add('show-page');
            bandeau.classList.remove('bandeau-blue', 'bandeau-green', 'bandeau-red');
            bandeau.classList.add(`bandeau-${user.color}`);
            currentUser = user.username;
            displayProfileContent();
        }, 1500);
    } else {
        message.textContent = 'Identifiant ou mot de passe incorrect.';
        message.style.color = 'red';
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    handleLogin(usernameInput, passwordInput);
});

quickLoginButtons.forEach(button => {
    button.addEventListener('click', () => {
        const username = button.dataset.user;
        const user = users.find(u => u.username === username);
        handleLogin(user.username, user.password);
    });
});

logoutBtn.addEventListener('click', () => {
    accueilPage.classList.remove('show-page');
    bandeau.classList.remove('bandeau-blue', 'bandeau-green', 'bandeau-red');
    loginPopup.style.display = 'flex';
    loginForm.reset();
    message.textContent = '';
});

resetGraphBtn.addEventListener('click', () => {
    weeklyWorkoutTimes = {};
    localStorage.setItem('weeklyWorkoutTimes_' + currentUser, JSON.stringify(weeklyWorkoutTimes));
    displayWeeklyGraph(mainContent);
});

function displayProfileContent() {
    mainContent.innerHTML = '';
    
    weeklyWorkoutTimes = JSON.parse(localStorage.getItem('weeklyWorkoutTimes_' + currentUser)) || {};
    
    const welcomeTitle = document.createElement('h1');
    welcomeTitle.textContent = `Bonjour, ${currentUser} !`;
    mainContent.appendChild(welcomeTitle);

    const paragraph = document.createElement('p');
    paragraph.textContent = "Choisissez où vous voulez faire votre séance :";
    mainContent.appendChild(paragraph);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('location-buttons');
    
    const salleBtn = document.createElement('button');
    salleBtn.textContent = "Salle";
    salleBtn.dataset.location = "salle";
    buttonContainer.appendChild(salleBtn);
    salleBtn.addEventListener('click', () => {
        displayDayButtons('salle');
    });

    mainContent.appendChild(buttonContainer);
    backArrow.style.display = 'none';
    
    displayWeeklyGraph(mainContent);
}

function displayDayButtons(location) {
    mainContent.innerHTML = '';
    
    backArrow.style.display = 'inline-block';
    
    const bandeauContent = document.querySelector('.bandeau-content');
    if (!bandeauContent.contains(backArrow)) {
        bandeauContent.insertBefore(backArrow, bandeauTitle);
    }

    const title = document.createElement('h2');
    title.textContent = `Séances à la ${location}`;
    mainContent.appendChild(title);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('day-buttons');
    
    daysOfWeek.forEach(day => {
        const button = document.createElement('button');
        button.textContent = day;
        buttonContainer.appendChild(button);
        
        button.addEventListener('click', () => {
            currentDay = day;
            showDayPopup(day, location);
        });
    });
    mainContent.appendChild(buttonContainer);
}

backArrow.addEventListener('click', () => {
    displayProfileContent();
});

function showDayPopup(day, location) {
    dayPopupTitle.textContent = `${day} - ${location.charAt(0).toUpperCase() + location.slice(1)}`;
    dayPopupContent.innerHTML = '';

    resetTimer();
    
    const timerContainer = document.createElement('div');
    timerContainer.style.marginBottom = '20px';
    timeDisplayElement = document.createElement('p');
    timeDisplayElement.textContent = 'Temps écoulé : 00:00';
    timerContainer.appendChild(timeDisplayElement);
    dayPopupContent.appendChild(timerContainer);
    
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('progress-container');
    const progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressContainer.appendChild(progressBar);
    dayPopupContent.appendChild(progressContainer);

    const congratsMessage = document.createElement('p');
    congratsMessage.id = 'congratsMessage';
    congratsMessage.textContent = 'Bravo, entraînement terminé ! 🎉';
    dayPopupContent.appendChild(congratsMessage);
    
    const programList = document.createElement('ul');
    programList.classList.add('exercise-list');

    let exercises = [];
    
    // Condition mise à jour pour le nom 'LUCAS'
    if (currentUser === 'LUCAS' && location === 'salle') {
        exercises = programs.salle[day];
    }
    
    if (currentUser === 'PAUL') {
        const noProgramMessage = document.createElement('p');
        noProgramMessage.textContent = 'Pas encore de programme défini pour ce jour.';
        dayPopupContent.appendChild(noProgramMessage);
    }
    
    if (exercises && exercises.length > 0) {
        exercises.forEach(exercise => {
            const listItem = document.createElement('li');
            listItem.classList.add('exercise-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.completed = 'false';

            const text = document.createElement('span');
            text.innerHTML = `<strong>${exercise.name}</strong><br>${exercise.details}`;

            listItem.appendChild(checkbox);
            listItem.appendChild(text);
            programList.appendChild(listItem);
        });
        dayPopupContent.appendChild(programList);
    }
    
    dayPopupContent.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateProgress(day);
        });
    });

    dayPopup.classList.remove('day-popup-hidden');
    startTimer();
}

function updateProgress(day) {
    const checkboxes = dayPopupContent.querySelectorAll('input[type="checkbox"]');
    const totalExercises = checkboxes.length;
    let completedExercises = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            completedExercises++;
        }
    });

    const progress = (totalExercises > 0) ? (completedExercises / totalExercises) * 100 : 0;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${progress}%`;

    const congratsMessage = document.getElementById('congratsMessage');
    if (progress === 100) {
        congratsMessage.style.display = 'block';
        stopTimer();
        weeklyWorkoutTimes[day] = elapsedTime;
        localStorage.setItem('weeklyWorkoutTimes_' + currentUser, JSON.stringify(weeklyWorkoutTimes));
        displayWeeklyGraph(mainContent);
    } else {
        congratsMessage.style.display = 'none';
    }
}

dayPopupCloseBtn.addEventListener('click', () => {
    dayPopup.classList.add('day-popup-hidden');
    resetTimer();
});

function displayWeeklyGraph(container) {
    let graphTitle = document.querySelector('.graph-title');
    let canvas = document.getElementById('workoutChart');

    if (!graphTitle) {
        graphTitle = document.createElement('h2');
        graphTitle.classList.add('graph-title');
        graphTitle.textContent = "Temps d'entraînement par jour (en minutes)";
        container.appendChild(graphTitle);
    }

    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'workoutChart';
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        const dataInMinutes = daysOfWeek.map(day => (weeklyWorkoutTimes[day] || 0) / 60000);
        
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: daysOfWeek,
                datasets: [{
                    label: 'Temps d\'entraînement (min)',
                    data: dataInMinutes,
                    borderColor: '#7f52b8',
                    backgroundColor: 'rgba(127, 82, 184, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        const dataInMinutes = daysOfWeek.map(day => (weeklyWorkoutTimes[day] || 0) / 60000);
        myChart.data.datasets[0].data = dataInMinutes;
        myChart.update();
    }
}