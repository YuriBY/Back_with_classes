import { LogsModel } from "./db";
import { IPandURLDbType } from "../models/commonTypes";
import { addSeconds } from "date-fns";

export const logsRepository = {
  async countRequests(requestData: IPandURLDbType): Promise<number> {
    try {
      const { ip, URL, date } = requestData;
      const tenSecondsAgo = addSeconds(date, -10);

      const filter = {
        ip: ip,
        URL: URL,
        date: { $gte: tenSecondsAgo },
      };

      const totalCount: number = await LogsModel.countDocuments(filter);
      
      return totalCount;
    } catch (error) {
      console.error("Error counting requests:", error);
      return 0;
    }
  },

  async saveToDb(requestData: IPandURLDbType): Promise<IPandURLDbType> {
    const result = await LogsModel.insertMany([requestData]);
    return requestData;
  },
};
