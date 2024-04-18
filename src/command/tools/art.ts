import { Branch } from "../../utils/branch.ts";
import { readText } from "../../utils/filesystem.ts";

function artf(){
    console.log(readText("bree.art"))
}

export const art:Branch = {
    f:artf
}