import express from 'express'
import cors from 'cors'
import * as setup from "./setup";
import registrationRoutes from "./routes/registration";

const app = express()

setup.database()

app.use('/registration', registrationRoutes)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


app.listen(3000, () => console.log('Server started'))