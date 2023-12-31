const express = require('express');
const http = require('http');
const bodyParser = require("body-parser");
const path = require('path');
const ejs = require('ejs');
const { MongoClient,ServerApiVersion } = require('mongodb');
const Double = require("mongodb").Double;
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

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, ""))); 
app.use(express.json());


app.get("/", (request, response) => { 
	response.render("index"); 
});

app.get("/login", (request, response) => { 
	response.render("login");
});

app.get("/add", (request, response) => { 
	response.render("add");
});

app.post("/add", async (request, response) => { 
    const applicant = { 
		name: request.body.name,
		phone : request.body.phone,
		address: request.body.address,
		date: request.body.date,
		position: request.body.position,
		salary: request.body.salary,
        tips: new Double(0),
        party: 0,
        days: 0
	  };
    try {
        await client.connect();
		const id = await client.db(databaseAndCollection.db).collection("counter").findOneAndUpdate(
			{ "_id" : "counter" },
			{ $inc: { "count" : 1 } });
		applicant.id = id.value.count;
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(applicant);
    	response.render("login");
	} catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

app.get("/remove", async (request, response) => { 
	let table = ``
	let filter = {};
	try {
        await client.connect();
        const cursor = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .find(filter);
        const result = await cursor.toArray();
        result.forEach(employee => table += 
            `<tr>
                <td><input type="checkbox" name="cb" value="${employee["id"]}"></td>
				<td>${employee["id"]}</td>
                <td>${employee["name"]}</td>
                <td>${employee["position"]}</td>
                <td>${employee["phone"]}</td>
                <td>${employee["address"]}</td>
              </tr>`);
        let variable = {table: table};
		response.render("remove", variable);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

app.post("/remove", async (request, response) => { 
	try {
        await client.connect();
		let idArray = request.body.cb;
		if (idArray !== undefined && Array.isArray(idArray)) {
			let newArray = idArray.map(id => parseInt(id));
			await client.db(databaseAndCollection.db)
			.collection(databaseAndCollection.collection)
			.deleteMany({ id: { $in: newArray } });
		} else if (idArray !== undefined) {
			idArray = parseInt(idArray);
			result = await client.db(databaseAndCollection.db)
        		.collection(databaseAndCollection.collection)
        		.deleteOne({ id: idArray });
		}
		response.render("login");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

app.get("/database", async (request, response) => { 
	let table = ``
	let filter = {};
	try {
        await client.connect();
        const cursor = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .find(filter);
        const result = await cursor.toArray();
        result.forEach(employee => table += 
            `<tr>
                <td>${employee["id"]}</td>
                <td>${employee["name"]}</td>
                <td>${employee["position"]}</td>
                <td>${employee["phone"]}</td>
                <td>${employee["address"]}</td>
                <td class="centercell">${employee["days"]}</td>
                <td class="centercell">${employee["party"]}</td>
                <td class="centercell">$${employee["tips"]}</td>
              </tr>`);
        let variable = {table: table};
		response.render("database", variable);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

app.get("/simulation", (request, response) => { 
    response.render("simulation");
});

app.get("/waitress", async (request, response) => { 
    try {
        await client.connect();
        const cursor = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .find({ position: "server" });
        const result = await cursor.toArray();
        let list = ''
        result.forEach(employee => list += 
            `<div class="list" draggable="true" data-value="${employee["id"]}">
                <span class="id">${employee["id"]}</span><img src="pictures/drag.jpg" draggable="false"> 
                <span class="name">${employee["name"]}</span>
            </div>`);
            let variable = {list: list};
        response.render("waitress", variable);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

app.get("/otherWorkers", async (request, response) => { 
    try {
        await client.connect();
        const cursor = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .find({
            $or: [
              { position: "cashier" },
              { position: "host" },
              { position: "chef" },
              { position: "manager" }
            ]
          });
        const result = await cursor.toArray();
        let list = ''
        result.forEach(employee => list += 
            `<div class="list" draggable="true" data-value="${employee["id"]}">
                <span class="id">${employee["id"]}</span><img src="pictures/drag.jpg" draggable="false"> 
                <span class="name">${employee["name"]}</span>
            </div>`);
            let variable = {list: list};
        response.render("otherWorkers", variable);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

app.post("/otherWorkers", async (request, response) => {     
    let waitress = request.body.waitress;
    let party =  request.body.party;
    let workers = request.body.workers;
    waitress = waitress.map(id => parseInt(id));
    party = party.map(id => parseInt(id));
    workers = workers.map(id => parseInt(id));

    try {
        await client.connect();
		await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).updateMany(
			{ $or: [
                  { id: { $in: waitress } },
                  { id: { $in: party } },
                  { id: { $in: workers } }
                ]},
			{ $inc: { "days" : 1 } });
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).updateMany(
            { id: { $in: party } },
            { $inc: { "party" : 1 } });
	} catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    response.json();
});

app.post("/simulation", async (request, response) => {     
    try {
        await client.connect();
        for (let field in request.body) {
            await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).updateOne(
                { id: parseInt(field) },
                { $inc: { "tips" : parseFloat(request.body[field]) } });
        }
	} catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    response.json();
});