export function getRootPath(){
    if(Deno.env.has("breePath"))
        return Deno.env.get("breePath")+"/data"
    else
        return Deno.env.get("HOME")
}

export function readJSON<T>(name:string):T|undefined{
    try{
        const path = getRootPath()+"/"+name+".json";
        //console.log(path)
        const data = Deno.readTextFileSync(path)
        return JSON.parse(data);
    }catch(error){
        if (error instanceof Deno.errors.NotFound) {
            return undefined;
          } else {
            throw error;
          }
    }
}

export function readText(name:string):string{
    try{
        const path = getRootPath()+"/"+name;
        //console.log(path)
        const data = Deno.readTextFileSync(path)
        return data;
    }catch(error){
        if (error instanceof Deno.errors.NotFound) {
            return "";
          } else {
            throw error;
          }
    }
}

export function writeJSON<T>(name:string,data:T){
    Deno.writeTextFileSync(getRootPath()+"/"+name+".json",JSON.stringify(data, null, 4));//better json formatting
}

export function writeText(name:string,data:string){
    Deno.writeTextFileSync(getRootPath()+"/"+name,data);
}