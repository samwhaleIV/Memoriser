const fileSelectionPanel = document.body.children[0];
const fileSelector = fileSelectionPanel.children[1];

const memoriserPanel = document.body.children[1];

document.addEventListener("keypress",function onPress(event){
    if(progress.correctAnswer !== 0) {
        switch(event.key) {
            case "1":
                processAnswer(event,1);
                break;
            case "2":
                processAnswer(event,2);
                break;
            case "3":
                processAnswer(event,3);
                break;
            case "4":
                processAnswer(event,4);
                break;
        }
    }
});

let rawDictionary = null;
let dictionary = null;
let dlength;

const progressParagraph = document.getElementById("progress");
const memoriserButtons = document.getElementById("memoriserButtons");
const memoriserHead = document.getElementById("memoriserHead");

memoriserButtons.children[0].addEventListener("click", event => processAnswer(event,1));
memoriserButtons.children[1].addEventListener("click", event => processAnswer(event,2));
memoriserButtons.children[2].addEventListener("click", event => processAnswer(event,3));
memoriserButtons.children[3].addEventListener("click", event => processAnswer(event,4));

let progress = {
    score: 0,
    total: 0,
    correctAnswer: 0,
}

function updateProgress() {
    if(progress.total === 0) {
        progressParagraph.innerHTML = "0/0<br>100.00%";
    } else if(progress.score === 0) {
        progressParagraph.innerHTML = `0/${progress.total}<br>0.00%`;
    } else {
        let percentString = ((progress.score / progress.total) * 100).toString();
        const percentSplit = percentString.split(".");
        if(percentSplit.length === 1) {
            percentString += ".00";
        } else if(percentSplit[1].length === 1) {
            percentString += "0";
        } else if(percentSplit[1].length > 2) {
            percentString = `${percentSplit[0]}.${percentSplit[1].substr(0,2)}`;
        }
        progressParagraph.innerHTML = `${progress.score}/${progress.total}<br>${percentString}%`;
    }
}

memoriserPanel.children[0].onclick = function() {
    switchToFileSelection();
}

fileSelector.onchange = function(e) {
    const file = fileSelector.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        rawDictionary = reader.result;
        switchToMemoriser();
    };
    reader.onerror = function(e) {
        alert("Error opening file!");
    }
    reader.readAsText(file);
};


function processDictionary() {
    dictionary = [];
    const lines = rawDictionary.split("\n");

    for(let i = 0;i<lines.length;i+=3) {
        dictionary.push(
            [lines[i],lines[i+1]]
        );
    }
    dlength = dictionary.length;
}

function switchToMemoriser() {
    fileSelectionPanel.classList.add("hidden");
    processDictionary();
    progress.score = -1;
    progress.total = -1;
    nextRound(true);
    memoriserPanel.classList.remove("hidden");
}

function switchToFileSelection() {
    progress.correctAnswer = 0;
    memoriserPanel.classList.add("hidden");
    fileSelector.value = "";
    fileSelectionPanel.classList.remove("hidden");
}

function generateQuestion() {
    const answerIndex = Math.floor(Math.random()*dlength);

    const indexes = [];
    let index = null;

    do {

        do {
            index = Math.floor(Math.random()*dlength);
        } while(index === answerIndex);

        indexes.push(index);

    } while (indexes.length < 3);


    const answerNumber = Math.floor(Math.random()*4);

    if(Math.random() < 0.5) { //left match to right sides
        switch(answerNumber) {
            case 0:
            return [
                dictionary[answerIndex][0],
                dictionary[answerIndex][1],
                dictionary[indexes[0]][1],
                dictionary[indexes[1]][1],
                dictionary[indexes[2]][1],
                1
            ]
            case 1:
            return [
                dictionary[answerIndex][0],
                dictionary[indexes[0]][1],
                dictionary[answerIndex][1],
                dictionary[indexes[1]][1],
                dictionary[indexes[2]][1],
                2
            ]
            case 2:
            return [
                dictionary[answerIndex][0],
                dictionary[indexes[0]][1],
                dictionary[indexes[1]][1],
                dictionary[answerIndex][1],
                dictionary[indexes[2]][1],
                3
            ]
            case 3:
            return [
                dictionary[answerIndex][0],
                dictionary[indexes[0]][1],
                dictionary[indexes[1]][1],
                dictionary[indexes[2]][1],
                dictionary[answerIndex][1],
                4
            ]
        }
    } else { //right match to left sides
        switch(answerNumber) {
            case 0:
            return [
                dictionary[answerIndex][1],
                dictionary[answerIndex][0],
                dictionary[indexes[0]][0],
                dictionary[indexes[1]][0],
                dictionary[indexes[2]][0],
                1
            ]
            case 1:
            return [
                dictionary[answerIndex][1],
                dictionary[indexes[0]][0],
                dictionary[answerIndex][0],
                dictionary[indexes[1]][0],
                dictionary[indexes[2]][0],
                2
            ]
            case 2:
            return [
                dictionary[answerIndex][1],
                dictionary[indexes[0]][0],
                dictionary[indexes[1]][0],
                dictionary[answerIndex][0],
                dictionary[indexes[2]][0],
                3
            ]
            case 3:
            return [
                dictionary[answerIndex][1],
                dictionary[indexes[0]][0],
                dictionary[indexes[1]][0],
                dictionary[indexes[2]][0],
                dictionary[answerIndex][0],
                4
            ]
        }

    }
}

function processAnswer(event,answer) {
    nextRound(answer === progress.correctAnswer);
}

function nextRound(correct) {
    if(correct) {
        progress.score++;
    }

    const questionData = generateQuestion();

    memoriserHead.textContent = questionData[0];

    memoriserButtons.children[0].textContent = questionData[1];
    memoriserButtons.children[1].textContent = questionData[2];
    memoriserButtons.children[2].textContent = questionData[3];
    memoriserButtons.children[3].textContent = questionData[4];

    progress.correctAnswer = questionData[5];

    progress.total++;
    updateProgress();
}