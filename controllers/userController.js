const User = require("../models/UserModel");
const Token = require("../models/TokenModel");

const {
  generateAccessToken,
  generateRefreshToken,
  saveToken,
} = require("./authController");

const bcrypt = require("bcrypt");
const saltRounds = 12;

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).lean();

    if (!user) return res.status(404).json("User does not exist");

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const { password, ...rest } = user;
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      await saveToken(user._id, refreshToken);

      res.cookie("refreshToken", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(200).json({ ...rest, accessToken, refreshToken });
    } else {
      return res.status(403).json("Passwords do not match");
    }
  } catch (error) {
    console.log(error);
  }
}

async function logout(req, res, next) {
  try {
    const { deletedCount } = await Token.deleteOne({
      userId: req.params.id,
      refreshToken: req.cookies.refreshToken,
    });

    if (deletedCount === 1) return res.status(200).json("success");

    return res.status(404).json("User was not authenticated!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ username }).exec();

    if (user) res.status(403).json("username already exists in the db");

    const emailCheck = await User.findOne({ email });

    if (emailCheck) res.status(403).json("email already exists in the db");

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ ...req.body, password: hashedPassword });

    newUser.save().then(
      async (user) => {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("refreshToken", refreshToken, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        await saveToken(user._id, refreshToken);

        const { password, ...rest } = user;

        return res
          .status(200)
          .json({ ...rest._doc, accessToken, refreshToken });
      },
      (err) => {
        console.log(err);
        res.status(500).json(err);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function checkUsername(req, res, next) {
  const user = await User.exists({ username: req.body.name });

  res.status(200).json(!!user);
}

async function checkEmail(req, res) {
  const user = await User.exists({ email: req.body.email });

  res.status(200).json(!!user);
}

module.exports = { login, logout, register, checkUsername, checkEmail };
