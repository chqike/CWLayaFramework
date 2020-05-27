

export class CWHttp {

    static post(url: string, datas, func:Function, thisObj?, failFunc?:Function, timeOutFunc?:Function){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    //console.log("resText=[" + xhr.responseText + "]")
                    window['MMR'].gameUtil.SERVER_TIME = new Date(xhr.getResponseHeader("Date"));
                    if(func && xhr.responseText != ""){
                        func(JSON.parse(xhr.responseText), thisObj)
                    }
                }else{
                    console.error("XMLHttpRequest return Error:" + xhr.status + " " + xhr.statusText);
                    //window['MMR'].gameUtil.showToast("HTTP POST return Error:" + xhr.status + " " + xhr.statusText)
                    window['MMR'].gameUtil.SERVER_TIME = new Date(xhr.getResponseHeader("Date"));
                    if (failFunc && xhr.responseText != ""){
                        failFunc(JSON.parse(xhr.responseText), thisObj)
                    }
                }
            }
        };      
        //设置xhr请求的超时时间
        //xhr.timeout = 7000                 
        xhr.open('POST', url, true);
        //xhr.setRequestHeader("Content-Type","multipart/form-data");   
        xhr.ontimeout = function(e) { 
            if(timeOutFunc){
                timeOutFunc()
            }
         };     

        var arr = new Array()
        let idx = 0
        for(let n in datas){
            //arr[idx] = encodeURIComponent(n) + "=" + encodeURIComponent(datas[n])
            arr[idx] = n + "=" +datas[n]
            idx++
        }

        xhr.send(arr.join("&"));

        //xhr.send("");
    }               

    static post2(url: string, data: string, func:Function, thisObj?, failFunc?:Function, timeOutFunc?:Function){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    //console.log("resText=[" + xhr.responseText + "]")
                    window['MMR'].gameUtil.SERVER_TIME = new Date(xhr.getResponseHeader("Date"));
                    if(func){
                        func(JSON.parse(xhr.responseText), thisObj)
                    }
                }else{
                    console.error("XMLHttpRequest return Error:" + xhr.status + " " + xhr.statusText);
                    //window['MMR'].gameUtil.showToast("HTTP POST return Error:" + xhr.status + " " + xhr.statusText)
                    window['MMR'].gameUtil.SERVER_TIME = new Date(xhr.getResponseHeader("Date"));
                    if (failFunc){
                        failFunc(JSON.parse(xhr.responseText), thisObj)
                    }
                }
            }
        };      
        //设置xhr请求的超时时间
        //xhr.timeout = 7000                 
        xhr.open('POST', url, true);
        //xhr.setRequestHeader("Content-Type","multipart/form-data");   
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.ontimeout = function(e) { 
            if(timeOutFunc){
                timeOutFunc()
            }
         };     

        var arr = new Array();
        arr[0] = encodeURIComponent("action") + "=" + encodeURIComponent("test");
        arr[1] = encodeURIComponent("parma") + "=" + encodeURIComponent(data);

        xhr.send(arr.join("&"));
    }       
    
    static get(url: string, func:Function, thisObj?, failFunc?:Function, timeOutFunc?:Function){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if(func){
                        func(JSON.parse(xhr.responseText), thisObj)
                    }
                }else{
                    console.error("XMLHttpRequest return Error:" + xhr.status + " " + xhr.statusText);
                    if (failFunc){
                        failFunc(JSON.parse(xhr.responseText), thisObj)
                    }
                }
            }
        };      
        //设置xhr请求的超时时间
        //xhr.timeout = 7000                 
        xhr.open('GET', url, true);
        xhr.setRequestHeader("Content-Type","multipart/form-data");   
        xhr.ontimeout = function(e) { 
            if(timeOutFunc){
                timeOutFunc()
            }
         };        
        xhr.send("");
    }
}

