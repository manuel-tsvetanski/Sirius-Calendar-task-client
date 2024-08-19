import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { Modal, Button, Form } from 'react-bootstrap';
import { fetchCalendarData } from '../api/calendarApi';

const DentalCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState({});
    const [appointmentDetails, setAppointmentDetails] = useState({});
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        async function loadCalendarData() {
            try {
                const calendarData = await fetchCalendarData();
                const eventsArray = calendarData.map(day =>
                    day.timeSlots.map(slot => ({
                        title: slot.available ? 'Available' : 'Booked',
                        start: slot.time,
                        color: slot.available ? 'green' : 'red',
                        editable: false,
                        durationEditable: false,
                        url: slot.available ? `/appointment/new?date=${day.date}&time=${slot.time}` : null,
                        extendedProps: {
                            user: slot.user ? {
                                name: slot.user.name,
                                email: slot.user.email,
                                phone: slot.user.phone, // Include phone for viewing
                                appointmentId: slot.appointmentId,
                            } : null,
                        },
                    }))
                ).flat();
                setEvents(eventsArray);
            } catch (error) {
                console.error('Error loading calendar data:', error);
            }
        }

        loadCalendarData();
    }, []);

    const handleEventClick = (info) => {
        console.log('Event Clicked:', info.event.extendedProps); // Debugging

        if (info.event.extendedProps.user === null) {
            // Slot is available for booking
            info.jsEvent.preventDefault();
            setSelectedSlot({
                date: info.event.start.toISOString().split('T')[0], // Extract the date in YYYY-MM-DD format
                time: info.event.start.toISOString().split('T')[1].substring(0, 5), // Extract the time in HH:mm format
            });
            setShowBookingModal(true);
        } else {
            // Slot is booked, show appointment details
            info.jsEvent.preventDefault();

            const { appointmentId, name, email, phone } = info.event.extendedProps.user || {};

            if (appointmentId) {
                setAppointmentDetails({
                    appointmentId, // Correctly set the appointmentId
                    name,
                    email,
                    phone,
                    date: info.event.start.toISOString().split('T')[0],
                    time: info.event.start.toISOString().split('T')[1].substring(0, 5),
                });

                console.log('Appointment Details:', {
                    appointmentId,
                    name,
                    email,
                    phone,
                });

                setShowViewModal(true);
            } else {
                console.error('Appointment ID is not defined in the event data');
            }
        }
    };

    const handleBookingClose = () => setShowBookingModal(false);
    const handleViewClose = () => setShowViewModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                date: selectedSlot.date,
                time: selectedSlot.time,
                user: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                },
            };

            const response = await fetch('http://127.0.0.1:8000/api/appointment/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const result = await response.json();
                if (result.errors) {
                    // Convert array of errors into an object for easier access
                    const errorObj = {};
                    result.errors.forEach(error => {
                        errorObj[error.field] = error.message;
                    });
                    setErrors(errorObj); // Set the errors state
                }
                throw new Error('Failed to submit form');
            }

            setShowBookingModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    };

    const handleDeleteAppointment = async () => {
        console.log('Attempting to delete appointment with ID:', appointmentDetails.appointmentId); // Debugging
        try {
            if (!appointmentDetails.appointmentId) {
                throw new Error('Appointment ID is not set');
            }

            const response = await fetch(`http://127.0.0.1:8000/api/appointment/delete/${appointmentDetails.appointmentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete appointment');
            }

            setShowViewModal(false);
            // Reload or update the calendar data after successful deletion
            window.location.reload();
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, bootstrapPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridDay,timeGridWeek,dayGridMonth',
                }}
                timeZone="local"
                events={events}
                slotDuration="01:00:00"
                allDaySlot={false}
                eventClick={handleEventClick}
            />

            {/* Modal for Booking */}
            <Modal show={showBookingModal} onHide={handleBookingClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Book Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                isInvalid={!!errors.name} // Apply invalid style if there's an error
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name} {/* Display the error message */}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                isInvalid={!!errors.email} // Apply invalid style if there's an error
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email} {/* Display the error message */}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPhone" className="mt-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                isInvalid={!!errors.phone} // Apply invalid style if there's an error
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone} {/* Display the error message */}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Book Appointment
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for Viewing */}
            <Modal show={showViewModal} onHide={handleViewClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Appointment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Name:</strong> {appointmentDetails.name}</p>
                    <p><strong>Email:</strong> {appointmentDetails.email}</p>
                    <p><strong>Phone:</strong> {appointmentDetails.phone}</p>
                    <p><strong>Date:</strong> {appointmentDetails.date}</p>
                    <p><strong>Time:</strong> {appointmentDetails.time}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleViewClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAppointment}>
                        Delete Appointment
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DentalCalendar;
