const ai = require("../ai/gemini");

module.exports.tripPlanner = async (req, res) => {

    try {

        const { destination, budget, days } = req.body;

        const prompt = `
        Plan a ${days}-day trip to ${destination}
        with a budget of ₹${budget}.

        Give:
        Day-wise itinerary
        Budget breakdown
        Places to visit
        Food recommendations
        Travel tips.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.json({
            plan: response.text
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "AI Error"
        });

    }

};