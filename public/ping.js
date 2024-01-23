let roundTripTimes = [];
let testInProgress = false;
let testCount = 0;
const maxTests = 60;
const testDuration = 10000; // 10 seconds
const packetsPerSecond = 20;
const totalPackets = testDuration / 1000 * packetsPerSecond; // Total packets in one burst

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
    });
}

function startTestBurst() {
    if (testInProgress) {
        return; // Prevent starting a new test if one is already in progress
    }

    testInProgress = true;
    document.getElementById("startButton").textContent = "Test Running";
    
    roundTripTimes = [];
    for (let i = 0; i < totalPackets; i++) {
        setTimeout(sendPing, i * (1000 / packetsPerSecond));
    }

    setTimeout(endTestBurst, testDuration);

    testCount = 0;
    runTestLoop();
}

function runTestLoop() {
    if (testCount < maxTests) {
        roundTripTimes = [];
        for (let i = 0; i < totalPackets; i++) {
            setTimeout(() => sendPing(i), i * (1000 / packetsPerSecond));
        }

        // Wait for the current burst to finish before starting the next one
        setTimeout(() => {
            testCount++;
            runTestLoop();
        }, testDuration + 1000); // 1 second buffer after testDuration
    } else {
        endTestBurst();
    }
}


function endTestBurst() {
    const maxTime = Math.max(...roundTripTimes);
    const startTime = new Date().toLocaleTimeString();
    updateResultsTable(startTime, maxTime);
    testCount++;

    if (testCount < maxTests) {
        setTimeout(startTestBurst, 1000); // Wait for 1 second before starting the next burst
    } else {
        document.getElementById("testStatus").textContent = "Test completed.";
    }
}

function updateResultsTable(startTime, maxPing) {
    const table = document.getElementById("resultsTable");
    const row = table.insertRow(-1); // Insert a new row at the end
    row.insertCell(0).textContent = startTime;
    const pingCell = row.insertCell(1);
    pingCell.textContent = maxPing + " ms";
    pingCell.className = "right-align"; // Apply the class to the cell
}

function finishTest() {
    const maxTime = Math.max(...roundTripTimes);
    const startTime = new Date().toLocaleTimeString();

    updateResultsTable(startTime, maxTime);

    document.getElementById("testStatus").textContent = "Ready for next ping";
}
