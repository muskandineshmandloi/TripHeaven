require("dotenv").config();
const Groq = require("groq-sdk");

console.log(process.env.GROQ_API_KEY?.substring(0, 7));
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

module.exports = groq;