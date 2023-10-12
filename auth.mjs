import passport from "passport";
import { Strategy } from "passport-strategy";
import { ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
dotenv.config()

console.log("Loaded environment variables:");
console.log("SECRET:", process.env.SECRET);

const opts = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await getUserById(payload.id);
      return user ? done(null, user) : done(new Error("User not found"), false);
    } catch (error) {
      done(error, false);
    }
  })
);