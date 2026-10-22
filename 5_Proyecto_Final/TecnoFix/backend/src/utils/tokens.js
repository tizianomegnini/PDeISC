import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

export function signAccessToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres.');
  }
  return jwt.sign({ sub: String(user.id), role: user.role, email: user.email },
    process.env.JWT_SECRET, { expiresIn: `${Number(process.env.ACCESS_TOKEN_MINUTES || 20)}m` });
}
export function createRefreshToken() {
  return crypto.randomBytes(48).toString('hex');
}
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
