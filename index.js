const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('college hunter sarver colte')
});




// mongodb code start
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.pphnrsn.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useUnifiedTopology: true }, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1 });

async function run() {
    try {

        const usersCollection = client.db("College").collection("users");
        const collegeCollection = client.db("College").collection("Colleges");
        const applicationCollection = client.db("College").collection("applications");
        const feedbackCollection = client.db("College").collection("feedback");
        const imageCollection = client.db("College").collection("images");

        app.post('/add-user', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const userAlreadyHave = await usersCollection.findOne(query)
            if (userAlreadyHave) {
                return res.send({ message: "this user already have in this collection" });
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        });

        app.get("/all-users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        });

        app.get("/user/:email", async (req, res) => {
            const email = req?.params?.email;
            // console.log(email)
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.send(result)
        });

        app.put("/update-profile/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateProfile = req.body;
            const newProfile = {
                $set: {
                    name: updateProfile.name,
                    email: updateProfile.email,
                    address: updateProfile.address,
                    university: updateProfile.university
                }
            }
            const result = await usersCollection.updateOne(filter, newProfile, option);
            res.send(result);
        });

        app.get("/all-college", async (req, res) => {
            const result = await collegeCollection.find().toArray();
            res.send(result)
        });

        app.get("/college-detail/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await collegeCollection.findOne(filter);
            res.send(result)
        });

        app.post("/applications", async (req, res) => {
            const application = req.body;
            const result = await applicationCollection.insertOne(application);
            res.send(result)
        });

        app.get("/applyed-college", async (req, res) => {
            let query = {};
            if (req?.query?.email) {
                query = { email: req.query.email }
            };
            const result = await applicationCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/my-college/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email }
            const result = await applicationCollection.findOne(filter);
            res.send(result)
        });

        app.post('/add-feedback', async (req, res) => {
            const feedback = req.body;
            const result = await feedbackCollection.insertOne(feedback);
            res.send(result);
        });

        app.get('/all-feedback', async (req, res) => {
            const result = await feedbackCollection.find().toArray();
            res.send(result);
        });

        app.get('/images', async (req, res) => {
            const result = await imageCollection.find().toArray();
            res.send(result);
        });

        app.get("/colleges", async (req, res) => {
            const search = req.query.search;
            console.log(search)
            const query = { college_name: { $regex: search, $options: "i" } }

            const result = await collegeCollection.find(query).toArray();
            res.send(result)
        });




        console.log("MongoDB pink korce re");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
// mongodb end







app.listen(port, () => {
    console.log(`last section server in running port of ${port}`)
})