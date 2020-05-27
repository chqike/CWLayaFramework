import {CWGame} from "../manager/CWLevelManager"
import {CWGameUtil} from "./CWGameUtil";
import {CWWxUtil} from "../data/CWWxUtil"
import {CWEventMgr} from "../manager/CWEventManager";
import {CWHttp} from "../network/CWHttp"
import { CWGuideData } from "./CWGuideData";
import { CWChannel } from "./CWChannel";
import { CWADSdk } from "../sdk/CWADSdk";

let TILI_TIME=60*5

export module CWClientData {
    export let openid:string = ""
    export let registerDate:string = ""; 
    export let loginDate:string = ""; 
    export let signDate:string  = "" 
    export let onlineTime:number = 0;
    export let shareTimes:number = 0;
    export let adTimes:number = 0;

    export let levelConfig
    export let questConfig
    export let skinConfig
    export let signConfig

    export let firstLogin=true

    export let level:number=1
    export let gold:number=0;
    export let diamond:number=0;
    export let exp:number=0
    export let signDay:number=1

    export let skinID:number=0
    export let skinBag
    export let shoucangTishi:number = 1
    export let popUIType=""
    export let soundVol=1
    export let musicVol=1
    export let points=0
    export let tili=0
    export let guideDone=false

    export let tiliTime:number=0
    export let tiliCount:number=0
    export let endlessTiliTime:number=0

    export let shareTimesDay1:number=0
    export let videoTimesDay1:number=0
    export let shareTimesDay2:number=0

    export let quest
    export let quest2
    export let inviteQuest
    export let inviteCounts=0
    export let todayInvite=false
    export let todayInviteGet=[0,0,0]
    export let cacheInvite=0
    export let todaySignAward=false
    export let todayEndlessTili=true

    export let redPackageRecord=[]

    export let todayGift
    export let yuyueSkin=-1
    export let yuyueSuccess

    //初始化
    export function init(){
        this.leaveTimestamp = -1
        this.shareTimes = 0;
        this.adTimes = 0
        this.highScore = 0

        this.level      = 1
        this.gold       = 0
        this.diamond    = 0
        this.exp        = 0
        this.signDay    = 1
        this.skinID     = 0
        this.skinBag    = [0]
        this.soundVol   =  1
        this.musicVol   =  1
        this.points     = CWGame.R_initPoint
        this.tili       = CWGame.R_initTili 
        this.quest      = []
        this.quest2     = []
        this.inviteQuest = []
        this.redPackageRecord =[]
        this.todayGift = []
        this.yuyueSkin  =-1
        this.shareTimesDay1 = CWGame.R_shareTimesDay1
        this.shareTimesDay2 = CWGame.R_shareTimesDay2
        this.videoTimesDay1 = CWGame.R_videoTimesDay1
        this.guideDone = false
        this.todayEndlessTili = true
        CWGameUtil.clientData = this
        this.yuyueSuccess = false
      
    }

    export function initTili(){
        this.tili       = CWGame.R_initTili
        this.tiliTime   = 0
        this.endlessTiliTime = 0

        Laya.timer.loop(1000, this, this.tiliCall)
    }

    //初始化
    export function initJson(){
        this.levelConfig=Laya.loader.getRes("res/json/level.json")
        this.skinConfig=Laya.loader.getRes("res/json/skin.json")
        this.signConfig=Laya.loader.getRes("res/json/sign.json")
        
        if(CWChannel.GAME_CHANNEL == CWChannel.CHANNEL_BAIDU){
            this.questConfig=Laya.loader.getRes("res/json/quest_bd.json")
        }
        else if(CWChannel.GAME_CHANNEL == CWChannel.CHANNEL_ANDROID
            ||CWChannel.GAME_CHANNEL == CWChannel.CHANNEL_IOS){
                this.questConfig=Laya.loader.getRes("res/json/quest_native.json")
        }
        else{
            this.questConfig=Laya.loader.getRes("res/json/quest.json")
        }
        
    }

