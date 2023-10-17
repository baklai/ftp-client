const PORT = 3000;
const HOST = 'localhost';
const JWT_ACCESS_SECRET = 'HELPDESK-JWT-ACCESS-SECRET';
const JWT_ACCESS_EXPIRES_IN = '24h';

export default () => ({
  host: process.env.HOST || HOST,
  port: parseInt(process.env.PORT, 10) || PORT,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || JWT_ACCESS_EXPIRES_IN
});
