let currentTask = 1;
const taskCount = 5;

let startTime;
let endTime;

function onTestNumberChanged(value) {
    currentTask = Number(value);

    setAllGray();
    const {expectedResult} = testCases[currentTask];
    makeDocGreen(expectedResult.status);
    setText("TestNumber", currentTask + 1);
    setText("DocumentNumber", expectedResult.documentNumber);
    setText("DocumentSum", expectedResult.totalSum);
}

function _runTest() {
    const {eventPack, expectedResult} = testCases[currentTask];
    if (!eventPack || eventPack.length === 0) {
        alert("В цепочке документооборота отсутствуют события");
        return;
    }

    setAllGray();
    runTestStep(eventPack, 0, createEmptyState(), expectedResult);
}

function runTestStep(events, eventNumber, state, expectedResult) {
    if (eventNumber !== 0) {
        makeDocGray(state.data.status);
    }

    if (events.length === eventNumber) {
        if (JSON.stringify(state.data) === JSON.stringify(expectedResult)) {
            makeDocGreen(state.data.status);
            showNextTaskButton();
        } else {
            makeDocRed(state.data.status);
        }
        return;
    }

    const event = events[eventNumber];
    runWorkflowEvent(state, event);
    if (state.error != null) {
        alert(`Произошла ошибка: ${state.error}`);
        return;
    }

    makeDocBlue(state.data.status);
    setTimeout(() => {
        runTestStep(events, eventNumber + 1, state, expectedResult);
    }, 300);
}

function startTasks() {
    startTime = new Date();
    location.assign('#0');
    showMainTask();
}

function goToNextTask() {
    const nextTask = currentTask + 1;
    if (nextTask === taskCount) {
        onLastTaskCompleted();
        return;
    }
    location.assign(`#${nextTask}`);
    hideNextTaskButton();
}

function onLastTaskCompleted() {
    endTime = new Date();
    setText("StartTime", startTime);
    setText("EndTime", endTime);
    showTasksComplete();
}

function pageLoad() {
    if (getHashValue() === "wizard") {
        showWizard();
    } else {
        showMainTask();
        onTestNumberChanged(getHashValue());
    }

    addEventListener("hashchange", () => {
        onTestNumberChanged(getHashValue());
    });
}

pageLoad();
