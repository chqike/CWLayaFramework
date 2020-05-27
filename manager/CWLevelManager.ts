// TypeScript file
import {CWEventMgr} from "../manager/CWEventManager";
import { CWWxUtil } from "../data/CWWxUtil";
import { CWSdkMgr } from "./CWSdkManager";
import { CWChannel } from "../data/CWChannel";

let gameUtil
let clientData
let eventDisp
let LEVT=Laya.Event
export module CWGame{
    export let MAP_CELLX_MAX=10
    export let MAP_CELLY_MAX=10
    export let LOW_EFFECT=false

	export let gameStart:boolean = false
    export let gamePause:boolean = false
    export let gameFinish:boolean = false
    export let gameWin:boolean = false
    export let RESROOT:string = "Conventional/"
    export let cityBlock:boolean=false

    export let curLevelProgress=0
    export let maxLevelMis=0
    export let finishLevel=0

    export let FULLSCREN_AD_COOL=true

    export let appName=''
    export let platform
    export let SCENE_FAXIAN="011014"
    export let launchScene=''
    export let launchQuery
    export let referrerInfo
    export let remoteSetting
    export let tagShareReturn:number = 0

    export let soundEnable:boolean = true
    export let musicEnable:boolean = true
    export let shockEnable:boolean = true
    export let touchEnable:boolean = true
    export let zhiseEnable:boolean = true

    export let R_SHARE_TXT = []
    export let R_SHARE_ID = []
    export let R_SHARE_URL = []

    export let R_shareTimesDay1:number=2//每日分享次数
    export let R_videoTimesDay1:number=3//每日分享次数
    export let R_shareTimesDay2:number=2//每日分享次数
    export let R_bottomBanner=true //底部banner
    export let R_forceShareVideo=true //强制分享录屏
    export let R_forceShareByLevel=3            //强制分享开启关卡
    export let R_forceShareByLevelInterval=2    //强制分享关卡间隔
    export let R_forceShareByTimeCool=0        //强制分享时间间隔
    export let R_forceShareProbability=100        //强制分享概率

    export let R_forceHintVideo=true //强制提示视频
    export let R_showSideAD=true  //侧边广告
    export let R_showFullADPage=false  //全屏导出广告
    export let R_showEndlessTili=true  //无限体力弹窗
    export let R_endlessTiliTime=5*60  //无限体力时长
    export let R_showGetItem=true  //双倍获取提示
    export let R_showInvite=true  //邀请好友按钮

    export let R_interstitialProbability=100//插屏概率
    export let R_interstitialCool=0//插屏关卡间隔
    export let lastInterstitialLevel=-100

    export let R_fullScreenUseTimeCool=true
    export let R_fullScreenTimeCool=30 //全屏频率/秒
    export let R_fullScreenProbability=50 //全屏概率
    export let R_fullScreenNoodCool=60 //全屏新人保护
    export let R_fullScreenLevelCool=0
    export let lastFullScreenLevel=-100

    export let R_bannerShowTimeCool=30//banner刷新间隔
    export let BANNER_REFRESH_COOL=true

    export let R_showBottomAdBar=false //底部广告条
    export let R_redpackage=true//紅包功能
    export let R_initTili=20 //初始体力
    export let R_initPoint=1 //初始提示

    export let R_SkinGiftCheck=true //皮肤礼物界面check
    export let R_CompleteCheck=true //结算页check
    export let R_RevivalLeft=5 //复活倒计时
    export let R_invincibleTime=5 //无敌时间
    export let R_showSkinGiftLevel=3//第几关出现皮肤试用
    export let R_showSkinYuyueLevel=3//第几关出现皮肤预约
    export let R_xuanyaoReward=1//炫耀奖励
    export let R_allowMistake=5//允许错误区域
    export let R_stageTimeMax=30//关卡倒计时
    export let R_insADRand=50 //结算插屏概率
    export let R_reportOnlineTime=true//上报在线时长
    export let R_forceShareRecord=50//强制分享录屏概率
    export let R_forceShareRecordLevel=3//强制分享录屏关卡

    export let curLevel=1
    export let highLevel=1
    export let allLevelDone
    export let lastShareLevel=0
    export let firstShare=true
    export let forceShareCool=true
    export let getOfflineReward
    export let collectGold=0
    export let skinTemp
    export let goLowLevel=false
    export let revivalStatus=false
    export let invincible=false
    export let skinGiftWndShow=false
    export let revivalShow=false
    export let goTomorrowTime=-1

