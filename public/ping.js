let roundTripTimes = new Array(3600).fill(-1);
let testInProgress = false;
const penaltyTime = 2000; // 2000 ms penalty for lost/delayed packets
const totalDuration = 60000; // 60 seconds
const intervalDuration = totalDuration / roundTripTimes.length; // Time between packets

function sendPing(index) {
    const clientTimeBeforeRequest = new Date().getTime();

    fetch('/ping?rand=' + Math.random(), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ clientTime: clientTimeBeforeRequest })
    })
    .then(response => response.json())
    .then(data => {
        const clientTimeAfterRequest = new Date().getTime();
        roundTripTimes[index] = clientTimeAfterRequest - clientTimeBeforeRequest;
    })
    .catch(() => {
        roundTripTimes[index] = penaltyTime; // Apply penalty if request fails or times out
    });
}

function startSendingPings() {
    roundTripTimes.fill(-1);
    testInProgress = true;
    document.getElementById("testStatus").textContent = "Test in progress...";

    for (let i = 0; i < roundTripTimes.length; i++) {
        setTimeout(() => sendPing(i), i * intervalDuration);
    }

    setTimeout(finishTest, totalDuration + 10000); // Extra time to account for responses
}

function finishTest() {
    testInProgress = false;
    const maxTime = Math.max(...roundTripTimes);
    const startTime = new Date().toLocaleTimeString();

    updateResultsTable(startTime, maxTime);
    document.getElementById("testStatus").textContent = "Ready for next ping";
}

function updateResultsTable(startTime, maxPing) {
    const table = document.getElementById("resultsTable");
    const row = table.insertRow(-1); // Insert a new row at the end
    row.insertCell(0).textContent = startTime;
    row.insertCell(1).textContent = maxPing + " ms";
}

function finishTest() {
    const maxTime = Math.max(...roundTripTimes);
    const startTime = new Date().toLocaleTimeString();

    updateResultsTable(startTime, maxTime);

    document.getElementById("testStatus").textContent = "Ready for next ping";
}


// Call this function to start the process
startSendingPings();
