const axios = require('axios');

// Set up your API key and base URL
const canvasApiKey = '7~BVxVMtMVcF9MnmUcQWA74y9Q2P8uzJWyT9QVG4ceGrEt7vXQGfvuVzFkhuhhyBD2';  // Replace with your actual Canvas API key
const canvasBaseUrl = 'https://canvas.instructure.com/api/v1';  // Replace <your-institution> with your Canvas domain

// Color coding for courses
const courseColors = {
    "PICARD AP PSYCHOLOGY": { color: "#d96135"},
    "AP US History-PB-6 -Kerr": { color: "#4835d9" },
    "AP English Language & Composition": { color: "#FAE700"},
    "AP Statistics-Mr.Shieh": { color: "#35d961"},
    "2024-25 Digital Photo 1": { color: "#d93561"},
    "AP Physics 1-PA-1 Tandon": { color: "#37C88E"},
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

        const courses = response.data;
        return courses;

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

        const assignments = response.data;
        return assignments;

    } catch (error) {
        console.error('Error fetching assignments:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to prepare assignments for the calendar
async function prepareAssignments() {
    const events = [];
    const courses = await getCourses();

    for (let course of courses) {
        // Skip courses with "undefined" names or not in courseColors
        if (!course.name || !courseColors[course.name]) {
            continue;
        }

        const assignments = await getAssignments(course.id);
        for (let assignment of assignments) {
            // Push assignments to the events array
            events.push({
                title: courseColors[course.name].initial,  // Initial of the course
                start: assignment.due_at,  // Due date of the assignment
                backgroundColor: courseColors[course.name].color,  // Course color
                borderColor: courseColors[course.name].color,  // Border same as background color
                textColor: "#fff",  // Text color white for better contrast
                allDay: true,  // Display event as an all-day event
            });
        }
    }

    return events;
}