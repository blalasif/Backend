import connectToMongo from "./database/db.js";
import express from 'express'
import auth from './routes/auth.js';
import notes from './routes/notes.js'
import cors from 'cors'

connectToMongo();

const app = express();
const port = 8000;
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json("Bilal")
})

// Available-routes 
app.get('/',(req,res)=>{

    res.json('ENotebook backend api')
})

app.use('/api/auth', auth);
app.use('/api/notes', notes)
// Available-routes 


app.listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`);
})