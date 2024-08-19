Sirius Calendar Task - Client
 
Overview
Sirius Calendar Task - Client is a React-based front-end application for managing appointments in a calendar interface. This project is part of the Sirius Calendar Task, which includes both a client and a server component. The client-side application communicates with the server through a RESTful API, allowing users to view, book, and delete appointments.

Features
FullCalendar Integration: Displays a weekly calendar view with available and booked time slots.
Appointment Management:
Booking: Users can book appointments by selecting available slots.
Viewing: Users can view details of existing appointments.
Deletion: Users can delete appointments directly from the calendar interface.
Form Validation: User input is validated with appropriate feedback for errors.
Responsive Design: The application is designed to work well on different screen sizes.
Technologies Used
React: A JavaScript library for building user interfaces.
FullCalendar: A powerful calendar component for displaying events.
React-Bootstrap: Provides prebuilt Bootstrap components for React.
RESTful API: Communication with the server-side API built in Symfony.
Installation
Prerequisites
Node.js (version 14.x or later)
npm (version 6.x or later) or Yarn (version 1.x or later)
Steps
Clone the Repository:

bash
git clone https://github.com/manuel-tsvetanski/Sirius-Calendar-task-client.git
Navigate to the Project Directory:

bash
cd Sirius-Calendar-task-client
Install Dependencies:

Using npm:

bash
npm install
Or using Yarn:

bash
yarn install
Start the Development Server:

bash
npm start
Or using Yarn:

bash
yarn start
Access the Application:

Open your browser and navigate to http://localhost:3000.
Usage
Booking an Appointment: Click on an available slot to open the booking form, fill in the details, and submit.
Viewing an Appointment: Click on a booked slot to view details of the appointment.
Deleting an Appointment: In the appointment details modal, click the "Delete Appointment" button to remove the appointment.
Project Structure
plaintext
Копиране на код
├── public
│   └── index.html        # HTML template
├── src
│   ├── api
│   │   └── calendarApi.js # API interaction functions
│   ├── components
│   │   └── DentalCalendar.jsx # Main calendar component
│   ├── App.js            # Main application file
│   ├── index.js          # Entry point for the React app
│   └── ...               # Other components and utilities
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Commit your changes (git commit -am 'Add some feature').
Push to the branch (git push origin feature/your-feature-name).
Create a new Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
Author: Manuel Tsvetanski
Email: manuel.tsvetanski@gmail.com
GitHub: manuel-tsvetanski

