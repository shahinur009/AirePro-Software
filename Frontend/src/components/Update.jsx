import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const Update = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [participants, setParticipants] = useState('');
    const navigate = useNavigate();
    const { eventId } = useParams();

    const [values, setValues] = useState({
        eventName: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        participants: ''
    });

    useEffect(() => {
        axios.get(`https://airepro-software.web.app/read/${eventId}`)
            .then(res => {
                const eventData = res.data[0];
                setValues({
                    eventName: eventData.eventName,
                    eventDate: new Date(eventData.eventDate).toISOString().split('T')[0], // Format date to YYYY-MM-DD
                    startTime: eventData.startTime.slice(0, 5), // Format time to HH:MM
                    endTime: eventData.endTime.slice(0, 5), // Format time to HH:MM
                    location: eventData.location,
                    description: eventData.description,
                    participants: eventData.participants
                });
            })
            .catch(err => console.log(err));
    }, [eventId]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const info = {
            eventName: values.eventName,
            eventDate: values.eventDate,
            startTime: values.startTime,
            endTime: values.endTime,
            location: values.location,
            description: values.description,
            participants: values.participants
        };

        if (!eventId || !info.eventName || !info.eventDate || !info.startTime || !info.endTime || !info.location || !info.description || !info.participants) {
            Swal.fire("Fill up All the input fields!");
            return;
        }

        axios.put(`https://airepro-software.web.app/update/${eventId}`, info)
            .then(res => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your Event Update Successful",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/');
            })
            .catch(err => {
                console.error("Error updating event:", err);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${err}`,
                });
            });
    };

    return (
        <div className="flex min-h-screen bg-green-400 justify-center mx-auto items-center text-black">
            <div className="w-1/2 max-w-5xl bg-gray-400 rounded-md p-5 py-5">
                <div className='flex justify-between'>
                    <h1 className='text-3xl font-bold'>Update Event Here</h1>
                    <Link to='/' className='btn bg-gray-400 w-1/2'>Home</Link>
                </div>
                <form className="card-body" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Event Name</span>
                        </label>
                        <input type="text" placeholder="Event Name" className="input input-bordered" required
                            onChange={e => setValues({ ...values, eventName: e.target.value })} value={values.eventName}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Event Date</span>
                        </label>
                        <input type="date" placeholder="Event Date" className="input input-bordered" required
                            onChange={e => setValues({ ...values, eventDate: e.target.value })} value={values.eventDate}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Start Time</span>
                        </label>
                        <input type="time" placeholder="Start Time" className="input input-bordered" required
                            onChange={e => setValues({ ...values, startTime: e.target.value })} value={values.startTime}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">End Time</span>
                        </label>
                        <input type="time" placeholder="End Time" className="input input-bordered" required
                            onChange={e => setValues({ ...values, endTime: e.target.value })} value={values.endTime}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Location</span>
                        </label>
                        <input type="text" placeholder="Location" className="input input-bordered" required
                            onChange={e => setValues({ ...values, location: e.target.value })} value={values.location}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea placeholder="Description" className="textarea textarea-bordered" required
                            onChange={e => setValues({ ...values, description: e.target.value })} value={values.description}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Participants</span>
                        </label>
                        <textarea placeholder="Participants" className="textarea textarea-bordered" required
                            onChange={e => setValues({ ...values, participants: e.target.value })} value={values.participants}
                        />
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary uppercase" type="submit">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;