import express from "express";
import session from "express-session";
import passport from "./middleware/passport";
const PORT = process.env.PORT || 8000;

const app = express();

// trust railway/proxy headers when deployed
app.set("trust proxy", 1);
// use ejs for rendering views
app.set("view engine", "ejs");
// serve static files like css/images from public folder
app.use(express.static("public"));

// session setup for login state
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // HTTPS Required
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

import indexRoute from "./routers/indexRoute";
import authRoute from "./routers/authRoute";
import postsRoute from "./routers/postRouters";
import subsRouters from "./routers/subsRouters";

// parse json request bodies
app.use(express.json());
// parse form data from post requests
app.use(express.urlencoded({ extended: true }));
// initialize passport authentication
app.use(passport.initialize());
app.use(passport.session());

// auth routes for login/logout
app.use("/auth", authRoute);
// post-related routes
app.use("/posts", postsRoute);
// subgroup-related routes
app.use("/subs", subsRouters);
// main/home routes
app.use("/", indexRoute);

// start the server
app.listen(PORT, () =>
  console.log(`server should be running at http://localhost:${PORT}/`),
);
