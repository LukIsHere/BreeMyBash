import {Branch,Rest} from "../../utils/branch.ts"

function toBase(char:string,dic:string="bre",size:number=0){
    const l = dic.length;
    if(l==0)
        throw "fk"
    let out = "";
    let charCode = char.charCodeAt(0)-"a".charCodeAt(0);

    while(charCode||out.length<size){
        out += dic[charCode%l];
        charCode -= charCode%l;
        charCode /= l;
    }

    return out
}
function encodeText(rest:Rest){
    if(!rest)
        throw "nope";
    const text = rest.join(" ").toLowerCase();
    let out = "";
    for(let i = 0;i<text.length;i++){
        if(text[i]==" ")
            out += " ";
        else
            out += toBase(text[i],"bre",3);
    }
    console.log(out);
}
function decodeText(_rest:Rest){

} 

function printDictionary(){
    let nl = false;
    let out = "";
    for(let i = 0;i<26;i++){
        const char = String.fromCharCode("a".charCodeAt(0)+i);
        out += char + " - " + toBase(char,"bre",3)
        if(nl)
            out += "\n"
        else
            out += ", "
        nl=!nl;
    }
    console.log(out);
}

export const encode:Branch = {
    b:undefined,
    f:encodeText
}
export const decode:Branch = {
    b:undefined,
    f:decodeText
}

export const dictionary:Branch = {
    b:undefined,
    f:printDictionary
}