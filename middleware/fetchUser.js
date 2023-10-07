import Jwt from "jsonwebtoken"
import 'dotenv/config.js';


const fetchUser = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send(error, "Please authenticate using valid token")

    }
    

    try {
        const { userId } = Jwt.verify(token, "" + process.env.JWT_SECRET)
        req.userId = userId;
        console.log("fetchUser", userId);
        next()

    } catch (error) {
        res.status(401).send({ error: "Please Authenticate using a valid token" })

    }

}


export default fetchUser;