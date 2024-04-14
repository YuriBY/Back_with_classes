import bcrypt from "bcrypt";

export const bcryprService = {
  async generateHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },
  async checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
};
