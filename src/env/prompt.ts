import { Branch, Rest } from "../utils/branch.ts";
import { recompile, updateEnv } from "./envc.ts";

function prompt(rest:Rest){
    if(rest.length==0){
        console.log("prompt is text displayed before your command (example:user@host / $)")
        console.log("you can make your prompt here : https://bash-prompt-generator.org/")
        console.log("build-in editor comming some time into the future")
        console.log('default prompt is "\\[\\e[32;1m\\]\\u@\\h\\[\\e[0m\\] \\[\\e[94;1m\\]\\w\[\\e[0m\\] \\$"')
        console.log("run envee prompt [prompt] to change it")
        return;
    }

    updateEnv((e=>{
        e.prompt = rest.join(" ")
        return e;
    }))
    recompile();
}

export const promptCommand:Branch = {
    f:prompt    
}