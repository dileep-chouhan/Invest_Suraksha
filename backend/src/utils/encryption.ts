import crypto from 'crypto';
import { config } from '../config';

export class Encryption {
  private algorithm = config.encryption.algorithm;
  private key = Buffer.from(config.encryption.key, 'hex');

  encrypt(text: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex')
    };
  }

  decrypt(encrypted: string, ivHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAutoPadding(true);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  generateSalt(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  hashWithSalt(text: string, salt: string): string {
    return crypto.pbkdf2Sync(text, salt, 10000, 64, 'sha512').toString('hex');
  }

  generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  encryptSensitiveData(data: any): string {
    const jsonString = JSON.stringify(data);
    const { encrypted, iv } = this.encrypt(jsonString);
    return `${iv}:${encrypted}`;
  }

  decryptSensitiveData(encryptedData: string): any {
    const [iv, encrypted] = encryptedData.split(':');
    const decryptedString = this.decrypt(encrypted, iv);
    return JSON.parse(decryptedString);
  }

  verifyIntegrity(data: string, hash: string): boolean {
    const calculatedHash = this.hash(data);
    return calculatedHash === hash;
  }

  generateApiKey(): string {
    const timestamp = Date.now().toString();
    const random = this.generateRandomToken(16);
    return `${timestamp}_${random}`;
  }
}

export default new Encryption();
