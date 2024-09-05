const axios = require('axios');

// Set up your API key and base URL
const canvasApiKey = '7~BVxVMtMVcF9MnmUcQWA74y9Q2P8uzJWyT9QVG4ceGrEt7vXQGfvuVzFkhuhhyBD2';  // Replace with your actual Canvas API key
const canvasBaseUrl = 'https://canvas.instructure.com/api/v1';  // Replace with your Canvas domain

// Color coding for courses
const courseColors = {
    "PICARD AP PSYCHOLOGY": "#d96135",
    "AP US History-PB-6 -Kerr": "#4835d9",
    "AP English Language & Composition": "#FAE700",
    "AP Statistics-Mr.Shieh": "#35d961",
    "2024-25 Digital Photo 1": "#d93561",
    "AP Physics 1-PA-1 Tandon": "#37C88E",
    // Add more courses here
};

// Function to get all courses you are enrolled in
async function getCourses() {
    try {
        const response = await axios.get(`${canvasBaseUrl}/courses`, {
            headers: {
                'Authorization': `Bearer ${canvasApiKey}`
            }
        });

        return response.data;  // Return the list of courses
    } catch (error) {
        console.error('Error fetching courses:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to get assignments for a specific course
async function getAssignments(courseId) {
    try {
        const response = await axios.get(`${canvasBaseUrl}/courses/${courseId}/assignments`, {
            headers: {
                'Authorization': `Bearer ${canvasApiKey}`
            }
        });

        return response.data;  // Return the list of assignments for the course
    } catch (error) {
        console.error('Error fetching assignments:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to prepare JSON objects for each assignment
async function prepareAssignments() {
    const events = [];  // Array to store assignment JSON objects
    const courses = await getCourses();  // Fetch the list of courses

    // Loop through each course to get assignments
    for (let course of courses) {
        const assignments = await getAssignments(course.id);  // Fetch assignments for the course

        // Loop through each assignment to create a JSON object
        for (let assignment of assignments) {
            // Get color from the courseColors object, or use a default color if the course is not listed
            const courseColor = courseColors[course.name] ? courseColors[course.name] : '#000000'; // Default color: black

            const date = assignment.due_at ? assignment.due_at.substring(0, 10) : '';
            const assignmentEvent = {
                title: assignment.name,
                start: date,
                end: date,
                allDay: true,
                color: courseColor,
                task: { description: assignment.description, points: assignment.points_possible }
            };
            events.push(assignmentEvent);
        }
    }

    return events;  // Return the array of JSON objects for all assignments
}

// Example call to test the function
prepareAssignments().then(events => {
    console.log(JSON.stringify(events, null, 2));  // Print the JSON objects for each assignment
}).catch(error => {
    console.error('Error preparing assignments:', error.message);
});


