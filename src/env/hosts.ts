import { Branch, Rest } from "../utils/branch.ts";
import { loopObj } from "../utils/parse.ts";
import { loadEnv, updateEnv } from "./envc.ts";

function hostsHelp(){
    console.log("Usage :")
    console.log("envee hosts - lists all the hosts")
    console.log("envee hosts add [name] [path] - adds hosts")
    console.log("envee hosts del [name] - removes hosts")
    console.log("")
    console.log("hosts are ssh devices you connect to")
    console.log("by typing c[name]")
}

function hostsList(rest:Rest,env=loadEnv()){//just pass instead of loading file again if u can
    if(rest.length!=0){
        console.log("typo?")
        console.log("try envee hosts help")
        return;
    }

    console.log("hosts :")
    loopObj(env.hosts,(k,v)=>{
        console.log(k+"="+v)        
    })
}

function hostsAdd(rest:Rest){
    updateEnv((env)=>{
        env.hosts[rest[0]] = rest.slice(1).join(" ")
        hostsList([],env)
        return env;
    })
}

function hostsDel(rest:Rest){
    updateEnv((env)=>{
        delete env.hosts[rest[0]]
        hostsList([],env)
        return env;
    })
}

export const hostsCommand:Branch = {
    b:{
        add:{f:hostsAdd},
        del:{f:hostsDel},
        help:{f:hostsHelp},
    },
    f:hostsList
}