    //保存数据
    export function saveData(){
        var tbl = {
            lastLoginDay:CWGameUtil.SERVER_TIME?CWGameUtil.SERVER_TIME.toLocaleDateString():-1,
            leaveTimestamp: CWGameUtil.SERVER_TIME ? CWGameUtil.SERVER_TIME.valueOf()/1000 : -1,
            shareTimes:this.shareTimes,
            adTimes:this.adTimes,
            soundEnable:CWGame.soundEnable ? 1 : 0,
            musicEnable:CWGame.musicEnable ? 1 : 0,
            shockEnable:CWGame.shockEnable ? 1 : 0,
            

            guideDone:this.guideDone,

            lv:CWGame.curLevel,
            highLv:CWGame.highLevel,
            registerDate:this.registerDate,
            signDate:this.signDate,
            signDay:this.signDay,
            level:this.level,
            skinBag:this.skinBag,
            skinID:this.skinID,
            //exp:this.exp,
            gold:this.gold,
            points:this.points,
            tili:this.tili,
            //diamond:this.diamond,
            //svol:this.soundVol,
            //mvol:this.musicVol,
            shareTimesDay1:this.shareTimesDay1,
            shareTimesDay2:this.shareTimesDay2,
            videoTimesDay1:this.videoTimesDay1,
            quest:this.quest,
            quest2:this.quest2,
            inviteQuest:this.inviteQuest,
            todayInvite:this.todayInvite,
            todayInviteGet:this.todayInviteGet,
            todaySignAward:this.todaySignAward,
            todayEndlessTili:this.todayEndlessTili,
            redPackageRecord:this.redPackageRecord,
            todayGift:this.todayGift,
            yuyueSkin:this.yuyueSkin,
            yuyueSuccess:this.yuyueSuccess
        }

        //console.log("保存数据：表"+tbl);
        return tbl
    } 

