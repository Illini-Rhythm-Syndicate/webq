import "./env.js";
import express from "express";
import session from "express-session";
import passport from "passport";
import queueRouter from "./routes/queue.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/queue", queueRouter);
app.use("/auth", authRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
