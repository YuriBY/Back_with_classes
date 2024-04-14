import { DevicesModel } from "./db";
import { DevicesDbType } from "../models/commonTypes";

export const deviceRepository = {
  async addDevice(deviceData: DevicesDbType): Promise<DevicesDbType | null> {
    const token = await DevicesModel.insertMany([deviceData]);

    if (!token) return null;
    return deviceData;
  },

  async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
    const result = await DevicesModel.deleteOne({
      deviceId: deviceId,
      userId: userId,
    });
    return result.deletedCount === 1;
  },

  async deleteAllDeviceExceptOne(
    userId: string,
    deviceId: string
  ): Promise<number> {
    const filter = {
      userId: userId,
      deviceId: { $ne: deviceId },
    };

    const result = await DevicesModel.deleteMany(filter);
    return result.deletedCount || 0;
  },

  async updateDevice(
    deviceId: string,
    activatedDate: string,
    expDate: string
  ): Promise<boolean> {
    const result = await DevicesModel.updateOne(
      { deviceId: deviceId },
      { lastActiveDate: activatedDate, expDate }
    );
    return result.matchedCount === 1;
  },
};