    // 读取数据
    export function loadData(data:any, ziji:any, skipLogin?){

        
        if(!data){
            data = CWGameUtil.userServerData
            if(CWChannel.GAME_CHANNEL == CWChannel.CHANNEL_IOS
                ||CWChannel.GAME_CHANNEL == CWChannel.CHANNEL_ANDROID){
                window['nativeHelp'].fullScreenNoobCool()
                CWGame.noob=true
            }
        }

        if(!data){
            //console.log('不存在远程存档')
            return
        }

        let tiemC = data.leaveTimestamp ? data.leaveTimestamp : -1
        if(CWGameUtil.userServerData){
            let timeS = CWGameUtil.userServerData.leaveTimestamp? CWGameUtil.userServerData.leaveTimestamp : -1
            if(tiemC < timeS){
                //console.log('存档替换')
                data = CWGameUtil.userServerData
                tiemC = timeS
            }
        }

        CWClientData.setLeaveTimestamp(tiemC)

        //时间
        var curDate: Date = new Date();

        ziji.shareTimes = data.shareTimes?data.shareTimes:0;
        ziji.adTimes = data.adTimes?data.adTimes:0;
        ziji.skinID = data.skinID!=undefined?data.skinID:0;
        ziji.yuyueSkin = data.yuyueSkin!=undefined?data.yuyueSkin:-1;
        ziji.skinBag = data.skinBag!=undefined?data.skinBag:[0]
        ziji.signDay = data.signDay!=undefined?data.signDay:1
        ziji.guideDone=data.guideDone?data.guideDone:false
        ziji.quest=data.quest!=undefined?data.quest:[]
        ziji.quest2=data.quest2!=undefined?data.quest2:[]
        ziji.inviteQuest=data.inviteQuest!=undefined?data.inviteQuest:[]
        ziji.redPackageRecord=data.redPackageRecord!=undefined?data.redPackageRecord:[]
        ziji.todayGift=data.todayGift!=undefined?data.todayGift:[] 
        ziji.todayInvite=data.todayInvite?data.todayInvite:false
        ziji.todayInviteGet=data.todayInviteGet!=undefined?data.todayInviteGet:[0,0,0]
        ziji.todaySignAward=data.todaySignAward?data.todaySignAward:false
        ziji.todayEndlessTili=data.todayEndlessTili!=undefined?data.todayEndlessTili:true
        ziji.yuyueSuccess=data.yuyueSuccess!=undefined?data.yuyueSuccess:false
        
        ziji.level = data.level!=undefined?data.level:1
        ziji.exp = data.exp!=undefined?data.exp:0
        ziji.gold = data.gold!=undefined?data.gold:0
        ziji.points = data.points!=undefined?data.points:CWGame.R_initPoint
        ziji.tili = data.tili!=undefined?data.tili:CWGame.R_initTili  
        ziji.diamond = data.diamond!=undefined?data.diamond:0
        ziji.shareTimesDay1 = data.shareTimesDay1!=undefined?data.shareTimesDay1:CWGame.R_shareTimesDay1
        ziji.shareTimesDay2 = data.shareTimesDay2!=undefined?data.shareTimesDay2:CWGame.R_shareTimesDay2
        ziji.videoTimesDay1 = data.videoTimesDay1!=undefined?data.videoTimesDay1:CWGame.R_videoTimesDay1
        
        if(typeof(ziji.tili)!='number'){
            ziji.tili=CWGame.R_initTili
        }

        CWGame.highLevel = data.highLv?data.highLv:1
        CWGame.curLevel=CWGame.highLevel
        ziji.arenaScroe = data.arena?data.arena:[100,0,0,0,0]

        if(CWGameUtil.SERVER_TIME){
            let _nowDate = CWGameUtil.SERVER_TIME.toLocaleDateString()
            if(data)
                ziji.registerDate = data.registerDate?data.registerDate:_nowDate
            else
                ziji.registerDate = _nowDate
            ziji.loginDate = _nowDate
            let lastLoginDay = data.lastLoginDay?data.lastLoginDay:-1
            if(_nowDate!=lastLoginDay){
                ziji.shareTimesDay1=CWGame.R_shareTimesDay1
                ziji.shareTimesDay2=CWGame.R_shareTimesDay2
                ziji.videoTimesDay1=CWGame.R_videoTimesDay1
                ziji.todayInvite=false
                ziji.todayInviteGet=[0,0,0]
                ziji.todaySignAward=false
                ziji.todayEndlessTili=true
  
                if(ziji.yuyueSkin!=-1){
                    ziji.yuyueSuccess=true
                }
                else{
                    ziji.todayGift=[]
                }
            } 
            if(ziji.leaveTimestamp&&ziji.leaveTimestamp!=-1){          
                let tg = CWGameUtil.SERVER_TIME.valueOf()/1000-ziji.leaveTimestamp
                let tm = CWGame.R_initTili
                console.log('tg:'+tg)
                if(tg>0&&ziji.tili<tm){
                    let r =~~(tg/TILI_TIME)
                    ziji.tili+=r
                    ziji.tili=ziji.tili>tm?tm:ziji.tili
                    if(ziji.tili<tm){
                        let to = tm-ziji.tili
                        let t1 = tg-r*TILI_TIME
                        ziji.tiliCount=to
                        ziji.tiliTime=TILI_TIME-t1
                    }
                }
                if(tg>=60*30){
                    CWGame.getOfflineReward=true
                }
            }
        }

        if(data.soundEnable != null){
            CWGame.soundEnable = data.soundEnable==1?true:false
            if(!CWGame.soundEnable)
                Laya.SoundManager.soundMuted = true 
        }    

        if(data.musicEnable != null){
            CWGame.musicEnable = data.musicEnable==1?true:false
            if(!CWGame.musicEnable)
                Laya.SoundManager.musicMuted = true 
        }          

        if(data.shockEnable != null){
            CWGame.shockEnable = data.shockEnable == 1?true:false
        }    

        ziji.shoucangTishi = data.shoucang?data.shoucang:1

        ziji.signDate = data.signDate?data.signDate:""

        if(ziji.signDay==7&&ziji.signDate!=ziji.loginDate){
            ziji.signDay=1
        }
        else if(ziji.signDate!=ziji.loginDate){
            ziji.signDay++
        }


        //console.log("读取时间："+Laya.Browser.now());
        //console.log("读取时间："+getSystemTime());
    }
    
