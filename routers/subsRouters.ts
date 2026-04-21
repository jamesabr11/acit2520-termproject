// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();

router.get("/list", async (req, res) => {
  // ⭐ TODO
  const subs = await database.getSubs();
  
  // Pass the subs array and the user object to the EJS template
  res.render("subs", { subs, user: req.user });
});

router.get("/show/:subname", async (req, res) => {
  // ⭐ TODO
  const subname = req.params.subname;
  
  // Fetch up to 50 posts that specifically match this subname
  const posts = await database.getPosts(50, subname); 
  
  // Pass the filtered posts, the subname string, and the user object to the template
  res.render("sub", { posts, subName: subname, user: req.user });
});

export default router;
