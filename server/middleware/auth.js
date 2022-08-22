import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {  // next means do something then move to the next thing
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;  // token.length >= 500 means log in with Google Oauth2.0

    let decodeData;

    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, 'test');

      req.userId = decodeData?.id;
    } else {  // login by google Oauth
      decodeData = jwt.decode(token);
      req.userId = decodeData?.sub;  // google's token called sub
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;