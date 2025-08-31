const categories = {
    "Ethical Principles": {
        100: ["Acting with honesty and truthfulness in all business dealings.", "Integrity"],
        200: ["The duty to keep sensitive information private.", "Confidentiality"],
        300: ["Acting in the best interest of clients, customers, or stakeholders.", "Fiduciary duty"],
        400: ["A situation where personal interests could interfere with professional responsibilities.", "Conflict of interest"],
        500: ["The principle that requires professionals to acknowledge and correct their mistakes.", "Accountability"]
    },
    "Workplace Conduct": {
        100: ["Treating colleagues with fairness, dignity, and respect.", "Professionalism"],
        200: ["Unwelcome behavior that creates a hostile or uncomfortable work environment.", "Harassment"],
        300: ["Reporting unethical behavior or policy violations.", "Whistleblowing"],
        400: ["Avoiding favoritism and personal bias in decision-making.", "Impartiality"],
        500: ["Using company resources for personal gain without authorization.", "Misappropriation"]
    },
    "Legal & Compliance": {
        100: ["Falsifying documents or financial records for personal or business gain.", "Fraud"],
        200: ["Laws that protect employees from discrimination based on race, gender, or religion.", "Equal Employment Opportunity (EEO) laws"],
        300: ["Offering or accepting something of value to influence a business decision.", "Bribery"],
        400: ["The requirement to disclose any conflicts of interest in professional dealings.", "Transparency"],
        500: ["A set of company policies that outline acceptable workplace behavior and expectations.", "Code of Conduct"]
    },
    "Professional Responsibilities": {
        100: ["The expectation that professionals will continue to develop their skills and knowledge.", "Continuous learning"],
        200: ["The obligation to report misconduct, even if it may have personal consequences.", "Duty to report"],
        300: ["Avoiding giving or receiving these to prevent conflicts of interest.", "Gifts and favors"],
        400: ["Following lawful instructions from supervisors unless they violate ethical standards.", "Ethical obedience"],
        500: ["The responsibility of a leader to set a strong ethical example.", "Ethical leadership"]
    },
    "Digital & Online Conduct": {
        100: ["Using company technology for personal, illegal, or inappropriate purposes.", "Misuse of company resources"],
        200: ["The duty to protect sensitive client or company data.", "Data privacy"],
        300: ["Unauthorized sharing or leaking of confidential company information.", "Information breach"],
        400: ["Posting false or damaging statements about a company or colleague online.", "Defamation"],
        500: ["The principle that encourages professionals to think carefully before posting online.", "Responsible online conduct"]
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
