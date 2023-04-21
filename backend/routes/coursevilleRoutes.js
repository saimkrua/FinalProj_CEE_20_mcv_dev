const express = require("express");
const coursevilleController = require("../controller/coursevilleController");

const router = express.Router();

router.get("/auth_app", coursevilleController.authApp);
router.get("/access_token", coursevilleController.accessToken);
router.get("/get_profile_info", coursevilleController.getProfileInformation);
router.get("/get_all_course",coursevilleController.getAllCourse);
router.get("/get_course_info/:cv_cid",coursevilleController.getCourseInformation);
router.get("/logout", coursevilleController.logout);

module.exports = router;
