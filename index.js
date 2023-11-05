const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvtteka.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const todoCollection = client.db("todo_app").collection("allTodos");

    // Get All todos
    app.get("/allTodos", async (req, res) => {
      const query = {};
      const cursor = todoCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get Single todo
    app.get("/allTodos/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const todo = await todoCollection.findOne(query);
      res.send(todo);
    });

    // Post todo task
    app.post("/allTodos", async (req, res) => {
      const newTodo = req.body;
      const result = await todoCollection.insertOne(newTodo);
      res.send(result);
    });

    // Update todo task by ID
    app.put("/allTodos/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTodo = req.body;
      const query = { _id: new ObjectId(id) };
      const updateResult = await todoCollection.updateOne(query, {
        $set: updatedTodo,
      });

      if (updateResult.modifiedCount === 1) {
        res.send({ message: "Todo updated successfully" });
      } else {
        res.status(404).send({ error: "Todo not found" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Todo is running");
});

app.listen(port, () => {
  console.log(`Todo server is running on port ${port}`);
});
