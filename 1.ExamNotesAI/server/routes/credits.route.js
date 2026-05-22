import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  createCreditsOrder,
  completeDummyPayment,
} from "../controllers/credits.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", isAuth, createCreditsOrder);
paymentRouter.post("/complete/:paymentId", completeDummyPayment);


export default paymentRouter;