    //玩家离线时间戳 毫秒、-1为不存在离线
    export function getLeaveTimestamp(){
        return this.leaveTimestamp
    }

    export function setLeaveTimestamp(time){
        this.leaveTimestamp = time
    }

    export function showToast2(id)
    {
        var title;
        title = "看完视频才可以复活哦！";
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();
            wx.showToast({
                title: title,
                icon: 'none',
                duration: 2000
              })
        }
    }

    export function isTodaySign()
    {
        return this.signDate!=""&&this.loginDate==this.signDate
    }  

    export function signComplete(){
        this.signDate = this.loginDate
    }

    export function tiliCall(){
        if(this.tiliTime>0){
            this.tiliTime--
            if(this.tiliTime==0){
                this.tili++
                this.tiliCount--
                if(this.tiliCount>0)
                    this.tiliTime=TILI_TIME
                CWEventMgr.getInstance().dispatchEvent(CWEventMgr.UPDATE_POINT)
            }
        }
        
        if(this.endlessTiliTime>0){
            this.endlessTiliTime--
        }
    }
    
    export function reduceTili(val){
        if(this.tili<=0||this.endlessTiliEnable)
            return
        this.tili-=val
        this.tili<0&&(this.tili=0)
        //Laya.timer.once(300,this,function(){
            CWGameUtil.showTextTip("体力-"+val) 
        //})
        if(this.tili<CWGame.R_initTili){
            this.tiliCount+=CWGame.R_initTili-this.tili
            if(this.tiliTime==0)
                this.tiliTime=TILI_TIME
        }
        CWEventMgr.getInstance().dispatchEvent(CWEventMgr.UPDATE_POINT)
    }

    export function addTili(val){
        this.tili+=val
        if(this.tili>=CWGame.R_initTili){
            this.tiliCount=0
            this.tiliTime=0
        }
        //Laya.timer.once(300,this,function(){
            CWGameUtil.showTextTip("体力+"+val) 
       // })
        CWEventMgr.getInstance().dispatchEvent(CWEventMgr.UPDATE_POINT)
    }

    export function enoughPoint(){
        return this.points>0
    }

    export function reducePoint(val){
        if(this.points<=0)
            return
        this.points-=val
        this.points<0&&(this.points=0)
        Laya.timer.once(300,this,function(){
            CWGameUtil.showTextTip("提示-"+val) 
        })
        CWEventMgr.getInstance().dispatchEvent(CWEventMgr.UPDATE_POINT)
    }

    export function addPoint(val){
        this.points+=val
        CWEventMgr.getInstance().dispatchEvent(CWEventMgr.UPDATE_POINT)
    }

    export function addGold(val){
        this.gold+=val
        CWEventMgr.getInstance().dispatchEvent(CWEventMgr.UPDATE_CASH)
    }

    export function autoSave(){
        if(CWGame.gameStart)
            return
        this.onBlur()
    }

    export function onFocus(){

    }

    export function onBlur(hide?){
        this.leaveTimestamp=CWGameUtil.SERVER_TIME ? CWGameUtil.SERVER_TIME.valueOf()/1000 : -1
        CWGameUtil.file.saveFile(CWGameUtil.file.getFileName(), this.saveData())
    }

    export function getCurrentLevelPage(nums){
        if(!this.levelConfig)
            return 0
        let len = CWGame.curLevel
        let a=len%nums
        return a==0?len/nums:~~(len/nums)+1      
    }

    export function getMaxLevelPage(nums){
        if(!this.levelConfig)
            return 0
        let len = this.levelConfig.length
        let a=len%nums
        return a==0?len/nums:~~(len/nums)+1      
    }

    export function getLevelConfigByPage(page,nums){
        if(!this.levelConfig)
            return []
        let len = this.levelConfig.length
        let totalPage=this.getMaxLevelPage(nums)
        if(page>totalPage)
            page=totalPage
        let ret=[]
        let start=(page-1)*nums
        for(let i=0;i<nums;++i){
            if(start+i<len)
                ret.push(start+i)
        }
        return ret
    }

    export function tiliEnough(){
        return this.tili>=1||this.endlessTiliEnable||window['MMR'].ENDLESS_TILI_MODE
    }

    export function costGold(cost){
        if(this.gold<cost){
            CWGameUtil.showToast('金币不足')
            return false
        }
        this.gold-=cost
        CWEventMgr.getInstance().dispatchEvent(CWEventMgr.UPDATE_CASH)
        return true
    }

    export function isTiliFull(){
        return this.tili>=CWGame.R_initTili
    }

    export function isPlayVideo(){
        if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_WEIXIN)
            return (CWWxUtil.Instance.isExamine()||CWGame.cityBlock)||this.videoTimesDay1>0//(this.shareTimesDay1<=0&&this.videoTimesDay1>0)//||this.shareTimesDay2<=0))
        else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_TOUTIAO)
            return true
        else 
            return true
    }

    export function isBlock(){
        if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_IOS||CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_ANDROID)
            return false
        return CWWxUtil.Instance.isExamine()||CWGame.cityBlock
    }

    export function forceShareCoool(){
        CWGame.forceShareCool=true
    }

    export function isForceShareVideo(){     
        let ret = !isBlock()&&CWGame.R_forceShareVideo&&CWGame.forceShareCool
                    &&CWGame.curLevel>CWGame.R_forceShareByLevel
                    &&(CWGame.curLevel-CWGame.lastShareLevel)>=CWGame.R_forceShareByLevelInterval
                    &&CWGame.R_forceShareProbability>=CWGame.rand(100)
        if(ret){
            CWGame.lastShareLevel = CWGame.curLevel
            CWGame.forceShareCool=false
            Laya.timer.once(CWGame.R_forceShareByTimeCool*60,this,this.forceShareCoool)
        }
        return ret
    }

    export function questComplete(id){
        this.quest.push(id)
        this.onBlur()
    }

    export function showSideAD(){
        if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_TOUTIAO&&CWGame.IsIOS())
            return false
        return CWGame.R_showSideAD&&CWADSdk.sideAdEnable()
    }

    export function showFullADPage(){
        return !CWGame.IsIOS()&&CWGame.R_showFullADPage&&CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_TOUTIAO&&CWADSdk.fullAdEnable()
    }

    export function showEndlessTili(){
        return CWGame.R_showEndlessTili&&this.todayEndlessTili
    }

    export function showBottomBanner(){
        if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_TOUTIAO){
            return !this.isBlock()&&CWGame.R_bottomBanner
        }
        return true
    }

    export function showGetItem(){
        return !this.isBlock()&&CWGame.R_showGetItem
    }

    export function showInvite(){
        return !this.isBlock()&&CWGame.R_showInvite
    }

    export function isForceHintVideo(){
        return !this.isBlock()&&CWGame.R_forceHintVideo
    }

    export function isShowBottomAdsBar(){
        return CWGame.R_showBottomAdBar&&CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_BAIDU
    }

    export function isSkinBought(id){
        for(let i=0;i<this.skinBag.length;++i){
            if(id==this.skinBag[i])
                return true
        }

        return false
    }

    export function todaySkinGift(){
        if(this.todayGift.length>0)
            return
        this.todayGift=[]
        let datas=[]
        for(let i=0;i<this.skinConfig.length;++i){
            if(!this.isSkinBought(i)){
                datas.push(i)
            }
        }
        if(datas.length==0){
            CWEventMgr.getInstance().dispatchEvent(CWEventMgr.ALL_SKIN_DONE)
            return
        }
        while(datas.length>4){
            let rd = CWGame.rand(datas.length)-1
            datas.splice(rd,1)
        }
        this.todayGift=datas
    }

}

export default CWClientData;