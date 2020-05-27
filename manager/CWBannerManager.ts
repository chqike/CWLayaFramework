
import { CWClientData } from "../data/CWClientData";
import { CWCommon } from "../data/CWCommon";
import { CWGame } from "./CWLevelManager";
import { CWSdkMgr } from "./CWSdkManager";
import { CWGameUtil } from "../data/CWGameUtil";
import { CWChannel } from "../data/CWChannel";
import { CWNativeHelp } from "../sdk/CWNativeHelp";

export module CWBannerMgr {
    export const AD_ENABLED = false
   
    var ADT = ''
    export var INTERSTITIAL_AD_ID = "";
    var VIDEO_AD_ID = []
    var BANNER_AD_ID = [];
    var APP_ID = ""
    export var enableInterstitialAd = true

    export function init(){
      if(!AD_ENABLED)
         return

      if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_WEIXIN){
        ADT = 'adunit-'
        INTERSTITIAL_AD_ID = "4fa03e7b871f1ec8";
        VIDEO_AD_ID = [
          "e52e119994571efb",
          "32ea11d64c626272"
        ]
        BANNER_AD_ID = [
          "14e36bcb8125c485",
          "1e857918a1a3deae"
        ];
        enableInterstitialAd=true
      }
      else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_TOUTIAO){
        INTERSTITIAL_AD_ID = "3go0p1u45o5kds42ao";
        VIDEO_AD_ID = [
          "n007ldc5877113k193"
        ]
        BANNER_AD_ID = [
          "lh9glt20n51f55ogim",
          "1ddnamf870t9dd2b32"
        ];
        enableInterstitialAd=true      
      }
      else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_BAIDU){
        APP_ID = "b5ccb65e"
        VIDEO_AD_ID = [
          "6971093",
          "6971094"
        ]
        enableInterstitialAd=false      
      }

      if(CWChannel.isShowMiniGameBanner())
        this.initBannerAd()
      this.createInterstitialAd();  
    }
  
    export let callFun,callFun2,callArg,callArg2,callObj
    let vidoeAd

    export function playVideoAd(id,obj,fun,fun2,arg,arg2?)
    {
        if(!AD_ENABLED)
            return false
        var pId = ADT+VIDEO_AD_ID[CWGame.rand(VIDEO_AD_ID.length)-1]
        if(pId==""){
          CWCommon.videoFail[id] = 1
          CWCommon.onShare(arg,obj,fun,fun2)
          return
        }
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();
            CWSdkMgr.sendEvent("视频广告开始-"+CWCommon.SHARE_REASON[arg],"")
            CWGameUtil.showLoading()
            Laya.timer.once(1500,this,()=>{
              CWGameUtil.hideLoading()
            })
            if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_WEIXIN
              ||CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_BAIDU){
                var vi 
                if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_WEIXIN){
                  vi = wx.createRewardedVideoAd({
                      adUnitId: pId
                  })

                  vi.onError(function (errMsg, errCode){
                      wx.hideLoading()
                      console.log("看视频错误",errMsg,errCode);
                      CWCommon.videoFail[id] = 1;
                      
                      vi && vi.offError()
                      vi && vi.offClose()
                      CWCommon.onShare(arg,obj,fun,fun2)
                  })
                  
                }
                else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_BAIDU){
                  console.log('adUnitId=['+pId+'] appSid=['+APP_ID+']')
                  vi = wx.createRewardedVideoAd({
                    adUnitId: pId,
                    appSid: APP_ID
                  });

                  vi.onError(function (err){
                      console.error("看视频错误",err.errMsg, err.errCode);
                      //CWCommon.videoFail[id] = 1;
                      
                      vi && vi.offError()
                      vi && vi.offClose()
                      fun2&&fun2(obj, "非常抱歉，目前暂无广告");
                      //CWCommon.onShare(arg) 
                  })
                }
                
                vi.load()
                .then(() =>{
                    vi.show().then(() =>{
                    })
                })
                .catch(err => {
                })
                
               
                vi.onClose(res =>{
                    if(res.isEnded){
                        window['MMR'].clientData.adTimes++
                        fun(obj,arg2);
                        CWSdkMgr.sendEvent("视频广告结束(看完)-"+CWCommon.SHARE_REASON[arg],"")
                    }
                    else{
                        if(fun2){
                            fun2(obj,arg2);
                        }
                        CWSdkMgr.sendEvent("视频广告结束(未看完)-"+CWCommon.SHARE_REASON[arg],"")
                    }
                    vi.offClose()
                    vi.offError()              
                })


            }
            else if(CWChannel.GAME_CHANNEL==CWChannel.CHANNEL_TOUTIAO){
                callFun=fun
                callFun2=fun2
                callArg=arg
                callArg2=arg2
                callObj=obj

                if(vidoeAd==undefined){
                    vidoeAd = wx.createRewardedVideoAd({
                        adUnitId: pId
                    })

                  vidoeAd.onClose(res =>{
                    if(res.isEnded){
                        window['MMR'].clientData.adTimes++
                        callFun(callObj,callArg2);
                        CWSdkMgr.sendEvent("视频广告结束(看完)-"+CWCommon.SHARE_REASON[callArg],"")
                    }
                    else{
                        if(callFun2){
                          callFun2(callObj,callArg2);
                        }
                        CWSdkMgr.sendEvent("视频广告结束(未看完)-"+CWCommon.SHARE_REASON[callArg],"")
                    }       
                    
                    CWGame.gamePause=false
                    Laya.timer.resume()
                  })

                  vidoeAd.onError(function (errMsg, errCode){
                      //console.log("看视频错误",errMsg,errCode);
                      CWCommon.videoFail[id] = 1;
                      CWGameUtil.hideLoading()
                      CWCommon.onShare(callArg,callObj,callFun,callFun2,callArg2)
                      CWGame.gamePause=false
                      Laya.timer.resume()
                  })  
                }
                
                vidoeAd.load()
                .then(() =>{
                  vidoeAd.show().then(() =>{
                    CWGameUtil.hideLoading()
                        CWGame.gamePause=true
                        Laya.timer.pause()
                    })
                })
                .catch(err => {
                    vidoeAd.load()
                    .then(() => {
                        vidoeAd.show().then(() =>{
                          CWGameUtil.hideLoading()
                          CWGame.gamePause=true
                          Laya.timer.pause()
                      })
                    });
                })
            }


            if(CWClientData.videoTimesDay1>0){
              CWClientData.videoTimesDay1--
            }
            CWClientData.videoTimesDay1==0&&(CWClientData.shareTimesDay1=CWGame.R_shareTimesDay1)

            CWNativeHelp.fullScreenNormalCool()
        }
    }

    //////////////////////////////////////////////////////////////////////

    
      let _interstitialAd;
      let _adLoad = false;
      let _isWaitingInterstitialAd = false;
      export function createInterstitialAd () {
        if (!window['MMR'].channel.isMiniGame()||!enableInterstitialAd){
          return;
        }
        let wx = window['MMR'].channel.getMiniGameObj();
        if(!wx)
          return
        if (wx.createInterstitialAd !== undefined) {
          _interstitialAd = wx.createInterstitialAd({adUnitId: ADT+INTERSTITIAL_AD_ID});
    
          _interstitialAd.onLoad(() => {
            //console.log('插屏广告加载成功');
            _adLoad = true;
          });
          _interstitialAd.onError(err => {
            _adLoad = false;
            //console.log('插屏广告加载错误', err);
          });
          _interstitialAd.onClose((res) => {
            //console.log('插屏广告关闭', res);
            _adLoad = false;
            CWBannerMgr.showCurrentBanner();
          });
        }
      };
    
      
    
      /**
       * 插屏广告是否已经加载成功
       * @param logKey
       * @returns {boolean}
       */
      export function isInterstitialAdLoad(logKey) {
        if (!window['MMR'].channel.isMiniGame()){
          return;
        }
        let wx = window['MMR'].channel.getMiniGameObj();
        if (logKey !== undefined) {
          if (_adLoad) {
            //sendLogEvent("无可用插屏广告 - " + logKey);
          }
        }
        return _adLoad;
      };
    
      /**
       * 显示插屏广告
       * @param logKey
       * @param callback
       */
      export function showInterstitialAd (logKey, callback) {
        if (!window['MMR'].channel.isMiniGame()){
          return;
        }
        let wx = window['MMR'].channel.getMiniGameObj();
        if (!enableInterstitialAd) {
          //sendLogEvent("插屏广告被设为关闭");
          return;
        }
        if (logKey !== undefined) {
          //sendLogEvent("插屏广告开始 - " + logKey);
        }

        if (_interstitialAd !== undefined) {
          if (_adLoad) {
            //_isWaitingInterstitialAd = true;
            _interstitialAd.show().then((res) => {
             // _isWaitingInterstitialAd = false;
              _adLoad = false;
              if (logKey) {
                //sendLogEvent("插屏广告成功" + logKey);
              }
              //console.log('插屏广告成功', res);
    
              CWBannerMgr.hideCurrentBanner();
              //callback && callback();
              
            }).catch((err) => {
              //_isWaitingInterstitialAd = false;
              console.log('激励插屏广告显示失败', err);
              //callback && callback();
            })
          }
        } else {
          callback && callback();
        }
      };
    
      // export function isWaitingInterstitialAd () {
      //   return _isWaitingInterstitialAd;
      // };
    
   
    //////////////////////////////////////////////////////////////////////
      

        const MAX_BANNER_LOAD_COUNT = 2;
        let _loadedBanners = [];  //已经加载的banner
        let _curBan = null;  //当前正在显示的banner
        let _banStyS = [];  //banner样式堆栈, 用来维护多次显示banner时的样式
        let _lastBannerOpts;
        let bannerReuseTimes = 1
        
        export let initBannerAd = function () {
            if (!window['MMR'].channel.isMiniGame()){
                return;
            }
          //console.log("initBannerAd");
          for(let i=0;i<MAX_BANNER_LOAD_COUNT;++i){
            let bannerId = ADT+BANNER_AD_ID[i]//[CWGame.rand(BANNER_AD_ID.length)-1];
            _createBannerAd(bannerId, true); 
          }
        };
      
        let _createBannerAd = function (bannerId, isPreload) {
          let wx = window['MMR'].channel.getMiniGameObj();
          if (!wx||wx.createBannerAd === undefined) {
            //console.log("banner广告初始化失败,微信版本太低");
            return null;
          }
          if (isPreload && _loadedBanners.length >= MAX_BANNER_LOAD_COUNT) {
            //console.log('已载入Banner数量已达上限');
            return null;
          }
      
          let sysInfo = wx.getSystemInfoSync();
          let screenHeight = sysInfo.screenHeight;
          let screenWidth = sysInfo.screenWidth;
          let ccw=screenWidth//Laya.Browser.clientWidth
          let cch=screenHeight//Laya.Browser.clientHeight

          let banner = wx.createBannerAd({
            adUnitId: bannerId,
            style: {
              width: 200,
              left: (ccw-200)/2,
              top: cch - ccw / 414 * 131,
            }
          });
          banner.bannerId = bannerId;
          banner.useTimes = 0;
          banner.onResize((res) => {
            let style = banner.resizeToStyle;
            if (!style) {
              //console.warn("Banner.onResize失败, 无resizeToStyle");
              return;
            }
            let sysInfo = wx.getSystemInfoSync();
            let screenWidth = sysInfo.screenWidth
            let screenHeight = sysInfo.screenHeight
      
            if (style.posType === 'bottom') {
              banner.style.left = (screenWidth - res.width) / 2; // 水平居中
              banner.style.top=style.top
            } else if (style.posType === 'top') {
              banner.style.left = (screenWidth - res.width) / 2; // 水平居中
              banner.style.top=style.top
            }
            else {
              banner.style.left = (screenWidth - res.width) / 2; // 水平居中
              banner.style.top=style.top
            }

            banner.resizeToStyle = banner.style

          });
      
          banner.onLoad(() => {
            //console.log('banner广告加载成功:' + bannerId);
            if (isPreload) {
              _loadedBanners.push(banner);
              //console.log(`成功预载Banner:${bannerId},剩余已预载Banner:${_loadedBanners.length}`);
            }
            if (!isPreload) {
              banner.useTimes++;
              banner.show();
              if(_curBan){
                _hideOrDestroyCurrentBanner()
              }
              _curBan = banner;
              //console.log(`成功载入Banner, 并直接显示:${bannerId},剩余已预载Banner:${_loadedBanners.length}`);
              _preloadBanner();
            }
          });
          banner.onError(err => {
            console.log('banner加载失败:' + bannerId, err);
            if (!isPreload) {
              _curBan = null;
            }
          });
          return banner;
        };
      
        /**
         * bannerId是否已经成功载入
         * @param bannerId
         * @returns {boolean}
         * @private
         */
        let _isBannerIdLoaded = function (bannerId) {
          if (_curBan) {
            if (_curBan.bannerId === bannerId)
              return false;
          }
          for (let j = 0; j < _loadedBanners.length; j++) {
            let banner = _loadedBanners[j];
            if (banner.bannerId === bannerId) {
              return true;
            }
          }
          return false;
        };
      
        /**
         * 取一个未被载入的BannerId
         * @returns {*}
         * @private
         */
        let _getNotLoadedBannerId = function () {
          for (let i = 0; i < BANNER_AD_ID.length; i++) {
            let bannerId = ADT+BANNER_AD_ID[i];
            if (!_isBannerIdLoaded(bannerId)) {
              return bannerId
            }
          }
          return null;
        };
      
      
        let _setBannerStyle = function (banner, style) {
          if (banner) {
            if(banner.resizeToStyle){
              style.width=banner.resizeToStyle.width
              style.left=banner.resizeToStyle.left
            }
 
            banner.resizeToStyle = style;
            banner.style.left = style.left;
            banner.style.top = style.top;
            banner.style.width = style.width;
            if (style.height !== undefined) {
              banner.style.height = style.height;
            }
          }
        };
      
      
        /**
         * 预载一个banner
         * @private
         */
        let _preloadBanner = function () {
          //console.log("预载Banner");
          let bannerId = _getNotLoadedBannerId();
          if (bannerId) {
            _createBannerAd(bannerId, true);
          } else {
            //console.log("所有BannerID都被预载, 无需再次预载");
          }
        };
      
        /**
         * 按指定style显示banner
         * @param style
         * @returns {*}
         * @private
         */
        let _showBannerWithStyle = function (style) {
          let banner = _curBan;
          if (!banner) {
            if (_loadedBanners.length > 0) {
              banner = _loadedBanners[0];
              _loadedBanners.splice(0, 1);
              //console.log("从已预载Banner中取出一个, 剩余已预载Banner:" + _loadedBanners.length);
              banner.useTimes++;
              banner.show();
              _curBan = banner;
              //由于从已载入的Banner中取出了一个, 需要再次预载一个banner供后续使用
              _preloadBanner();
            } else {
              //console.log("没有找到已预载Banner, 实时创建一个");
              let bannerId = _getNotLoadedBannerId();
              if (bannerId) {
                banner = _createBannerAd(bannerId, false);
              }
            }
          } else {
            banner.useTimes++;
            banner.show();
          }
          if (banner) {
            _setBannerStyle(banner, style);
          }
          return banner;
        };
        let _hideOrDestroyCurrentBanner = function () {
          if (_curBan) {
            _curBan.hide();
            if (_curBan.useTimes >= bannerReuseTimes) {
              _curBan.destroy();
              _curBan = null;
              //console.log("销毁Banner");
            }
          }
        };
      
      
        let getBannerStyle = function (opts) {
          if (opts === undefined) {
            opts = {
              posType: 'bottom'
            };
          }
          //容错: 如果posType为node, 但refNode没有设置, 改为屏幕底部显示
          if (opts.posType === 'node' && !opts.refNode) {
            //console.warn('Banner位置设选项异常, 改为底部显示Banner', opts);
            opts = {
              posType: 'bottom'
            };
          }
      
          if (_lastBannerOpts &&
              _lastBannerOpts.posType === opts.posType &&
              _lastBannerOpts.refNode === opts.refNode) {
            return Object.assign({}, _lastBannerOpts);
          }
      
          let sysInfo = wx.getSystemInfoSync();
          let screenWidth = sysInfo.screenWidth;
          let screenHeight = sysInfo.screenHeight;
          let result;
          let ccw=screenWidth
          let cch=screenHeight

          if (opts.posType === 'top') {
            result = {
              width: screenWidth - Math.random() * 0.01,
              top: 0,
              left: 0,
              height: 100 - Math.random() * 0.01,
              posType: opts.posType,
            }
          }	else if (opts.posType === 'bottom') {
            result = {
              width: ccw * (1 - 50 / 200),
              left: (ccw - ccw * (1 - 50 / 200))/2,
              top: cch - ccw / 414 * 115,
                //height: 200-40,
                posType: opts.posType,
            };
        }
        else {
          let width = ccw * (1 - 40 / 200);
          let height = 100;
          let left = ccw * (40 / 200) / 2;
          let top = cch
          if(opts.centerY)
            top = cch / 2 + ccw / 414 * opts.centerY
          else if(opts.bottomY)
            top = cch - ccw / 414 * opts.bottomY

            result = {
              left,
              top,
              width,
              height,
              posType: opts.posType,
              refNode: opts.refNode,
            }
          }
          _lastBannerOpts = result;
          return result;
        };
      
      
        /**
         * 显示Banner广告, banner显示时的以bannerRefNode作为参考节点,
         * 会确保不超出参考节点的范围, 如果bannerRefNode为空,
         * 则显示在屏幕底部并缩放占满屏幕
         * @param opts
         * @returns {*}
         */
        export let showBannerAd = function (opts) {
            if(!AD_ENABLED)
              return
            if (!window['MMR'].channel.isMiniGame()){
                return;
            }
          _hideOrDestroyCurrentBanner();
      
          let style = getBannerStyle(opts);
          let banner = _showBannerWithStyle(style);
          _banStyS.push(style);
          return banner;
        };
      
        /**
         * 隐藏banner, 如果堆栈里有其他banner,则恢复前一个样式
         * @param clearStack
         */
        export let hideBannerAd = function (clearStack?) {
            if(!AD_ENABLED)
              return
            if (!window['MMR'].channel.isMiniGame()){
                return;
            }
          if (clearStack) {
            _banStyS = [];
          }
          _hideOrDestroyCurrentBanner();
          if (_banStyS.length > 0) {
            _banStyS.splice(_banStyS.length - 1, 1);
          }
          if (_banStyS.length === 0 || clearStack) {
            _lastBannerOpts = undefined;
          } else {
            //console.log("Banner堆非空, 恢复上一级样式");
            let style = _banStyS[_banStyS.length - 1];
            _curBan = null;
            _showBannerWithStyle(style);
          }
        };
      
      
        /**
         * 设置当前正在显示的Banner的样式
         * @param opts
         */
        export let setCurrentBannerStyle = function (opts) {
            if (!window['MMR'].channel.isMiniGame()){
                return;
            }
          let style = getBannerStyle(opts);
          _showBannerWithStyle(style);
        };
      
      
        export let showCurrentBanner = function () {
            if (!window['MMR'].channel.isMiniGame()){
                return;
            }
          if(_curBan){
            _curBan.show();
          }
        };
      
        export let hideCurrentBanner = function () {
            if (!window['MMR'].channel.isMiniGame()){
                return;
            }
          if(_curBan){
            _curBan.hide();
          }
        };
}