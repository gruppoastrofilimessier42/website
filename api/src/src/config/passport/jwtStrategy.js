const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("../config");
const { tokenTypes } = require("../tokens");
const inTransaction = require("../../utils/inTransaction");
const { userService } = require("../../services");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    let dbUser;
    // TODO: loggable?
    try {
      await inTransaction(async (trx) => {
        dbUser = await userService.getUserOrNotFound(payload.sub, trx);
      });
    } catch {}
    if (!dbUser) {
      return done(null, false);
    }
    done(null, dbUser);
  } catch (error) {
    done(error, false);
  }
};

module.exports = new JwtStrategy(jwtOptions, jwtVerify);
