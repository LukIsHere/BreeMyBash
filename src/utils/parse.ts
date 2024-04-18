export function parserInt(str:string){
    const num = Number(str);
    
    if(isNaN(num))
        throw str+" is not a number";

    if(!isFinite(num))
        throw str+" is a stupid number";

    // if(!(num%1))
    //     throw str+" kinda sucks"

    return num;
}

export function fillter(arr:string[]){
    if(!Array.isArray(arr))
        throw "filtering error"
    return arr.filter(a=>{return typeof(a)==="string"}) as string[];
}

export function crossOut(text:string){
    let out = "";
    for(let i = 0;i<text.length;i++){
        out += "\u0336" + text[i];
    }

    return out;
}

export function loopObj<T>(obj:{[key:string]:T},func:(k:string,v:T)=>void){
    Object.keys(obj).forEach(k=>{
        func(k,obj[k]);
    })
}

//for the future?
// const colorTable = {
//     "Default":		    ["\x1b[39m",		"\x1b[49m"],	
//     "Black":		    ["\x1b[30m",		"\x1b[40m"],
//     "DarkRed":		    ["\x1b[31m",		"\x1b[41m"],
//     "DarkGreen":		["\x1b[32m",		"\x1b[42m"],	
//     "DarkYellow":		["\x1b[33m",		"\x1b[43m"],
//     "DarkBlue":		["\x1b[34m",		"\x1b[44m"],
//     "DarkMagenta":	    ["\x1b[35m",		"\x1b[45m"],
//     "DarkCyan":		["\x1b[36m",		"\x1b[46m"],	
//     "LightGray":		["\x1b[37m",		"\x1b[47m"],
//     "DarkGray":		["\x1b[90m",		"\x1b[100m"],	
//     "Red":		        ["\x1b[91m",		"\x1b[101m"],	
//     "Green":		    ["\x1b[92m",		"\x1b[101m"],	
//     "Orange":		    ["\x1b[93m",		"\x1b[103m"],	
//     "Blue":		        ["\x1b[94m",		"\x1b[104m"],
//     "Magenta":		    ["\x1b[95m",		"\x1b[105m"],	
//     "Cyan":		        ["\x1b[96m",		"\x1b[106m"],
//     "White":		    ["\x1b[97m",		"\x1b[107m"]
// }
// type ctable = typeof colorTable

// export function getColor(c:keyof(ctable)):string{
//     return colorTable[c][0];
// }
// export function getBackground(c:keyof(ctable)):string{
//     return colorTable[c][1];
// }
// export function getClear(){
//     return getColor("Default")+getBackground("Default")
// }
