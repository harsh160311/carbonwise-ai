import { Router, Request, Response } from 'express';
import { chatMessageSchema } from '../validators/carbonValidator.js';
import { generateCoachResponse } from '../services/coachService.js';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const parsed = chatMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { message, carbonData } = parsed.data;
    const response = await generateCoachResponse(message, carbonData);

    res.json({
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Coach error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;
