const express = require("express");
const router = express.Router();

const aiController = require("../Controllers/ai");

router.get("/trip-planner", aiController.renderPlanner);

router.post("/trip-planner", aiController.tripPlanner);

module.exports = router;