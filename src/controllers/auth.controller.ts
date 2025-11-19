import { Request, Response, NextFunction } from "express";
import { AuthService } from "@/services/auth.service";
import { BaseController } from "./base.controller";
import { AppError } from "@/utils/appError";

export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

signup =  (req: Request, res: Response, next: NextFunction): void => {
  this.handleRequest(req, res, next, async () => {
    const { firstName, lastName, email, password } = req.body;
    // correct order
    return await this.authService.signup(firstName, lastName, email, password);
  });
};


  login = (req: Request, res: Response, next: NextFunction): void => {
    this.handleRequest(req, res, next, async () => {
      const { email, password } = req.body;
      return await this.authService.login(email, password);
    });
  };

  logout = (req: Request, res: Response, next: NextFunction): void => {
    this.handleRequest(req, res, next, async () => {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }
      await this.authService.logout(req.user.userId);
      return { message: "Logged out successfully" };
    });
  };

  refresh = (req: Request, res: Response, next: NextFunction): void => {
    this.handleRequest(req, res, next, async () => {
      const { refreshToken } = req.body;
      return await this.authService.refresh(refreshToken);
    });
  };

  // verifyEmail = (req: Request, res: Response, next: NextFunction): void => {
  //   this.handleRequest(req, res, next, async () => {
  //     const { token } = req.params;
  //     return await this.authService.verifyEmail(token);
  //   });
  // };
  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.params;
    await this.authService.verifyEmail(token);

    //  Redirect to frontend after successful verification
    return res.redirect(`${process.env.FRONTEND_URL}/my-account`);
  } catch (error: any) {
    console.error("Email verification failed:", error);
    // Redirect to frontend failure page
    return res.redirect(`${process.env.FRONTEND_URL}/verify-email/failed`);
  }
};


  resendVerification = (req: Request, res: Response, next: NextFunction): void => {
    this.handleRequest(req, res, next, async () => {
      const { email } = req.body;
      return await this.authService.resendVerificationEmail(email);
    });
  };

  forgotPassword = (req: Request, res: Response, next: NextFunction): void => {
    this.handleRequest(req, res, next, async () => {
      const { email } = req.body;
      return await this.authService.forgotPassword(email);
    });
  };

  resetPassword = (req: Request, res: Response, next: NextFunction): void => {
    this.handleRequest(req, res, next, async () => {
      const { token } = req.params;
      const { password } = req.body;
      return await this.authService.resetPassword(token, password);
    });
  };
}
