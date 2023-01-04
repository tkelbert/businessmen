//this is a test server for dev purposes
const { spawn } = require("child_process")
    const childPython = spawn('python', ['test.py'])
    childPython.stdout.on('data', (data) => {
        console.log("pyt", data)
    })


// const express = require("express")
// const app = express()
// const cors = require('cors')

// app.use(cors())

// app.use(express.json());

// app.post("/", (req, res) => {
//     console.log(req.body)
//     clientBoard = req.body.board;
//     clientBoard[Math.floor(Math.random() * 9)] = "U"
//     res.status(200)
//     res.send(JSON.stringify(clientBoard))
// })

// const port = 6060;
// app.listen(port, () => console.log(`Listening on port ${6060}`))