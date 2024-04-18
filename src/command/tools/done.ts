import { play } from "https://deno.land/x/audio@0.2.0/mod.ts";
import { Branch } from "../../utils/branch.ts";
import { getRootPath } from "../../utils/filesystem.ts";


function cdone(){
    const path =  getRootPath()+"/ringTone.ogg";
    //console.log(path)
    Deno.run({
        cmd:["paplay",path]
    }).status().then(()=>{})
}

export const done:Branch = {
    b:undefined,
    f:cdone
}