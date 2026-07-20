import jwt from 'jsonwebtoken';

type AccessTokenPayload = {
  user_id : string;
};
type RefreshTokenPayload = {
  user_id: string;
};

const accessTokenExpiresIn = 15 * 60;

function getJwtSecret()  {

  const access_secret = process.env.JWT_ACCESS_SECRET;
  const refresh_secret = process.env.JWT_REFRESH_SECRET;

  if (!access_secret || !refresh_secret) {
    throw new Error("JWT Secret is missing");
  }
  return {
    access_secret,
    refresh_secret
  };
}

export function createAccessToken(payload: AccessTokenPayload){
  const {access_secret} = getJwtSecret();
  return jwt.sign(payload, access_secret, {
    expiresIn: accessTokenExpiresIn,
  });
}

export function createRefreshToken(payload: RefreshTokenPayload){
  const {refresh_secret} = getJwtSecret();
  return jwt.sign(payload, refresh_secret, {
    expiresIn: "30d",
  });

}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const { access_secret } = getJwtSecret();
  return jwt.verify(token, access_secret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const { refresh_secret } = getJwtSecret();
  return jwt.verify(token, refresh_secret) as RefreshTokenPayload;
}
