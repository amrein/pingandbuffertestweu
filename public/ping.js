let roundTripTimes = [];
let pingTestInProgress = false;
let pingTestCount = 0;
const maxPingTests = 60;
const pingTestDuration = 10000; // 10 seconds
const packetsPerSecond = 10;
const totalPackets = pingTestDuration / 1000 * packetsPerSecond; // Total packets in one burst

function sendPing() {
    const clientTimeBeforeRequest = new Date().getTime();

    fetch('/ping?rand=' + Math.random(), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ clientTime: clientTimeBeforeRequest })
    })
    .then(response => response.json())
    .then(data => {
        const clientTimeAfterRequest = new Date().getTime();
        roundTripTimes.push(clientTimeAfterRequest - clientTimeBeforeRequest);
    });
}

function startPingTest() {
    if (pingTestInProgress) {
        return; // Prevent starting a new test if one is already in progress
    }

    pingTestInProgress = true;
    let pingStartButton = document.getElementById("pingStartButton");
    pingStartButton.textContent = "Test Running";
    pingStartButton.style.backgroundColor = "grey";
    pingStartButton.disabled = true;

    pingTestCount = 0;
    runPingTestLoop();
}

function runPingTestLoop() {
    roundTripTimes = [];
    for (let i = 0; i < totalPackets; i++) {
        setTimeout(sendPing, i * (1000 / packetsPerSecond));
    }

    setTimeout(() => {
        endPingTest();
    }, pingTestDuration + 1000);
}

function endPingTest() {
    const stats = calculatePingStats(roundTripTimes);
    updatePingResultsTable(stats);

    pingTestCount++;
    if (pingTestCount < maxPingTests) {
        setTimeout(runPingTestLoop, 100);
    } else {
        let pingStartButton = document.getElementById("pingStartButton");
        pingStartButton.textContent = "Start Ping Test";
        pingStartButton.style.backgroundColor = "";
        pingStartButton.disabled = false;
        document.getElementById("pingTestStatus").textContent = "Ping test completed.";
        pingTestInProgress = false;
    }
}

function calculatePingStats(times) {
    times.sort((a, b) => a - b);
    const min = times[0];
    const max = times[times.length - 1];
    const sum = times.reduce((a, b) => a + b, 0);
    const average = sum / times.length;
    const median = times.length % 2 !== 0 ? times[Math.floor(times.length / 2)] : (times[times.length / 2 - 1] + times[times.length / 2]) / 2;
    const squareDiffs = times.map(time => Math.pow(time - average, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / times.length;
    const stdev = Math.sqrt(avgSquareDiff);
    
    return { max, min, average, median, stdev };
}

function updatePingResultsTable({ max, min, average, median, stdev }) {
    const table = document.getElementById("pingResultsTable");
    const row = table.insertRow(-1);
    row.insertCell(0).textContent = max.toFixed(2);
    row.insertCell(1).textContent = min.toFixed(2);
    row.insertCell(2).textContent = average.toFixed(2);
    row.insertCell(3).textContent = median.toFixed(2);
    row.insertCell(4).textContent = stdev.toFixed(2);
}
