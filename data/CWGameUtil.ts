import {CWNetDefine} from "../network/CWNetDefine"
import {CWWxUtil} from "../data/CWWxUtil"
import {CWEventMgr} from "../manager/CWEventManager";
import { CWGame } from "../manager/CWLevelManager";
import { CWChannel } from "./CWChannel";
import { CWNativeHelp } from "../sdk/CWNativeHelp";

export module CWGameUtil{
    export let SERVER_TIME:Date;
    export const DEV_VERSION       = 0;  
    export const EXAMINE_VERSION   = 1;  
    export const OFFICIAL_VERSION  = 2;  

    export let userServerData

    export let launchTime:number = 0 
    export let onlineTime:number = 0 
    export let launchScene:number = 0 
    export let clientData
    export let setting
 
    export function G_RES_URL(onlyUrl?) {
        //if(!window['MMR'].CW_G_REMOTE||!window['MMR'].channel.isMiniGame()){
            //console.log('不适用远程资源')
        //    return ""
        //}

        let url = "https://cdn.birdfly.sy3.com/dop/"
        if(onlyUrl)
            return url
        //默认
        return url+"v"+CWWxUtil.Instance.version+"/"
    }    

    export function G_RES_ROOT() {
        let _browser = Laya.Browser
        let _path = "Conventional/"
        // if (_browser.onMobile && _browser.onAndroid){
        //     _path = "Android/"
        // }
        // else if(_browser.onMobile && _browser.onIOS){
        //     _path = "iOS/"
        // }

        return _path
    }    

    export  function onlineSaveData(data){
        let wxins=CWWxUtil.Instance
        if(clientData.openid == ""){
            return
        }
    
        let dp = {
            'openid':clientData.openid,
            'aId':wxins.aId,
            'version':wxins.version,
            'gameData':data
        }

        window['MMR'].http.post(wxins.saveDataURL , dp, function(res){

        })
    }
       
    export class file{
        static USER_DATA_FILE = "dopDefaultSave"

        static getFileName(){
            if(clientData.openid != ""){
                return ("DOP"+clientData.openid)
            }
            else{
                return file.USER_DATA_FILE
            }   
        }

        static loadFile(fileName, func?, ziji?, call?) {
            //console.log("读取:"+ fileName);
            let data = Laya.LocalStorage.getItem(fileName)
            if(data)
                func(JSON.parse(data), ziji, call);   
            else        
                func(null, ziji, call); 
        }

        static saveFile(fileName, data, onlyNative?) {
            if(window['MMR'].DONT_SAVE)
                return
            //console.log("存储:"+ fileName);
            Laya.LocalStorage.setItem(fileName, JSON.stringify(data))
        }
            
    }

    //更新在线时间
    export function updateOnlineTime(){
        //启动时间
		var today = new Date(); 
        var now = today.getTime();
        if(CWGameUtil.launchTime == 0){
            CWGameUtil.launchTime = now
        }
        let ot = Math.floor((now - CWGameUtil.launchTime)/1000)
        CWGameUtil.onlineTime += ot
        if(CWGameUtil.onlineTime>0&&CWGame.R_reportOnlineTime)
            window['MMR'].adSdk.collectTime(CWGameUtil.onlineTime)
    }

    //注册天数
    export function registerDays(){
        let now = CWGameUtil.SERVER_TIME.toLocaleDateString()
        let nowDate = String(now).split('/')
        let regisDate = String(clientData.registerDate).split('/')
        //console.log('now:'+now+" register:"+clientData.registerDate)
        if(nowDate[0] != regisDate[0]){
            //console.log('年份不同')
            return 7
        }
        else if(nowDate[1] != regisDate[1]){
            //console.log('月份不同，模糊计算')
            return 30 - Number(regisDate[2]) + Number(nowDate[2]) + 1
        }
        else{
            return Number(nowDate[2]) - Number(regisDate[2]) + 1
        }
    }
    
    export function login(callback?){
        console.log('开始登录')

        var verLogin = function(rescode,callback){
            let wxins=CWWxUtil.Instance
            let dp = {
                'code':rescode,
                'aId':wxins.aId,
                'version':wxins.version
            }
            if(CWGame.launchQuery&&CWGame.launchQuery.frOpenid)
                dp['frOpenid']=CWGame.launchQuery.frOpenid
            console.log(dp)
            window['MMR'].http.post(wxins.registURL, dp, function(res, thisObj){
                console.log('登录返回')
                //console.log(res);
                clientData.openid = res.openId  
                CWGameUtil.SERVER_TIME = new Date(res.nowTime * 1000)
                //wxins.checkVersionType(res.authStatus, res.version)
                clientData.loginDate=CWGameUtil.SERVER_TIME.toLocaleDateString()
                console.log('当前时间：'+CWGameUtil.SERVER_TIME.toLocaleDateString())

                CWGameUtil.getServerData(res.UserID, res.TokenID, callback)
            }, 
            this,
            function(res, thisObj){
                //登录失败
                console.error('登录失败')
                CWGameUtil.getServerData(wxins.dwUserID, wxins.tokenID, callback)
            },
            function(res, thisObj){
                //登录失败
                console.error('登录超时')
                CWGameUtil.getServerData(wxins.dwUserID, wxins.tokenID, callback)
            })
        }

        if (window['MMR'].channel.isNeedLogin()){
            let wx = window['MMR'].channel.getMiniGameObj();
            wx.login({
                force:false,
                success: (res) => {
                    verLogin(res.code,callback)
                },
                fail: () =>{
                    console.error('login fail')
                    let wxins=CWWxUtil.Instance
                    CWGameUtil.getServerData(wxins.dwUserID, wxins.tokenID, callback)
                },
                complete: () =>{
                }
              })  
         }
         else{
            let wxins=CWWxUtil.Instance
            CWGameUtil.getServerData(wxins.dwUserID, wxins.tokenID, callback)
         } 
    }

