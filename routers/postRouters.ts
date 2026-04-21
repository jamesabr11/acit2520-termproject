// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { userInfo } from "os";

// ------------------------------------
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

// ------------------------------------
// create posts 
router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", { user: req.user});
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  // ⭐ Done
  const { title, link, desciption, subgroup } = req.body
  const creator = req.user.id 

  if (!link && !desciption) {
    return res.status(400).send("You must give a link or description")
  }

  const newPost = await database.addPost(title, link, desciption, creator, subgroup)
    res.redirect(`/posts/show/${newPost.id}`)
});

// ------------------------------------
// edit posts
router.get("/edit/:postid", async (req, res) => {
  const post = await database.getPost(req.params.postid)

if (!post) return res.status(404).send("Post not found");
  
  // only the creator can edit
  if (post.creator !== req.user.id) {
    return res.status(403).send("You do not have permission to edit this post.");
  }

  res.render("editPost", { post, user: req.user });
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
    // ⭐ done
  const post = await database.getPost(req.params.postid);

  if (post.creator !== req.user.id) {
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
  
  if (post.creator !== req.user.id) {
    return res.status(403).send("You do not have permission to delete this post.");
  }

  res.render("deleteConfirm", { post, user: req.user });
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(req.params.postid);

  if (!post) return res.redirect("/");

  if (post.creator === req.user.id) {
    await database.deletePost(req.params.postid);
    // Redirect to the sub that the post belonged to
    res.redirect(`/subs/show/${post.subgroup}`);
  } else {
    res.status(403).send("Unauthorized");
  }
});


// ------------------------------------
// comments
router.post("/comment-create/:postid",ensureAuthenticated, async (req, res) => {
    // ⭐ TODO
    const postid = req.params.postid
    const desciption = req.body.desciption
    const creator = req.user.id

    if (desciption) {
      await database.addComment(postid, creator, desciption)
    }
  res.redirect(`/posts/show${postid}`)
  
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
