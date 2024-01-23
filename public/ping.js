async function sendPing() {
    try {
        const clientTimeBeforeRequest = new Date();
        const clientTimeBeforeRequestUTC = clientTimeBeforeRequest.toISOString();

        const response = await fetch('/ping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientTime: clientTimeBeforeRequestUTC }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const clientTimeAfterRequest = new Date();
        const serverTime = new Date(data.serverTime);

        const timeLag = clientTimeAfterRequest - serverTime;

        alert("Timestamp (Client): " + clientTimeBeforeRequestUTC + 
              "\nTimestamp (Server): " + data.serverTime +
              "\nTime Lag (Client-Server): " + timeLag + "ms");
    } catch (error) {
        console.error("Error sending ping:", error);
    }
}

sendPing();
