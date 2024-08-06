const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyD5qwDlGFOK2VDU07X-8w3cB4RhagbIgoU");

export const askGemini = async (question) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(question);
  return result.response.text();
}

function generateRandomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // Formats date as YYYY-MM-DD
}

export function generateRandomData() {
  const data = [];
  const startDate = new Date(2020, 0, 1); // Start date: January 1, 2020
  const endDate = new Date(); // End date: Current date

  for (let i = 0; i < 6; i++) {
    const record = {
      steps: Math.floor(Math.random() * 20000),          // Random steps between 0 and 20000
      temperature: (Math.random() * 5 + 96).toFixed(1), // Random temperature between 96 and 101, rounded to 1 decimal place
      heartBeat: Math.floor(Math.random() * 50 + 60),   // Random heartbeat between 60 and 110
      date: generateRandomDate(startDate, endDate)       // Random date between startDate and endDate
    };
    data.push(record);
  }
  return data;
}