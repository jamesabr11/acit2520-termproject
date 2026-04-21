import * as db from "../fake-db";

// get posts
// Make calls to your db from this file!
export async function getPosts(n = 20, sub: string | undefined = undefined) {
  // Adding "as any" stops TypeScript from panicking about the fake-db parameter inference
  return db.getPosts(n, sub as any);
}
export async function getPost(id: string | number) {
  return db.getPost(Number(id));
}

// subgroup
export async function getSubs() {
  return db.getSubs();
}

// create edit and delte posts
export async function addPost(title: string, link: string, description: string, creator: string | number, subgroup: string) {
  // title, link, creator, description, subgroup
  return db.addPost(title, link, Number(creator), description, subgroup);
}
export async function editPost(id: string | number, newData: any) {
  return db.editPost(Number(id), newData);
}

export async function deletePost(id: string | number) {
  return db.deletePost(Number(id));
}

// comment
export async function getCommentsForPost(id: string | number) {
  const post = db.getPost(Number(id));
  return post ? post.comments : [];
}

export async function addComment(postId: string | number, creator: string | number, description: string) {
  return db.addComment(Number(postId), Number(creator), description);
}

// voting
export async function addVote(postId: string | number, userId: string | number, voteValue: number) {
  return db.addVote(Number(postId), Number(userId), voteValue);
}