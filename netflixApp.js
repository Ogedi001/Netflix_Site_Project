const fetch = (...args) =>
import('node-fetch').then(({default: fetch}) => fetch(...args));
const axios = require("axios")

const express = require('express')
const app = express()

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));


const tvShowAPI ="https://www.episodate.com/api/most-popular",
searchAPI ="https://www.episodate.com/api/search",
detailsAPI ="https://www.episodate.com/api/show-details"


app.get("/", async (req,res)=>{
  
    let { page } = req.query;

    try {
        if (typeof page === 'undefined' || page < 1) {
            page = 1;
        }

        const resp = await axios.get(tvShowAPI + `?page=${page}`);
        
        res.render('movies', { movies: resp.data });

    } catch (error) {
        console.log(error)
        res.status(500).json({Error_message:'Bad request'})
    }
})

app.get('/movie', async (req,res)=>{
let {id} = req.query

try {
const response = await axios.get(detailsAPI + `?q=${id}`)
const data = response.data
    res.render('movie', {movie : data.tvShow})
} catch (error) {
    res.status(500).json({Error_message:'Bad request'})
}
})

app.get('/search',async(req,res)=>{
let {q,page}= req.query

    try {
const response = await axios.get(searchAPI +`?q=${q}&page=${page}`)
const data = response.data


res.json({page: Number(page), movies :data.tv_shows})
    } catch (error) {
        res.status(500).json({ message: "An error occured" }); 
    }
})


app.listen(4000, () => {
    console.log(`App is live at https://localhost:4000`)
})