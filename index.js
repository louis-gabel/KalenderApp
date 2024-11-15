const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex')(require('./knexfile').development);

const app = express();
app.use(bodyParser.json());

// Example endpoint: Retrieve events
app.get('/events', async (req, res) => {
    // Query the 'events' table and select all columns
    const events = await knex('events').select('*');
    // Send the retrieved events as a JSON response
    res.json(events);
  });
  
  // Example endpoint: Add an event
  app.post('/events', async (req, res) => {
    // Destructure the event details from the request body
    const { title, start_date, end_date, location, organizer_id } = req.body;
    // Insert the new event into the 'events' table and get the inserted event's ID
    const [id] = await knex('events').insert({ title, start_date, end_date, location, organizer_id, recurrence_pattern });
    // Send a response with status 201 (Created) and the new event's ID
    res.status(201).json({ id });
  });
  
  // Define the port number from environment variables or default to 3000
  const PORT = process.env.PORT || 3000;
  // Start the server and listen on the defined port
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));