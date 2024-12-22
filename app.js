let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new-btn");
let modeModal = document.getElementById("mode-modal");
let symbolChoiceModal = document.getElementById("symbol-choice-modal");
let winnerModal = document.getElementById("winner-modal");
let winnerMsg = document.getElementById("winner-msg");
let aiModeBtn = document.getElementById("ai-mode");
let offlineModeBtn = document.getElementById("offline-mode");
let chooseXBtn = document.getElementById("choose-x");
let chooseOBtn = document.getElementById("choose-o");
let gameContainer = document.querySelector(".game-container");

let userSymbol = "X";
let aiSymbol = "O";
let currentPlayer = "X";
let gameMode = "offline";

const saveGameState = () => {
    const state = {
        board: Array.from(boxes).map(box => box.innerText),
        userSymbol,
        aiSymbol,
        currentPlayer,
        gameMode,
    };
    localStorage.setItem("ticTacToeState", JSON.stringify(state));
};

const loadGameState = () => {
    const state = JSON.parse(localStorage.getItem("ticTacToeState"));
    if (state) {
        state.board.forEach((symbol, index) => {
            boxes[index].innerText = symbol;
            boxes[index].disabled = symbol !== "";
        });
        userSymbol = state.userSymbol;
        aiSymbol = state.aiSymbol;
        currentPlayer = state.currentPlayer;
        gameMode = state.gameMode;
        gameContainer.classList.remove("hide");
    } else {
        modeModal.classList.remove("hide");
    }
};

const resetGame = () => {
    currentPlayer = "X";
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
    });
    winnerModal.classList.add("hide");
    saveGameState();
};

const checkWinner = () => {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
            boxes[a].innerText &&
            boxes[a].innerText === boxes[b].innerText &&
            boxes[b].innerText === boxes[c].innerText
        ) {
            announceWinner(boxes[a].innerText);
            return true;
        }
    }
    if (Array.from(boxes).every(box => box.innerText)) {
        announceWinner("Draw");
        return true;
    }
    return false;
};

const announceWinner = (winner) => {
    if (winner === "Draw") {
        winnerMsg.innerText = "It's a Draw!";
    } else if (winner === userSymbol) {
        winnerMsg.innerText = "Congratulations, You Win!";
    } else if (winner === aiSymbol) {
        winnerMsg.innerText = "AI Wins!";
    } else {
        winnerMsg.innerText = `${winner} Wins!`;
    }
    winnerModal.classList.remove("hide");
    saveGameState();
};

const aiMove = () => {
    let emptyBoxes = [...boxes].filter(box => !box.innerText);
    if (emptyBoxes.length > 0) {
        let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        randomBox.innerText = aiSymbol;
        randomBox.disabled = true;
        if (!checkWinner()) {
            currentPlayer = userSymbol;
            saveGameState();
        }
    }
};

boxes.forEach(box => {
    box.addEventListener("click", () => {
        if (!box.innerText) {
            box.innerText = currentPlayer;
            box.disabled = true;
            if (!checkWinner()) {
                if (gameMode === "ai" && currentPlayer === userSymbol) {
                    currentPlayer = aiSymbol;
                    setTimeout(aiMove, 500);
                } else {
                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                }
            }
            saveGameState();
        }
    });
});

aiModeBtn.addEventListener("click", () => {
    gameMode = "ai";
    modeModal.classList.add("hide");
    symbolChoiceModal.classList.remove("hide");
});

offlineModeBtn.addEventListener("click", () => {
    gameMode = "offline";
    modeModal.classList.add("hide");
    symbolChoiceModal.classList.remove("hide");
});

chooseXBtn.addEventListener("click", () => {
    userSymbol = "X";
    aiSymbol = "O";
    currentPlayer = "X";
    symbolChoiceModal.classList.add("hide");
    gameContainer.classList.remove("hide");
    saveGameState();
});

chooseOBtn.addEventListener("click", () => {
    userSymbol = "O";
    aiSymbol = "X";
    currentPlayer = "X";
    symbolChoiceModal.classList.add("hide");
    gameContainer.classList.remove("hide");
    saveGameState();
});

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

document.addEventListener("DOMContentLoaded", loadGameState);
