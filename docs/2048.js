var board;
var score = 0;
var rows = 4;
var columns = 4;

var startX, startY, endX, endY; // Koordinaten für Touch und Maus

window.onload = function() {
    setGame();

    // Mausbewegung erkennen
    document.addEventListener("mousedown", startSwipe);
    document.addEventListener("mouseup", endSwipe);

    // Touch für Mobilgeräte
    document.addEventListener("touchstart", startTouch);
    document.addEventListener("touchend", endTouch);
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
 
    // Füge den Übergang hinzu, indem wir die Positionen aktualisieren
    let [r, c] = tile.id.split("-").map(Number);
    tile.style.transform = `translate(${c * 110}px, ${r * 110}px)`; // Berechne die Position
}

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    } else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
});

function startTouch(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}

function endTouch(e) {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleSwipe();
}

function startSwipe(e) {
    startX = e.clientX;
    startY = e.clientY;
}

function endSwipe(e) {
    endX = e.clientX;
    endY = e.clientY;
    handleSwipe();
}

function handleSwipe() {
    let deltaX = endX - startX;
    let deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // horizontal swipe
        if (deltaX > 0) {
            slideRight();
        } else {
            slideLeft();
        }
    } else {
        // vertical swipe
        if (deltaY > 0) {
            slideDown();
        } else {
            slideUp();
        }
    }
    setTwo();
    document.getElementById("score").innerText = score;
}

function filterZero(row) {
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row); //[4, 2]
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}
function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function noMovesLeft() {
    if (hasEmptyTile()) {
        return false; // Wenn es noch leere Felder gibt, sind Züge möglich
    }

    // Überprüfe, ob angrenzende Kacheln kombiniert werden können
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let current = board[r][c];
            if (r < rows - 1 && current == board[r + 1][c]) {
                return false; // Überprüfe Kachel darunter
            }
            if (c < columns - 1 && current == board[r][c + 1]) {
                return false; // Überprüfe Kachel rechts
            }
        }
    }

    return true; // Keine Bewegungen mehr möglich
}

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
    } else if (e.code == "ArrowRight") {
        slideRight();
    } else if (e.code == "ArrowUp") {
        slideUp();
    } else if (e.code == "ArrowDown") {
        slideDown();
    }
    document.getElementById("score").innerText = score;
    
    // Prüfe, ob das Spiel vorbei ist
    if (noMovesLeft()) {
        showGameOver();
    } else {
        setTwo();
    }
});

function handleSwipe() {
    let deltaX = endX - startX;
    let deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // horizontal swipe
        if (deltaX > 0) {
            slideRight();
        } else {
            slideLeft();
        }
    } else {
        // vertical swipe
        if (deltaY > 0) {
            slideDown();
        } else {
            slideUp();
        }
    }
    document.getElementById("score").innerText = score;

    // Prüfe, ob das Spiel vorbei ist
    if (noMovesLeft()) {
        showGameOver();
    } else {
        setTwo();
    }
}

function showGameOver() {
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOver").style.display = "block";
}

var startTime;
var timerInterval;

window.onload = function() {
    setGame();

    // Startet den Timer, sobald das Spiel beginnt
    startTimer();

    // Mausbewegung erkennen
    document.addEventListener("mousedown", startSwipe);
    document.addEventListener("mouseup", endSwipe);

    // Touch für Mobilgeräte
    document.addEventListener("touchstart", startTouch);
    document.addEventListener("touchend", endTouch);
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTime, 1000); // Aktualisiert jede Sekunde
}

function updateTime() {
    var now = new Date();
    var elapsed = Math.floor((now - startTime) / 1000); // Zeit in Sekunden

    var minutes = Math.floor(elapsed / 60);
    var seconds = elapsed % 60;

    // Formatierung der Zeit auf 2 Stellen
    var formattedTime = 
        (minutes < 10 ? "0" + minutes : minutes) + ":" + 
        (seconds < 10 ? "0" + seconds : seconds);

    document.getElementById("time").innerText = formattedTime;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function showGameOver() {
    document.getElementById("finalScore").innerText = score;
    
    // Stoppt den Timer und zeigt die finale Zeit an
    stopTimer();
    document.getElementById("finalTime").innerText = document.getElementById("time").innerText;

    document.getElementById("gameOver").style.display = "block";
}

