import express from "express";
import {
    getAddBasicInfo,
    getCreateVM,
    getDeleteVM,
    getVMPower,
    getVRealBasicInfo,
    getVRealData,
    getVmChangeSet,
    hostsPageRender,
    postAddBasicInfo,
    postCreateVM,
    postVRealBasicInfo,
    postVmChangeSet,
    vmDetailPageRender,
    vmRealPageRender,
    vmsPageRender,
} from "../controllers/vmController";
import { checkVRealInfoMiddleware, protectorMiddleware } from "../middlewares";

const vsphereRouter = express.Router();

vsphereRouter
    .route("/")
    .all(protectorMiddleware)
    .get(getAddBasicInfo)
    .post(postAddBasicInfo);

vsphereRouter.route("/hosts").all(protectorMiddleware).get(hostsPageRender);
vsphereRouter.route("/hosts/vms").all(protectorMiddleware).get(vmsPageRender);

vsphereRouter
    .route("/hosts/vms/detail")
    .all(protectorMiddleware)
    .get(vmDetailPageRender);

vsphereRouter
    .route("/add/real")
    .all(protectorMiddleware)
    .get(getVRealBasicInfo)
    .post(postVRealBasicInfo);

vsphereRouter.get("/real/usage", getVRealData);

vsphereRouter
    .route("/hosts/vms/real")
    .all(protectorMiddleware)
    .all(checkVRealInfoMiddleware)
    .get(vmRealPageRender);

vsphereRouter
    .route("/hosts/vms/edit")
    .all(protectorMiddleware)
    .get(getVmChangeSet)
    .post(postVmChangeSet);

vsphereRouter
    .route("/hosts/vms/delete")
    .all(protectorMiddleware)
    .get(getDeleteVM);

vsphereRouter
    .route("/hosts/create")
    .all(protectorMiddleware)
    .get(getCreateVM)
    .post(postCreateVM);

vsphereRouter.route("/vm/pw").all(protectorMiddleware).get(getVMPower);

export default vsphereRouter;
