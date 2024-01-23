let roundTripTimesPoll = [];
let pollTestInProgress = false;
let pollTestCount = 0;
const maxPollTests = 15;
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

function calculatePingStats(times) {
    const validTimes = times.filter(time => time >= 0);
    if (validTimes.length === 0) return { max: 0, min: 0, average: 0, median: 0, stdev: 0 };

    const sum = validTimes.reduce((a, b) => a + b, 0);
    const average = sum / validTimes.length;

    const sortedTimes = validTimes.slice().sort((a, b) => a - b);
    const median = sortedTimes.length % 2 !== 0 ? 
        sortedTimes[Math.floor(sortedTimes.length / 2)] : 
        (sortedTimes[sortedTimes.length / 2 - 1] + sortedTimes[sortedTimes.length / 2]) / 2;

    const max = sortedTimes[sortedTimes.length - 1];
    const min = sortedTimes[0];

    const squareDiffs = validTimes.map(time => Math.pow(time - average, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / validTimes.length;
    const stdev = Math.sqrt(avgSquareDiff);

    return { max, min, average, median, stdev };
}

function updatePollResultsTable({ max, min, average, median, stdev }) {
    const table = document.getElementById("pollResultsTable");
    const row = table.insertRow(-1);
    row.insertCell(0).textContent = max.toFixed(2);
    row.insertCell(1).textContent = min.toFixed(2);
    row.insertCell(2).textContent = average.toFixed(2);
    row.insertCell(3).textContent = median.toFixed(2);
    row.insertCell(4).textContent = stdev.toFixed(2);
}
