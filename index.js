const express = require('express'); //CommonJs Modules
// Same as import express from 'express; //ES2015 Modules

const db = require('./data/db.js');

const server = express();

// normally where middleware is configured
server.use(express.json());

// normally where routing is configured (routing is also a form of middleware)
server.get('/', (req,res) => { // req = REQUEST res = RESPONSE
res.send('Hello FSW12');
});


server.get('/users', (req ,res) => {
 db.find()
 .then(users => {
     res.status(200).json(users);
 })
 .catch(err => {
     console.error('error',err);

     res.status(500).json({ message:'Error getting the data' });
 });
})


server.post('/users', async (req, res) => {

    const user = req.body;

    if(user.name && user.bio){
        try {
            const response = await db.insert(user);
            res.status(201).json({ message: 'User created successfully'});
        } catch (err) {
            res.status(500).json({
                title:'Error adding the user',
                description:'what happened',
                recoveryInstructions: 'this is what you can do to recover',
            });
        }
    } else {
        res.status(422).json({ message: 'A user needs both a name and bio'});
    }
})

server.delete('/users/:id', (req , res) => {
    const { id } = req.params; // const id = req.params.id;

    db.remove(id)
    .then(count => {
        console.log('count:', count);
        if (count) {
        res.status(204).end();
    } else {
        res.status(200).json({ message: 'No user with this id was found'});
    }
    })
    .catch(err => res.status(500).json(err));
});

server.put('/users/:id', (req , res) => {
 db.update(req.params.id, req.body).then(users => {
     res.status(200).json(users)
 })
 .catch(err => res.status(500).json({ message: 'update failed'}));  
})

// start the server
server.listen(9000, () => console.log('\n== API on port 9k ==\n'));

