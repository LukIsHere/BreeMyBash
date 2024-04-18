import { Branch } from "../utils/branch.ts";
import { readJSON, writeJSON, writeText } from "../utils/filesystem.ts";
import { loopObj } from "../utils/parse.ts";
import { struct, validate} from "../utils/validator.ts"
import { customCommand } from "./custom.ts";
import { hostsCommand } from "./hosts.ts";
import { pathCommand } from "./path.ts";
import { promptCommand } from "./prompt.ts";
import { shortcutsCommand } from "./shortcuts.ts";
import { welcomeCommand } from "./welcome.ts";

const envStruct:struct = {
    type:"obj",
    keys:{
        prompt:{type:"str"},
        welcome:{type:"arr",content:{type:"str"}},
        shortcuts:{type:"dic",content:{type:"str"}},
        hosts:{type:"dic",content:{type:"str"}},
        custom:{type:"dic",content:{type:"str"}},
        path:{type:"arr",content:{type:"str"}}
    }
}
export type envconf = {
    prompt:string,
    welcome:string[],
    shortcuts:{[key:string]:string},
    hosts:{[key:string]:string},
    custom:{[key:string]:string},
    path:string[]
}

export function loadEnv():envconf{
    const env = readJSON("conf") as envconf
    validate(envStruct,env)
    return env;
}

export function saveEnv(env:envconf){
    writeJSON<envconf>("conf",env)
}

export function updateEnv(func:(env:envconf)=>envconf){
    saveEnv(func(loadEnv()));
    recompile();
}

export function recompile(){
    console.log("recompiling env")
    const env = readJSON("conf") as envconf
    validate(envStruct,env)
    let out = "#!/bin/bash\n#this file is edited by envee\n#any changes made manualy will be erased\n#with next recompilation\n"
    
    out += "PS1=\""+env.prompt+"\"\n"
    
    out += "#shortcuts\n"
    loopObj<string>(env.shortcuts,(k,v)=>{
        out+="alias d"+k+"=\"cd "+v+"\"\n"
    })
    out += "#hosts\n"
    loopObj<string>(env.hosts,(k,v)=>{
        out+="alias c"+k+"=\"ssh "+v+"\"\n"
    })
    out +="#custom\n"
    loopObj<string>(env.custom,(k,v)=>{
        out+="alias "+k+"=\""+v+"\"\n"
    })
    out +="#path\n"
    env.path.forEach(p=>{
        out += "addPath \"cd "+p+"\"\n"
    })
    out +="#welcome\n"
    env.welcome.forEach(cmd=>{
        out += cmd+"\n"
    })
    writeText("env.sh",out)
}

function enveeHelp(){
    console.log("for more details run :")
    console.log("envee prompt")
    console.log("envee welcome help")
    console.log("envee path help")
    console.log("envee shortcuts help")
    console.log("envee hosts help")
    console.log("envee custom help")
    console.log("comands:")
    console.log("envee recompile - regenerates the environment file")
}

export const envee:Branch = {
    b:{
        welcome:welcomeCommand,
        prompt:promptCommand,
        shortcuts:shortcutsCommand,
        path:pathCommand,
        hosts:hostsCommand,
        custom:customCommand,
        help:{f:enveeHelp},
        recompile:{f:recompile}
    },
    f:enveeHelp
}