// app.js
const { MongoClient, ObjectId } = require("mongodb");

// Replace with your Atlas connection string
const uri = "mongodb+srv://myUser:MyPassword123@cluster0.abcde.mongodb.net/";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const db = client.db("contact");
    const collection = db.collection("contactlist");

    // 1. Insert Many
    await collection.insertMany([
      { LastName: "Ben", FirstName: "Moris", Email: "ben@gmail.com", age: 26 },
      { LastName: "Kefi", FirstName: "Seif", Email: "kefi@gmail.com", age: 15 },
      { LastName: "Emilie", FirstName: "brouge", Email: "emilie.b@gmail.com", age: 40 },
      { LastName: "Alex", FirstName: "brown", age: 4 },
      { LastName: "Denzel", FirstName: "Washington", age: 3 }
    ]);

    // 2. Find All
    console.log("📌 All Contacts:");
    console.log(await collection.find().toArray());

    // 3. Find One by ID
    const one = await collection.findOne({});
    console.log("📌 One Contact by ID:", one);

    // 4. Find where age > 18
    console.log("📌 Contacts with age > 18:");
    console.log(await collection.find({ age: { $gt: 18 } }).toArray());

    // 5. Find where age > 18 AND name has "ah"
    console.log("📌 Contacts with age > 18 and name contains 'ah':");
    console.log(await collection.find({
      age: { $gt: 18 },
      $or: [
        { FirstName: { $regex: "ah", $options: "i" } },
        { LastName: { $regex: "ah", $options: "i" } }
      ]
    }).toArray());

    // 6. Update "Kefi Seif" -> "Kefi Anis"
    await collection.updateOne(
      { FirstName: "Seif", LastName: "Kefi" },
      { $set: { FirstName: "Anis" } }
    );
    console.log("📌 Updated Kefi Seif -> Kefi Anis");

    // Show updated
    console.log(await collection.find({ LastName: "Kefi" }).toArray());

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
