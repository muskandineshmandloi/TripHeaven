const ai = require("../ai/genai");

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
                You are an AI Travel Planner.

                Plan a ${days}-day ${style} trip to ${destination}
                with a total budget of ₹${budget}.

                Provide the response in the following sections:

                1. Recommended Stay
                2. Day-wise Itinerary
                3. Budget Breakdown
                4. Places to Visit
                5. Food Recommendations
                6. Travel Tips

                Keep the response concise, well-structured, and easy to read.
                `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const plan = response.text();
        console.log(response);

        res.render("ai/planner", {
            plan,
            destination,
            budget,
            days
        });

    } catch (err) {

        console.error(err.message);
        console.error(err);

        res.render("ai/planner", {
            plan: "Something went wrong while generating the travel plan.",
            destination: "",
            budget: "",
            days: ""
        });

    }

};