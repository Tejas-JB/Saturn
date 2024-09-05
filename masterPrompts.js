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
    else if (assignmentTitle.includes("MCQ") || assignmentTitle.includes("Test") || assignmentTitle.includes("test")){
        
      masterPrompt = "You are an expert on Psychology and teach AP Psychology. Please help the student understand the following topic in depth by sending the student concise and easy to understand notes and analysis. Also include practice multiple choice questions for the students to practice. The topic is from the unit listed in this title: " + assignmentTitle + ", which can be found in the textbook.";
    } 
    else if (assignmentTitle.includes("FRQ") || assignmentTitle.includes("Test") || assignmentTitle.includes("test")){
      masterPrompt = "You are an expert on Psychology and teach AP Psychology. Please help the student understand the following topic in depth by sending the student concise and easy to understand notes and analysis. Also include practice free response questions for the students to practice. The topic is from the unit listed in this title: " + assignmentTitle + ", which can be found in the textbook.";
    }
  }
  
  else if (courseName === "AP US History-PB-6 -Kerr") {
    if (assignmentTitle.includes("MCQ") || assignmentTitle.includes("Test") || assignmentTitle.includes("test")){
      masterPrompt = "You are a history expert. Please help the student understand this topic in detail with key historical context and analysis, and create practice multiple choice questions for the student to practice. The topic is in the title: " + assignmentTitle + "";
    }
    else if (assignmentTitle.includes("SAQ") || assignmentTitle.includes("Test") || assignmentTitle.includes("test")){
      masterPrompt = "You are a history expert. Please help the student understand this topic in detail with key historical context and analysis, and create practice free response questions for the student to practice. The topic is in the title: " + assignmentTitle + "";
    }
    else if (assignmentTitle.includes("Notes")){
      masterPrompt = "You are a history expert. Please help the student understand this topic in detail with key historical context and analysis, and create notes that are concise and easy to understand for the students. The topic is in the title: " + assignmentTitle + "";
    }
  }
  
  else if (courseName === "AP English Language & Composition") {
    if (assignmentTitle.includes("MCQ") || assignmentTitle.includes("Test") || assignmentTitle.includes("test")){
      masterPrompt = "You are a literary expert. Help the student practice for an upcoming multiple choice test about the topic listed in this title: " + assignmentTitle + "";
    }
    else if (assignmentTitle.includes("essay") || (assignmentTitle.includes("Essay"))){
      masterPrompt = "You are a literary expert. Help the student analyze this book with a focus on rhetoric, themes, and literary devices, to prepare the student for an upcoming essay about the book. Include some sample AP Lang essay prompts that the student can use the prepare for the essay. The book is in this title: " + assignmentTitle + "";
    }
    
  }
  
  else if (courseName === "AP Statistics-Mr.Shieh") {
    if (assignmentTitle.includes("MCQ") || assignmentTitle.includes("Test") || assignmentTitle.includes("test")){
      masterPrompt = "You are a statistics tutor. Teach the student the concepts present in the following topic, and give them some multiple choice questions to prepare them for their upcoming mcq test. The topic is in the title: " + assignmentTitle + "";
    }
    else if (assignmentTitle.includes("FRQ") || assignmentTitle.includes("Test") || assignmentTitle.includes("test")){
      masterPrompt = "You are a statistics tutor. Teach the student the concepts present in the following topic, and give them some free response questions to prepare them for their upcoming mcq test. The topic is in the title: " + assignmentTitle + "";
    }
    
  }
  
  else if (courseName === "AP Physics 1-PA-1 Tandon") {
    if (assignmentTitle.includes("MCQ") || assignmentTitle.includes("Test") || assignmentTitle.includes("test")){
      masterPrompt = "You are a physics expert. Help the student understand the following topic, and give the student some multiple choice questions to practice. The intention is to prepare the student for an uncoming mcq test. The topic is listed in the title: " + assignmentTitle + "";
    }
    else if (assignmentTitle.includes("FRQ") || assignmentTitle.includes("Test") || assignmentTitle.includes("test")){
      masterPrompt = "You are a physics expert. Help the student understand the following topic, and give the student some free response questions to practice. The intention is to prepare the student for an uncoming frq test.The topic is listed in the title: " + assignmentTitle + "";
    }
    else if (assignmentTitle.includes("WS")){
      masterPrompt = "You are a physics expert. Help the student understand the following topic, and give the student some multiple choice questions to practice. The topic is listed in the title: " + assignmentTitle + "";
    }
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

