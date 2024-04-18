//pls remember that indexes here start a 0 not 1 like inside the list
export function delArrayIndex<T>(arr:T[],index:number):T[]{
    const out:T[] = [];
    arr.forEach((el,i)=>{
        if(i!=index)
            out.push(el)
    })
    return out
}

export function upArrayIndex<T>(arr:T[],index:number):T[]{
    const out:T[] = [];
    const target = arr[index]
    
    if(index==0)
        return arr;

    arr.forEach((el,i)=>{
        if(index==i+1)
            out.push(target)

        if(i!=index)
            out.push(el)
    })

    return out
}

export function downArrayIndex<T>(arr:T[],index:number):T[]{
    const out:T[] = [];
    const target = arr[index]

    if(index+1==arr.length)
        return arr;

    arr.forEach((el,i)=>{
        if(i!=index)
            out.push(el)
        
        if(index==i-1)
            out.push(target)
    })

    return out
}