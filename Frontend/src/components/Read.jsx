import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Read = () => {
    const { eventId } = useParams()
    const [event, setEvent] = useState([])

    useEffect(() => {
        axios.get(`https://airepro-software.web.app/read/${eventId}`)
            .then(res => {
                console.log(res.data)
                setEvent(res.data[0])
            })
            .catch(err => console.log(err))
    }, [eventId])
    
    return (
        <div className="flex min-h-screen bg-green-400 justify-center mx-auto items-center text-black">
            <div className="w-full max-w-4xl bg-gray-400 rounded-md p-5">
                <h1 className="text-xl font-bold uppercase">Event Details</h1>
                {event && (
                    <>
                        <p><span className="font-bold">Id:</span> {event?.eventId}</p>
                        <p><span className="font-bold">Event Name:</span> {event?.eventName}</p>
                        <p><span className="font-bold">Event Date:</span> {event?.eventDate}</p>
                        <p><span className="font-bold">Start Time:</span> {event?.startTime}</p>
                        <p><span className="font-bold">End Time:</span> {event?.endTime}</p>
                        <p><span className="font-bold">Location:</span> {event?.location}</p>
                        <p><span className="font-bold">Description: </span>{event?.description}</p>
                        <p><span className="font-bold">Participants:</span> {event?.participants}</p>
                    </>
                )}
                <Link to='/' className="btn btn-success">Home</Link>
                <Link to={`/update/${eventId}`} className="btn btn-secondary">Update</Link>
            </div>
        </div>
    );

};

export default Read;