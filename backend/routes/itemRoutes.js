const express = require("express");
const itemsController = require("../controller/itemsController");

const router = express.Router();

router.get("/:student_id", itemsController.getToDoList);
router.post("/:student_id", itemsController.addToDoList);
router.patch("/:student_id/:task_id", itemsController.editToDoList);
router.delete("/:student_id/:task_id", itemsController.deleteToDoList);

module.exports = router;