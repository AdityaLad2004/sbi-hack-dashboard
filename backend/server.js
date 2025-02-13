const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyDETb4SLcvhl3gXr3XzLVl6qWqZQ7AVoFc";
const genAI = new GoogleGenerativeAI(API_KEY);

const getSolution = async (errorMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `You are a DevOps expert. Provide a detailed solution for this error: ${errorMessage}`
    );

    const responseText = result.response.text();
    console.log(`AI Response for "${errorMessage}":`, responseText); // Debugging
    return responseText;
  } catch (error) {
    console.error("Error fetching solution:", error);
    return "Solution not available.";
  }
};

app.post("/api/get-solution", async (req, res) => {
  const { errors } = req.body;
  console.log("Received Errors:", errors); // Debugging

  const solutions = {};
  for (const error of errors) {
    solutions[error] = await getSolution(error);
  }

  console.log("Final Solutions:", solutions); // Debugging
  res.json(solutions);
});

app.listen(5000, () => console.log("Server running on port 5000"));
