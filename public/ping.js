let roundTripTimes = [];
let testInProgress = false;

function sendPing(index) {
    const clientTimeBeforeRequest = new Date().getTime();

    fetch('/ping', {
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

function startSendingPings() {
    roundTripTimes = new Array(50).fill(-1);
    testInProgress = true;
    document.getElementById("testStatus").textContent = "Test in progress...";

    for (let i = 0; i < 50; i++) {
        setTimeout(() => sendPing(i), Math.random() * 10000); // Schedule ping within 10 seconds
    }

    setTimeout(finishTest, 20000); // Allow an extra 10 seconds for server response
}


function updateResultsTable(startTime, clientIP, maxPing) {
    const table = document.getElementById("resultsTable");
    const row = table.insertRow(-1); // Insert a new row at the end
    row.insertCell(0).textContent = startTime;
    row.insertCell(1).textContent = clientIP;
    row.insertCell(2).textContent = maxPing + " ms";
}

function finishTest() {
    const maxTime = Math.max(...roundTripTimes);
    const startTime = new Date().toLocaleTimeString();
    const clientIP = "TBD"; // Placeholder for client IP. You need to determine how to fetch it.

    updateResultsTable(startTime, clientIP, maxTime);

    document.getElementById("testStatus").textContent = "Ready for next ping";
}


// Call this function to start the process
startSendingPings();
