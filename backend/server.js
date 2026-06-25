const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/summary", async (req, res) => {
  try {
    const { name, education, skills, experience, project1, project2, project3 } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Create a professional ATS-friendly resume summary.

Name: ${name}
Education: ${education}
Skills: ${skills}
Experience: ${experience}
Projects: ${project1}, ${project2}, ${project3}

Write a professional summary in 120-150 words.
Return only one paragraph.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({
      summary: response.text(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "AI generation failed",
    });
  }
});

app.post("/skills", async (req, res) => {
  try {
    const { skills } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Based on these skills:
${skills}

Suggest 10 additional resume skills.
Return only skill names separated by commas.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({
      skills: response.text(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Skill recommendation failed",
    });
  }
});

app.get("/", (req, res) => {
  res.send("AI Resume Maker Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
