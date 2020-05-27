import { CWChannel } from "../data/CWChannel"

export module CWRecorderManager{
    export var recorder
    export var vPath=""
    export var totalTime=0
    export var startTime
    export var isPause
    export var forceEnd
    export var autoEnd
    export var noEvent
    const clipIndexList = []; // 剪辑索引列表
    export function init(){
        if(!CWChannel.isCameraEnable())
            return
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj()
            recorder = wx&&wx.getGameRecorderManager()
            if(recorder){
                recorder.onStart(res =>{
                    console.log('录屏开始');
                    // do somethine;
                })

                recorder.onPause(res =>{
                    console.log('录屏暂停');
                    // do somethine;
                })

                recorder.onStop(res =>{
                    console.log('录屏结束');
                    console.log(res.videoPath);
                    if(!isPause){
                        totalTime+=(Laya.timer.currTimer-startTime)
                        startTime=Laya.timer.currTimer
                    }
                    //vPath=res.videoPath
                    // do somethine;
                    var eventMgr = window['MMR'].eventManager
                    !noEvent&&eventMgr.getInstance().dispatchEvent(eventMgr.LUPIN_STOP,[true])
                    if(!forceEnd)
                        autoEnd=true
                    recorder.clipVideo({
                        path: res.videoPath,
                        timeRange: [60, 0],
                        success(res){
                          //console.log(res.videoPath); // 生成最后60秒的视频
                          vPath=res.videoPath
                          forceEnd&&eventMgr.getInstance().dispatchEvent(eventMgr.RECORD_END)
                        },
                        fail(e) {
                          console.error(e)
                          forceEnd&&eventMgr.getInstance().dispatchEvent(eventMgr.RECORD_END)
                        }
                      })

                })

                recorder.onError(res =>{
                    console.error(res)
                    // do somethine;
                })
            }
        }
    }

    export function start(second?){
        //console.log('start')
        if(!recorder)
            return
        second==undefined&&(second=300)
        //second>300&&(second=300)
        recorder.start({
            duration: second,
        })

        totalTime=0
        startTime=Laya.timer.currTimer
        isPause=false
        forceEnd=false
        autoEnd=false
        noEvent=false
    }

    export function pause(){
        if(!recorder)
            return
        recorder.pause()
        totalTime+=(Laya.timer.currTimer-startTime)
        startTime=Laya.timer.currTimer
        isPause=true
    }

    export function resume(){
        if(!recorder)
            return
        recorder.resume()
        startTime=Laya.timer.currTimer
        isPause=false
    }

    export function stop(quiet?){
        if(!recorder)
            return
        if(!isPause){
            totalTime+=(Laya.timer.currTimer-startTime)
            startTime=Laya.timer.currTimer
        }

        forceEnd=true
        noEvent=quiet
        recorder.stop()
    }

    export function timeLess(){
        return totalTime<3.5*1000
    }

    export function share(obj,fun1,fun2, force?){
        if (window['MMR'].channel.isMiniGame()){
            console.log('totalTime:'+totalTime)
            if(totalTime<3.5*1000){
                console.log("分享失败：录屏时长低于 3 秒")
                !force&&window['MMR'].gameUtil.showToast("分享失败：录屏时长低于 3 秒")
                fun2&&fun2(obj,true)
                return false
            }
            let wx = window['MMR'].channel.getMiniGameObj()
            //console.log(vPath)
            wx.shareAppMessage({
                channel: 'video',
                title: '分享视频',
                desc: "我答题贼6",
                imageUrl: '',
                templateId: '',
                query: '',
                extra: {
                  videoPath: vPath, // 可替换成录屏得到的视频地址
                  videoTopics: ['我答题贼6']
                },
                success() {
                  console.log('分享视频成功');
                  fun1&&fun1(obj) 
                },
                fail(e) {
                  console.log('分享视频失败');
                  console.log(e)
                  fun2&&fun2(obj)
                }
              })
            
            return true
        }
    }
}