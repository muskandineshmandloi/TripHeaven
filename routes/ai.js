const express = require("express");
const router = express.Router();

const aiController = require("../Controllers/ai");

router.get("/trip-planner", aiController.renderPlanner);

module.exports = router;