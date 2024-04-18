import { delArrayIndex, downArrayIndex, upArrayIndex } from "../utils/arrayer.ts";
import { Branch, Rest } from "../utils/branch.ts";
import { parserInt } from "../utils/parse.ts";
import { loadEnv, recompile, updateEnv } from "./envc.ts";

function welcomeHelp(){
    console.log("Usage :")
    console.log("envee welcome - lists all welcome commands")
    console.log("envee welcome add [command] - adds command to welcome commands")
    console.log("envee welcome [index] - removes command from welcome commands")
    console.log("envee welcome up [index] - moves command up")
    console.log("envee welcome downa [index] - moves command down")
    console.log("")
    console.log("welcome commands are executed when you open")
    console.log("your terminal")
}

function welcomeList(rest:Rest,env=loadEnv()){//just pass instead of loading file again if u can
    if(rest.length!=0){
        console.log("typo?")
        welcomeHelp()
        return;
    }

    let index = 1;
    env.welcome.forEach(w=>{
        console.log(index+". "+w)
        index++;
    })
}

function welcomeAdd(rest:Rest){
    updateEnv((env)=>{
        env.welcome.push(rest.join(" "))
        welcomeList([],env);
        return env;
    })
    recompile();
}

function welcomeDel(rest:Rest){
    updateEnv((env)=>{
        env.welcome = delArrayIndex(env.welcome,parserInt(rest[0])-1)
        welcomeList([],env);
        return env;
    })
    recompile();
}

function welcomeUp(rest:Rest){
    updateEnv((env)=>{
        env.welcome = upArrayIndex(env.welcome,parserInt(rest[0])-1)
        welcomeList([],env);
        return env;
    })
    recompile();
}

function welcomeDown(rest:Rest){
    updateEnv((env)=>{
        env.welcome = downArrayIndex(env.welcome,parserInt(rest[0])-1)
        welcomeList([],env);
        return env;
    })
    recompile();
}

export const welcomeCommand:Branch = {
    b:{
        add:{f:welcomeAdd},
        del:{f:welcomeDel},
        down:{f:welcomeDown},
        up:{f:welcomeUp},
        help:{f:welcomeHelp},
    },
    f:welcomeList
}