    export let FPS:number = 60
    export let speedScale=1

    export let LINK_FUCHUANG=1
    export let LINK_DINGYUE=2
    export let LINK_SHOUCANG=3

    export let SCENE_FUCHUANG="1131"
    export let SCENE_SHOUCANG="1089"

    export let tipsType

    export let firstLoad:boolean=true
    export let noob=false

    export let shareVideoType=''
    
    export function levelIndex(){
        return curLevel
    }

    export function levelName(){
        return "第"+curLevel+"关"
    }

    var today = new Date(); 
    var seed = today.getTime();
    function rnd(){
        seed = ( seed * 9301 + 49297 ) % 233280;
        return seed / ( 233280.0 );
    };

    export function rand(number){
        return Math.ceil(rnd() * number);
    }   

    export function IsDouYin(){
        return appName=='Douyin'
    }

    export function IsTouTiao(){
        return appName=='Toutiao'
    }

    export function IsIOS(){
        return platform=="ios"
    }

    export class CWLevelMgr {
        private static instance: CWLevelMgr

        public static get Instance(): CWLevelMgr {
            if (this.instance == null) {
                gameUtil= window['MMR'].gameUtil
                this.instance = new CWLevelMgr()
                var _ins = this.instance
                clientData = window['MMR'].clientData
                eventDisp = CWEventMgr.getInstance().dispatchEvent
                if (window['MMR'].channel.isMiniGame()){
                    console.log('前后台监听')
                    window['MMR'].channel.getMiniGameObj().onShow(_ins.onfocus)
                    window['MMR'].channel.getMiniGameObj().onHide(_ins.onblur)
                } 
                let addEL = CWEventMgr.getInstance().addEventListener
                let emr = CWEventMgr
                addEL(emr.LEVLE_COMPLETE, _ins.onLevelComplete, _ins)      
                addEL(emr.BACK_TO_MAIN, _ins.onBackMain, _ins)  
                addEL(emr.RESTART, _ins.onRestart, _ins) 
                addEL(emr.REVIVAL, _ins.onRevival, _ins)
                

                addEL(emr.ON_BEGIN_RUN, _ins.onBeginRun, _ins)
                
            }     
                        
            return this.instance
        }


        onfocus(res){
            console.log('前台')
            if(tagShareReturn == 1){
                tagShareReturn = 0
                eventDisp(CWEventMgr.SHARE_RETURN);
            }
            clientData.onFocus()
            
            gamePause=false
            Laya.timer.resume()
            //gameUtil.playBGM("bgm3")
            if(res&&res.scene){
				CWGame.launchScene=res.scene
            }
            
            eventDisp(CWEventMgr.ON_SHOW)
        }

        onblur(){   
            console.log('后台')
            clientData.onBlur(true) 
            eventDisp(CWEventMgr.ON_HIDE)      
            gamePause=true
            Laya.timer.pause()
            gameUtil.stopMusic()
            gameUtil.updateOnlineTime()
        }
        

        public init(callFunc){
            if(firstLoad){
                firstLoad=false
                //gameUtil.playBGM("bgm3")
                if(LOW_EFFECT){
                    console.log('LOW')
                }
            }   

            this.onGameStart(true)

            Laya.timer.once(300,this,function(){
                callFunc&&callFunc()
            })
        }

    
        public createLevel(callFunc?) : void{
            this.loadScene("game.ls", callFunc)
        }

        public loadScene(sceneName, callFunc?):void{  
            //console.log('loadScene:'+sceneName)
            gamePause = false
            gameStart = false 
            
        }

        onGameRun(){
            console.log('开始关卡:'+curLevel)
            CWSdkMgr.stageStart(levelIndex(), levelName())
            CWChannel.isNative()&&CWSdkMgr.sendEvent(levelName()+"关卡进入")
            CWSdkMgr.startLevel("level-"+curLevel)

            window['MMR'].adSdk.curScene="battle"
            if(noob)
                CWSdkMgr.sendEvent("新用户首次开始游戏")
            noob=false   

            Laya.Dialog.open("scenes/BattleDlg.scene",false)

            Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown)
            if(CWChannel.isCameraEnable()){
                Laya.timer.once(100,this,eventDisp,[CWEventMgr.LUPIN_START])
            }
        }

