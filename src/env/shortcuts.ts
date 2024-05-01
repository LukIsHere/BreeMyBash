import { Branch, Rest } from "../utils/branch.ts";
import { loopObj } from "../utils/parse.ts";
import { loadEnv, updateEnv } from "./envc.ts";

function shortcutsHelp(){
    console.log("Usage :")
    console.log("envee shortcuts - lists all the shortcuts")
    console.log("envee shortcuts add [name] [path] - adds shortcuts")
    console.log("envee shortcuts del [name] - removes shortcuts")
    console.log("")
    console.log("shortcuts are shortcuts :3 to a directory")
    console.log("you use them by typing d[name] , it is")
    console.log("recomend that shortcut path starts with / or ~/")
    console.log("in order to be directory independent")
}

function shortcutsList(rest:Rest,env=loadEnv()){//just pass instead of loading file again if u can
    if(rest.length!=0){
        console.log("typo?")
        console.log("try envee help")
        return;
    }

    console.log("Shortcuts :")
    loopObj(env.shortcuts,(k,v)=>{
        console.log(k+"="+v)        
    })
}

function shortcutsAdd(rest:Rest){
    updateEnv((env)=>{
        env.shortcuts[rest[0]] = rest.slice(1).join(" ")
        shortcutsList([],env)
        return env;
    })
}

function shortcutsDel(rest:Rest){
    updateEnv((env)=>{
        delete env.shortcuts[rest[0]]
        shortcutsList([],env)
        return env;
    })
}

export const shortcutsCommand:Branch = {
    b:{
        add:{f:shortcutsAdd},
        del:{f:shortcutsDel},
        help:{f:shortcutsHelp},
    },
    f:shortcutsList
}