// @ts-nocheck

// sample users for login and post ownership
const users = {
  1: {
    id: 1,
    uname: "alice",
    password: "alpha",
  },
  2: {
    id: 2,
    uname: "theo",
    password: "123",
  },
  3: {
    id: 3,
    uname: "prime",
    password: "123",
  },
  4: {
    id: 4,
    uname: "leerob",
    password: "123",
  },
};

// sample posts stored in memory
const posts = {
  101: {
    id: 101,
    title: "Mochido opens its new location in Coquitlam this week",
    link: "https://dailyhive.com/vancouver/mochido-coquitlam-open",
    description:
      "New mochi donut shop, Mochido, is set to open later this week.",
    creator: 1,
    subgroup: "food",
    timestamp: 1643648446955,
  },
  102: {
    id: 102,
    title: "2023 State of Databases for Serverless & Edge",
    link: "https://leerob.io/blog/backend",
    description:
      "An overview of databases that pair well with modern application and compute providers.",
    creator: 4,
    subgroup: "coding",
    timestamp: 1642611742010,
  },
};

// sample comments for posts
const comments = {
  9001: {
    id: 9001,
    post_id: 102,
    creator: 1,
    description: "Actually I learned a lot :pepega:",
    timestamp: 1642691742010,
  },
};

// votes are stored separately from posts
const votes = [
  { user_id: 2, post_id: 101, value: +1 },
  { user_id: 3, post_id: 101, value: +1 },
  { user_id: 4, post_id: 101, value: +1 },
  { user_id: 3, post_id: 102, value: -1 },
];

// helpful debug function to inspect current fake db state
function debug() {
  console.log("==== DB DEBUGING ====");
  console.log("users", users);
  console.log("posts", posts);
  console.log("comments", comments);
  console.log("votes", votes);
  console.log("==== DB DEBUGING ====");
}

// get one user by id
function getUser(id) {
  return users[id];
}

// find a user by username for login
function getUserByUsername(uname: any) {
  const foundUser = Object.values(users).find(
    (user: any) => user.uname === uname,
  );

  if (foundUser) {
    return getUser(foundUser.id);
  } else {
    return null;
  }
}

// get all votes that belong to one post
function getVotesForPost(post_id) {
  return votes.filter((vote) => vote.post_id === post_id);
}

// add related creator, votes, and comments onto a post object
function decoratePost(post) {
  post = {
    ...post,
    creator: users[post.creator],
    votes: getVotesForPost(post.id),
    comments: Object.values(comments)
      .filter((comment) => comment.post_id === post.id)
      .map((comment) => ({ ...comment, creator: users[comment.creator] })),
  };
  return post;
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */

// get newest posts, optionally filtered by subgroup
function getPosts(n = 5, sub = undefined) {
  let allPosts = Object.values(posts);
  if (sub) {
    allPosts = allPosts.filter((post) => post.subgroup === sub);
  }
  allPosts.sort((a, b) => b.timestamp - a.timestamp);
  return allPosts.slice(0, n);
}

// get one post by id and decorate it with extra info
function getPost(id) {
  return decoratePost(posts[id]);
}

// create and store a new post
function addPost(title, link, creator, description, subgroup) {
  let id = Math.max(...Object.keys(posts).map(Number)) + 1;
  let post = {
    id,
    title,
    link,
    description,
    creator: Number(creator),
    subgroup,
    timestamp: Date.now(),
  };
  posts[id] = post;
  return post;
}

// update editable post fields
function editPost(post_id, changes = {}) {
  let post = posts[post_id];
  if (changes.title) {
    post.title = changes.title;
  }
  if (changes.link) {
    post.link = changes.link;
  }
  if (changes.description) {
    post.description = changes.description;
  }
  if (changes.subgroup) {
    post.subgroup = changes.subgroup;
  }
}

// remove a post from memory
function deletePost(post_id) {
  delete posts[post_id];
}

// return a unique list of subgroup names
function getSubs() {
  return Array.from(new Set(Object.values(posts).map((post) => post.subgroup)));
}

// create and store a new comment
function addComment(post_id, creator, description) {
  let id = Math.max(...Object.keys(comments).map(Number)) + 1;
  let comment = {
    id,
    post_id: Number(post_id),
    creator: Number(creator),
    description,
    timestamp: Date.now(),
  };
  comments[id] = comment;
  return comment;
}

// add a new vote or update an existing one
function addVote(post_id, user_id, value) {
  let existingVote = votes.find(
    (v) => v.post_id === Number(post_id) && v.user_id === Number(user_id),
  );

  if (existingVote) {
    // If clicking the same button, cancel the vote
    if (existingVote.value === Number(value)) {
      existingVote.value = 0;
    } else {
      // Otherwise update it
      existingVote.value = Number(value);
    }
  } else {
    // New vote
    votes.push({
      user_id: Number(user_id),
      post_id: Number(post_id),
      value: Number(value),
    });
  }
}
export {
  debug,
  getUser,
  getUserByUsername,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getSubs,
  addComment,
  decoratePost,
  addVote,
};
