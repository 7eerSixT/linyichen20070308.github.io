/**
 * Tower of Hanoi 3D Game
 * Logic & Controller
 */

// === 1. 游戏状态 ===
const state = {
    disksCount: 5,
    pegs: [
        [], // Peg A
        [], // Peg B
        []  // Peg C
    ],
    moves: 0,
    isSolving: false,
    selectedPegIndex: null,
    selectedDiskSize: null,
};

// === 2. DOM 引用 ===
const boardEl = document.getElementById('board');
const diskCountInput = document.getElementById('diskCount');
const resetBtn = document.getElementById('resetBtn');
const solveBtn = document.getElementById('solveBtn');
const moveCounter = document.getElementById('moveCounter');
const statusBar = document.getElementById('status-bar');

// 圆盘颜色
const diskColors = [
    '#FF6B6B', '#FFA94D', '#FFD93D', '#6BCB77', 
    '#4D96FF', '#9B59B6', '#FF6B6B', '#FFA94D'
];

// === 3. 核心逻辑 ===

function initGame(count) {
    state.disksCount = count;
    state.pegs = [ [], [], [] ];
    state.moves = 0;
    state.isSolving = false;
    state.selectedPegIndex = null;
    state.selectedDiskSize = null;
    solveBtn.disabled = false;
    
    for(let i = count; i >= 1; i--) {
        state.pegs[0].push(i);
    }

    updateUI();
    statusBar.textContent = "游戏开始！";
    statusBar.className = "";
    moveCounter.textContent = `移动: ${state.moves}`;
}

function isValidMove(fromIndex, toIndex) {
    if (fromIndex === toIndex) return false;
    const fromPeg = state.pegs[fromIndex];
    const toPeg = state.pegs[toIndex];
    
    if (fromPeg.length === 0) return false;
    
    const diskMoving = fromPeg[fromPeg.length - 1];
    const targetTop = toPeg.length > 0 ? toPeg[toPeg.length - 1] : Infinity;
    
    return diskMoving < targetTop;
}

function performMove(fromIdx, toIdx) {
    if (!isValidMove(fromIdx, toIdx)) {
        showError("非法移动：不能将大盘放在小盘上！");
        return false;
    }

    const disk = state.pegs[fromIdx].pop(); 
    state.pegs[toIdx].push(disk);
    
    state.moves++;
    moveCounter.textContent = `移动: ${state.moves}`;
    state.selectedPegIndex = null;
    
    updateUI();
    
    if (checkWin()) {
        statusBar.textContent = "🎉 恭喜你赢了！ 🎉";
        statusBar.className = "win";
    } else {
        statusBar.textContent = `移动成功！`;
        statusBar.className = "";
    }
    return true;
}

function checkWin() {
    return state.pegs[2].length === state.disksCount;
}

// === 4. UI 渲染 ===

function updateUI() {
    boardEl.innerHTML = '';
    const pegLabels = ['A', 'B', 'C'];

    state.pegs.forEach((peg, pegIndex) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'peg-wrapper';
        wrapper.dataset.index = pegIndex;

        const pole = document.createElement('div');
        pole.className = 'peg-pole';
        wrapper.appendChild(pole);

        const diskContainer = document.createElement('div');
        diskContainer.className = 'disk-container';

        peg.slice().forEach((diskSize, i) => {
            const width = 20 + (diskSize / state.disksCount) * 140; 
            
            const diskEl = document.createElement('div');
            diskEl.className = 'disk';
            diskEl.style.width = `${width}px`;
            diskEl.style.background = `linear-gradient(180deg, ${lightenColor(diskColors[diskSize % diskColors.length], 40)}, ${diskColors[diskSize % diskColors.length]})`;
            
            if (state.selectedPegIndex === pegIndex && state.selectedDiskSize === diskSize && i === peg.length - 1) {
                diskEl.classList.add('selected');
            }

            diskContainer.appendChild(diskEl);
        });

        wrapper.appendChild(diskContainer);

        const base = document.createElement('div');
        base.className = 'peg-base';
        wrapper.appendChild(base);

        const label = document.createElement('div');
        label.className = 'peg-label';
        label.textContent = `Peg ${pegLabels[pegIndex]}`;
        wrapper.appendChild(label);

        boardEl.appendChild(wrapper);
    });
}

function lightenColor(color, percent) {
    return color; 
}

// === 5. 错误与反馈 ===

function showError(msg) {
    statusBar.textContent = `⚠️ ${msg}`;
    statusBar.className = "error";
    setTimeout(() => {
        if(!checkWin()) statusBar.className = "";
    }, 1500);
}

// === 6. 事件处理 ===

boardEl.addEventListener('click', (e) => {
    if (state.isSolving) return;

    const wrapper = e.target.closest('.peg-wrapper');
    if (!wrapper) return;

    const targetPegIndex = parseInt(wrapper.dataset.index);

    if (state.selectedPegIndex === null) {
        if (state.pegs[targetPegIndex].length === 0) {
            showError("该柱子上没有圆盘！");
            return;
        }
        state.selectedPegIndex = targetPegIndex;
        state.selectedDiskSize = state.pegs[targetPegIndex][state.pegs[targetPegIndex].length - 1];
        statusBar.textContent = `已选中 Peg ${['A','B','C'][targetPegIndex]} 的顶部圆盘。请点击目标柱子。`;
        updateUI(); 
    } else {
        const fromIdx = state.selectedPegIndex;
        const toIdx = targetPegIndex;
        
        if (fromIdx === toIdx) {
            state.selectedPegIndex = null;
            state.selectedDiskSize = null;
            statusBar.textContent = "已取消选择。";
            updateUI();
            return;
        }

        performMove(fromIdx, toIdx);
    }
});

resetBtn.addEventListener('click', () => {
    if (state.isSolving) return;
    const currentCount = parseInt(diskCountInput.value); 
    if (currentCount < 3 || currentCount > 8) {
        showError("请输入 3 到 8 之间的数字");
        return;
    }
    initGame(currentCount);
});

diskCountInput.addEventListener('change', () => {
    resetBtn.click();
});

// === 7. 自动求解 ===

function startAutoSolve() {
    if (state.isSolving) return;
    if (checkWin()) {
        initGame(state.disksCount);
    }
    
    state.isSolving = true;
    solveBtn.disabled = true;
    statusBar.textContent = "自动求解中...";
    
    const moves = [];
    
    function generateMoves(n, from, to, aux) {
        if (n === 0) return;
        generateMoves(n - 1, from, aux, to);
        moves.push({from, to});
        generateMoves(n - 1, aux, to, from);
    }

    generateMoves(state.disksCount, 0, 2, 1);

    let i = 0;
    function step() {
        if (i >= moves.length) {
            state.isSolving = false;
            solveBtn.disabled = false;
            statusBar.textContent = "🎯 求解完成！";
            statusBar.className = "win";
            return;
        }

        const move = moves[i];
        performMove(move.from, move.to);
        i++;
        setTimeout(step, 400);
    }
    step();
}

solveBtn.addEventListener('click', startAutoSolve);

// === 8. 启动 ===
initGame(5);