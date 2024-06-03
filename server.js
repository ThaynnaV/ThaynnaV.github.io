const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on('connection', (socket) => {
    console.log('A new client connected');
    clients.push(socket);

    socket.on('message', (message) => {
        console.log('Received:', message);

        // Broadcast the message to all clients
        clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on('close', () => {
        clients = clients.filter(client => client !== socket);
        console.log('A client disconnected');
    });
});
