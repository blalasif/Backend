//mongodb+srv://bilaljee684:<password>@merndatabase.0o3bbng.mongodb.net/
import { connect } from 'mongoose'
const connectToMongo = async () => {
    try {
        await connect(process.env.MONGO_URI)
        console.log("😀😀😀😀😀😀 Connected to Database 😀😀😀😀😀😀😀😀😀😀😀😀😀😀");

    } catch (error) {
        console.log(error);
    }


}


export default connectToMongo
