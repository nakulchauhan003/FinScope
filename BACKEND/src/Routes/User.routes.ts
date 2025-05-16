import { Router } from "express";
import { checkStatusRoute, getUserAndProfile, login, registerUser } from "../Controllers/User.controller";
const router=Router();

router.route('/').get(checkStatusRoute);
router.route('/register').post(registerUser);
router.route('/login').post(login);
router.route('/get_user_and_profile').get(getUserAndProfile);

export default router;