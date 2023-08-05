const express = require('express');
const http = require('http');
const bodyParser = require("body-parser");
const path = require('path');
const ejs = require('ejs');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
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
		salary: request.body.salary
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
			idArray.map(id => parseInt(id));
			result = await client.db(databaseAndCollection.db)
			.collection(databaseAndCollection.collection)
			.deleteMany({ id: { $in: idArray } });
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
                <td>${employee["_id"]}</td>
                <td>${employee["name"]}</td>
                <td>${employee["position"]}</td>
                <td>${employee["phone"]}</td>
                <td>${employee["address"]}</td>
              </tr>`);
        let variable = {table: table};
		response.render("database", variable);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});