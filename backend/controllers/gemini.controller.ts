import { Request, Response } from 'express';
import { generateResult } from '../services/gemini.service';

export const getResult = async (req: Request, res: Response): Promise<any> => {
    try {

        const { prompt } = req.query;
        const result = await generateResult(prompt as string);

        return res.send(result);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}