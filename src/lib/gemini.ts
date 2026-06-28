import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const hasApiKey = !!API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (hasApiKey) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// 1. AI Summary for a college
export async function getCollegeSummary(college: any): Promise<string> {
  const prompt = `Provide a concise, engaging 3-paragraph summary of ${college.name} located in ${college.location}, ${college.district}, ${college.state}. 
  Detail its academic reputation, average/highest placements (${college.averagePackage} LPA and ${college.highestPackage} LPA respectively), infrastructure, and hostel/transport facilities. 
  End with a bulleted list of 3 Pros and 2 Cons based on typical student feedback. Format the output in clean Markdown.`;

  if (!hasApiKey || !genAI) {
    return `### AI Summary of ${college.name}

**Overview**: ${college.name} (located in ${college.location}, ${college.district}) is one of the standout engineering options in ${college.state}. With a solid average package of **${college.averagePackage} LPA** and a peak package of **${college.highestPackage} LPA**, the institution is well-regarded for launching successful careers in technical domains.

**Academic & Life**: The college is known for its experienced faculty and rich history. Featuring active student chapters (like IEEE, ISTE, and CSI) and a strong coding environment, students gain excellent hands-on knowledge. The campus offers comprehensive ${college.hostel ? "hostel blocks and" : ""} transport services, maintaining an active student-centric environment.

**Key Highlights**:
*   **Pros**:
    *   **High Placements**: ${college.placementPercentage}% placement rate ensures excellent job prospects.
    *   **Strong Industry Connections**: Active partnerships and internship alignments in nearby IT hubs.
    *   **Vibrant Student Culture**: Excellent technical and cultural festivals.
*   **Cons**:
    *   **Rigorous Academic Load**: High expectations and frequent exams can feel intensive.
    *   **Infrastructure Pace**: Older academic blocks can sometimes feel crowded compared to newer private buildings.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini summary error, falling back:", error);
    return `Failed to fetch live AI summary. Defaulting to cached highlights:\n\n${college.description}`;
  }
}

// 2. AI College Comparison Insights
export async function getComparisonInsights(colleges: any[]): Promise<string> {
  if (colleges.length === 0) return "Please select colleges to compare.";

  const collegesInfo = colleges
    .map(
      (c) =>
        `- **${c.name}** (Fees: ₹${c.fees}/yr, Placement: ${c.placementPercentage}%, Avg Package: ${c.averagePackage} LPA, Highest Package: ${c.highestPackage} LPA, Type: ${c.type}, Autonomous: ${c.autonomous})`
    )
    .join("\n");

  const prompt = `Analyze and compare the following colleges and provide clear insights in Markdown:
  ${collegesInfo}
  
  Determine:
  1. Which college offers the best Return on Investment (ROI) based on Fees vs Placements.
  2. Which college has the strongest placement performance.
  3. A summary table or breakdown recommending which student profile (budget-conscious, placement-focused, etc.) should choose which college.`;

  if (!hasApiKey || !genAI) {
    const bestPlacement = [...colleges].sort((a, b) => b.placementPercentage - a.placementPercentage)[0];
    const bestROI = [...colleges].sort((a, b) => (b.averagePackage * 100000 / b.fees) - (a.averagePackage * 100000 / a.fees))[0];

    return `### AI Comparison Insights

#### 1. Return on Investment (ROI) Analysis
*   **Best Value**: **${bestROI.name}** stands out as the best value for money option. With annual fees of **₹${bestROI.fees.toLocaleString()}** and an average package of **${bestROI.averagePackage} LPA**, it offers a very rapid cost-recovery window.
*   **Premium Option**: Private colleges like **${colleges.find(c => c.type === 'Private')?.name || 'Private colleges'}** demand higher tuition fees but compensate with modern amenities, global tie-ups, and modern lab systems.

#### 2. Placements & Market Strength
*   **Top Performer**: **${bestPlacement.name}** leads the cohort with a **${bestPlacement.placementPercentage}%** placement percentage and a highest package of **${bestPlacement.highestPackage} LPA**. It is the ideal pick for students seeking top-tier core product companies (Amazon, Adobe, etc.).

#### 3. Recommendation Profile

| Student Profile | Recommended Choice | Rationale |
| :--- | :--- | :--- |
| **Budget-Conscious** | ${bestROI.name} | Extremely low fee structure combined with dependable placements. |
| **Placement-First** | ${bestPlacement.name} | Absolute highest packages and maximum placement security. |
| **Balance & Culture** | ${colleges[Math.floor(colleges.length/2)]?.name || 'Aided Colleges'} | Balanced campus life, hostel facilities, and standard university rankings. |`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini comparison error:", error);
    return "Could not generate automated comparison insights. Please check fees, ratings, and packages in the table above.";
  }
}

// 3. AI Assistant Chat response
export async function getAssistantResponse(
  message: string,
  history: { role: "user" | "model"; content: string }[],
  colleges: any[]
): Promise<string> {
  const collegesContext = colleges
    .map(
      (c) =>
        `- ${c.name} in ${c.district}: Fees ₹${c.fees}/yr, Placement ${c.placementPercentage}%, Avg Package ${c.averagePackage} LPA, Type ${c.type}, Autonomous ${c.autonomous ? "Yes" : "No"}, Hostel ${c.hostel ? "Yes" : "No"}`
    )
    .join("\n");

  const prompt = `You are a helpful, professional, and friendly admissions consultant for engineering colleges in Kerala.
  Use the following list of real colleges to answer the user's questions:
  ${collegesContext}
  
  User's Message: "${message}"
  
  Answer the user accurately based on the college data. If the user asks for suggestions under a budget, suggest private or government colleges that fit. Keep the answer concise, nicely formatted with bold text and bullet points.`;

  if (!hasApiKey || !genAI) {
    const msg = message.toLowerCase();
    
    // Quick keyword-based high-fidelity mock responses
    if (msg.includes("cse") || msg.includes("computer science")) {
      const cseColleges = colleges.filter(c => c.fees <= 90000).slice(0, 3);
      return `Based on your interest in **Computer Science & Engineering (CSE)**, here are some excellent recommendations:
      
1.  **Government Model Engineering College (MEC), Ernakulam**: Outstanding placement records (average package of 8.2 LPA) with a low government-aided fee of ₹35,000.
2.  **College of Engineering, Trivandrum (CET)**: Kerala's top college, offering a world-class CSE department with ₹35,000 fees and high average packages.
3.  **TKM College of Engineering, Kollam**: Great academic heritage and strong tech recruiting.

*Would you like me to compare their curriculum or review scores?*`;
    }

    if (msg.includes("placement") || msg.includes("package")) {
      const placementColleges = [...colleges].sort((a,b) => b.placementPercentage - a.placementPercentage).slice(0, 3);
      return `Here are the colleges with the **highest placement rates** in Kerala:

*   **Government Model Engineering College (MEC), Ernakulam**: **${placementColleges[0].placementPercentage}%** placement rate.
*   **College of Engineering, Trivandrum (CET)**: **${placementColleges[1].placementPercentage}%** placement rate with a top package of ${placementColleges[1].highestPackage} LPA.
*   **TKM College of Engineering, Kollam**: **${placementColleges[2].placementPercentage}%** placement rate.

All three colleges host recruiting drives from tech majors like Microsoft, Amazon, Oracle, and TCS.`;
    }

    if (msg.includes("autonomous")) {
      const autoColleges = colleges.filter(c => c.autonomous);
      return `Here are the prominent **autonomous engineering colleges** in our database:

*   **College of Engineering, Trivandrum (CET)** (Trivandrum) - Government
*   **TKM College of Engineering, Kollam** (Kollam) - Government-Aided
*   **Rajagiri School of Engineering & Technology (RSET)** (Ernakulam) - Private

Autonomous status allows these institutions to design their own industry-aligned curriculum and conduct examinations independently, leading to faster results and updated syllabus formats.`;
    }

    if (msg.includes("under") || msg.includes("fee") || msg.includes("budget") || msg.includes("₹")) {
      // Look for a number
      const match = msg.match(/(\d+[\d,]*)/);
      const budget = match ? parseInt(match[0].replace(/,/g, ""), 10) : 80000;
      const budgetColleges = colleges.filter(c => c.fees <= budget);
      
      if (budgetColleges.length === 0) {
        return `I couldn't find any colleges in our records with fees below **₹${budget.toLocaleString()}**. 
        However, the cheapest options are **Government Engineering Colleges** (like GECT Thrissur at ₹15,000/year) and **Government-Aided colleges** (around ₹35,000 - ₹40,000/year).`;
      }

      return `Here are the engineering colleges with annual fees **under ₹${budget.toLocaleString()}**:

${budgetColleges.slice(0, 3).map(c => `*   **${c.name}** (${c.district}) — Fees: **₹${c.fees.toLocaleString()}/year** (Placement: ${c.placementPercentage}%, Avg Package: ${c.averagePackage} LPA)`).join("\n")}

These represent great choices that keep educational expenses highly manageable while providing good career starts.`;
    }

    return `Hello! I am your AI Admissions Assistant for College Discovery. I can help you:
    
*   Recommend colleges under a specific budget (e.g., *"Suggest colleges under ₹50,000"*).
*   Find top placement colleges (e.g., *"Which colleges have 90%+ placements?"*).
*   Locate autonomous colleges (e.g., *"Best autonomous colleges in Kochi"*).
*   Provide advice on branches and careers.

How can I help you discover the perfect engineering college today?`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }]
      })),
      generationConfig: { maxOutputTokens: 1000 }
    });
    
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini assistant error:", error);
    return "I am currently experiencing a connection hiccup with my AI engine. How else can I assist you with our college list?";
  }
}

// 4. AI Career Roadmap Generator
export async function getBranchRoadmap(branch: string): Promise<string> {
  const prompt = `Create a detailed, inspiring 4-year study and skills roadmap for a student majoring in "${branch}".
  Provide a bulleted list for Year 1, Year 2, Year 3, and Year 4. 
  Include specific tech stacks to learn, certifications to pursue, project ideas, and interview preparation timelines. Format in clean, bold Markdown.`;

  if (!hasApiKey || !genAI) {
    return `### AI Career Roadmap for ${branch}

#### 🚀 Year 1: Fundamentals & Discovery
*   **Focus**: Mathematics, logical reasoning, and basic coding paradigms.
*   **Technologies to Learn**: C programming, Python basics, HTML/CSS.
*   **Milestones**: Get comfortable with Git/GitHub; build a responsive personal portfolio website.

#### 🛠️ Year 2: Core Engineering & Specialization
*   **Focus**: Data Structures and Algorithms (DSA), Object-Oriented Programming (OOPs), and database concepts.
*   **Technologies to Learn**: Java or C++, SQL (PostgreSQL/MySQL), Linux command line, Data Structures.
*   **Milestones**: Solve 100+ questions on LeetCode/HackerRank; build a database-driven CRUD application (e.g., task manager).

#### 🌐 Year 3: Practical Frameworks & Internships
*   **Focus**: Advanced tech stack (Web/App Development, Cloud, or AI/ML) and system design.
*   **Technologies to Learn**: React/Next.js, Node.js, REST APIs, Docker, cloud basics (AWS/Vercel).
*   **Milestones**: Participate in a local hackathon; secure a 2-month summer internship; build a complex group project.

#### 🎓 Year 4: Portfolios, Placements & Launch
*   **Focus**: Interview prep, mock interviews, placement tests, and your final year capstone project.
*   **Actions**: Standardize resume; solve daily code challenges; finalize a highly scalable capstone project.
*   **Interview Prep**: Revise OS, DBMS, Networks, and system design paradigms. Ready to land your first tech job!`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini roadmap error:", error);
    return "Roadmap generator is temporarily unavailable. Check back soon for your specialized roadmap!";
  }
}
