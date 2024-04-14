import { inputUserType } from "../../src/models/usersType";

export const testingDtos = {
  createUserDto() {
    return {
      login: "Misha",
      password: "qwerty",
      email: "Misha@sffrs.com",
    };
  },

  createUsersDto(count: number): inputUserType[] {
    const users: inputUserType[] = [];

    for (let i = 0; i < count; i++) {
      users.push({
        login: "Misha" + i,
        password: "qwerty",
        email: `Misha${i}@sffrs.com`,
      });
    }
    return users;
  },
};
