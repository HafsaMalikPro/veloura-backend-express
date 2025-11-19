import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
export const notFoundHandler = (req: Request, res: Response , next: NextFunction) => {
  ApiResponse.error(res, '🔍 Ooops! Looks like you are lost. 🗺️', 404);
}; 

