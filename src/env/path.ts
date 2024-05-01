import { delArrayIndex } from "../utils/arrayer.ts";
import { Branch, Rest } from "../utils/branch.ts";
import { parserInt } from "../utils/parse.ts";
import { loadEnv, updateEnv } from "./envc.ts";

function pathHelp(){
    console.log("Usage :")
    console.log("envee path - lists all paths")
    console.log("envee path add [command] - adds command to paths")
    console.log("Usage path del [index] - removes command from path")
    console.log("")
    console.log("path variable points to folders where binaries")
    console.log("are loacated so you don't have to type full path")
    console.log("when you a program")
}

function pathList(rest:Rest,env=loadEnv()){//just pass instead of loading file again if u can
    if(rest.length!=0){
        console.log("type?")
        console.log("try envee path help")
    }

    let index = 1;
    env.path.forEach(w=>{
        console.log(index+". "+w)
        index++;
    })
}

function pathAdd(rest:Rest){
    updateEnv((env)=>{
        env.path.push(rest.join(" "))
        pathList([],env);
        return env;
    })
}

function pathDel(rest:Rest){
    updateEnv((env)=>{
        env.path = delArrayIndex(env.path,parserInt(rest[0])-1)
        pathList([],env);
        return env;
    })
}

export const pathCommand:Branch = {
    b:{
        add:{f:pathAdd},
        del:{f:pathDel},
        help:{f:pathHelp},
    },
    f:pathList
}