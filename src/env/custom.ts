import { Branch, Rest } from "../utils/branch.ts";
import { loopObj } from "../utils/parse.ts";
import { loadEnv, recompile, updateEnv } from "./envc.ts";

function customHelp(){
    console.log("Usage :")
    console.log("envee custom - lists all the customs")
    console.log("envee custom add [name] [path] - adds custom")
    console.log("envee custom del [name] - removes custom")
    console.log("")
    console.log("custom is a simple way of creating alias'es")
    console.log("simply replacing <some long command> with [name]")
}

function customList(rest:Rest,env=loadEnv()){//just pass instead of loading file again if u can
    if(rest.length!=0){
        console.log("typo?")
        console.log("try envee custom help")
        return;
    }

    console.log("custom :")
    loopObj(env.custom,(k,v)=>{
        console.log(k+"="+v)        
    })
}

function customAdd(rest:Rest){
    updateEnv((env)=>{
        env.custom[rest[0]] = rest.slice(1).join(" ")
        customList([],env)
        return env;
    })
    recompile()
}

function customDel(rest:Rest){
    updateEnv((env)=>{
        delete env.custom[rest[0]]
        customList([],env)
        return env;
    })
    recompile();
}

export const customCommand:Branch = {
    b:{
        add:{f:customAdd},
        del:{f:customDel},
        help:{f:customHelp},
    },
    f:customList
}