        onBeginRun(){

        }

        dis(x,y,x2,y2){
            let dx:number = x - x2;
            let dy:number = y - y2;
            let distance:number = Math.sqrt(dx*dx+dy*dy);
            return distance;
        }


        onBackMain(){
            Laya.Dialog.close("scenes/CompletedDlg.scene")
            this.onGameStart(true)
        }

        onRestart(){
            Laya.Dialog.close("scenes/CompletedDlg.scene")
            this.onGameStart()
        }

        onRevival(){

        }

        onGameStart(onlyShow?){
            gamePause = false
            gameStart = false 
            gameWin = false
            gameFinish = false

            this.loadLevel() 
            if(gameStart){
                Laya.Dialog.close("stages/Stage"+(curLevel-1)+".scene")
                Laya.Dialog.open("stages/Stage"+curLevel+".scene",false) 
                gameStart=!onlyShow
                if(!onlyShow){
                    console.log('开始关卡:'+curLevel)
                    CWSdkMgr.stageStart(levelIndex(), levelName())
                    CWChannel.isNative()&&CWSdkMgr.sendEvent(levelName()+"关卡进入")
                    CWSdkMgr.startLevel("level-"+curLevel)
        
                    window['MMR'].adSdk.curScene="battle"
                    if(noob)
                        CWSdkMgr.sendEvent("新用户首次开始游戏")
                    noob=false   

                    eventDisp(CWEventMgr.LEVEL_START)
                    Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown)
                    if(CWChannel.isCameraEnable()){
                        Laya.timer.once(100,this,eventDisp,[CWEventMgr.LUPIN_START])
                    }
                }
            }
        }

        onLevelComplete(){
            if(gameFinish)
                return
            gameFinish=true
            console.log('完成关卡:'+curLevel)
            finishLevel=curLevel
            window['MMR'].adSdk.curScene="completed"
            CWSdkMgr.stageEnd(levelIndex(), levelName(), gameWin)
            if(gameWin){
                CWChannel.isNative()&&CWSdkMgr.sendEvent(levelName()+"关卡通过")
                CWSdkMgr.finishLevel("level-"+curLevel)
                gameUtil.playSound("finish")
                CWGame.curLevel++
                if(CWGame.curLevel>CWGame.highLevel)
                    CWGame.highLevel=CWGame.curLevel
            }

            //if(CWChannel.isCameraEnable()){
             Laya.stage.off(Laya.Event.MOUSE_DOWN,this,this.onMouseDown)
            //}
                        
            clientData.onBlur()
            Laya.timer.clearAll(this)
            window['MMR'].common.sendUserDataToWX()
            gameUtil.vibrateLong()

            Laya.timer.once(800,this,function(){
                Laya.Dialog.open("scenes/CompletedDlg.scene",false)
            })
        }



        woodColor
        woodIIntensity
        loadLevel(){
            let cfg
            let maxL=clientData.levelConfig.length
            if(curLevel>maxL){
                curLevel=maxL-1
                cfg = clientData.levelConfig[maxL-1]
                gameUtil.showToast("后续关卡制作中")
            }
            else{
                cfg = clientData.levelConfig[curLevel-1]
            }
            if(!cfg){
                console.error('关卡配置不存在:'+curLevel)
                return
            }

            gameStart=true
        }

		private round:Laya.Image; //控制圆    
        private joy:Laya.Image; //方向圆
        private centerX:number = -1;
        private centerY:number = -1;
        private angle:number = 0;
        onMouseDown(){
            if(!this.joy){
                this.joy =  new Laya.Image("res/ui/win/pen.png")//new Laya.Image("res/ui/win/point_touch.png")
                this.joy.anchorX = 0
                this.joy.anchorY =1
                this.joy.scaleX = 1
                this.joy.scaleY = 1
                this.joy.zOrder=3000
                Laya.stage.addChild(this.joy);
            }

            this.joy.visible=true
            this.joy.pos(Laya.stage.mouseX, Laya.stage.mouseY)
            Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
        }

        onMouseUp(){
            Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
            Laya.stage.off(Laya.Event.MOUSE_UP,this,this.onMouseUp);
            if(this.joy){
                this.joy.visible=false
            }
            
        }
        
        onMouseMove(e:MouseEvent){
            if(this.joy){
                this.joy.pos(Laya.stage.mouseX, Laya.stage.mouseY)
            }  
        }

    }
}