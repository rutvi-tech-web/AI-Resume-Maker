import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [summary, setSummary] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [experience, setExperience] = useState("");
  const [project1, setProject1] = useState("");
  const [project2, setProject2] = useState("");
  const [project3, setProject3] = useState("");
  const [template, setTemplate] = useState("ats");
  const [photo, setPhoto] = useState("");
  const [showEducation, setShowEducation] = useState(true);
  const [showExperience, setShowExperience] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showSkills, setShowSkills] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState("");

  useEffect(() => {
  const savedData = localStorage.getItem("resumeData");

const savedTheme = localStorage.getItem("darkMode");

if (savedTheme !== null) {
  setDarkMode(savedTheme === "true");
}

if (savedData) {
  const data = JSON.parse(savedData);

    setName(data.name || "");
    setEmail(data.email || "");
    setPhone(data.phone || "");
    setLinkedin(data.linkedin || "");
    setGithub(data.github || "");
    setEducation(data.education || "");
    setExperience(data.experience || "");
    setSkills(data.skills || "");
    setProject1(data.project1 || "");
    setProject2(data.project2 || "");
    setProject3(data.project3 || "");
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "resumeData",
    JSON.stringify({
      name,
      email,
      phone,
      linkedin,
      github,
      education,
      experience,
      skills,
      project1,
      project2,
      project3,
    })
  );
}, [
  name,
  email,
  phone,
  linkedin,
  github,
  education,
  experience,
  skills,
  project1,
  project2,
  project3,
]);

useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(24);
  doc.text(name || "Resume", 20, 20);

  if (photo) {
    doc.addImage(photo, "JPEG", 150, 10, 40, 40);
  }

  doc.setFontSize(12);
  doc.text(`${email} | ${phone}`, 20, 30);

  let y = 45;

  doc.setFontSize(16);
  doc.text("Professional Summary", 20, y);
  y += 10;

  doc.setFontSize(12);
  const summaryLines = doc.splitTextToSize(
  summary || "Not Provided",
  170
);

doc.text(summaryLines, 20, y);

y += summaryLines.length * 7;

  doc.setFontSize(16);
  doc.text("Education", 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(education || "Not Provided", 20, y);

  y += 20;

  doc.setFontSize(16);
  doc.text("Skills", 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(skills || "Not Provided", 20, y);

  y += 20;

  doc.setFontSize(16);
  doc.text("Experience", 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(experience || "Not Provided", 20, y, {
    maxWidth: 170,
  });

  y += 25;

  doc.setFontSize(16);
  doc.text("Projects", 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`• ${project1}`, 20, y);
  y += 8;

  doc.text(`• ${project2}`, 20, y);
  y += 8;

  doc.text(`• ${project3}`, 20, y);

  doc.save(`${name || "resume"}.pdf`);
};

  const generateSummary = async () => {
  try {
    const response = await fetch(
  `    ${import.meta.env.VITE_API_URL}/summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        education,
        skills,
        experience,
        project1,
        project2,
        project3,
      }),
    });

    const data = await response.json();

    setSummary(data.summary);
  } catch (error) {
    console.error(error);
    alert("AI generation failed");
  }
};

  const recommendSkills = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/skills`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills,
        }),
      }
    );

    const data = await response.json();

    setRecommendedSkills(data.skills);
  } catch (error) {
    console.error(error);
    alert("Skill recommendation failed");
  }
};

  const calculateScore = () => {
  let total = 0;

  if (name) total += 10;
  if (email) total += 10;
  if (phone) total += 10;
  if (linkedin) total += 10;
  if (github) total += 10;
  if (education) total += 15;
  if (skills) total += 15;
  if (experience) total += 10;
  if (project1 || project2 || project3) total += 10;

  setScore(total);
};

  const calculateATS = () => {
  let tips = [];

  if (!name) tips.push("Add your full name");
  if (!email) tips.push("Add email address");
  if (!phone) tips.push("Add phone number");
  if (!skills) tips.push("Add technical skills");
  if (!education) tips.push("Add education details");
  if (!experience) tips.push("Add experience or internship");
  if (!project1 && !project2 && !project3) {
  tips.push("Add at least one project");
}

  if (tips.length === 0) {
    tips.push("Excellent! Your resume is ATS friendly.");
    tips.push("Add more action verbs like Developed, Built, Implemented.");
    tips.push("Use industry-specific keywords.");
  }

  setSuggestions(tips);
};

  return (
    <div className={`${darkMode ? "dark" : "light"} preview ${template}`}>
      {photo && (
    <img
      src={photo}
      alt="Profile"
      className="profile-photo"
    />
  )}
      <h1>AI Resume Maker Pro</h1>

      <h2>Enter Details</h2>
      
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <input
        type="text"
        placeholder="Education"
        value={education}
        onChange={(e) => setEducation(e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="text"
        placeholder="LinkedIn URL"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
      />

      <input
        type="text"
        placeholder="GitHub URL"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
      />

      <input
        type="text"
        placeholder="Experience (Internship / Work)"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />

      <input
        type="text"
        placeholder="Project 1"
        value={project1}
        onChange={(e) => setProject1(e.target.value)}
      />

      <input
        type="text"
        placeholder="Project 2"
        value={project2}
        onChange={(e) => setProject2(e.target.value)}
      />

      <input
        type="text"
        placeholder="Project 3"
        value={project3}
        onChange={(e) => setProject3(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];

          if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
              setPhoto(reader.result);
            };

            reader.readAsDataURL(file);
          }
       }}
      />

      <h3>Select Sections</h3>

      <label>
      <input
        type="checkbox"
        checked={showEducation}
        onChange={() => setShowEducation(!showEducation)}
      />
        Education
      </label>

