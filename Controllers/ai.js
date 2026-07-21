const groq = require("../ai/groq");
const { marked } = require("marked");

module.exports.renderPlanner = (req, res) => {
    res.render("ai/planner", {
        htmlPlan: null,
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

Return the response in Markdown format.

# Recommended Stay

# Day-wise Itinerary

# Budget Breakdown

# Places to Visit

# Food Recommendations

# Travel Tips

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

        const htmlPlan = marked.parse(plan);

        res.render("ai/planner", {
            htmlPlan,
            destination,
            budget,
            days
        });

    } catch (err) {

        console.error(err);

        res.render("ai/planner", {
            htmlPlan: "<p>Something went wrong while generating the travel plan.</p>",
            destination: "",
            budget: "",
            days: ""
        });

    }
};