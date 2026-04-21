import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  // check if user is logged in using passport
if (req.isAuthenticated()) {
  res.redirect("/posts");
} else {
  // if not logged in send to login page
  res.redirect("/auth/login");
}
});

export default router;
