import UserModel from "../models/user.model.js";
import dotenv from "dotenv";
import crypto from "crypto";
import mongoose from "mongoose";

dotenv.config();

const CREDIT_MAP = {
  100: 50,
  200: 120,
  500: 300,
};

const dummyPayments = new Map();

export const createCreditsOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;


    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    if (!CREDIT_MAP[amount]) {
      return res.status(400).json({
        message: "Invalid credit plan",
      });
    }


    const paymentId = crypto.randomUUID();

    dummyPayments.set(paymentId, {
      userId,
      amount,
      credits: CREDIT_MAP[amount],
      status: "pending",
    });

    const paymentUrl = `${process.env.CLIENT_URL}/dummy-payment/${paymentId}`;

    res.status(200).json({
      success: true,
      paymentId: paymentId,
      url: paymentUrl,
    });

  } catch (error) {
    console.error("Order Creation Exception:", error);
    res.status(500).json({
      message: "Payment creation failed",
    });
  }
};

export const completeDummyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = dummyPayments.get(paymentId);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (payment.status === "completed") {
      return res.status(400).json({
        message: "Payment already completed",
      });
    }

    payment.status = "completed";

    const targetObjectId = new mongoose.Types.ObjectId(payment.userId);

    const user = await UserModel.findByIdAndUpdate(
      targetObjectId,
      {
        $inc: { credits: Number(payment.credits) },
        $set: { isCreditAvailable: true },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User account could not be found to apply credits.",
      });
    }


    res.status(200).json({
      success: true,
      message: "Dummy payment successful",
      user,
    });

  } catch (error) {
    console.error("Payment Capture Engine Exception:", error);
    res.status(500).json({
      message: "Payment verification failed",
    });
  }
};