require('dotenv').config()
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const mongoose = require('mongoose')
const express = require('express')

const appRoutes = require('./routes/app.routes.js')
const axios = require('axios'),
    Person = require('./models/people.model'),
    cookieParser = require('cookie-parser')




const app = express()

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


DB_URL = process.env.DB_URL,
    PORT = process.env.PORT || 4000
const SECRET = process.env.SECRET


async function main() {
    try {
        console.log('connecting to DB')
        await mongoose.connect(DB_URL)
        console.log('connected successfully');

        app.use('/', appRoutes)


    } catch (error) {
        console.log(error);
    }



    app.listen(PORT, () => {
        console.log(`App is live at https://localhost:${PORT}`)
    })
}

main()