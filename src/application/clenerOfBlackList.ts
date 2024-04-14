// import {
//   addWeeks,
//   startOfWeek,
//   addDays,
//   setHours,
//   setMinutes,
//   format,
// } from "date-fns";
// import { refreshTokenCollection } from "../repositories/db";

// export function scheduleNextTuesdayEvent() {
//   const nextTuesday = addDays(startOfWeek(addWeeks(new Date(), 1)), 2);
//   const eventTime = setMinutes(setHours(nextTuesday, 20), 0);

//   const timeDiff = eventTime.getTime() - Date.now();

//   setTimeout(async () => {
//     const result = await refreshTokenCollection.deleteMany({
//       exp: { $lt: eventTime.getTime() },
//     });
//     console.log("Успешно удалено:", result.deletedCount, "документов");
//   }, timeDiff);

//   console.log(
//     "Событие запланировано на:",
//     format(eventTime, "yyyy-MM-dd'T'HH:mm:ssxxx")
//   );
// }
