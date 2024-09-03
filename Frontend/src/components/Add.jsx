import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const Add = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [participants, setParticipants] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const info = {
            eventName, eventDate, startTime, endTime, location, description, participants
        }
        console.log(info)

        if (!eventName || !eventDate || !startTime || !endTime || !location || !description || !participants) {
            Swal.fire("Fill up All the input field!");;
            return;
        }

        // Make POST request to the backend
        axios.post('http://localhost:8081/add', info)
            .then(res => {
                console.log(res);  // Log success response
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your Event Add Successful",
                    showConfirmButton: false,
                    timer: 1500
                });  // Optional: show success message to user
                navigate('/');  // Navigate to home page or other route
            })
            .catch(err => {
                console.error("Error adding event:", err);  // Log error to console
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });  // Show error message to user
            });
    };

    return (
        <div className="flex min-h-screen bg-green-400 justify-center mx-auto items-center text-black">
            <div className="w-1/2 max-w-5xl bg-gray-400 rounded-md p-5 py-5">
                <div className='flex justify-between'>
                    <h1 className='text-3xl font-bold'>Add Event Here</h1>
                    <Link to='/' className='btn bg-gray-400 w-1/2'>Back Home</Link>
                </div>
                <form className="card-body" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Event Name</span>
                        </label>
                        <input type="text" placeholder="Event Name" className="input input-bordered" required
                            onChange={e => setEventName(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Event Date</span>
                        </label>
                        <input type="date" placeholder="Event Date" className="input input-bordered" required
                            onChange={e => setEventDate(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Start Time</span>
                        </label>
                        <input type="time" placeholder="Start Time" className="input input-bordered" required
                            onChange={e => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">End Time</span>
                        </label>
                        <input type="time" placeholder="End Time" className="input input-bordered" required
                            onChange={e => setEndTime(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Location</span>
                        </label>
                        <input type="text" placeholder="Location" className="input input-bordered" required
                            onChange={e => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea placeholder="Description" className="textarea textarea-bordered" required
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Participants</span>
                        </label>
                        <textarea placeholder="Participants" className="textarea textarea-bordered" required
                            onChange={e => setParticipants(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary uppercase" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Add;
