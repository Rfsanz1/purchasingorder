import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ordersRouter from "./orders";
import kledoRouter from "./kledo";
import authRouter from "./auth";
import systemRouter from "./system";
import driverAreasRouter from "./driverAreas";
import appSettingsRouter from "./appSettings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(ordersRouter);
router.use(kledoRouter);
router.use(systemRouter);
router.use(driverAreasRouter);
router.use(appSettingsRouter);

export default router;
