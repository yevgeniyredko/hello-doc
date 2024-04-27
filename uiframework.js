function getHashValue() {
    return location.hash.slice(1);
}

function showWizard() {
    document.getElementById("Wizard").className = "pageLayout";
    document.getElementById("MainTask").className = "hidden";
    document.getElementById("TasksComplete").className = "hidden";
}

function showMainTask() {
    document.getElementById("Wizard").className = "hidden";
    document.getElementById("MainTask").className = "pageLayout";
    document.getElementById("TasksComplete").className = "hidden";
}

function showTasksComplete() {
    document.getElementById("Wizard").className = "hidden";
    document.getElementById("MainTask").className = "hidden";
    document.getElementById("TasksComplete").className = "pageLayout";
}

function showNextTaskButton() {
    document.getElementById("NextTaskButton").classList.remove("hidden");
}

function hideNextTaskButton() {
    document.getElementById("NextTaskButton").classList.add("hidden");
}

function setText(elementId, text) {
    document.getElementById(elementId).replaceChildren(text);
}

function makeDocGreen(status) {
    const element = document.getElementById(status);
    setElementGreen(element);
}

function makeDocBlue(status) {
    const element = document.getElementById(status);
    setElementBlue(element);
}

function makeDocRed(status) {
    const element = document.getElementById(status);
    setElementRed(element);
}

function makeDocGray(status) {
    const element = document.getElementById(status);
    setElementGray(element);
}

function setAllGray() {
    document.getElementById("Docflow").childNodes.forEach(c => setElementGray(c));
}

function setElementGreen(element) {
    setElementColor(element, "_green");
}

function setElementBlue(element) {
    setElementColor(element, "_blue");
}

function setElementRed(element) {
    setElementColor(element, "_red");
}

function setElementColor(element, color) {
    if (!element.classList) {
        return;
    }
    setElementGray(element);
    element.classList.add(color);
}

function setElementGray(element) {
    if (!element.classList) {
        return;
    }
    element.classList.remove("_blue");
    element.classList.remove("_green");
    element.classList.remove("_red");
}