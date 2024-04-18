export class Room {
    constructor(name) {
        this.name = name;
        this.clients = new Set();
    }

    join(client) {
        this.clients.add(client);
    }

    leave(client) {
        this.clients.delete(client);
    }

    send(message) {
        for (const client of this.clients) {
            client.send(message);
        }
    }
}