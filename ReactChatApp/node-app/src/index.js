const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 7070 });
const clients = new Map();

wss.on('connection', (ws) => {
  let nickname = '';

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'join') {
      if (Array.from(clients.values()).includes(parsedMessage.nickname)) {
        ws.send(JSON.stringify({ type: 'error', message: 'Nickname already taken' }));
        ws.close();
      } else {
        nickname = parsedMessage.nickname;
        clients.set(ws, nickname);
        broadcast({ type: 'join', nickname });
      }
    } else if (parsedMessage.type === 'message') {
      broadcast({ type: 'message', nickname, message: parsedMessage.message });
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    broadcast({ type: 'leave', nickname });
  });

  function broadcast(data) {
    clients.forEach((clientNickname, client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
});

console.log('WebSocket server is running on ws://localhost:7070');