    export function showToast(str, ico?){
        CWEventMgr.getInstance().dispatchEvent(CWEventMgr.SHOW_TOAST,[str])
    }


    export function showTextTip(str){
        CWEventMgr.getInstance().dispatchEvent(CWEventMgr.SHOW_TEXT_TIP,[str])
    }

    export function showLoading(){
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();
            wx.showLoading({
                title: '加载中',
                mask: true
            })
        }
    }

    export function hideLoading(){
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();
            wx.hideLoading()
        }
    }

    export function getFileData(filePath, callback, ziji, call?){
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();    
            if(wx){
                let fs = wx.getFileSystemManager()
                fs.readFile({
                    filePath: `${wx.env.USER_DATA_PATH}/` + filePath,
                    encoding: "utf8",
                    success: (res) => {
                        if(res&&res.data){
                            //console.log("读取成功：", JSON.parse(res.data));
                            callback(JSON.parse(res.data), ziji, call); 
                        }  
                        else        
                            callback(null, ziji, call); 
                    },
                    fail: (errMsg) => {
                        //console.log("读取错误：", errMsg);
                      callback(null, ziji, call)
                    },
                    complete: (data) => { }
                  });                
            }   
        }
        else{
            callback(null, ziji, call)
        }
    }

    export function writeFileData(filePath, data){
        //console.log("准备写入数据：",data);
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();    
            if(wx){
                let fs = wx.getFileSystemManager()
                fs.writeFile({
                    filePath: `${wx.env.USER_DATA_PATH}/` + filePath,
                    data:data,
                    encoding: "utf8",
                    success: (data) => {
                        //console.log("写入成功：",data);
                    },
                    fail: (errMsg) => {
                      //console.log("写入错误：",errMsg);
                    },
                    complete: (data) => { 
                        //console.log("写入完成",data);
                    }
                  });
            }   
        }
    }

    export function vibrate(){
        var wx = window['MMR'].channel.getMiniGameObj();
        if(wx){
            wx.vibrateShort({
                success: () => {
    
                },
    
                fail: () =>{
    
                },
                complete: () =>{
                }
            }) 
        }     
    }

    export function vibrateShort(){
        if (CWGame.shockEnable && window['MMR'].channel.isMiniGame()){
            Laya.timer.clear(this, this.vibrate)
            for(let i=0;i<3;++i){
                Laya.timer.once(20*i, this, this.vibrate)
            } 
         }  
    }

    export function vibrateLong(){
        if (CWGame.shockEnable && window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();
            wx.vibrateLong({
                success: () => {
    
                },

                fail: () =>{
    
                },
                complete: () =>{
                }
              })  
         }  
    }
    
    //获取服务器存档
    export function getServerData(thisUserID, thisTokenID, callback){

        if(true){
            callback&&callback()
            return
        }
   }

    //过快点击
    let lastClick:number = 0
    export function isClickBusy(time?:number, hideToast?:boolean){
        if(!time)time=400
        let now = new Date().getTime();
        if(now-lastClick>time){
            lastClick=now
            return true 
        }
        else{
            if(!hideToast)
                CWGameUtil.showToast("操作过于频繁，请稍后再试")
            return false
        } 
    }

    export function checkBlock(){
        window['MMR'].http.post("https://mergefarm.sy3.com/city-block.php", {}, function(res, thisObj){
            //console.log(res)
            clientData.loginDate=CWGameUtil.SERVER_TIME.toLocaleDateString()
            console.log('当前时间：'+CWGameUtil.SERVER_TIME.toLocaleDateString())
            if(res&&res.block)
                CWGame.cityBlock=true
        },this);
    }

    export function getNewTime(func?){
        window['MMR'].http.post("https://mergefarm.sy3.com/city-block.php", {}, function(res, thisObj){
        },this)
    }

    export function scaleSmall(nx,ny,eb):void{
        Laya.Tween.to(eb.currentTarget, {scaleX:nx, scaleY: ny}, 2)
    }

    export function scaleBig(nx,ny,eb):void{
        Laya.Tween.to(eb.currentTarget, {scaleX:1.2*nx, scaleY:1.2*ny}, 2)
    }

    export function itemDown(cy,eb){
        for(let i=0;i<eb.currentTarget.numChildren;++i){
            let child=eb.currentTarget.getChildAt(i)
            child.centerY=cy[i]
        }
    }

    export function itemUp(cy,eb){
        for(let i=0;i<eb.currentTarget.numChildren;++i){
            let child=eb.currentTarget.getChildAt(i)
            child.centerY=cy[i]
        }
    }

    export function soundPath(){
        return CWChannel.isUseLocalURL()?"":this.G_RES_URL()
    }

    export function soundExtension(){
        return (CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_IOS||CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_ANDROID)?".wav":".mp3"
    }

    export function clickSound(){
        !Laya.SoundManager.muted&&Laya.SoundManager.playSound(this.soundPath()+"res/sound/touch"+soundExtension(), 1)
    }

    export function playSound(name,t?){
        t==undefined&&(t=1)
        !Laya.SoundManager.muted&&Laya.SoundManager.playSound(this.soundPath()+"res/sound/"+name+soundExtension(), t)
    }

    export function stopSound(name){
        !Laya.SoundManager.muted&&Laya.SoundManager.stopSound(this.soundPath()+"res/sound/"+name+soundExtension())
    }

    export function playBGM(name){
        Laya.SoundManager.playMusic(this.G_RES_URL(true)+"res/sound/"+name+".mp3", 0)
    }
    
    export function stopMusic(){
        Laya.SoundManager.stopMusic()
    }

    export function iconShake(self,glist){    
        if(!glist)
            return
        var dst=[]
        var len=glist.length
        var rl = len>=6?6:len
        while(true){
            let rn = CWGame.rand(len)
            let cf = false
            for(var i in dst){
                if(dst[i]==rn){
                    cf=true
                    break
                }
            }
            if(!cf){
                dst.push(rn)
                if(dst.length>=rl)
                    break
            }
        }

        var iconFun=function(gl,gp){
            Laya.Tween.clearAll(gl)
            Laya.Tween.clearAll(gp)
            gp.alpha=1
            var lher=Laya.Handler.create
            Laya.Tween.to(gp,{alpha:0},1500)
            Laya.Tween.to(gl, {rotation:-15}, 300, Laya.Ease.quadOut, lher(self, function(){
                Laya.Tween.to(gl, {rotation:15}, 300, Laya.Ease.quadOut, lher(self, function(){
                    Laya.Tween.to(gl, {rotation:-10}, 250, Laya.Ease.quadOut, lher(self, function(){
                        Laya.Tween.to(gl, {rotation:10}, 250, Laya.Ease.quadOut, lher(self, function(){
                            Laya.Tween.to(gl, {rotation:0}, 200)            
                        }))            
                    }))            
                }))            
            }))
        }

        for(var i in dst){
            let idx = dst[i]
            let gl=self['_gl'+idx]
            let gp=self['_gp'+idx]
            iconFun(gl,gp)
        }
    }

    export function rectangleCol(x1,y1,w1,h1,x2,y2,w2,h2){
        var maxX,maxY,minX,minY;


        maxX = x1+w1 >= x2+w2 ? x1+w1 : x2+w2;
        maxY = y1+h1 >= y2+h2 ? y1+h1 : y2+h2;
        minX = x1 <= x2 ? x1 : x2;
        minY = y1 <= y2 ? y1 : y2;


        if(maxX - minX <= w1+w2 && maxY - minY <= h1+h2){
          return true;
        }else{
          return false;
        }
    }

    export function gameOver(time?){
        this.playSound('tick')
        CWGame.touchEnable=false
        Laya.timer.once(1500,this,function(){
            CWEventMgr.getInstance().dispatchEvent(CWEventMgr.LEVLE_COMPLETE)
            CWGame.touchEnable=true
        })
    }

    /**解决因为卡顿在多点触摸期间导致的bug*/
    export function SingletonList_expand(){
        Laya.SingletonList.prototype["_remove"] = function(index){
            // @xd added, 如果index == -1 不执行
            if(index == -1){
                return;
            }
            
            this.length--;
            if (index!==this.length){
                var end=this.elements[this.length];
                // @xd added, 添加end是存存在判断
                if(end){
                    this.elements[index]=end;
                    end._setIndexInList(index);
                }
                
            }
        }

        var old_func  = Laya.SimpleSingletonList.prototype['add'];
        Laya.SimpleSingletonList.prototype['add'] = function(element){
            var index=element._getIndexInList();
            //  add, 添加安全性判断.
            if (index!==-1){
                //LogsManager.echo("SimpleSingletonList:element has  in  SingletonList.");
                return;
            }

            old_func.call(this,element);
        }

    }
}        
