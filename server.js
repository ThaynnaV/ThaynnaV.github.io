// Import the 'ws' library to create a WebSocket server
const WebSocket = require('ws');

// Create a new WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Event listener for when a new client connects
wss.on('connection', function connection(ws) {
  console.log('A new client connected');

  // Event listener for when a message is received from a client
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    // Broadcast the message to all connected clients except the sender
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the WebSocket server');
});

// Log to the console that the WebSocket server is running
console.log('WebSocket server is running on ws://localhost:8080');
