import { Response, Router } from "express";
import { processQuery } from "../../lib/database";
import { useAuth } from "../../hooks";
import { v4 as uuidv4 } from "uuid";
import IRequest from "../../interfaces/IRequest";
import Logger from "../../lib/Logger";
const router: Router = Router();
import citizenWeaponRouter from "./weapons";
import citizenVehicleRouter from "./vehicles";
import medicalRecordsRouter from "./medical-records";
import companyRouter from "./company";
import { UploadedFile } from "express-fileupload";

router.use("/weapons", citizenWeaponRouter);
router.use("/vehicles", citizenVehicleRouter);
router.use("/medical-records", medicalRecordsRouter);
router.use("/company", companyRouter);

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const citizens = await processQuery("SELECT * FROM `citizens` WHERE `user_id` = ?", [
    req.user?.id,
  ]);

  return res.json({ status: "success", citizens });
});

router.get("/all", useAuth, async (req: IRequest, res: Response) => {
  const citizens = await processQuery("SELECT `id`, `full_name` FROM `citizens`");

  return res.json({ citizens, status: "success" });
});

router.get("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [id]);

  return res.json({ citizen: citizen[0], status: "success" });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const {
    full_name,
    gender,
    ethnicity,
    birth,
    hair_color,
    eye_color,
    address,
    height,
    weight,
    dmv,
    pilot_license,
    fire_license,
    ccw,
  } = req.body;

  const file = req.files?.image ? (req.files.image as UploadedFile) : null;
  const index = req.files?.image && file?.name.indexOf(".");

  const imageId = file ? `${uuidv4()}${file.name.slice(index!)}` : "default.svg";

  if (full_name && birth && gender && ethnicity && hair_color && eye_color && height && weight) {
    const citizen = await processQuery("SELECT * FROM `citizens` WHERE `full_name` = ?", [
      full_name,
    ]);

    if (citizen[0]) {
      return res.json({
        status: "error",
        error: "Name is already in use!",
      });
    }

    const query =
      "INSERT INTO `citizens` (`id`, `full_name`, `user_id`, `birth`, `gender`, `ethnicity`, `hair_color`, `eye_color`, `address`, `height`, `weight`, `dmv`, `fire_license`, `pilot_license`, `ccw`, `business`, `business_id`, `rank`, `vehicle_reg`, `posts`, `image_id`, `b_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const id = uuidv4();
    try {
      await processQuery(query, [
        id /* Id */,
        full_name /* full name */,
        req.user?.id /* user_id */,
        birth /* birth */,
        gender /* gender */,
        ethnicity /* ethnicity */,
        hair_color /* hair_color */,
        eye_color /* eye_color */,
        address /* address */,
        height /* height */,
        weight /* weight */,
        dmv /* dmv */,
        fire_license /* fire_license */,
        pilot_license /* pilot_license */,
        ccw /* ccw */,
        "none" /* business */,
        "" /* business_id */,
        "none" /* rank */,
        true /* vehicle_reg */,
        true /* posts */,
        imageId /* image_id */,
        "" /* b_status */,
      ]);
    } catch (e) {
      Logger.error("CREATE_CITIZEN_ERROR", e);
      return res.json({
        error: "An error occurred when creating your citizen",
        status: "error",
      });
    }

    file?.name &&
      file.mv("./public/citizen-images/" + imageId, (e: any) => {
        if (e) {
          Logger.error("MOVE_CITIZEN_IMAGE", e);
        }
      });

    return res.json({ status: "success", citizenId: id });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.put("/:citizenId", useAuth, async (req: IRequest, res: Response) => {
  const { citizenId } = req.params;
  const {
    full_name,
    gender,
    ethnicity,
    birth,
    hair_color,
    eye_color,
    address,
    height,
    weight,
    dmv,
    pilot_license,
    fire_license,
    ccw,
  } = req.body;

  const file = req.files?.image ? (req.files.image as UploadedFile) : null;
  const index = req.files?.image && file?.name.indexOf(".");

  const imageId = file ? `${uuidv4()}${file.name.slice(index!)}` : "default.svg";

  if (full_name && birth && gender && ethnicity && hair_color && eye_color && height && weight) {
    const citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [citizenId]);

    if (!citizen[0]) {
      return res.json({
        error: "Citizen was not found",
        status: "error",
      });
    }

    const query =
      "UPDATE `citizens` SET `birth` = ?, `gender` = ?, `ethnicity` = ?, `hair_color` = ?, `eye_color` = ?, `address` = ?, `height` = ?, `weight` = ?, `dmv` = ?, `fire_license` = ?, `pilot_license` = ?, `ccw` = ?, `image_id` = ? WHERE `id` = ?";

    try {
      await processQuery(query, [
        birth /* birth */,
        gender /* gender */,
        ethnicity /* ethnicity */,
        hair_color /* hair_color */,
        eye_color /* eye_color */,
        address /* address */,
        height /* height */,
        weight /* weight */,
        dmv /* dmv */,
        fire_license /* fire_license */,
        pilot_license /* pilot_license */,
        ccw /* ccw */,
        imageId /* image_id */,
        citizenId /* id */,
      ]);
    } catch (e) {
      Logger.error("CREATE_CITIZEN_ERROR", e);
      return res.json({
        error: "An error occurred when creating your citizen",
        status: "error",
      });
    }

    file?.name &&
      file.mv("./public/citizen-images/" + imageId, (e: any) => {
        if (e) {
          Logger.error("MOVE_CITIZEN_IMAGE", e);
        }
      });

    return res.json({ status: "success", citizenId: citizenId });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.delete("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;

  await processQuery("DELETE FROM `citizens` WHERE `id` = ?", [id]);

  return res.json({ status: "success" });
});

router.put("/licenses/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const { dmv, fire_license, pilot_license, ccw } = req.body;

  if (dmv && fire_license && pilot_license && ccw) {
    await processQuery(
      "UPDATE `citizens` SET `dmv` = ?, `fire_license` = ?, `pilot_license` = ?, `ccw` = ? WHERE `id` = ?",
      [dmv, fire_license, pilot_license, ccw, id]
    );

    return res.json({ status: "success", citizenId: id });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

export default router;
