import {
  UserAccountDBType,
  UserAccountOutType,
  UserOutType,
} from "../models/usersType";
import { UsersModel } from "./db";

export const usersRepository = {
  userBigObjMapper(user: UserAccountDBType): UserAccountOutType {
    return {
      id: user._id,
      accountData: {
        userName: user.accountData.userName,
        email: user.accountData.email,
        created: user.accountData.created,
      },
      emailConfirmation: {
        confirmationCode: user.emailConfirmation.confirmationCode,
        expirationDAte: user.emailConfirmation.expirationDAte,
        isConfirmed: user.emailConfirmation.isConfirmed,
      },
    };
  },

  userMapper(user: UserAccountDBType): UserOutType {
    return {
      id: user._id,
      login: user.accountData.userName,
      email: user.accountData.email,
      createdAt: user.accountData.created,
    };
  },

  async createUser(newUser: UserAccountDBType): Promise<UserOutType> {
    const result = await UsersModel.insertMany([newUser]);
    return this.userMapper(newUser);
  },

  async saveUser(newUser: UserAccountDBType): Promise<UserAccountOutType> {
    const result = await UsersModel.insertMany([newUser]);
    return this.userBigObjMapper(newUser);
  },

  async deleteUser(id: string) {
    const result = await UsersModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },

  async findUserById(userId: string): Promise<UserAccountDBType | null> {
    const result = await UsersModel.findOne({ _id: userId });

    if (!result) return null;
    return result;
  },

  async uppdateUser(userId: string): Promise<boolean> {
    const result = await UsersModel.updateOne(
      { _id: userId },
      { "emailConfirmation.isConfirmed": true }
    );
    return result.modifiedCount === 1;
  },

  async uppdateUserCode(
    userId: string,
    code: string,
    expirationDAte: Date
  ): Promise<boolean> {
    const result = await UsersModel.updateOne(
      { _id: userId },
      {
        "emailConfirmation.confirmationCode": code,
        "emailCofirmation.expirationDAte": expirationDAte,
      }
    );
    return result.modifiedCount === 1;
  },

    async updatePassword(userId: string, passwordHash: string): Promise<boolean> {
      try {
          const userInstance = await UsersModel.findOne({ _id: userId });

          if (!userInstance) {
              console.log('Пользователь с идентификатором', userId, 'не найден.');
              return false;
          }

          userInstance.accountData.passwordHash = passwordHash;
          // userInstance.markModified('accountData.passwordHash')
          const result = await userInstance.save();

          if (result) {
              console.log('Пароль пользователя с идентификатором', userId, 'успешно обновлен.');
              return true;
          } else {
              console.log('Не удалось обновить пароль пользователя с идентификатором', userId);
              return false;
          }
      } catch (error) {
          console.error('Произошла ошибка при обновлении пароля пользователя:', error);
          return false;
      }
  }

  // async updatePassword(userId: string, passwordHash: string): Promise<boolean> {
  //   try {
  //     const result = await UsersModel.findOneAndUpdate(
  //       { _id: userId },
  //       { "accountData.passwordHash": passwordHash }
  //     );

  //     if (result) {
  //       console.log(
  //         "Пароль пользователя с идентификатором",
  //         userId,
  //         "успешно обновлен."
  //       );
  //       return true;
  //     } else {
  //       console.log(
  //         "Не удалось обновить пароль пользователя с идентификатором",
  //         userId
  //       );
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Произошла ошибка при обновлении пароля пользователя:",
  //       error
  //     );
  //     return false;
  //   }
  // },
};
