
import { CWGame } from "./CWLevelManager";

//试玩管理
export module CWTryMgr{
    export let gameList7
    export let gameList9
    export function init(){
        CWTryMgr.gameList7 = []
        CWTryMgr.gameList9 = []
        //window['zisewan']&&window['zisewan'].initZiSheWanAd(CWTryMgr.parse)
    }

    export function parse(code, res){
        if(res){
            //console.log('parse')
            var getItem = function(data){
                let item = {}
                item['desc']        = Math.floor(Math.random() * 899999 + 100000)+"人在玩"
                item['icon']        = data.app_icon
                item['appid']       = data.appid
                item['name']        = data.app_title
                item['id']          = data.app_id
                item['link_path']   = data.link_path
                return item
            }
            if(res['position-7']){
                let data = res['position-7']
                for(let i=0;i<data.length;++i){
                    CWTryMgr.gameList7.push(getItem(data[i]))
                }
            }

            if(res['position-9']){
                let data = res['position-9']
                for(let i=0;i<data.length;++i){
                    CWTryMgr.gameList9.push(getItem(data[i]))
                }

                let more=3-(CWTryMgr.gameList9.length%3)
                if(more>0){
                    for(let i=0;i<more;++i){
                        CWTryMgr.gameList9.push(getItem(data[i]))
                    }
                }
                
            }

        }
    }

    export function playGame(data)
    {
        if(!data||!data.appid)return
        if (window['MMR'].channel.isMiniGame()){
            let wx = window['MMR'].channel.getMiniGameObj();
            //console.log(data.id+'_'+data.appid+'_'+data.link_path)
            wx.navigateToMiniProgram({
                appId: data.appid,
                path: data.link_path,
                extraData: {},
                envVersion: 'release',
                success(res) {
                    window['zisewan'].reportClick(window['MMR'].clientData.openid, data.id);
                },  
                fail(res) {
                    window['MMR'].eventManager.getInstance().dispatchEvent(window['MMR'].eventManager.TRY_GAME_CANCEL)
                }
            })
        }
    }

    export function randomGame(pos, num){
        let datas=[]
        let gl
        if(pos==7){
            gl=CWTryMgr.gameList7
        }
        else if(pos==9){
            gl=CWTryMgr.gameList9
        }

        if(!gl||gl.length==0)
            return []

        for(let i=0;i<gl.length;++i){
            let item = gl[i]
            datas.push(item);
        }

        while(datas.length < num){
            let _t = CWGame.rand(gl.length)
            datas.push(gl[_t-1])
        }

        while(datas.length > num){
            let _t = CWGame.rand(datas.length)
            datas.splice(_t-1, 1)
        }

        return datas
    }
}