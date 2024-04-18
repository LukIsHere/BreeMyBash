export type Rest = string[]
export type Handle = (rst:Rest)=>void
export type Branch = {b?:{[key:string]:Branch}|undefined,f:Handle}

export function dummy(){
    console.error("function not implemented yet")
}

export function path(bra:Branch,args:string[]=Deno.args,pos:number=0){
    const arg = args[pos];

    if(args.length==pos){
      return bra.f(args.slice(pos))
    }

    if(!arg){
      return bra.f(args.slice(pos))
    }

    if(!bra.b){
      return bra.f(args.slice(pos))
    }

    const pat = bra.b[arg];

    if(!pat){
      return bra.f(args.slice(pos))
    }

    path(pat,args,pos+1);
}