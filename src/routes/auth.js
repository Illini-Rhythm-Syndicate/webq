import express from "express";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

const router = express.Router();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ["identify"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { id: profile.id, username: profile.username });
    },
  ),
);

router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/index.html");
  },
);

router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

router.get("/status", (req, res) => {
  res.json({ user: req.user || null });
});

export default router;
