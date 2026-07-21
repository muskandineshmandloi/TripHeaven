const groq = require("../ai/groq");
const { marked } = require("marked");
const htmlPlan = marked.parse(plan);

module.exports.renderPlanner = (req, res) => {

    res.render("ai/planner", {
        plan: null,
        destination: "",
        budget: "",
        days: ""
    });

};

module.exports.tripPlanner = async (req, res) => {

    try {

        const { destination, budget, days, style } = req.body;

        const prompt = `
        You are a professional AI Travel Planner.

        Create a ${days}-day ${style} trip to ${destination}
        with a total budget of ₹${budget}.

        Provide the response in the following format:

        Recommended Stay

        Day-wise Itinerary

        Budget Breakdown

        Places to Visit

        Food Recommendations

        Travel Tips

        Keep the response concise, well-structured, and easy to read.
        `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const plan = completion.choices[0].message.content;

        res.render("ai/planner", {
            htmlPlan,
            destination,
            budget,
            days
        });

    } catch (err) {

        console.error("Gemini Error:");
        console.error(err);

        res.render("ai/planner", {
            plan: "Something went wrong while generating the travel plan.",
            destination: "",
            budget: "",
            days: ""
        });

    }

};