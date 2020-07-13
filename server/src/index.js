const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserEntity = require("./entities/user.entity");

const app = express();

app.use(bodyParser.json());

app.post("/api/user/register", async (req, res, next) => {
  try {
    // 1. 유저 정보를 client에서 받는다.
    //   req.body = {
    //     username: "jongseok",
    //     email: "the2792@gmail.com",
    //     password: "1234",
    //   };

    // 2. db에서 가입된 이메일인지 확인한다.
    // -> 가입 되었으면 에러메시지를 리턴
    // -> 가입 안되었으면 계속 이어서

    const existingUser = await UserEntity.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      throw ErrorHandler(404, "asdkjdslfjdslkjfdslkjflk");
    }

    // 3resu. db에 유저 정보를 넣는다.
    // -> 비밀번호를 해쉬화한다.

    const newUser = await UserEntity.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // 4-1. 디비에 저장된 유저 정보를 client에 리턴한다. (선택사항)
    // 4-2. 메시지만 보여줘도되고  (선택사항)
    // 4-3. 토큰을 만들어서 보내준다. (토큰은 이메일정도만? 토큰화해서) (선택사항)

    res.status(201).json({
      ok: true,
      msg: `${newUser.username}님 환영합니다. `,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Server Error",
    });
  }
});

app.post("/api/user/login", async (req, res, next) => {
  const existingUser = await UserEntity.findOne({
    email: req.body.email,
  });

  if (!existingUser) {
    res.status(401).json({
      ok: false,
      msg: "존재하지 않는 이메일입니다. ",
    });
  }

  const token = existingUser.generateToken();

  res.status(201).json({
    ok: true,
    msg: "토큰이 발행되었습니다.",
    payload: token,
  });
});

app.get("/app/user/me", (req, res, next) => {
  res.status(201).json({
    ok: true,
  });
});

const PORT = 3333;
const MONGO_URI =
  "mongodb+srv://whdtjr2792:!canyou12@cluster0-mgk1n.gcp.mongodb.net/rest?retryWrites=true&w=majority";

app.listen(PORT, () => {
  mongoose.connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log(`🦐Connected DB`);
  console.log(`🐙Running Server at Port ${PORT}`);
});
