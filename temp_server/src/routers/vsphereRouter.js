import express from "express";
import {
    getAddBasicInfo,
    getCreateVM,
    getDeleteVM,
    getVRealBasicInfo,
    getVmChangeSet,
    hostsPageRender,
    postAddBasicInfo,
    postVRealBasicInfo,
    postVmChangeSet,
    vmDetailPageRender,
    vmRealPageRender,
    vmsPageRender,
} from "../controllers/vmController";
import { getCloudData } from "../controllers/cloudData";
import { checkVRealInfoMiddleware, protectorMiddleware } from "../middlewares";
import { patchMemory, startPower, stopPower } from "../controllers/vmChangeSet";
import { testGetHost } from "../tests/Test";

const vsphereRouter = express.Router();

//0527 이 사이만 최종 코드

// vSphere 정보 입력 창
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

vsphereRouter.route("/hosts/vms/create", getCreateVM);

//0527 이 사이만 최종 코드

vsphereRouter.get("/data", getCloudData);
vsphereRouter.get("/data/t", testGetHost);
vsphereRouter.get("/patch/memory", patchMemory);
vsphereRouter.get("/stop/power", stopPower);
vsphereRouter.get("/start/power", startPower);

//
//Test 코드
vsphereRouter.get("/host", testGetHost);

export default vsphereRouter;
