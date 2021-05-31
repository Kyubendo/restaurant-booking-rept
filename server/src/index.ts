import express from 'express'
import cors from 'cors'
import * as setup from "./setup";
import mainRoutes from "./routes/main";

const app = express()

setup.database()

app.use('/', mainRoutes)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


app.listen(3000, () => console.log('Server started'))