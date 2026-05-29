// Game state using arrays and objects as required
const gameState = {
    disksCount: 5,
    pegs: [[], [], []], // 3 pegs as stacks (arrays)
    moves: 0,
    isAutoSolving: false,
    selectedPegIndex: null,
    selectedDiskSize: null
};

// DOM elements
const diskCountInput = document.getElementById('diskCount');
const moveCountEl = document.getElementById('moveCount');
const resetBtn = document.getElementById('resetBtn');
const autoSolveBtn = document.getElementById('autoSolveBtn');
const warningMsgEl = document.getElementById('warningMsg');
const victoryMsgEl = document.getElementById('victoryMsg');
const pegsEls = document.querySelectorAll('.peg');

// Initialize game
function initGame() {
    gameState.disksCount = parseInt(diskCountInput.value);
    gameState.pegs = [[], [], []];
    gameState.moves = 0;
    gameState.isAutoSolving = false;
    gameState.selectedPegIndex = null;
    gameState.selectedDiskSize = null;

    // Clear all pegs
    pegsEls.forEach(peg => {
        while (peg.children.length > 1) {
            peg.removeChild(peg.lastChild);
        }
    });

    // Push disks to first peg (largest at bottom, smallest on top)
    for (let i = gameState.disksCount; i >= 1; i--) {
        gameState.pegs[0].push(i);
    }

    renderDisks();
    moveCountEl.textContent = gameState.moves;
    warningMsgEl.textContent = '';
    victoryMsgEl.classList.add('hidden');
    toggleControls(false);
}

// Render disks using forEach
function renderDisks() {
    pegsEls.forEach((pegEl, pegIndex) => {
        const disks = gameState.pegs[pegIndex];
        while (pegEl.children.length > 1) {
            pegEl.removeChild(pegEl.lastChild);
        }

        disks.forEach(diskSize => {
            const diskEl = document.createElement('div');
            diskEl.classList.add('disk', `disk-${diskSize}`);
            diskEl.dataset.size = diskSize;
            diskEl.dataset.peg = pegIndex;
            pegEl.appendChild(diskEl);
        });
    });
}

// Show warning message with animation
function showWarning(message) {
    warningMsgEl.textContent = message;
    warningMsgEl.style.animation = 'none';
    setTimeout(() => {
        warningMsgEl.style.animation = 'shakeWarning 0.5s ease-in-out';
    }, 10);
    setTimeout(() => {
        warningMsgEl.textContent = '';
    }, 1500);
}

// Check if move is valid (smaller disk on top)
function isValidMove(fromPeg, toPeg) {
    if (fromPeg.length === 0) return false;
    if (toPeg.length === 0) return true;
    const topFrom = fromPeg[fromPeg.length - 1];
    const topTo = toPeg[toPeg.length - 1];
    return topFrom < topTo;
}

// Execute move using push/pop
function executeMove(fromIndex, toIndex) {
    const fromPeg = gameState.pegs[fromIndex];
    const toPeg = gameState.pegs[toIndex];
    const diskSize = fromPeg.pop();
    toPeg.push(diskSize);
    gameState.moves++;
    moveCountEl.textContent = gameState.moves;
    renderDisks();
    checkWin();
}

// Check if all disks are on the last peg
function checkWin() {
    const targetPeg = gameState.pegs[2];
    if (targetPeg.length === gameState.disksCount) {
        victoryMsgEl.classList.remove('hidden');
        toggleControls(true);
    }
}

// Toggle controls during auto-solve
function toggleControls(disabled) {
    diskCountInput.disabled = disabled;
    resetBtn.disabled = disabled;
    autoSolveBtn.disabled = disabled;
}

// Click handler for pegs/disks
pegsEls.forEach((pegEl, pegIndex) => {
    pegEl.addEventListener('click', (e) => {
        if (gameState.isAutoSolving || !victoryMsgEl.classList.contains('hidden')) return;

        if (gameState.selectedPegIndex === null) {
            const pegDisks = gameState.pegs[pegIndex];
            if (pegDisks.length === 0) return;
            gameState.selectedPegIndex = pegIndex;
            gameState.selectedDiskSize = pegDisks[pegDisks.length - 1];
            e.target.classList.add('selected');
        } else {
            const fromPeg = gameState.pegs[gameState.selectedPegIndex];
            const toPeg = gameState.pegs[pegIndex];

            if (gameState.selectedPegIndex === pegIndex) {
                renderDisks();
                gameState.selectedPegIndex = null;
                gameState.selectedDiskSize = null;
                return;
            }

            if (isValidMove(fromPeg, toPeg)) {
                executeMove(gameState.selectedPegIndex, pegIndex);
            } else {
                showWarning("Cannot place larger disk on smaller one!");
            }

            gameState.selectedPegIndex = null;
            gameState.selectedDiskSize = null;
            renderDisks();
        }
    });
});

// Reset button
resetBtn.addEventListener('click', initGame);

// Change disk count
diskCountInput.addEventListener('change', () => {
    const val = parseInt(diskCountInput.value);
    if (val >= 3 && val <= 8) {
        initGame();
    } else {
        diskCountInput.value = gameState.disksCount;
    }
});

// Auto solve with recursion and delay
async function autoSolve() {
    gameState.isAutoSolving = true;
    toggleControls(true);
    await solveHanoi(gameState.disksCount, 0, 2, 1);
    gameState.isAutoSolving = false;
    toggleControls(false);
}

function solveHanoi(n, from, to, aux) {
    return new Promise(resolve => {
        if (n === 0) {
            resolve();
            return;
        }

        solveHanoi(n - 1, from, aux, to)
            .then(() => new Promise(res => setTimeout(res, 500)))
            .then(() => {
                executeMove(from, to);
                const topDisk = pegsEls[to].lastChild;
                if (topDisk) topDisk.classList.add('floating');
                setTimeout(() => topDisk?.classList.remove('floating'), 500);
            })
            .then(() => new Promise(res => setTimeout(res, 500)))
            .then(() => solveHanoi(n - 1, aux, to, from))
            .then(resolve);
    });
}

autoSolveBtn.addEventListener('click', autoSolve);

// Initialize on load
window.addEventListener('DOMContentLoaded', initGame);