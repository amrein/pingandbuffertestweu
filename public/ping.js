let maxTime = 0;
let requestsCount = 0;

function sendPing() {
    const clientTimeBeforeRequest = new Date().getTime();

    fetch('/ping', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ clientTime: clientTimeBeforeRequest })
    })
    .then(response => response.json())
    .then(data => {
        const clientTimeAfterRequest = new Date().getTime();
        const roundTripTime = clientTimeAfterRequest - clientTimeBeforeRequest;
        maxTime = Math.max(maxTime, roundTripTime);
    })
    .finally(() => {
        requestsCount++;
        if (requestsCount === 50) {
            alert("Longest round-trip time: " + maxTime + " ms");
        }
    });
}

function startSendingPings() {
    for (let i = 0; i < 50; i++) {
        setTimeout(sendPing, Math.random() * 10000); // Schedule ping within 10 seconds
    }
}

// Call this function to start the process
startSendingPings();
