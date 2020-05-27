import { CWGame } from "../manager/CWLevelManager"
import { CWGameUtil } from "./CWGameUtil";
import { CWWxUtil } from "../data/CWWxUtil"
import { CWEventMgr} from "../manager/CWEventManager";
import { CWTryMgr } from "../manager/CWTryManager";
import { CWHttp } from "../network/CWHttp"
import { CWClientData} from "../data/CWClientData"
import { CWSdkMgr } from "../manager/CWSdkManager";
import { CWChannel } from "./CWChannel";

let SHARE_TXT = [
    "玩的就是心跳，够胆来试试！",
    "悬崖速降，你能坚持多久？"
]
let SHARE_ID = [

]
let SHARE_URL = [
    "https://cdn.birdfly.sy3.com/cliff/cliff01.jpg",
    "https://cdn.birdfly.sy3.com/cliff/cliff01.jpg",
    "https://cdn.birdfly.sy3.com/cliff/cliff01.jpg"
]

export module CWCommon {
    export let shareTime:number;
    export let shareFail:number;

    export let IsShowHand:boolean = false;

    export let videoFail:Array<number> =new Array<number>();

    export let SHARE_DESC=["none","Tili", "Help", "Skin","LowLevel","Revival","XuanYao","AddTishi"]
    export let SHARE_INDEX={"Tili":1, "Help":2, "Skin":3,"LowLevel":4,"Revival":5,"XuanYao":6,"AddTishi":7}
    export let SHARE_REASON = ["无目的","体力","提示", "皮肤试用","降低难度",'复活',"炫耀","获得提示"]
    export let shareCallback
    export let shareCallObj

    //初始化
    export function init(){
        this.shareTime = 0;
        this.shareFail = 0;

        for(var i = 0;i<20;i++)
        {
            this.videoFail[i] = 0;
        }

        CWEventMgr.getInstance().addEventListener(CWEventMgr.SHARE_RETURN, this.onShareReturn, this);
    }

    export var shareType=''
    export function onShareReturn()
    {
        let shareIdx = 0
        shareIdx = this.SHARE_INDEX[this.shareType]
        let block=CWClientData.isBlock()
        if(block||(CWGame.firstShare&&CWClientData.shareTimesDay1==CWGame.R_shareTimesDay1)){
            CWClientData.shareTimesDay1--
            CWClientData.shareTimesDay1==0&&(CWClientData.videoTimesDay1=CWGame.R_videoTimesDay1)
            let curDate: Date = new Date();
            this.shareTime = Math.floor(curDate.valueOf()/1000);
            CWGame.firstShare=false

            shareCallback&&shareCallback(shareCallObj)           
            return
        }

        if(this.shareFail == 1 || CWClientData.shareTimesDay1==CWGame.R_shareTimesDay1-1)
        {
            CWClientData.shareTimesDay1--
            CWClientData.shareTimesDay1==0&&(CWClientData.videoTimesDay1=CWGame.R_videoTimesDay1)
            this.shareFail = 0
            this.showAuthModal(this, this.myShare, shareIdx)
            return
        }

        let curDate: Date = new Date();
        let nowTime = Math.floor(curDate.valueOf()/1000);

        if(nowTime - this.shareTime <= 2.5)
        {
            this.shareTime = nowTime
            this.showAuthModal(this, this.myShare, shareIdx)
            return;
        }
        if(CWClientData.shareTimesDay1>0){
            CWClientData.shareTimesDay1--      
        }
        CWClientData.shareTimesDay1==0&&(CWClientData.videoTimesDay1=CWGame.R_videoTimesDay1)
        this.shareTime = nowTime;

        shareCallback&&shareCallback(shareCallObj) 
    }

    export function getShareInfo(){
        let rand = CWGame.rand(SHARE_TXT.length)-1
        var txt = SHARE_TXT[rand]
        let block=false//CWClientData.isBlock()
        if(!block&&CWGame.R_SHARE_TXT.length>0){
            rand = CWGame.rand(CWGame.R_SHARE_TXT.length)-1
            txt = CWGame.R_SHARE_TXT[rand]                  
        }
        rand = CWGame.rand(SHARE_URL.length)-1
        var shareUrl = SHARE_URL[rand]
        if(!block&&CWGame.R_SHARE_URL.length>0){
            rand = CWGame.rand(CWGame.R_SHARE_URL.length)-1
            shareUrl = CWGameUtil.G_RES_URL(true)+CWGame.R_SHARE_URL[rand]
        }
        var id = SHARE_ID[rand]
        if(!block&&CWGame.R_SHARE_ID.length>0){
            id = CWGame.R_SHARE_ID[rand]
        }
        return [txt,shareUrl,id]
    }

