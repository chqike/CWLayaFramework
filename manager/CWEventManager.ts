
export class CWEventMgr{
    static ON_SHOW:string         = 'ea'   //前台
    static ON_HIDE:string         = 'eb'    //后台
    static LOAD_SUBPACKAGE:string = "ec" //子包
    static SHARE_RETURN:string    = 'ed'
    static RELOAD_SUBPACKAGE:string = 'ef'
    static UPDATE_PROGRESS:string = 'eg'
    static LOAD_STAGE:string = 'eh'

    static UPDATE_CASH:string     = 'e1'
    static UPDATE_EXP:string      = 'e2'
    static GET_USER_INFO:string   = 'e3'
   
    static BACK_TO_MAIN:string    = 'e4'
    static GAME_FINISH:string     = 'e5'
    static REVIVAL:string         = 'e6'
    static USE_SKIN:string        = 'e7'
    static RESTART:string         = 'e8'
    static MOREGAME_BACK:string   = 'e9'
    static TRY_GAME_CANCEL:string = 'e10'
    static SHOW_TOAST:string      = 'e11'
    static SHOW_TEXT_TIP:string      = 'e12'
    static UPDATE_POINT           = 'e16'
    static SHOW_COLLECT           = 'e15'
    
    static LEVEL_START            = 'e14'
    static LEVLE_COMPLETE         = 'e13'

    static LUPIN_STOP             = 'e17'
    static LUPIN_START            = 'e18'

    static SHOW_BANNER            = 'e19'
    static HIDE_BANNER            = 'e20'
    static SHOW_INS_AD            = 'e19a'

    static RECORD_END             = 'e22'

    static ON_FLOOR                 = 'e23'
    static ON_AIR                   = 'e24'
    static ON_BLOCK                 = 'e25'
    static ON_PUSH_BOX              = 'e26'
    static ON_COLLECT_COIN          = 'e27'
    static ON_CELL_ENTER            = 'e28'
    
    static ON_UPDATE_SKIN_INFO      = 'e29'
    static ON_USE_SKIN              = 'e30'
    static NEW_LEVEL                = 'e31'
    static ON_ENABLE_SHADOW         = 'e32'
    static ON_BEGIN_RUN             = 'e33'
    static ON_CELL_EXIT             = 'e34'
    static SHOW_SKIN_GIFT           = 'e35'
    static START_INVINCIBLE         = 'e36'
    static STOP_INVINCIBLE          = 'e37'
    static ALL_SKIN_DONE            = 'e38'

    static SHOW_REVIVAL             = 'e39'
    static ON_GET_YUYUE_SKIN        = 'e40'
    static ON_TOMORROW              = 'e41'
    static ON_TOP_MASK              = 'e42'

    //--------------------
    static ON_MOUSE_MOVE            = 'e43'
    static ON_MOUSE_UP              = 'e44'
    static ON_STAGE_START           = 'e45'
    static ON_SHOW_STAGE_IPS        = 'e46'
    static ON_SHOW_STAGE_GUIDE      = 'e47'
    static ON_MOUSE_DOWN            = 'e48'

    static dispatcher;
    static _instance: CWEventMgr;
    public static getInstance() {
        if (CWEventMgr._instance == null) {
            CWEventMgr._instance = new CWEventMgr();
            CWEventMgr.dispatcher = new Laya.EventDispatcher();
        }
        return CWEventMgr._instance;
    }
    constructor() {

    }
    ///注册事件
    public dispatchEvent(InName, agv?: any[]) {
        //派发事件
        //console.log("派发事件",InName);
        CWEventMgr.dispatcher.event(InName, agv);
    }
    //侦听事件
    public addEventListener(InName, listener: Function, caller, arg?: any[]): void {
        //console.log("侦听事件",InName);
        CWEventMgr.dispatcher.on(InName, caller, listener, (arg == null) ? null : ([arg]));
    }
    //侦听事件
    public removeEventListener(InName, listener: Function, caller): void {
        //console.log("侦听事件",InName);
        CWEventMgr.dispatcher.off(InName, caller, listener);
    }    
}
