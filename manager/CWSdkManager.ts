import { CWChannel } from "../data/CWChannel"

export module CWSdkMgr{
    export let aldStage
    export let aldSendEvent
    export function init(){
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj()
            aldStage = wx.aldStage
            aldSendEvent = wx.aldSendEvent
        }

        
    }

    //关卡开始
    export function stageStart(sid, name){
        if(!aldStage){
            //console.error('aldStage is nil')
            return
        }
            
        aldStage.onStart({
            stageId : sid,     //关卡ID 该字段必传
            stageName : name, //关卡名称  该字段必传
            //userId : window['MMR'].clientData.openid //用户ID 可选
        })
    }

    //关卡中 revive award
    export function stageRunning(sid, name, evt, pa){
        if(!aldStage){
            //console.error('aldStage is nil')
            return
        }
        aldStage.onRunning({
            stageId : sid,     //关卡ID 该字段必传
            stageName : name, //关卡名称  该字段必传
            //userId : window['MMR'].clientData.openid, //用户ID 可选
            event : evt,  //发起支付 关卡进行中，用户触发的操作    该字段必传
            params : pa
            // {    //参数
            //     itemName : "火力增强",  //购买商品名称  该字段必传
            //     itemCount : 5,        //购买商品数量  可选，默认1
            //     itemMoney : 20        // 购买商品金额  可选 默认0
            //     desc : "武器库-商店购买"  //商品描述   可选
            // }
        })
    }
    
    //关卡完成 complete fail
    export function stageEnd(sid, name, win){
        let t1 = win?"complete":"fail"
        let t2 = win?"关卡完成":"关卡失败"
        if(!aldStage){
            //console.error('aldStage is nil')
            return
        }
        aldStage.onEnd({
            stageId : sid,    //关卡ID 该字段必传
            stageName : name, //关卡名称  该字段必传
            //userId : window['MMR'].clientData.openid,  //用户ID 可选
            event : t1,   //关卡完成  关卡进行中，用户触发的操作    该字段必传
            params : {
                desc :  t2  //描述
            }
        })
    }

    export function sendEvent(key, value?){
        console.log(key)
        if(CWChannel.isMiniGame()){
            if(!aldSendEvent){
                //console.error('aldSendEvent is nil')
                return
            }
            let toSendData = undefined;    
            if (typeof value === 'object') {
                toSendData = {};
                let keys = Object.keys(value);
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    toSendData[key] = JSON.stringify(value[key]);
                }
            }    
            aldSendEvent(key,value)
        }
        else if(CWChannel.isNative()){
            value==undefined&&(value="0")
            window['MMR'].nativeHelp&&window['MMR'].nativeHelp.sendEvent(key, value)
        }
    }

    export function startLevel(level){
        if(CWChannel.isMiniGame()){

        }
        else if(CWChannel.isNative()){
            window['MMR'].nativeHelp&&window['MMR'].nativeHelp.startLevel(level)
        }
    }

    export function finishLevel(level){
        if(CWChannel.isMiniGame()){

        }
        else if(CWChannel.isNative()){
            window['MMR'].nativeHelp&&window['MMR'].nativeHelp.finishLevel(level)
        }
    }

    export function failLevel(level){
        if(CWChannel.isMiniGame()){

        }
        else if(CWChannel.isNative()){
            window['MMR'].nativeHelp&&window['MMR'].nativeHelp.failLevel(level)
        }
    }
}