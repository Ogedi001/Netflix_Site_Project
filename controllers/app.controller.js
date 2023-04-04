require('dotenv').config()

const axios = require('axios'),
    Person = require('./../models/people.model'),
    bcrypt = require('bcrypt'),

    jwt = require('jsonwebtoken')


const tvShowAPI = "https://www.episodate.com/api/most-popular",
    searchAPI = "https://www.episodate.com/api/search",
    detailsAPI = "https://www.episodate.com/api/show-details"


const SECRET = process.env.SECRET

console.log(SECRET)

const createToken = (id) => {

    const Time_in = new Date().toLocaleTimeString();


    return jwt.sign({ id, Time_in }, `${SECRET}`)
}

const hompage = async (req, res) => {
    let { page } = req.query;

    try {
        if (typeof page === 'undefined' || page < 1) {
            page = 1;
        }

        const resp = await axios.get(tvShowAPI + `?page=${page}`);

        res.render('movies', { movies: resp.data });

    } catch (error) {
        console.log(error)
        res.status(500).json({ Error_message: 'Bad request' })
    }

}

const getRegister = async (req, res) => {
    res.render('register', { errors: null });
}

const registerUser = async (req, res) => {
    try {
        // init mongoose
        console.log(req.body)
        const user = await Person.create(req.body);
        const token = createToken(user._id);
        res.cookie('users', token, { httpOnly: true });
        res.redirect('/home');

        // create auth with cookies
        // res.redirect('/home');
    } catch (error) {


        if (error.name === "ValidationError") {

            const errors = {};
            Object.keys(error.errors).forEach(field => {
                errors[field] = error.errors[field].message
            });

            res.render('register', { errors: errors })
            return;
        }

    }
}
const getLogin = async (req, res) => {
    res.render('login', { error: null });
}
// const login = async (req, res) => {
//     const {email, password} = req.body
//     try {

//         if(!email){
//             res.render('login',{error: "Please insert an email"})
//             return
//         }

//         if(!password){
//             res.render('login',{error: "Please insert a valid password"})
//             return
//         }


//         // search for any user with that email
//     const user = await Person.findOne({ email });

//     if (!user) {
//       res.render('login', { error: "Users does not exist! " });
//       return;
//     }

//     // compare password
//     const hasValidPass = bcrypt.compareSync(password, user.password);

//     if (!hasValidPass) {
//       res.render('login', { error: "Invalid credentials" });
//       return;
//     }

//     res.redirect('/home')

//    } catch (error) {
//         res.status(500).json({message: "internal serval error"})

//         console.log(error);
//     }

//  }

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Person.UserAuth(email, password);
        const token = createToken(user._id);
        res.cookie('users', token, { httpOnly: true });
        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.render("login", { error });

    }
};
const logout = async (req, res) => {
    res.cookie('users', '', { maxAge: 1 })
    res.redirect('/login')
}


const getMovie = async (req, res) => {
    let { id } = req.query

    try {
        const response = await axios.get(detailsAPI + `?q=${id}`)
        const data = response.data
        res.render('movie', { movie: data.tvShow })
    } catch (error) {
        res.status(500).json({ Error_message: 'Bad request' })
    }

}

const searchMovie = async (req, res) => {
    let { q, page } = req.query

    try {
        const response = await axios.get(searchAPI + `?q=${q}&page=${page}`)
        const data = response.data


        res.json({ page: Number(page), movies: data.tv_shows })
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
}

module.exports = {
    hompage,
    getRegister,
    registerUser,
    getLogin,
    login,
    logout,
    getMovie,
    searchMovie
}