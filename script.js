{\rtf1\ansi\ansicpg936\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 /**\
 * Tower of Hanoi 3D Game\
 * Logic & Controller\
 */\
\
// === 1. \uc0\u28216 \u25103 \u29366 \u24577  (State) ===\
const state = \{\
    disksCount: 5,\
    pegs: [\
        [], // Peg A (Left)\
        [], // Peg B (Middle)\
        []  // Peg C (Right)\
    ],\
    moves: 0,\
    isSolving: false,\
    selectedPegIndex: null,\
    selectedDiskSize: null,\
\};\
\
// === 2. DOM \uc0\u24341 \u29992  ===\
const boardEl = document.getElementById('board');\
const diskCountInput = document.getElementById('diskCount');\
const resetBtn = document.getElementById('resetBtn');\
const solveBtn = document.getElementById('solveBtn');\
const moveCounter = document.getElementById('moveCounter');\
const statusBar = document.getElementById('status-bar');\
\
// \uc0\u24425 \u34425 \u33394 \u30424  palette\
const diskColors = [\
    '#FF6B6B', '#FFA94D', '#FFD93D', '#6BCB77', \
    '#4D96FF', '#9B59B6', '#FF6B6B', '#FFA94D'\
];\
\
// === 3. \uc0\u26680 \u24515 \u36923 \u36753 \u20989 \u25968  ===\
\
// \uc0\u21021 \u22987 \u21270 \u28216 \u25103 \
function initGame(count) \{\
    state.disksCount = count;\
    state.pegs = [ [], [], [] ];\
    state.moves = 0;\
    state.isSolving = false;\
    state.selectedPegIndex = null;\
    state.selectedDiskSize = null;\
    solveBtn.disabled = false;\
    \
    // \uc0\u22635 \u20805 \u26609 \u23376  A\u65306 push() \u26041 \u27861 \u20351 \u29992 \
    for(let i = count; i >= 1; i--) \{\
        state.pegs[0].push(i);\
    \}\
\
    updateUI();\
    statusBar.textContent = "\uc0\u28216 \u25103 \u24320 \u22987 \u65281 ";\
    statusBar.className = "";\
    moveCounter.textContent = `\uc0\u31227 \u21160 : $\{state.moves\}`;\
\}\
\
// \uc0\u26816 \u26597 \u26576 \u20010 \u26609 \u23376 \u30340 \u39030 \u37096 \u22278 \u30424 \u22823 \u23567 \
function getTopDiskSize(pegIndex) \{\
    const peg = state.pegs[pegIndex];\
    if (peg.length === 0) return null;\
    return peg[peg.length - 1];\
\}\
\
// \uc0\u26816 \u26597 \u31227 \u21160 \u26159 \u21542 \u26377 \u25928 \
function isValidMove(fromIndex, toIndex) \{\
    if (fromIndex === toIndex) return false;\
    const fromPeg = state.pegs[fromIndex];\
    const toPeg = state.pegs[toIndex];\
    \
    if (fromPeg.length === 0) return false;\
    \
    const diskMoving = fromPeg[fromPeg.length - 1];\
    const targetTop = toPeg.length > 0 ? toPeg[toPeg.length - 1] : Infinity;\
    \
    return diskMoving < targetTop;\
\}\
\
// \uc0\u25191 \u34892 \u31227 \u21160 \u65306 pop() \u21644  push() \u26041 \u27861 \u20351 \u29992 \
function performMove(fromIdx, toIdx) \{\
    if (!isValidMove(fromIdx, toIdx)) \{\
        showError("\uc0\u38750 \u27861 \u31227 \u21160 \u65306 \u19981 \u33021 \u23558 \u22823 \u30424 \u25918 \u22312 \u23567 \u30424 \u19978 \u65281 ");\
        return false;\
    \}\
\
    const disk = state.pegs[fromIdx].pop(); \
    state.pegs[toIdx].push(disk);\
    \
    state.moves++;\
    moveCounter.textContent = `\uc0\u31227 \u21160 : $\{state.moves\}`;\
    state.selectedPegIndex = null;\
    \
    updateUI();\
    \
    if (checkWin()) \{\
        statusBar.textContent = "\uc0\u55356 \u57225  \u24685 \u21916 \u20320 \u36194 \u20102 \u65281  \u55356 \u57225 ";\
        statusBar.className = "win";\
    \} else \{\
        statusBar.textContent = `\uc0\u31227 \u21160 \u25104 \u21151 \u65281 `;\
        statusBar.className = "";\
    \}\
    return true;\
\}\
\
// \uc0\u26816 \u26597 \u32988 \u21033 \u26465 \u20214 \
function checkWin() \{\
    return state.pegs[2].length === state.disksCount;\
\}\
\
// === 4. UI \uc0\u28210 \u26579  ===\
\
function updateUI() \{\
    boardEl.innerHTML = '';\
    const pegLabels = ['A', 'B', 'C'];\
\
    // forEach() \uc0\u26041 \u27861 \u20351 \u29992 \
    state.pegs.forEach((peg, pegIndex) => \{\
        const wrapper = document.createElement('div');\
        wrapper.className = 'peg-wrapper';\
        wrapper.dataset.index = pegIndex;\
\
        const pole = document.createElement('div');\
        pole.className = 'peg-pole';\
        wrapper.appendChild(pole);\
\
        const diskContainer = document.createElement('div');\
        diskContainer.className = 'disk-container';\
\
        // slice() \uc0\u21644  forEach() \u26041 \u27861 \u20351 \u29992 \
        peg.slice().forEach((diskSize, i) => \{\
            const width = 20 + (diskSize / state.disksCount) * 140; \
            \
            const diskEl = document.createElement('div');\
            diskEl.className = 'disk';\
            diskEl.style.width = `$\{width\}px`;\
            diskEl.style.background = `linear-gradient(180deg, $\{lightenColor(diskColors[diskSize % diskColors.length], 40)\}, $\{diskColors[diskSize % diskColors.length]\})`;\
            \
            if (state.selectedPegIndex === pegIndex && state.selectedDiskSize === diskSize && i === peg.length - 1) \{\
                diskEl.classList.add('selected');\
            \}\
\
            diskContainer.appendChild(diskEl);\
        \});\
\
        wrapper.appendChild(diskContainer);\
\
        const base = document.createElement('div');\
        base.className = 'peg-base';\
        wrapper.appendChild(base);\
\
        const label = document.createElement('div');\
        label.className = 'peg-label';\
        label.textContent = `Peg $\{pegLabels[pegIndex]\}`;\
        wrapper.appendChild(label);\
\
        boardEl.appendChild(wrapper);\
    \});\
\}\
\
function lightenColor(color, percent) \{\
    return color; \
\}\
\
// === 5. \uc0\u38169 \u35823 \u19982 \u21453 \u39304  ===\
\
function showError(msg) \{\
    statusBar.textContent = `\uc0\u9888 \u65039  $\{msg\}`;\
    statusBar.className = "error";\
    setTimeout(() => \{\
        if(!checkWin()) statusBar.className = "";\
    \}, 1500);\
\}\
\
// === 6. \uc0\u20107 \u20214 \u22788 \u29702  ===\
\
boardEl.addEventListener('click', (e) => \{\
    if (state.isSolving) return;\
\
    const wrapper = e.target.closest('.peg-wrapper');\
    if (!wrapper) return;\
\
    const targetPegIndex = parseInt(wrapper.dataset.index);\
\
    if (state.selectedPegIndex === null) \{\
        if (state.pegs[targetPegIndex].length === 0) \{\
            showError("\uc0\u35813 \u26609 \u23376 \u19978 \u27809 \u26377 \u22278 \u30424 \u65281 ");\
            return;\
        \}\
        state.selectedPegIndex = targetPegIndex;\
        state.selectedDiskSize = state.pegs[targetPegIndex][state.pegs[targetPegIndex].length - 1];\
        statusBar.textContent = `\uc0\u24050 \u36873 \u20013  Peg $\{['A','B','C'][targetPegIndex]\} \u30340 \u39030 \u37096 \u22278 \u30424 \u12290 \u35831 \u28857 \u20987 \u30446 \u26631 \u26609 \u23376 \u12290 `;\
        updateUI(); \
    \} else \{\
        const fromIdx = state.selectedPegIndex;\
        const toIdx = targetPegIndex;\
        \
        if (fromIdx === toIdx) \{\
            state.selectedPegIndex = null;\
            state.selectedDiskSize = null;\
            statusBar.textContent = "\uc0\u24050 \u21462 \u28040 \u36873 \u25321 \u12290 ";\
            updateUI();\
            return;\
        \}\
\
        performMove(fromIdx, toIdx);\
    \}\
\});\
\
resetBtn.addEventListener('click', () => \{\
    if (state.isSolving) return;\
    const currentCount = parseInt(diskCountInput.value); \
    if (currentCount < 3 || currentCount > 8) \{\
        showError("\uc0\u35831 \u36755 \u20837  3 \u21040  8 \u20043 \u38388 \u30340 \u25968 \u23383 ");\
        return;\
    \}\
    initGame(currentCount);\
\});\
\
diskCountInput.addEventListener('change', () => \{\
    resetBtn.click();\
\});\
\
// === 7. \uc0\u33258 \u21160 \u27714 \u35299 \u36923 \u36753  (\u36882 \u24402  + setTimeout) ===\
\
function startAutoSolve() \{\
    if (state.isSolving) return;\
    if (checkWin()) \{\
        initGame(state.disksCount);\
    \}\
    \
    state.isSolving = true;\
    solveBtn.disabled = true;\
    statusBar.textContent = "\uc0\u33258 \u21160 \u27714 \u35299 \u20013 ...";\
    \
    const moves = [];\
    \
    function generateMoves(n, from, to, aux) \{\
        if (n === 0) return;\
        generateMoves(n - 1, from, aux, to);\
        moves.push(\{from, to\});\
        generateMoves(n - 1, aux, to, from);\
    \}\
\
    generateMoves(state.disksCount, 0, 2, 1);\
\
    let i = 0;\
    function step() \{\
        if (i >= moves.length) \{\
            state.isSolving = false;\
            solveBtn.disabled = false;\
            statusBar.textContent = "\uc0\u55356 \u57263  \u27714 \u35299 \u23436 \u25104 \u65281 ";\
            statusBar.className = "win";\
            return;\
        \}\
\
        const move = moves[i];\
        performMove(move.from, move.to);\
        i++;\
        setTimeout(step, 400);\
    \}\
    step();\
\}\
\
solveBtn.addEventListener('click', startAutoSolve);\
\
// === 8. \uc0\u21551 \u21160 \u28216 \u25103  ===\
initGame(5);}