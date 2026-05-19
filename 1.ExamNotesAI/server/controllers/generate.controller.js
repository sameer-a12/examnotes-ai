import Notes from "../models/notes.model.js"
import UserModel from "../models/user.model.js"
import { generateGeminiResponse } from "../services/gemini.services.js"
import { buildPrompt } from "../utils/promptBuilder.js"
 
function getPreviousDate(dateStr) {
    const d = new Date(dateStr)
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
}
 
export const generateNotes = async (req, res) => {
    try {
        const {
            topic,
            classLevel,
            examType,
            revisionMode = false,
            includeDiagram = false,
            includeChart = false
        } = req.body;
 
        if (!topic) {
            return res.status(400).json({ message: "Topic is required" })
        }
 
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(400).json({ message: "user is not found" })
        }
 
        if (user.credits < 10) {
            user.isCreditAvailable = false
            await user.save()
            return res.status(403).json({ message: "Insufficient credits" });
        }
 
        const prompt = buildPrompt({ topic, classLevel, examType, revisionMode, includeDiagram, includeChart })
        const aiResponse = await generateGeminiResponse(prompt)
 
        const notes = await Notes.create({
            user: user._id,
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart,
            content: aiResponse
        })
 
        user.credits -= 10;
        if (user.credits <= 0) user.isCreditAvailable = false;
        if (!Array.isArray(user.notes)) user.notes = [];
        user.notes.push(notes._id);
 
        const today = new Date().toISOString().split('T')[0]
        const last = user.lastActiveDate
 
        if (last === today) {
        } else if (last === getPreviousDate(today)) {
            user.streak = (user.streak || 0) + 1
        } else {
            user.streak = 1
        }
        user.lastActiveDate = today
       
 
        await user.save();
 
        return res.status(200).json({
            data: aiResponse,
            noteId: notes._id,
            creditsLeft: user.credits,
            streak: user.streak
        })
 
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "AI generation failed",
            message: error.message
        });
    }
}
