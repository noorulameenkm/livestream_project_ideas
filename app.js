const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');


const app = express(feathers());

// IdeaService

class IdeaService {
    constructor() {
        this.ideas = [];
    }

    async find() {
        return this.ideas;
    }

    async create(data) {
        const idea = {
            id: this.ideas.length,
            text: data.text,
            tech: data.tech,
            viewer: data.viewer
        }

        idea.time = moment().format('h:mm:ss a');

        this.ideas.push(idea);

        return idea;
    }
}


// ParseJson
app.use(express.json());

// configuring socketio realtime API's
app.configure(socketio());

// Enable rest services
app.configure(express.rest());

// Register services
app.use('/ideas', new IdeaService());


app.on('connection', conn => app.channel('stream').join(conn));

// publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => console.log(`Realtime server running on port ${PORT}`));

// app.service('ideas').create({
//     text: 'build a realtime app with socketio',
//     tech: 'socketio, feathersjs,. expressjs',
//     viewer: 'John Doe'
// });