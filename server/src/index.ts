import express from 'express'
import cors from 'cors'
import * as setup from "./setup";
import mainRoutes from "./routes/main";

const app = express()

setup.database()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', mainRoutes)


app.listen(3000, () => console.log('Server started'))