    export function shareTicket(){
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj()
            wx.showShareMenu({
                withShareTicket: true
            })

            let ret = this.getShareInfo()
            var txt = ret[0]
            var shareUrl = ret[1]
            var id = ret[2]

            if(CWChannel.isUseAld()){
                wx.aldOnShareAppMessage(() => {
                    return {
                        title: txt,
                        //imageUrlId:id,
                        imageUrl:shareUrl,
                    }
                })
            }
            else{
                wx.onShareAppMessage(() => {
                    return {
                        title: txt,
                        //imageUrlId:id,
                        imageUrl:shareUrl,
                    }
                })
            }

        }
    }

    export function onShare(arg,obj?,fun?,fun2?,arg2?){
        //分享
        let curDate: Date = new Date();
        let nowTime = Math.floor(curDate.valueOf()/1000);
        this.shareTime = nowTime;
        this.myShare(arg,obj,fun,fun2,arg2);
    }
    

    export function myShare(arg, obj?,fun?,fun2?,arg2?)
    {
        CWClientData.shareTimes = 1 + Number(CWClientData.shareTimes)
        shareCallback=fun
        shareCallObj=obj
        //时间差
        let curDate: Date = new Date();
        let nowTime = Math.floor(curDate.valueOf()/1000);
        if(obj)
            obj.shareTime = nowTime
        else
            this.shareTime = nowTime;

        if(arg != 0)
        {
            CWGame.tagShareReturn = 1
            CWCommon.shareType=SHARE_DESC[arg]
        }
           
        //分享
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();

            let ret = CWCommon.getShareInfo()
            var txt = ret[0]
            var shareUrl = ret[1]
            var id = ret[2]

            if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_WEIXIN){
                wx.aldShareAppMessage({
                    title: txt,
                    //imageUrlId:id,
                    imageUrl: shareUrl,
                    ald_desc: SHARE_REASON[arg],
                    //query: pQuery,
                    cancel:(res)=>{
                            if(arg != 0)
                            {
                                if(obj)
                                    obj.shareFail = 1
                                else
                                    this.shareFail = 1;
                            }
                            CWClientData.shareTimes -= 1 
                        }
                })
            }
            else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_TOUTIAO){
                wx.shareAppMessage({
                    title: txt,
                    desc: "",
                    imageUrl: shareUrl,
                    query: "",
                    success() {
                      console.log("分享成功");
                      fun&&fun(obj,arg2);
                    },
                    fail(e) {
                      console.log("分享失败");
                      fun2&&fun2(obj,arg2)
                    }
                });
            } 
            else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_BAIDU){
                wx.shareAppMessage({
                    title: txt,
                    content: "",
                    imageUrl: shareUrl,
                    query: "",
                    success() {
                      console.log("分享成功");
                      fun&&fun(obj,arg2);
                    },
                    fail(e) {
                      console.log("分享失败");
                      fun2&&fun2(obj,arg2)
                    }
                });
            } 
        }
    }

    export function inviteShare(){
        if (window['MMR'].channel.isMiniGame()){
            CWSdkMgr.sendEvent("邀请好友","")
            let wx = window['MMR'].channel.getMiniGameObj();

            let ret = this.getShareInfo()
            var txt = ret[0]
            var shareUrl = ret[1]
            var id = ret[2]
            
            let ctquery="frOpenid="+CWClientData.openid
            wx.shareAppMessage({
                title: txt,
                imageUrl: shareUrl,
                query: ctquery
            })
        }
    }

    let shareMess = ["分享失败,请分享至大于30人的群","只有分享到群才能获得奖励哦","该群已分享过,请换个群"]

    export function showAuthModal(OBJ, fun, arg, fun2?) {

        var txt = shareMess[CWGame.rand(3)-1]
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: txt,
                showCancel: true,
                cancelText: '取消',
                confirmText: '去分享',
                success: function (res) {
                    if (res.confirm) {
                        fun&&fun(arg, OBJ);
                      } else if (res.cancel) {
                        fun2&&fun2(OBJ)
                      }
                    
                },
            })
        }
    }
   
    export function tryGetUserInfo()
    {
        if(window['MMR'].clientData.openid && window['MMR'].clientData.openid != "")
        {
            return true
        }
        else
        {
            this.getUserInfo(resolve, this)
            return false
        }
    }

    export function resolve(userInfo, OBJ)
    {
        if(userInfo == null)
        {
            return;
        }
        OBJ.nickName  = userInfo.nickName;
        OBJ.avatarUrl = userInfo.avatarUrl;
        OBJ.gender    =   userInfo.gender;
        CWWxUtil.Instance.nickName = userInfo.nickName;
        CWWxUtil.Instance.avatarUrl = userInfo.avatarUrl;
        CWEventMgr.getInstance().dispatchEvent(CWEventMgr.GET_USER_INFO);
    }

    export function getUserInfo(resolve,OBJ) {
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();
            let sysInfo = wx.getSystemInfoSync();
            let sdkVersion = sysInfo.SDKVersion;
            sdkVersion = sdkVersion.replace(/\./g, "");
            sdkVersion = sdkVersion.substr(0, 3);
            let sdkVersionNum = parseInt(sdkVersion);
            //console.log("platform获取用户授权:", sdkVersionNum);

            //判断用户是否授权过
            wx.getSetting({
            success(res) {
                if (sdkVersionNum >= 201 && !res.authSetting['scope.userInfo']) {
                    window['MMR'].gameUtil.showToast("请首先点击屏幕\n授权使用用户信息")
                    var button = wx.createUserInfoButton({
                    type: 'text',
                    style: {
                        left: 0,
                        top: 0,
                        width: 720,
                        height: 1280,
                        lineHeight: 0,
                        textAlign: 'center',
                        fontSize: 0,
                        borderRadius: 10
                    }
                });
                button.onTap((res) => {
                //console.log("用户授权:", res);
                if (res && res.userInfo) {
                    var userInfo = res.userInfo;
                    resolve(userInfo,OBJ);
                } else {
                    resolve(null,OBJ);
                }
                button.show();
                button.destroy();
                });
              } 
              else {
                wx.getUserInfo({
                  withCredentials: true,
                  success: res => {
                    var userInfo = res.userInfo;
                    resolve(userInfo,OBJ);
                  },
                  fail: res => {
                    wx.showModal({
                      title: '友情提醒',
                      content: '请允许微信获得授权!',
                      confirmText: "授权",
                      showCancel: false,
                      success: res => {
                        resolve(null,OBJ);
                      }
                    });
                  }
                });
              }
            }
          })
        }
    } 

    export function WXget()
    {
        if (window['MMR'].channel.isUseRank()){
            Laya.loader.load(["res/atlas/test.atlas"],Laya.Handler.create(this,()=>{
                Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/test.atlas");  
            }));
        }
    }

    export function clearWXData()
    {
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj()
            let param:any = {
                cmd:'clear'
            }
            wx&&wx.getOpenDataContext().postMessage(param)
        }

    }

    export function WXrank()
    {
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj()
            let param:any = {
                tag: "showRankList",
                key: "top",
                type: 1,
                shareTicket: "",
                UserID:window['MMR'].clientData.openid
            }
            wx&&wx.getOpenDataContext().postMessage({message: JSON.stringify(param)})
        }
    }

    export function sendUserDataToWX()
    {
        let KVDataList = [{
            key:"",
            value:""
        }];
        KVDataList[0].key = "top";
        KVDataList[0].value = JSON.stringify({
            "wxgame": {
                "UserID":window['MMR'].clientData.openid,
                "score": CWGame.highLevel!=undefined?CWGame.highLevel:1,
                "update_time":CWGameUtil.SERVER_TIME ? CWGameUtil.SERVER_TIME.getMilliseconds() : "0",
            },
        });

        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();
            wx.setUserCloudStorage({
                KVDataList: KVDataList,
                success: function (res) {
                }
            })
        }
    }
    
    let G_UNIT=["k","m","b","t","aa","bb","cc","dd","ee","ff","gg","hh","ii"]
    export function showTxt(gold)
    {
        gold == undefined && (gold = 0)
        gold = Number(gold)
        if(gold < 1000 )
        {
            return Math.floor(gold).toString();
        }
        else{
            for(let i=0;i<G_UNIT.length;++i){
                if(gold < Math.pow(1000,i+2)){
                    var go = Math.floor(gold/Math.pow(1000,i+1));
                    var dian = Math.floor((gold%Math.pow(1000,i+1))/(Math.pow(1000,i)*100));
                    return go.toString() + "." + dian.toString() + G_UNIT[i];                 
                }
            }
        }

        return 'MAX'
    }

    export function tvAction1(nd){    
        Laya.Tween.clearAll(nd)
        Laya.Tween.to(nd, {rotation:-30}, 600, Laya.Ease.quadOut, Laya.Handler.create(this, function(){
            Laya.Tween.to(nd, {rotation:30}, 600, Laya.Ease.quadOut, Laya.Handler.create(this, function(){
                Laya.Tween.to(nd, {rotation:-25}, 500, Laya.Ease.quadOut, Laya.Handler.create(this, function(){
                    Laya.Tween.to(nd, {rotation:25}, 500, Laya.Ease.quadOut, Laya.Handler.create(this, function(){
                        Laya.Tween.to(nd, {rotation:0}, 400, Laya.Ease.quadOut, Laya.Handler.create(this, function(){
                            Laya.timer.once(1000, this, this.tvAction2,[nd])                            
                        }))         
                    }))            
                }))            
            }))            
        }))
    }

    export function tvAction2(nd){       
        Laya.Tween.to(nd, {rotation:30}, 1000, null, Laya.Handler.create(this, this.tvAction1,[nd]))
    }
}

export default CWCommon;