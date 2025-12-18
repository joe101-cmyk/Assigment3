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
    }catch {
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
    return response.end(JSON.stringify(readUsers()));
    }

    if (method === "POST" && url === "/users") {
    let body = "";
    request.on("data", chunk => body += chunk);
    request.on("end", () => {
        const newUser = JSON.parse(body);
        const users = readUsers();

        newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
        users.push(newUser);
        writeUsers(users);

        response.writeHead(201);
        response.end(JSON.stringify(newUser));
    });
    return;
    }

    response.writeHead(404);
    response.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});
