let roundTripTimesPoll = [];
let pollTestInProgress = false;
let pollTestCount = 0;
const maxPollTests = 60;
const pollTestDuration = 10000; // 10 seconds
const pollsPerSecond = 10;
const totalPolls = pollTestDuration / 1000 * pollsPerSecond; // Total polls in one burst

function sendPoll(index) {
    const clientTimeBeforeRequest = new Date().getTime();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/poll?rand=' + Math.random(), true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const clientTimeAfterRequest = new Date().getTime();
            roundTripTimesPoll[index] = clientTimeAfterRequest - clientTimeBeforeRequest;
        }
    };
    xhr.send(JSON.stringify({ clientTime: clientTimeBeforeRequest }));
}

function startPollTest() {
    if (pollTestInProgress) {
        return;
    }

    pollTestInProgress = true;
    let pollStartButton = document.getElementById("pollStartButton");
    pollStartButton.textContent = "Test Running";
    pollStartButton.style.backgroundColor = "grey";
    pollStartButton.disabled = true;

    pollTestCount = 0;
    runPollTestLoop();
}

function runPollTestLoop() {
    roundTripTimesPoll = [];
    for (let i = 0; i < totalPolls; i++) {
        setTimeout(() => sendPoll(i), i * (1000 / pollsPerSecond));
    }

    setTimeout(() => {
        endPollTest();
    }, pollTestDuration + 1000);
}

function endPollTest() {
    const stats = calculatePingStats(roundTripTimesPoll);
    updatePollResultsTable(stats);

    pollTestCount++;
    if (pollTestCount < maxPollTests) {
        setTimeout(runPollTestLoop, 1000);
    } else {
        let pollStartButton = document.getElementById("pollStartButton");
        pollStartButton.textContent = "Start Poll Test";
        pollStartButton.style.backgroundColor = "";
        pollStartButton.disabled = false;
        document.getElementById("pollTestStatus").textContent = "Poll test completed.";
        pollTestInProgress = false;
    }
}

// Reuse the calculatePingStats and updatePingResultsTable functions from ping.js
// Or define them here if they are not included in ping.js
