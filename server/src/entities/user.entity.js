const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// DB middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, salt);

  this.password = hashedPassword;
});

const JWT_SECRET = "jongseok";

userSchema.methods.generateToken = function () {
  const payload = {
    _id: this._id,
    email: this._id,
  };
  return jwt.sign(payload, JWT_SECRET);
};

module.exports = mongoose.model("User", userSchema);
