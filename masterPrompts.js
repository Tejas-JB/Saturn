const axios = require('axios');

// Function to query GPT-3.5 for help with an assignment
async function gptAssist(assignment) {
  const openaiApiKey = 'your_openai_api_key';  // Replace with your OpenAI API key

  // Extract course name and assignment details from the assignment JSON object
  const courseName = assignment.course;
  const assignmentTitle = assignment.title
  const assignmentDescription = assignment.description;

  // Use if-else statements to determine the master prompt based on the course
  let masterPrompt = '';
  
  if (courseName === "PICARD AP PSYCHOLOGY") {
    if (assignmentTitle.includes("Mod") || assignmentTitle.includes("Moc")){
        
        masterPrompt = "You are an expert on Psychology and teach AP Psychology. Please help the student understand the following topic in depth by sending the student concise and easy to understand notes and analysis. The topic is from the module listed in this title: " + assignmentTitle + ", which can be found in the textbook.";
    }
    
  }
  
  else if (courseName === "AP US History-PB-6 -Kerr") {
    masterPrompt = "You are a history expert. Please help the student understand this topic in detail with key historical context and analysis. The topic is:";
  }
  
  else if (courseName === "AP English Language & Composition") {
    masterPrompt = "You are a literary expert. Help the student analyze this text with a focus on rhetoric, themes, and literary devices. The text is:";
  }
  
  else if (courseName === "AP Statistics-Mr.Shieh") {
    masterPrompt = "You are a statistics tutor. Help the student analyze the following data set and explain the statistical significance. The task is:";
  }
  
  else if (courseName === "AP Physics 1-PA-1 Tandon") {
    masterPrompt = "You are a physics expert. Help the student solve this physics problem with detailed explanations and diagrams if necessary. The problem is:";
  }
  
  else {
    masterPrompt = `Help the student with this assignment from the course: ${courseName}. The assignment is:`;
  }

  // Create the full prompt by combining the master prompt and the assignment title or details
  const fullPrompt = `${masterPrompt} ${assignmentTitle} ${assignmentDescription}`;

  try {
    // Query OpenAI API
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'gpt-3.5-turbo',
      prompt: fullPrompt,
      max_tokens: 500,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Return the GPT-3.5 response text
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error querying GPT-3.5:', error);
    return 'There was an error querying the GPT-3.5 model.';
  }
}

// Function to assist with all assignments in a course
async function assistWithAssignments(assignments) {
  for (let assignment of assignments) {
    const gptResponse = await gptAssist(assignment);
    console.log(`GPT-3.5 Assistance for ${assignment.title}:`);
    console.log(gptResponse);
  }
}

module.exports = { gptAssist, assistWithAssignments };

