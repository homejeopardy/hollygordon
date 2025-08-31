const categories = {
    "Potent Potables": {
        100: ["This spirit is traditionally made from fermented agave in Mexico.", "Tequila"],
        200: ["A classic cocktail of whiskey, sugar, bitters, and an orange peel.", "Old Fashioned"],
        300: ["This Italian liqueur, often enjoyed after dinner, is flavored with anise.", "Sambuca"],
        400: ["The national drink of Brazil made with cachaça, sugar, and lime.", "Caipirinha"],
        500: ["A traditional Japanese alcoholic beverage brewed from fermented rice.", "Sake"]
    },
    "Plants": {
        100: ["The process by which plants convert sunlight into energy.", "Photosynthesis"],
        200: ["This part of the plant transports water from the roots to the leaves.", "Xylem"],
        300: ["The world’s largest rainforest.", "The Amazon"],
        400: ["These plants grow on other plants for support but are not parasitic.", "Epiphytes"],
        500: ["The study of fungi, often considered alongside botany.", "Mycology"]
    },
    "Presidents": {
        100: ["The first President of the United States.", "George Washington"],
        200: ["This president issued the Emancipation Proclamation.", "Abraham Lincoln"],
        300: ["The only U.S. president to serve more than two terms.", "Franklin D. Roosevelt"],
        400: ["The youngest elected president in U.S. history.", "John F. Kennedy"],
        500: ["The president who signed the Civil Rights Act of 1964.", "Lyndon B. Johnson"]
    },
    "Puns": {
        100: ["What do you call fake spaghetti?", "An impasta"],
        200: ["I’m reading a book on anti-gravity. It’s ______.", "Impossible to put down"],
        300: ["I used to play piano by ear, but now I use my ______.", "Hands"],
        400: ["This type of joke relies on a play on words for humor.", "Pun"],
        500: ["I stayed up all night to see where the sun went… Then it ______.", "Dawned on me"]
    },
    "Potter": {
        100: ["The house at Hogwarts known for bravery and courage.", "Gryffindor"],
        200: ["This professor teaches Potions for much of Harry’s time at Hogwarts.", "Severus Snape"],
        300: ["The name of Harry’s owl.", "Hedwig"],
        400: ["The killing curse, one of the three Unforgivable Curses.", "Avada Kedavra"],
        500: ["The device Hermione uses to attend multiple classes at once in *Prisoner of Azkaban*.", "Time-Turner"]
    }
};

let teams = {};
let currentQuestion = null;
let currentPoints = 0;
let currentButton = null; // Stores the clicked button

document.getElementById("add-team").addEventListener("click", addTeam);
document.getElementById("start-game").addEventListener("click", startGame);

function addTeam() {
    const teamInputs = document.getElementById("team-inputs");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Team Name";
    teamInputs.appendChild(input);
}

function startGame() {
    const teamInputs = document.querySelectorAll("#team-inputs input");
    if (teamInputs.length === 0) return;

    teams = {};
    const teamSelect = document.getElementById("team-select");
    teamSelect.innerHTML = "";
    document.getElementById("scores").innerHTML = "";

    teamInputs.forEach(input => {
        if (input.value.trim() !== "") {
            const name = input.value.trim();
            teams[name] = 0;

            const scoreDiv = document.createElement("div");
            scoreDiv.className = "team";
            scoreDiv.id = `team-${name}`;
            scoreDiv.innerText = `${name}: $0`;
            document.getElementById("scores").appendChild(scoreDiv);

            const option = document.createElement("option");
            option.value = name;
            option.innerText = name;
            teamSelect.appendChild(option);
        }
    });

    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    generateBoard();
}

function generateBoard() {
    const board = document.getElementById("jeopardy-board");
    board.innerHTML = '';

    Object.keys(categories).forEach(category => {
        let header = document.createElement("div");
        header.className = "category";
        header.innerText = category;
        board.appendChild(header);
    });

    for (let points of [100, 200, 300, 400, 500]) {
        Object.keys(categories).forEach(category => {
            let button = document.createElement("button");
            button.className = "question";
            button.innerText = `$${points}`;
            button.setAttribute("data-category", category);
            button.setAttribute("data-points", points);
            button.onclick = showQuestion;
            board.appendChild(button);
        });
    }
}

function showQuestion(event) {
    currentButton = event.target; // Store the clicked button
    const category = currentButton.getAttribute("data-category");
    const points = parseInt(currentButton.getAttribute("data-points"));

    currentQuestion = category;
    currentPoints = points;

    // Play the Jeopardy theme song
    const jeopardyTheme = document.getElementById("jeopardy-theme");
    jeopardyTheme.play();

    document.getElementById("question-text").innerText = categories[category][points][0];
    document.getElementById("popup").style.display = "block";
}

function showAnswer() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("answer-text").innerText = categories[currentQuestion][currentPoints][1];
    document.getElementById("answer-popup").style.display = "block";

    // Stop the Jeopardy theme song
    const jeopardyTheme = document.getElementById("jeopardy-theme");
    jeopardyTheme.pause();
    jeopardyTheme.currentTime = 0; // Reset audio to start
}

function updateScore(correct) {
    const team = document.getElementById("team-select").value;
    teams[team] += correct ? currentPoints : -currentPoints;
    document.getElementById(`team-${team}`).innerText = `${team}: $${teams[team]}`;

    // Close the answer pop-up after scoring
    document.getElementById("answer-popup").style.display = "none";

    // Disable the button permanently after the question has been answered
    if (currentButton) {
        currentButton.disabled = true;
        currentButton.style.backgroundColor = "#222"; // Change to a "used" style
        currentButton.style.cursor = "not-allowed";
    }
}
