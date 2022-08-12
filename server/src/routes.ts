import { Application } from "express";

import testController from './controllers/testController'

export function routes(app: Application) {
    app.use("/test", testController);
}
  