// Q1
// ----------------------------------
// const fs = require('fs')
// const path = require('path')
// const fille_path= path.join(__dirname,'Example.txt');
// console.log(fille_path);
// const read = fs.createReadStream(fille_path,'utf-8');
// read.on('data',(chunk)=>{
//     console.log("Display chunk");
//     console.log(chunk);
// });
// read.on('end',()=>{
//     console.log("End Fille");

// });
// read.on('error',()=>{
//     console.log("Error");

// });
// -------------------------------------------------
// Q2
// ------------------------------
// const fs = require('fs')
// const read_stream = fs.createReadStream("./Example.txt","utf-8");
// const write_stream = fs.createWriteStream("./Copy.txt","utf-8");
// read_stream.on('data',(chunk)=>{
// write_stream.write(chunk);
// });
// read_stream.on('end',(chunk)=>{
// console.log("End");

// });
// read_stream.on('error',()=>{
//     console.log("Error");
// });
// -------------------------------------------
// Q3
// ------------------------------
// const fs = require('fs');
// const zlib = require('zlib')
// const gzip = zlib.createGzip();
// const read_stream = fs.createReadStream('./Example.txt', 'utf-8');
// const write_stream = fs.createWriteStream('./Ex2.txt.gz', 'utf-8');
// read_stream.pipe(gzip).pipe(write_stream)
// --------------------------------------------------
// const http = require("node:http");
// const fs = require("node:fs");

// const port = 3000;
// const filePath = "./Myjson.json";

// function readUsers() {
//     if (!fs.existsSync(filePath)) return [];
//     const data = fs.readFileSync(filePath, "utf-8");
//     if (!data) return [];
//     try {
//     return JSON.parse(data);
//     }catch {
//     return [];
//     }
// }

// function writeUsers(users) {
//     fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
// }

// const server = http.createServer((request, response) => {
//     const { method, url } = request;
//     response.setHeader("Content-Type", "application/json");

//     if (method === "GET" && url === "/users") {
//     return response.end(JSON.stringify(readUsers()));
//     }

//     if (method === "POST" && url === "/users") {
//     let body = "";
//     request.on("data", chunk => body += chunk);
//     request.on("end", () => {
//         const newUser = JSON.parse(body);
//         const users = readUsers();

//         newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
//         users.push(newUser);
//         writeUsers(users);

//         response.writeHead(201);
//         response.end(JSON.stringify(newUser));
//     });
//     return;
//     }

//     response.writeHead(404);
//     response.end(JSON.stringify({ message: "Route not found" }));
// });

// server.listen(port, () => {
//     console.log(`Server is running http://localhost:${port}`);
// });
// Q1
// ----------------------------------
// const fs = require('fs')
// const path = require('path')
// const fille_path= path.join(__dirname,'Example.txt');
// console.log(fille_path);
// const read = fs.createReadStream(fille_path,'utf-8');
// read.on('data',(chunk)=>{
//     console.log("Display chunk");
//     console.log(chunk);
// });
// read.on('end',()=>{
//     console.log("End Fille");

// });
// read.on('error',()=>{
//     console.log("Error");

// });
// -------------------------------------------------
// Q2
// ------------------------------
// const fs = require('fs')
// const read_stream = fs.createReadStream("./Example.txt",'utf-8');
// const write_stream = fs.createWriteStream("./Copy.txt",'utf-8');
// read_stream.on('data',(chunk)=>{
// write_stream.write(chunk);
// });
// read_stream.on('end',(chunk)=>{
// console.log("End");

// });
// read_stream.on('error',()=>{
//     console.log("Error");
// });
// -------------------------------------------
// Q3
// ------------------------------
// const http = require("node:http");
// const fs = require("node:fs");
// const path = require("node:path");

// const port = 3000;
// const dataFile = path.join(__dirname, "users.json");

// function readUsers() {
//   if (!fs.existsSync(dataFile)) {
//     fs.writeFileSync(dataFile, JSON.stringify([]));
//   }
//   const data = fs.readFileSync(dataFile, "utf-8");
//   return JSON.parse(data || "[]");
// }

// function writeUsers(users) {
//   fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
// }

// const server = http.createServer((request, response) => {
//   const { method, url } = request;
//   response.setHeader("Content-Type", "application/json");

//   if (method === "GET" && url === "/users") {
//     const users = readUsers();
//     return response.end(JSON.stringify(users));
//   }

//   if (method === "POST" && url === "/users") {
//     let body = "";

//     request.on("data", chunk => body += chunk);
//     request.on("end", () => {
//       try {
//         const newUser = JSON.parse(body);
//         const users = readUsers();

//         newUser.id = users.length
//           ? users[users.length - 1].id + 1
//           : 1;

//         users.push(newUser);
//         writeUsers(users);

//         response.writeHead(201);
//         response.end(JSON.stringify(newUser));
//       } catch {
//         response.writeHead(400);
//         response.end(JSON.stringify({ message: "Invalid JSON" }));
//       }
//     });
//     return;
//   }

//   if (method === "PATCH" && url.startsWith("/users/")) {
//     const id = parseInt(url.split("/")[2], 10);
//     let body = "";

//     request.on("data", chunk => body += chunk);
//     request.on("end", () => {
//       try {
//         const updates = JSON.parse(body);
//         const users = readUsers();
//         const user = users.find(u => u.id === id);

//         if (!user) {
//           response.writeHead(404);
//           return response.end(JSON.stringify({ message: "User not found" }));
//         }

//         Object.assign(user, updates);
//         writeUsers(users);

//         response.end(JSON.stringify(user));
//       } catch {
//         response.writeHead(400);
//         response.end(JSON.stringify({ message: "Invalid JSON" }));
//       }
//     });
//     return;
//   }

//   if (method === "DELETE" && url.startsWith("/users/")) {
//     const id = parseInt(url.split("/")[2], 10);
//     const users = readUsers();
//     const index = users.findIndex(u => u.id === id);

//     if (index === -1) {
//       response.writeHead(404);
//       return response.end(JSON.stringify({ message: "User not found" }));
//     }

//     const deletedUser = users.splice(index, 1);
//     writeUsers(users);

//     return response.end(JSON.stringify(deletedUser[0]));
//   }

//   response.writeHead(404);
//   response.end(JSON.stringify({ message: "not found" }));
// });

// server.listen(port, () => {
//      console.log(`Server is running http://localhost:${port}`);
// });
