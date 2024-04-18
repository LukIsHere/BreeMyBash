export type struct = {type:"obj",keys:{[key:string]:struct}} | {type:"dic",content:struct} | {type:"arr",content:struct} | {type:"str"} | {type:"num"} | {type:"bol"} | {type:"lst",size:number,content:struct}

function isString(obj:string){
    if(typeof obj!="string")
        throw JSON.stringify(obj)+"is not a string"
}
function isNumber(obj:string){
    if(!Number.isInteger(obj))
        throw JSON.stringify(obj)+"is not a number"
}
function isBool(obj:string){
    if(typeof obj != "boolean")
        throw JSON.stringify(obj)+"is not a bool"
}

export function validate(struct:struct,obj:any){
    switch (struct.type){
        case "obj":
            if(typeof obj != "object")
                throw JSON.stringify(obj)+" is not an object"
            if(Array.isArray(obj))
                throw JSON.stringify(obj)+" is not an object"
            //content validation
            Object.keys(struct.keys).forEach(k=>{
                if(obj[k]==undefined)
                    throw k+" is missing"
                validate(struct.keys[k],obj[k])
            })
        break;
        case "dic":
            if(typeof obj != "object")
                throw JSON.stringify(obj)+" is not an object"
            if(Array.isArray(obj))
                throw JSON.stringify(obj)+" is not an object"
            //content validation
            Object.keys(obj).forEach(k=>{
                validate(struct.content,obj[k])
            })
        break;
        case "lst":
            if(!Array.isArray(obj))
                throw JSON.stringify(obj)+" is not an array"
            if(obj.length<struct.size)
                throw JSON.stringify(obj)+" array is too small (not "+struct.size+")"
            if(obj.length>struct.size)
                throw JSON.stringify(obj)+" array is too large (not "+struct.size+")"
            obj.forEach(v=>{
                validate(struct.content,v)
            })
        break;
        case "arr":
            if(!Array.isArray(obj))
                throw JSON.stringify(obj)+" is not an array"
            obj.forEach(v=>{
                validate(struct.content,v)
            })
        break;
        case "num":
            isNumber(obj)
        break;
        case "str":
            isString(obj)
        break;
        case "bol":
            isBool(obj)
        break;
    }
}