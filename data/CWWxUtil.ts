import { CWChannel } from "./CWChannel";

export class CWWxUtil {
    public version = "1.0.0" 
    public bundle = '0'
    public aId  = 36  
    public adSafe = true
    private gameUtil = window['MMR'].gameUtil
    public VERSION_TYPE = window['MMR'].gameUtil.DEV_VERSION;

    private static instance: CWWxUtil;
    public avatarUrl:string = "" //头像
    public city:string      //城市
    public country:string   //国家
    public gender:number    //性别 0：未知、1：男、2：女
    public language:string  //语言
    public nickName:string = '游客'  //昵称
    public province:string  //身份
    public dwUserID:number = 0  //id
    public openID:string = ''
    public tokenID:number = 0   //token 
    public shareid = 0

    public tversion

    public get registURL(){
        return "https://api-dati.h5uc.com/api/login-wx-free-auth"         
    }

    public get saveDataURL() {
        return "https://api-dati.h5uc.com/api/game-single-data-report"
    } 

    public get getDataURL() {

        return "https://api-dati.h5uc.com/api/user/get-user"
    } 
    
    public get inviteDataURL(){
        return "https://api-dati.h5uc.com/api/invite/count"
    }

    public static get Instance(): CWWxUtil {
        if (this.instance == null) {
            this.instance = new CWWxUtil();       

            if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_WEIXIN){
                this.instance.version="1.0.0"
                this.instance.bundle="1"
                console.log('channel:wx')
            }
            else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_TOUTIAO){
                this.instance.version="1.0.0"
                this.instance.bundle="1"
                console.log('channel:tt')
            }
            else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_BAIDU){
                //this.instance.version="1.0.0"
                console.log('channel:bd')
            }
            else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_IOS){
                this.instance.version="1.0.0"
                console.log('channel:ios')
            }
            else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_ANDROID){
                //this.instance.version="1.0.0"
                this.instance.bundle="1"
                console.log('channel:android')
            }            
            else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_H5){
                //this.instance.version="1.0.0"
                console.log('channel:h5')
            }
            
        };
        return this.instance;
    }

    public getVersion(){
        return this.version+"."+this.bundle
    }

    public isExamine(){
        return this.VERSION_TYPE == this.gameUtil.EXAMINE_VERSION 
    }

    public setExamine(){
        this.VERSION_TYPE = this.gameUtil.EXAMINE_VERSION 
    }

    public isDev(){
        return this.VERSION_TYPE == this.gameUtil.DEV_VERSION 
    }

    public checkVersionType(authStatus, sver){
        console.log("版本号："+this.version+" 状态："+authStatus)     
        sver==undefined&&(sver="1.0.0")
        authStatus=1
        if(authStatus==1){
            this.VERSION_TYPE = this.gameUtil.EXAMINE_VERSION         
        }
        else{
            this.VERSION_TYPE = this.gameUtil.OFFICIAL_VERSION       
        }
             
    }
    

    public checkVersionType2(sver){
        let authStatus = this.version==sver
        console.log("版本号："+this.version+" 状态："+authStatus)     
        sver==undefined&&(sver="1.0.0")
        if(authStatus){
            this.VERSION_TYPE = this.gameUtil.EXAMINE_VERSION         
        }
        else if(this.version>sver){
            this.VERSION_TYPE = this.gameUtil.DEV_VERSION
        }
        else{
            this.VERSION_TYPE = this.gameUtil.OFFICIAL_VERSION       
        }
             
    }

}