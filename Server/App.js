const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../client/build')); // Needed for serving production build of React

/****** DATABASE ******/
const db = require('./Db.js')(mongoose);

/**** Routes ****/
app.get('/api/questions', async (req, res) => {
    const questions = await db.getQuestions();
    res.json(questions);
});

app.get('/api/questions/:id', async (req, res) => {
    let id = req.params.id;
    const question = await db.getQuestion(id);
    res.json(question);
});

app.put('/api/questions/:id', (req, res) => {
    const id = req.body.id;
    const newAnswer = req.body.answer;
    
    async function addAnswer() {
        const answer = await db.addAnswer(id, newAnswer);
        console.log(answer);
    }
    addAnswer();
});

app.put('/api/vote', (req, res) => {
    const answerId = req.body.answerId;
    const vote = req.body.vote;
    async function updateVote() {
        await db.vote(answerId, vote)
    }
    updateVote();
})

app.put('/api/newquestion', (req, res) => {
    let title = req.body.title;
    let desc = req.body.desc;
    async function addQuestion() {
        await db.createQuestion(title, desc)
    }
    addQuestion();
})

// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html) to be handled by Reach router
// It's important to specify this route as the very last one to prevent overriding all of the other routes
app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);

/**** Start ****/
const url = process.env.MONGO_URL || 'mongodb://localhost/mandatory_db';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await app.listen(port); // Start the API
        console.log(`Questions API running on port ${port}!`);
    })
    .catch(error => console.error(error));
