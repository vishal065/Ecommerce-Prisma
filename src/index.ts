import express, { Express } from "express";
import { PORT } from "./secrets";
import IndexRoute from "../src/Routes/indexRoute";
import { errorMiddleware } from "./Middlewares/errors.Middleware";


export const app: Express = express();

app.use(express.json());
app.use("/api/v1", IndexRoute);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("server is running", PORT);
});
