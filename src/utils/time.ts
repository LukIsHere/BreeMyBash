export function nowTime(){
    const now = new Date;
    //console.log(now.getHours()+":"+now.getMinutes())
    const imp = {
        hour:now.getHours(),
        min:now.getMinutes(),
        weekday:now.getDay(),
        day:now.getDate(),
        month:now.getMonth()+1,//for some reason months start from 0
        year:now.getFullYear()
    }
    return imp
}