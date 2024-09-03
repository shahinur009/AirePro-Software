import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

export default function Events() {
    const [event, setEvent] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/')
            .then(res => setEvent(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (eventId) => {
        try {
            await axios.delete(`http://localhost:8081/delete/${eventId}`);
            window.location.reload();  // Refresh the page to reflect changes
            Swal.fire({
                title: "Delete Done!",
                text: "Your event was deleted successfully!",
                icon: "success"
            });
        } catch (err) {
            console.log("Error deleting event:", err);
            Swal.fire({
                title: "Delete Failed!",
                text: "There was a problem deleting the event.",
                icon: "error"
            });
        }
    };


    return (
        <div className="flex min-h-screen bg-green-400 justify-center mx-auto items-center text-black">
            <div className="w-full max-w-7xl bg-gray-400 rounded-md p-5">
                <Link to='/add' className="btn btn-success uppercase mb-4">Add +</Link>
                <table className="table w-full text-left">
                    <thead className="uppercase text-black">
                        <tr>
                            <th>Event ID</th>
                            <th>Event Name</th>
                            <th>Event Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Participants</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {event.map((data, index) => (
                            <tr key={index}>
                                <td>{data.eventId}</td>
                                <td>{data.eventName}</td>
                                <td>{data.eventDate}</td>
                                <td>{data.startTime}</td>
                                <td>{data.endTime}</td>
                                <td>{data.location}</td>
                                <td>{data.description.split(' ').slice(0, 5).join(' ') + (data.description.split(' ').length > 5 ? '...' : '')}</td>
                                <td>{data.participants.split(' ').slice(0, 5).join(' ') + (data.participants.split(' ').length > 5 ? '...' : '')}</td>
                                <td className="flex">
                                    <Link to={`read/${data.eventId}`} className="btn btn-secondary">Read</Link>
                                    <Link to={`update/${data.eventId}`} className="btn btn-warning ms-2">Edit</Link>
                                    <button onClick={() => handleDelete(data.eventId)} className="btn btn-error ms-2">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
