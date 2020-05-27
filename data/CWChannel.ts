
export module CWChannel{
    export let CHANNEL_H5      = 1
    export let CHANNEL_WEIXIN  = 2
    export let CHANNEL_TOUTIAO = 3
    export let CHANNEL_BAIDU   = 4
    export let CHANNEL_IOS     = 5
    export let CHANNEL_ANDROID = 6

    export let GAME_CHANNEL = CHANNEL_WEIXIN

    export function isMiniGame(){
        return getMiniGameObj()&&(GAME_CHANNEL==CHANNEL_WEIXIN||GAME_CHANNEL==CHANNEL_TOUTIAO||GAME_CHANNEL==CHANNEL_BAIDU)
    } 

    export function getMiniGameObj(){
        if(GAME_CHANNEL==CHANNEL_WEIXIN||GAME_CHANNEL==CHANNEL_TOUTIAO){
            return Laya.Browser.window.wx
        }
        else if(GAME_CHANNEL==CHANNEL_BAIDU){
            return Laya.Browser.window.swan
        }
    }

    export function isUseSubpackage(){
        return GAME_CHANNEL==CHANNEL_WEIXIN||GAME_CHANNEL==CHANNEL_BAIDU
    }
    
    export function isCameraEnable(){
        return isMiniGame()&&this.GAME_CHANNEL==this.CHANNEL_TOUTIAO
    } 

    export function isMoreGameLink(){
        return isMiniGame()&&this.GAME_CHANNEL==this.CHANNEL_TOUTIAO
    } 

    export function isUseLocalURL(){
        return GAME_CHANNEL==CHANNEL_H5||GAME_CHANNEL==CHANNEL_IOS||GAME_CHANNEL==CHANNEL_ANDROID||GAME_CHANNEL==CHANNEL_WEIXIN||GAME_CHANNEL==CHANNEL_TOUTIAO
    }

    export function isNative(){
        return GAME_CHANNEL==CHANNEL_IOS||GAME_CHANNEL==CHANNEL_ANDROID
    }

    export function isShowMiniGameBanner(){
        return GAME_CHANNEL==CHANNEL_WEIXIN||GAME_CHANNEL==CHANNEL_TOUTIAO
    }

    export function isUesLocalStorage(){
        return GAME_CHANNEL==CHANNEL_H5||GAME_CHANNEL==CHANNEL_IOS||GAME_CHANNEL==CHANNEL_ANDROID||GAME_CHANNEL==CHANNEL_BAIDU
    }

    export function isUseCWAdSdk(){
        return GAME_CHANNEL==CHANNEL_WEIXIN||GAME_CHANNEL==CHANNEL_TOUTIAO||GAME_CHANNEL==CHANNEL_BAIDU
    }

    export function isUseAld(){
        return GAME_CHANNEL==CHANNEL_WEIXIN||GAME_CHANNEL==CHANNEL_TOUTIAO
    }    

    export function isUseRank(){
        return GAME_CHANNEL==CHANNEL_WEIXIN
    }

    export function isNeedLogin(){
        return false
    }

    export function remoteJson(){
        return isMiniGame()&&(GAME_CHANNEL==CHANNEL_TOUTIAO||GAME_CHANNEL==CHANNEL_WEIXIN)
    }
}