<br />

<label>
  <input
    type="checkbox"
    checked={showExperience}
    onChange={() => setShowExperience(!showExperience)}
  />
  Experience
</label>

<br />

<label>
  <input
    type="checkbox"
    checked={showProjects}
    onChange={() => setShowProjects(!showProjects)}
  />
  Projects
</label>

<br />

<label>
  <input
    type="checkbox"
    checked={showSkills}
    onChange={() => setShowSkills(!showSkills)}
  />
  Skills
</label>

      <select
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        className="template-select"
      >
      <option value="ats">ATS Friendly</option>
      <option value="modern">Modern</option>
      <option value="student">Student</option>
      </select>

      <button className="generate-btn" onClick={generateSummary}>
        Generate AI Resume Summary
      </button>

      <button onClick={recommendSkills}>
        AI Skill Suggestions
      </button>

      <button onClick={calculateScore}>
        Check Resume Score
      </button>

      <button onClick={calculateATS}>
        Check ATS Suggestions
      </button>

      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>

      <button
        className="clear-btn"
        onClick={() => {
        localStorage.removeItem("resumeData");

        setName("");
        setEmail("");
        setPhone("");
        setLinkedin("");
        setGithub("");
        setEducation("");
        setExperience("");
        setSkills("");
        setProject1("");
        setProject2("");
        setProject3("");
        setSummary("");
        setScore(0);

        setSuggestions([]);
        setRecommendedSkills("");
      }}
  > 

    Clear Resume
      </button>

      <button
        className="theme-btn"
        onClick={() => setDarkMode(!darkMode)}
  >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <hr />

      <h3>Resume Score: {score}/100</h3>

      {recommendedSkills && (
  <>
    <h3>Recommended Skills</h3>
    <div className="skill-box">
      {recommendedSkills}
    </div>
  </>
)}

      <h3>ATS Suggestions</h3>

      {suggestions.length > 0 && (
        <div className="ats-box">
          {suggestions.map((item, index) => (
            <p key={index}>✅ {item}</p>
          ))}
        </div>
      )}

      <h2>Resume Preview</h2>

<div className={`preview ${darkMode ? "dark" : "light"}`}>

  {photo && (
    <img
      src={photo}
      alt="Profile"
      className="profile-photo"
    />
  )}

  <h1>{name}</h1>

  <p>
    {email} | {phone}
  </p>

  {linkedin && (
  <a href={linkedin} target="_blank" rel="noreferrer">
    LinkedIn Profile
  </a>
)}

<br />

{github && (
  <a href={github} target="_blank" rel="noreferrer">
    GitHub Profile
  </a>
)}

  <hr />

  <h3>Professional Summary</h3>
  <p>{summary}</p>

  {showEducation && (
    <>
      <h3>Education</h3>
      <p>{education}</p>
    </>
  )}

  {showSkills && (
    <>
      <h3>Skills</h3>
      <p>{skills}</p>
    </>
  )}

  {showExperience && (
    <>
      <h3>Experience</h3>
      <p>{experience}</p>
    </>
  )}

  {showProjects && (
    <>
      <h3>Projects</h3>
      <p>{project1}</p>
      <p>{project2}</p>
      <p>{project3}</p>
    </>
  )}
      </div>
    </div>
  );
}

export default App;