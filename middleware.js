const express = require('express'),
app = express()


const logger = (req,res,next)=>{
res.write('Hello am a middleware function')
next()
}

app.use(logger)

app.get('/', (req,res)=>{
    res.write('this my homepage blah blah')
    res.send()
})

app.listen(3000,()=>{
    console.log('app is live at port 3000');
})
