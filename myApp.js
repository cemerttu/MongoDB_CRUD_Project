const { MongoClient, ObjectId } = require("mongodb");

// 🔹 Local MongoDB (change if you're using Atlas)
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();

    const db = client.db("contact");
    const collection = db.collection("contactlist");

    // Reset collection (avoid duplicates)
    await collection.deleteMany({});

    // Insert documents
    await collection.insertMany([
      { lastName: "Ben", firstName: "Moris", email: "ben@gmail.com", age: 26 },
      { lastName: "Kefi", firstName: "Seif", email: "kefi@gmail.com", age: 15 },
      { lastName: "Emilie", firstName: "brouge", email: "emilie.b@gmail.com", age: 40 },
      { lastName: "Alex", firstName: "brown", age: 4 },
      { lastName: "Denzel", firstName: "Washington", age: 3 }
    ]);

    console.log("📌 All contacts:");
    console.log(await collection.find().toArray());

    const one = await collection.findOne();
    console.log("📌 One contact by ID:", await collection.findOne({ _id: one._id }));

    console.log("📌 Contacts with age > 18:");
    console.log(await collection.find({ age: { $gt: 18 } }).toArray());

    console.log("📌 Contacts age > 18 and name containing 'ah':");
    console.log(await collection.find({
      age: { $gt: 18 },
      firstName: { $regex: "ah", $options: "i" }
    }).toArray());

    await collection.updateOne(
      { lastName: "Kefi", firstName: "Seif" },
      { $set: { firstName: "Anis" } }
    );

    await collection.deleteMany({ age: { $lt: 5 } });

    console.log("📌 Final contacts list:");
    console.log(await collection.find().toArray());

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
