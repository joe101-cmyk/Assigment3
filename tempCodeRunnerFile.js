const http = require("node:http");
const fs = require("node:fs");

const port = 3000;

const filePath = "./Myjson.json";

function readUsers() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf-8");
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (err) {
        console.error("Failed to parse users JSON:", err);
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

const server = http.createServer((request, response) => {
    const { method, url } = request;
    response.setHeader("Content-Type", "application/json");

    if (method === "GET" && url === "/users") {
    const users = readUsers();
    response.end(JSON.stringify(users));
    }

    else if (method === "GET" && url.startsWith("/users/")) {
    const id = Number(url.split("/")[2]);
    if (!Number.isInteger(id) || id <= 0) {
        response.writeHead(400);
        return response.end(JSON.stringify({ message: "Invalid id" }));
    }

    const users = readUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
        response.writeHead(404);
        return response.end(JSON.stringify({ message: "User not found" }));
    }

    response.end(JSON.stringify(user));
    }

    else if (method === "POST" && url === "/users") {
    let body = "";
    request.on("data", chunk => body += chunk);
    request.on("end", () => {
        let newUser;
        try {
            newUser = JSON.parse(body);
        } catch (err) {
            response.writeHead(400);
            return response.end(JSON.stringify({ message: "Invalid JSON" }));
        }

        const users = readUsers();

        if (users.some(u => u.email === newUser.email)) {
            response.writeHead(409);
            return response.end(JSON.stringify({ message: "Email already exists" }));
        }

        newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
        users.push(newUser);
        writeUsers(users);

        response.writeHead(201);
        response.end(JSON.stringify(newUser));
    });
    }

    else if (method === "PATCH" && url.startsWith("/users/")) {
    const id = Number(url.split("/")[2]);
    if (!Number.isInteger(id) || id <= 0) {
        response.writeHead(400);
        return response.end(JSON.stringify({ message: "Invalid id" }));
    }

    let body = "";
    request.on("data", chunk => body += chunk);
    request.on("end", () => {
        let updates;
        try {
            updates = JSON.parse(body);
        } catch (err) {
            response.writeHead(400);
            return response.end(JSON.stringify({ message: "Invalid JSON" }));
        }

        const users = readUsers();
        const user = users.find(u => u.id === id);

        if (!user) {
            response.writeHead(404);
            return response.end(JSON.stringify({ message: "User not found" }));
        }

        if (Object.prototype.hasOwnProperty.call(updates, 'name')) user.name = updates.name;
        if (Object.prototype.hasOwnProperty.call(updates, 'age')) user.age = updates.age;
        if (Object.prototype.hasOwnProperty.call(updates, 'email')) user.email = updates.email;

        writeUsers(users);
        response.end(JSON.stringify({ message: "User updated" }));
    });
    }

    else if (method === "DELETE" && url.startsWith("/users/")) {
    const id = Number(url.split("/")[2]);
    if (!Number.isInteger(id) || id <= 0) {
        response.writeHead(400);
        return response.end(JSON.stringify({ message: "Invalid id" }));
    }

    const users = readUsers();
    const filteredUsers = users.filter(u => u.id !== id);

    writeUsers(filteredUsers);
    response.end(JSON.stringify({ message: "User deleted" }));
    }

    else {
    response.writeHead(404);
    response.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});
