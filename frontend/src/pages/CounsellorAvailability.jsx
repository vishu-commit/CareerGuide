import { useEffect, useState } from "react";
import api from "../services/api";

function CounsellorAvailability() {

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [availability, setAvailability] = useState([]);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const fetchAvailability = async () => {

        try {

            const response = await api.get(
                "/availability/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAvailability(
                response.data.availability || []
            );

        } catch (error) {

            console.log(error);

        }
    };


    useEffect(() => {
        fetchAvailability();
    }, []);


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!date || !startTime || !endTime) {
            setMessage("Please fill all fields");
            return;
        }

        try {

            const response = await api.post(
                "/availability",
                {
                    available_date: date,
                    start_time: startTime,
                    end_time: endTime
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                response.data.message
            );

            setDate("");
            setStartTime("");
            setEndTime("");

            fetchAvailability();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to add availability"
            );
        }
    };


    const deleteAvailability = async (id) => {

        try {

            await api.delete(
                `/availability/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchAvailability();

        } catch (error) {

            console.log(error);
        }
    };


    return (
        <div className="page-container">

            <h1>📅 My Availability</h1>

            <p>
                Set the dates and times when students can book you.
            </p>

            {message && (
                <p>{message}</p>
            )}


            <form onSubmit={handleSubmit}>

                <label>Date</label>

                <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        setDate(e.target.value)
                    }
                />

                <br /><br />

                <label>Start Time</label>

                <input
                    type="time"
                    value={startTime}
                    onChange={(e) =>
                        setStartTime(e.target.value)
                    }
                />

                <br /><br />

                <label>End Time</label>

                <input
                    type="time"
                    value={endTime}
                    onChange={(e) =>
                        setEndTime(e.target.value)
                    }
                />

                <br /><br />

                <button type="submit">
                    ➕ Add Availability
                </button>

            </form>


            <h2>Available Slots</h2>

            {availability.length === 0 ? (

                <p>No availability added yet.</p>

            ) : (

                <div>

                    {availability.map((slot) => (

                        <div
                            className="career-card"
                            key={slot.id}
                        >

                            <h3>
                                📅 {slot.available_date}
                            </h3>

                            <p>
                                ⏰ {slot.start_time} - {slot.end_time}
                            </p>

                            <button
                                onClick={() =>
                                    deleteAvailability(slot.id)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default CounsellorAvailability;