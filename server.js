const express = require('express');
const http = require('http');
const bodyParser = require("body-parser");
const path = require('path');
const ejs = require('ejs');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: path.resolve(__dirname, '.env') });

const app = express();
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const databaseAndCollection = {db: "Restaurant", collection: "guest"};
const uri = `mongodb+srv://${userName}:${password}@cluster0.lxrteir.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

process.stdin.setEncoding("utf8");

if (process.argv.length != 2) {
	process.stdout.write(`Usage server.js`);
	process.exit(1);
}
 
const portNumber = 3000;
app.listen(portNumber);
console.log(`Web server started and running at http://localhost:${portNumber}`);
const prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.on('readable', () => {  
	let dataInput = process.stdin.read();
	if (dataInput !== null) {
		let command = dataInput.trim();
		if (command.toLowerCase() === "stop") {
			console.log("Shutting down the server");
            process.exit(0); 
        }
        process.stdout.write(prompt);
		process.stdin.resume();
    }
});

app.set("views", path.resolve(__dirname, ""));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, ''))); 



app.get("/", (request, response) => { 
	response.render("index"); 
});

app.get("/login", (request, response) => { 
	response.render("login");
});

app.get("/add", (request, response) => { 
	response.render("add");
});

app.post("/apply", async (request, response) => { 
    const applicant = { 
		name: request.body.name,
		phone : request.body.phone,
		address: request.body.address,
		date: request.body.date,
		position: request.body.position,
		salary: request.body.salary
	  };
    try {
        await client.connect();
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(applicant);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
		response.render("login");
    }
});

app.get("/remove", (request, response) => { 
	response.render("remove");
});