import { runDB } from "./repositories/db";
import { app } from "./app";
import { appConfig } from "./common/config/appConfi";

const port = appConfig.PORT;

const startApp = async () => {
  await runDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
