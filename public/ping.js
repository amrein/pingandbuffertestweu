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

function finishTest() {
    testInProgress = false;
    const maxTime = Math.max(...roundTripTimes);
    document.getElementById("testStatus").textContent = "Test completed. Longest round-trip time: " + maxTime + " ms";
}

// Call this function to start the process
startSendingPings();
