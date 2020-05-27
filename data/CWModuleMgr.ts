import { CWGameUtil } from "./CWGameUtil"
import { CWHttp } from "../network/CWHttp"
import { CWClientData } from "./CWClientData";
import { CWEventMgr } from "../manager/CWEventManager";
import { CWCommon } from "../data/CWCommon";
import { CWTryMgr } from "../manager/CWTryManager";
import { CWADSdk } from "../sdk/CWADSdk";
import { CWChannel } from "./CWChannel";
import { CWSdkMgr } from "../manager/CWSdkManager";
import { CWNativeHelp } from "../sdk/CWNativeHelp";


export module CWModuleMgr{
    export const gameUtil           = CWGameUtil
    export const http               = CWHttp
    export const clientData         = CWClientData
    export const eventManager       = CWEventMgr
    export const common             = CWCommon
    export const tryMgr             = CWTryMgr
    export const adSdk              = CWADSdk
    export const channel            = CWChannel
    export const sdkMgr             = CWSdkMgr
    export const nativeHelp         = CWNativeHelp


    export let CW_G_REMOTE          = true                                 
    export let DONT_SAVE            = false
    export let SKIP_ADS             = false //跳过原生广告
    export let ENDLESS_TILI_MODE    = true  //无限体力模式
   
    export let fixCenterY   = (Laya.Browser.clientHeight/Laya.Browser.clientWidth)/(1555/690) 
    export let fixBottom    = (Laya.Browser.clientHeight/Laya.Browser.clientWidth-1280/720)*720 * 0.5
}