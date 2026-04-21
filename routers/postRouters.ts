// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

// ------------------------------------
// view posts
router.get("/", async (req, res) => {
  const posts = await database.getPosts(20);
  const user = await req.user;
  res.render("posts", { posts, user });
});

router.get("/show/:postid", async (req, res) => {
  const postid = req.params.postid;
  
  const post = await database.getPost(postid);
  const comments = await database.getCommentsForPost(postid);
  const user = req.user;

  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("individualPost", { post, comments, user });
});

// ------------------------------------
// create posts 
router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", { user: req.user });
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  // ⭐ Done
  // 
  const { title, link, description, subgroup } = req.body;
  const creator = req.user.id; 

  if (!link && !description) {
    return res.status(400).send("You must give a link or description");
  }

  const newPost = await database.addPost(title, link, description, creator, subgroup);
  res.redirect(`/posts/show/${newPost.id}`);
});

// ------------------------------------
// edit posts
//  ensureAuthenticated middleware
router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(req.params.postid);

  if (!post) return res.status(404).send("Post not found");
  
  // only the creator can edit
  const isCreator = post.creator === req.user.id || post.creator?.id === req.user.id;
  if (!isCreator) {
    return res.status(403).send("You do not have permission to edit this post.");
  }

  res.render("editPost", { post, user: req.user });
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ done
  const post = await database.getPost(req.params.postid);

  
  const isCreator = post.creator === req.user.id || post.creator?.id === req.user.id;
  if (!isCreator) {
    return res.status(403).send("Unauthorized");
  }

  // update the post with new data from req.body
  await database.editPost(req.params.postid, req.body);
  res.redirect(`/posts/show/${req.params.postid}`);
});

// ------------------------------------
// delete posts
router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(req.params.postid);

  if (!post) return res.status(404).send("Post not found");
  
  
  const isCreator = post.creator === req.user.id || post.creator?.id === req.user.id;
  if (!isCreator) {
    return res.status(403).send("You do not have permission to delete this post.");
  }

  res.render("deleteConfirm", { post, user: req.user });
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(req.params.postid);

  if (!post) return res.redirect("/");

  
  const isCreator = post.creator === req.user.id || post.creator?.id === req.user.id;
  if (isCreator) {
    await database.deletePost(req.params.postid);
    // Redirect to the sub that the post belonged to
    res.redirect(`/subs/show/${post.subgroup}`);
  } else {
    res.status(403).send("Unauthorized");
  }
});


// ------------------------------------
// comments
router.post("/comment-create/:postid", ensureAuthenticated, async (req, res) => {
    // ⭐ TODO
    const postid = req.params.postid;
    // FIXED: Spelling of description
    const description = req.body.description;
    const creator = req.user.id;

    if (description) {
      await database.addComment(postid, creator, description);
    }
  
  res.redirect(`/posts/show/${postid}`);
});

// ------------------------------------
// voting

router.post("/vote/:postid", ensureAuthenticated, async (req, res) => {
  const postid = req.params.postid;
  const userid = req.user.id;
  const setvoteto = parseInt(req.body.setvoteto, 10); // Should be +1, -1, or 0

  await database.addVote(postid, userid, setvoteto);
  
  res.redirect(`/posts/show/${postid}`);
});

export default router;