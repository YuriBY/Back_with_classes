import { UserAccountDBType } from "./../models/usersType";
import jwt, { JwtPayload } from "jsonwebtoken";
import { appConfig } from "../common/config/appConfi";
import { v4 as uuidv4 } from "uuid";
import { DevicesDbType } from "../models/commonTypes";
import { ObjectId } from "mongodb";
import { addMinutes } from "date-fns";
import { deviceRepository } from "../repositories/deviceRepository";

const JWT_SECRET_A = appConfig.SECRET_KEY;
if (!JWT_SECRET_A) {
  throw new Error("!JWT_SECRET does not found");
}

const JWT_SECRET_R = appConfig.REFRESH_KEY;
if (!JWT_SECRET_R) {
  throw new Error("!JWT_SECRET does not found");
}

export const jwtService = {
  async createJWT_A(user: UserAccountDBType) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_A, {
      expiresIn: "10m",
    });
    return {
      data: {
        accessToken: token,
      },
    };
  },

  async getUserIdByToken(token: string) {
    try {
      const result = jwt.verify(token, JWT_SECRET_A);

      if (typeof result === "string") {
        return null;
      } else {
        const payload = result as JwtPayload;
        return payload.userId;
      }
    } catch (error) {
      return null;
    }
  },

  async createJWT_R(
    user: UserAccountDBType,
    clientIp: string,
    clientTitle: string
  ) {
    const deviceId = uuidv4();
    const activatedDate = new Date();
    const expDate = addMinutes(activatedDate, 20);
    // const expDate = addSeconds(activatedDate, 20);
    const token = jwt.sign(
      { userId: user._id, deviceId: deviceId, lastActivaDate: activatedDate },
      JWT_SECRET_R,
      {
        expiresIn: "20m",
      }
    );
    console.log("createdJWT", token);
    const deviceData: DevicesDbType = {
      _id: new ObjectId(),
      ip: clientIp,
      title: clientTitle,
      lastActiveDate: activatedDate.toISOString(),
      deviceId: deviceId,
      expDate: expDate.toISOString(),
      userId: user._id,
    };

    const result = await deviceRepository.addDevice(deviceData);

    return token;
  },

  async updateJWT_R(user: UserAccountDBType, deviceId: string) {
    const activatedDate = new Date();
    const expDate = addMinutes(activatedDate, 20);
    // const expDate = addSeconds(activatedDate, 20);
    const token = jwt.sign(
      { userId: user._id, deviceId: deviceId, lastActivaDate: activatedDate },
      JWT_SECRET_R,
      {
        expiresIn: "20m",
      }
    );
    console.log("updatedJWT", token);

    const result = await deviceRepository.updateDevice(
      deviceId,
      activatedDate.toISOString(),
      expDate.toISOString()
    );

    return token;
  },

  async getUserIdByRefreshToken(token: string) {
    try {
      const result = jwt.verify(token, JWT_SECRET_R);

      if (typeof result === "string") {
        return null;
      } else {
        const payload = result as JwtPayload;
        return {
          userId: payload.userId,
          deviceId: payload.deviceId,
          lastActivaDate: payload.lastActivaDate,
          exp: payload.exp,
        };
      }
    } catch (error) {
      return null;
    }
  },
};
