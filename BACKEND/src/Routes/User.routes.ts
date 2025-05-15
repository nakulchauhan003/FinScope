import { Router } from "express";
import { checkStatusRoute, login, registerUser } from "../Controllers/User.controller";
const router=Router();

router.route('/').get(checkStatusRoute);
router.route('/register').post(registerUser);
router.route('/login').post(login);

export default router;