import { DevicesModel } from "./db";
import { DevicesDbType, DevicesOutType } from "../models/commonTypes";

export const deviceQueryRepository = {
  async getAll(userId: string): Promise<DevicesOutType[] | null> {
    const result = await DevicesModel.find({ userId: userId }).lean();
    return result.map(({ ip, title, lastActiveDate, deviceId }) => ({
      ip,
      title,
      lastActiveDate,
      deviceId,
    }));
  },

  async checkIdAndDate(
    deviceId: string,
    lastActivaDate: string,
    userId: string
  ): Promise<DevicesDbType | null> {
    try {
      const filter = {
        lastActiveDate: lastActivaDate,
        deviceId: deviceId,
        userId: userId,
      };

      const result: DevicesDbType | null = await DevicesModel.findOne(filter);

      return result;
    } catch (error) {
      console.error("Error counting requests:", error);
      return null;
    }
  },

  async findDeviceWithUserId(userId: string): Promise<DevicesDbType | null> {
    const result = await DevicesModel.findOne({ userId: userId });
    return result;
  },

  async findDeviceWithDeviceId(
    deviceId: string
  ): Promise<DevicesDbType | null> {
    const result = await DevicesModel.findOne({ deviceId: deviceId });
    return result;
  },
};
