require('dotenv').config()


const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const Profile = require('./models/profile')

const userRoutes = require('./routes/user');

const dbUrl = process.env.DB_URL
mongoose.connect(process.env.DB_URL)
    .then(res => {
        console.log('Database connected')
    }).catch(e => console.log(e))

app.engine('ejs', ejsMate)
app.set('views engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))

const sessionConfig = {
    secret: "thissholdbettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        hhtpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/profile', async(req, res) => {

    const profiles = await Profile.find({})
    res.render('profileIndex.ejs', { profiles })
})

app.get('/profiles/:id', async(req, res) => {
    const profile = await Profile.findById(req.params.id)
    res.render('editForm.ejs', { profile })
})

app.put('/profile/:id', async(req, res) => {
    if (!req.user) {
        req.flash('error', 'Need to login first')
        res.redirect('/')
    }
    const { id } = req.params
    await Profile.findByIdAndUpdate(id, {...req.body })
    res.redirect('/profile')
})

app.get('/createProfile', async(req, res) => {

    if (!req.user) {
        req.flash('error', 'Need to login first')
        res.redirect('/')
    } else {
        const foundedUser = await Profile.find({ "author": req.user.id })
        if (foundedUser.length !== 0) {
            req.flash('error', "profile already created")
            res.redirect('/')
        } else {
            res.render('createForm.ejs')
        }

    }




})

app.post('/profile', async(req, res) => {


    const newProfile = new Profile(req.body)
    newProfile.author = req.user.id
    await newProfile.save()
    req.flash('success', 'successfully created your profile')
    res.redirect(`/`)



})




app.listen(3000, (req, res) => {
    console.log(`listening at port 3000`)
})