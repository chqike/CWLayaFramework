import { CWGame } from "../manager/CWLevelManager"

export module CWNativeHelp{
    export let AdsHelp
    export let rewardVideoCallback
    export let rewardVideoObj
    export let eventConfig

    export function init(){
        AdsHelp = window['AdsHelp']
        window['nativeHelp']=CWNativeHelp
        
    }
    
    export function buildUUID(){
        function e() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
        }
    
        return e() + e() + e() + e() + e() + e() + e() + e();
    }

    export function getUUID(){
        var id = ""
        id = Laya.LocalStorage.getItem("uuid")
        if(!id||id==""){
            id = buildUUID()
            Laya.LocalStorage.setItem("uuid",id)
        }
        return id
    }

    export function showBannerAds(){
        if(!AdsHelp||!CWGame.BANNER_REFRESH_COOL)
            return
        this.bannerTimeCool()
        AdsHelp.showBannerAds()
    }

    export function hideBannerAds(){
        if(!AdsHelp)
            return
        AdsHelp.hideBannerAds()
    }

    export function bannerTimeCool(){
        if(CWGame.R_bannerShowTimeCool<=0)
            return
        CWGame.BANNER_REFRESH_COOL=false
        Laya.timer.clear(this,this.onBannerAdCool)
        Laya.timer.once(CWGame.R_bannerShowTimeCool*1000,this,this.onBannerAdCool)
    }

    export function onBannerAdCool(){
        CWGame.BANNER_REFRESH_COOL=true
    }

    export function showRewardVideoAds(obj, callback, rewardName, rewardAmount){
        if(!AdsHelp)
            return
        if(window['MMR'].SKIP_ADS){
            callback&&callback(obj)
            return true
        }
        rewardVideoCallback=callback
        rewardVideoObj=obj
        Laya.SoundManager.muted=true
        this.fullScreenNormalCool()
        this.sendEvent("激励视频开始播放")
        AdsHelp.showRewardVideoAds(rewardName, rewardAmount, getUUID())
    }

    export function shareContentInfo(){
        if(!AdsHelp)
            return 
        AdsHelp.shareContentInfo() 
    }

    export function startRecorder(){
        if(!AdsHelp)
            return 
        //AdsHelp.startRecorder() 
    }

    export function stopRecorder(){
        if(!AdsHelp)
            return 
        //AdsHelp.stopRecorder() 
    }

    export function showToast(value){
        if(!AdsHelp)
            return
        AdsHelp.showToast(value)
    }

    export function rewardVideoComplete(){
        console.log("hippo_sdk ===>JS rewardVideoComplete")
    }

    export function rewardVideoClosed(){
        console.log("hippo_sdk ===>JS rewardVideoClosed")
        this.sendEvent("激励视频完成播放")
        rewardVideoCallback&&rewardVideoCallback(rewardVideoObj)
        Laya.SoundManager.muted=false
        this.fullScreenNormalCool()
    } 

    export function splashClosed(){
        console.log("hippo_sdk ===>JS splashClosed")
        this.showBannerAds()
    } 

    export function showInterstitialAds(){
        if(!AdsHelp)
            return
        if(CWGame.R_interstitialProbability<CWGame.rand(100))
            return
        if(CWGame.curLevel-CWGame.lastInterstitialLevel<=CWGame.R_interstitialCool)
            return
        CWGame.lastInterstitialLevel=CWGame.curLevel
        AdsHelp.showInterstitialAds()
    }
    
    export function showFullScreenAds(obj, callback){
        if(!AdsHelp||!CWGame.FULLSCREN_AD_COOL){
            callback&&callback(obj)
            return true
        }       
        if(window['MMR'].SKIP_ADS){
            callback&&callback(obj)
            return true
        }
        if(CWGame.R_fullScreenProbability<CWGame.rand(100)){
            //console.log("hippo_sdk ===>JS showFullScreenAds rand fail:")
            callback&&callback(obj)
            return true
        }
        if(CWGame.curLevel-CWGame.lastFullScreenLevel<=CWGame.R_fullScreenLevelCool){
            callback&&callback(obj)
            return true
        }
        CWGame.lastFullScreenLevel=CWGame.curLevel
        rewardVideoCallback=callback
        rewardVideoObj=obj
        Laya.SoundManager.muted=true
        this.fullScreenNormalCool()
        this.sendEvent("全屏视频（fullscreen）开始播放")
        AdsHelp.showFullScreenAds()
        return true
    }

    export function onFullScreenAdClosed(){
        console.log("hippo_sdk ===>JS onFullScreenAdClosed")
        rewardVideoCallback&&rewardVideoCallback(rewardVideoObj)
        Laya.SoundManager.muted=false
        this.sendEvent("全屏视频（fullscreen）完成播放")
    }

    export function onFullScreenAdCool(){
        CWGame.FULLSCREN_AD_COOL=true
    }

    export function fullScreenNormalCool(){
        if(!CWGame.R_fullScreenUseTimeCool)
            return
        CWGame.FULLSCREN_AD_COOL=false
        Laya.timer.clear(this,this.onFullScreenAdCool)
        Laya.timer.once(CWGame.R_fullScreenTimeCool*1000,this,this.onFullScreenAdCool)
    }

    export function fullScreenNoobCool(){
        if(!CWGame.R_fullScreenUseTimeCool)
            return
        CWGame.FULLSCREN_AD_COOL=false
        Laya.timer.clear(this,this.onFullScreenAdCool)
        Laya.timer.once(CWGame.R_fullScreenNoodCool*1000,this,this.onFullScreenAdCool)
    }

    export function sendEvent(name, value){
        eventConfig==undefined&&(eventConfig=Laya.loader.getRes("res/json/event.json"))
        value==undefined&&(value="0")
        if(!AdsHelp||!eventConfig){
            console.log('nativehelp sendEvent fail')
            return
        }
            
        let key
        for (let index = 0; index < eventConfig.length; index++) {
            const element = eventConfig[index];
            if(element['name']==name){
                key = element['id']
                break
            }
        }
        key!=undefined&&AdsHelp.sendEvent(key, value.toString())
    }

    export function startLevel(level){
        if(!AdsHelp){
            return
        }
        AdsHelp.startLevel(level)
    }

    export function finishLevel(level){
        if(!AdsHelp){
            return
        }   
        AdsHelp.finishLevel(level)  
    }

    export function failLevel(level){
        if(!AdsHelp){
            return
        }
        AdsHelp.failLevel(level)
    }
}

