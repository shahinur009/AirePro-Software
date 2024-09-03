const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 8081;

app.use(express.json());
app.use(
    cors({
      origin: [
        "http://localhost:8081",
        "https://airepro-software.web.app",
        "https://airepro-software.firebaseapp.com",
      ],
      credentials: true,
    })
  );

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'airepro-software-event'
});

// Connect to the database and handle errors
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Get data from Database
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM event';
    db.query(sql, (err, data) => {
        if (err) return res.json('Error from get data');
        return res.json(data);
    })
})

// Get Read data From database 
app.get('/read/:eventId', (req, res) => {
    const sql = 'SELECT * FROM event WHERE eventId = ?';
    const id = req.params.eventId;
    db.query(sql, [id], (err, data) => {
        if (err) return res.json('Error from get data');
        return res.json(data);
    })
})

// Add Event to Database with Time Conflict Check
app.post('/add', (req, res) => {
    const info = req.body;
    
    // Check if there is already an event at the same date and time
    const checkSql = 'SELECT * FROM event WHERE eventDate = ? AND ((startTime <= ? AND endTime >= ?) OR (startTime <= ? AND endTime >= ?))';
    db.query(checkSql, [info.eventDate, info.startTime, info.startTime, info.endTime, info.endTime], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error checking for existing event", error: err.message });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "An event already exists during this time slot." });
        }

        // If no conflict, proceed to add the event
        const sql = 'INSERT INTO event (eventName, eventDate, startTime, endTime, location, description, participants) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [
            info.eventName,
            info.eventDate,
            info.startTime,
            info.endTime,
            info.location,
            info.description,
            info.participants
        ];

        db.query(sql, values, (err, data) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Error from server-side post method", error: err.message });
            }
            return res.status(201).json({ message: "Event added successfully", data });
        });
    });
});

// Update Event in Database with Time Conflict Check
app.put('/update/:eventId', (req, res) => {
    const info = req.body;
    const id = req.params.eventId;

    // Check if there is already an event at the same date and time (excluding the current event being updated)
    const checkSql = 'SELECT * FROM event WHERE eventId != ? AND eventDate = ? AND ((startTime <= ? AND endTime >= ?) OR (startTime <= ? AND endTime >= ?))';
    db.query(checkSql, [id, info.eventDate, info.startTime, info.startTime, info.endTime, info.endTime], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error checking for existing event", error: err.message });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "An event already exists during this time slot." });
        }

        // If no conflict, proceed to update the event
        const sql = 'UPDATE event SET `eventName` = ?, `eventDate` = ?, `startTime` = ?, `endTime` = ?, `location` = ?, `description` = ?, `participants` = ? WHERE `eventId` = ?';

        const values = [
            info.eventName,
            info.eventDate,
            info.startTime,
            info.endTime,
            info.location,
            info.description,
            info.participants,
            id
        ];

        db.query(sql, values, (err, data) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Error from server-side update method", error: err.message });
            }
            return res.status(200).json({ message: "Event updated successfully", data });
        });
    });
});


// // Add Event to Database
// app.post('/add', (req, res) => {

//     const info = req.body;
//     // console.log(info);
//     // time validation
//     const checkSql = 'SELECT * FROM event WHERE eventDate = ? AND ((startTime <= ? AND endTime >= ?) OR (startTime <= ? AND endTime >= ?))';
    

//     const sql = 'INSERT INTO event (eventName, eventDate, startTime, endTime, location, description, participants) VALUES (?, ?, ?, ?, ?, ?, ?)';
//     const values = [
//         info.eventName,
//         info.eventDate,
//         info.startTime,
//         info.endTime,
//         info.location,
//         info.description,
//         info.participants
//     ];

//     db.query(sql, values, (err, data) => {
//         if (err) {
//             console.error("Database error:", err);  // Log error details for better debugging
//             return res.status(500).json({ message: "Error from server-side post method", error: err.message });
//         }
//         return res.status(201).json({ message: "Event added successfully", data });
//     });
// });

// // Update event api here
// app.put('/update/:eventId', (req, res) => {
//     // console.log("PUT request received for event ID:", req.params.eventId);

//     const info = req.body;
//     // console.log("Request Body:", info);

//     const sql = 'UPDATE event SET `eventName` = ?, `eventDate` = ?, `startTime` = ?, `endTime` = ?, `location` = ?, `description` = ?, `participants` = ? WHERE `eventId` = ?';

//     const values = [
//         info.eventName,
//         info.eventDate,
//         info.startTime,
//         info.endTime,
//         info.location,
//         info.description,
//         info.participants
//     ];

//     const id = req.params.eventId;

//     db.query(sql, [...values, id], (err, data) => {
//         if (err) {
//             console.error("Database error:", err);
//             return res.status(500).json({ message: "Error from server-side update method", error: err.message });
//         }
//         return res.status(200).json({ message: "Event updated successfully", data });
//     });
// });

// Delete event API here
app.delete('/delete/:eventId', (req, res) => {
    const sql = 'DELETE FROM event WHERE eventId = ?';
    const eventId = req.params.eventId;

    // console.log(`Received request to delete event with ID: ${eventId}`);
    db.query(sql, [eventId], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error from server-side delete method", error: err.message });
        }
        return res.status(200).json({ message: "Event deleted successfully", data });
    });
});



app.listen(PORT, () => {
    console.log(`Backend server running on, ${PORT}`);
});
