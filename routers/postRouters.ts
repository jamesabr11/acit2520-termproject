// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { userInfo } from "os";

// veiw posts
router.get("/", async (req, res) => {
  const posts = await database.getPosts(20);
  const user = await req.user;
  res.render("posts", { posts, user });
});

router.get("/show/:postid", async (req, res) => {
  const postid = req.params.postid
  const post = await database.getPosts(postid)
  const comments = await database.getCommentsForPost(postid)
  const user = req.user

  if (!post) {
    return res.status(404).send("Post not found")
  }
  res.render("individualPost", { post, comments, user})
})

// create posts 
router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", { user: req.user});
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const { title, link, desciption, subgroup } = req.body
  const creator = req.user.id 

  if (!link && !desciption) {
    return res.status(400).send("You must give a link or description")
  }

  const newPost = await database.addPost(title, link, desciption, creator, subgroup)
    res.redirect(`/posts/show/${newPost.id}`)
});

router.get("/show/:postid", async (req, res) => {
  // ⭐ TODO
  res.render("individualPost");
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // ⭐ TODO
  }
);

export default router;
