import { CWGame } from "../manager/CWLevelManager"
import { CWChannel } from "../data/CWChannel"
import { CWWxUtil } from "../data/CWWxUtil"

export module CWADSdk{
    export let cwsdk
    export let LOGO_URL="https://img-farmgames.h5uc.com/"

    export let curScene="main"

    export let sideAd=[] //侧边广告
    export let fullAd=[] //导出广告
    export let endPageAd=[] //结束页广告
    export let indexFloatAd=[] //浮动广告
    export let promotionAd=[] //底部广告
    export let moreAd=[] //推荐游戏
    /*
    *gameFloat 导出广告
    *endPage 结束页广告
    *indexLeft 侧边广告
    *indexFloat 浮动广告
    *more 推荐游戏
    *promotion 底部广告
    */
    export function init(){
        if (window['MMR'].channel.isUseCWAdSdk()){
            cwsdk = window['cwsdk']
        }

        if(cwsdk){
            // cwsdk.loadAd((data) => {
            //     //console.log('sdk data ', data)
            //     if(data.baseUrl!=undefined){
            //         LOGO_URL=data.baseUrl
            //     }
            //     sideAd=data.indexLeft  
            //     fullAd=data.gameFloat
            //     endPageAd=data.endPage
            //     indexFloatAd=data.indexFloat
            //     promotionAd=data.promotion
            //     moreAd=data.more
                
            //     let more=3-(fullAd.length%3)
            //     if(more>0){
            //         for(let i=0;i<more;++i){
            //             fullAd.push(fullAd[i])
            //         }
            //     }
            // })
            if(CWGame.referrerInfo&&CWGame.referrerInfo.appId)
                collectUser(CWGame.referrerInfo.appId, getUUID(), CWGame.launchQuery)
            collectUser(CWGame.launchScene, getUUID(), CWGame.launchQuery)
        }
    }

    export function fullAdEnable(){
        return fullAd&&fullAd.length>0
    }

    export function sideAdEnable(){
        let ads=[]
        if(curScene=="main"||curScene=="battle")
            ads=indexFloatAd  
        // else if(curScene=="battle")
        //     ads=sideAd
        else if(curScene=="completed")
            ads=endPageAd
        return ads&&ads.length>0
        //return sideAd&&sideAd.length>0
    }

    export function getEndlessListAd(){
        if(!fullAd)
            return []
        let arr = []
        let len=fullAd.length*10
        for(let j=0;j<20;++j){
            for(let i=0;i<fullAd.length;++i){
                arr.push([i+1,fullAd[i]])
            }
        }

        return [arr,len]
    }

    export function getBottomAds(){
        if(!promotionAd)
            return []
        let arr = []
        for(let i=0;i<promotionAd.length;++i){
            arr.push([i+1,promotionAd[i]])
        }
        let len=arr.length
        let dlen=promotionAd.length
        let idx=0
        while(len<10){
            if(idx>=dlen)
                idx=0
            arr.push([len,promotionAd[idx]])  
            idx++
            len=arr.length 
        }
        return [arr,len]
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
        window['MMR'].clientData.openid = id
        return id
    }

    export function getRandomSideAD(){
        if(!sideAd||sideAd.length==0)
            return

        return sideAd[CWGame.rand(sideAd.length)-1]
    }

    export function getNextGame(index,nums){
        let ads=[]
        if(curScene=="main"||curScene=="battle")
            ads=indexFloatAd  
        // else if(curScene=="battle")
        //     ads=sideAd
        else if(curScene=="completed")
            ads=endPageAd

        if(!ads||ads.length==0)
            return
        
        let now = index+nums
        let max = ads.length
        while(now>max)
            now-=max    
        return [ads[now-1],now]
    }

    export function getGame(index){
        let ads=[]
        if(curScene=="main"||curScene=="battle")
            ads=indexFloatAd  
        // else if(curScene=="battle")
        //     ads=sideAd
        else if(curScene=="completed")
            ads=endPageAd

        if(!ads||ads.length==0)
            return  
        return ads[index-1]?ads[index-1]:ads[CWGame.rand(ads.length)-1]
    }

    export function onOpenLink(data){
        console.log('onOpenLink:',data)
        let wx=window['MMR'].channel.getMiniGameObj()
        if(!wx||!data)
            return

        var uuidFunc=this.getUUID
        if(CWChannel.GAME_CHANNEL == CWChannel.CHANNEL_WEIXIN){
            console.log("TODO:WEIXIN")
        }
        else if(CWChannel.GAME_CHANNEL == CWChannel.CHANNEL_TOUTIAO){
            
            if(wx.showMoreGamesModal){
                wx.showMoreGamesModal({
                    appLaunchOptions:[],
                        success(res) {
                            //console.log("success", res.errMsg);
                            cwsdk.collect(data,uuidFunc(),1)
                        },
                        fail(res) {
                            console.log("showMoreGamesModal fail", res.errMsg);
                            cwsdk.collect(data,uuidFunc(),0)
                        }
                    });      
            } 
        }
        else if(CWChannel.GAME_CHANNEL == CWChannel.CHANNEL_BAIDU){
            cwsdk.collect(data,uuidFunc(),1)
            wx.navigateToMiniProgram({
                appKey: data.appId, // 要打开的小程序 App Key
                path: '', // 打开的页面路径，如果为空则打开首页
                success: (res) => {
                    console.log('navigateToMiniProgram success');
                    
                },
                fail: (err) => {
                    console.log('navigateToMiniProgram fail');
                    //cwsdk.collect(data,uuidFunc(),0)
                }
            });
        }
    }

        /**
     * 用户上报
     * @param {string} path  场景值
     * @param {string} openid  小游戏中的用户Id
     * @param {Object} query  特殊场景via
     * @param {function} success 接口调用成功的回调函数
     * @param {function} fail 接口调用失败的回调函数
     */
    export function collectUser(path, openid, query, success?, fail?){
        if(!cwsdk)
            return
        console.log('collectuser...')
        cwsdk.collectUser(path, openid, query, ()=>{
            console.log('collectUser success：'+path+"/"+openid)
            success&&success()
        }, ()=>{
            console.log('collectUser fail:'+path+"/"+openid)
            fail&&fail()
        })
    }

    export function collectTime(oltime){
        if(!cwsdk)
            return
        cwsdk.collecTime(getUUID(), oltime, CWGame.launchScene)
    }

    export function collectEvent(eId, value?){
        if(!cwsdk)
            return
        cwsdk.collectEvent(getUUID(), eId, CWGame.launchScene, value)
    }

}