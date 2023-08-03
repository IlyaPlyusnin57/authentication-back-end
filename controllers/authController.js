const jwt = require("jsonwebtoken");
const Token = require("../models/TokenModel");

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  const userId = req.body.userId;

  try {
    const token = await Token.findOne({ userId, refreshToken }).lean();

    if (!token) return res.status(403).json("You're not authenticated!");

    jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json(err?.message);
      }

      const accessToken = generateAccessToken(user.userId);

      res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

async function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Cookies: ", req.cookies);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ msg: err?.message, errorFrom: "verifyAccessToken" });
      }

      req.decoded = decoded;
      next();
    });
  } else {
    return res
      .status(401)
      .json("You are not authenticated! (From: verifyAccessToken)");
  }
}

async function verifyRefreshToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json(err?.message);
      }

      req.decoded = decoded;
      next();
    });
  } else {
    return res
      .status(401)
      .json("You are not authenticated! (From: verifyRefreshToken)");
  }
}

async function saveToken(userId, refreshToken) {
  try {
    const tokenData = await Token.findOne({ userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }

    const token = await Token.create({ userId, refreshToken });

    return token;
  } catch (error) {
    console.log(error);
  }
}

function generateAccessToken(userId) {
  const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });

  return token;
}

function generateRefreshToken(userId) {
  const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN, {
    expiresIn: "1d",
  });

  return token;
}

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  saveToken,
  refreshToken,
};
