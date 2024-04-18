import { readJSON, writeJSON } from "../../utils/filesystem.ts";
import { parserInt } from "../../utils/parse.ts";
import { nowTime } from "../../utils/time.ts";
import { Branch, Rest } from "../../utils/branch.ts";
import { struct, validate } from "../../utils/validator.ts";

/*
this deffinetly requires rewriting
*/

type day = { day: number; month?: number; year?: number };
type event = { name: string; at: day };
type cal = event[];

const calStruct:struct = {
  type:"arr",
  content:{
    type:"obj",
    keys:{
      name:{type:"str"},
      at:{
        type:"obj",
        keys:{
          day:{type:"num"}
        }
      }
    }
  }
}

function validateCal(c: cal|undefined): cal {
  validate(calStruct,c);
  return c as cal;
}

function loadCal(): cal {
  try {
    return sortCal(filterCal(validateCal(readJSON<cal>("calendar")))); //add actuall check
  } catch {
    savCal([]);
    return [];
  }
}
function savCal(data: cal) {
  writeJSON("calendar", data);
}

function getDayNow(): day {
  const now = nowTime();
  return { day: now.day, month: now.month, year: now.year };
}

function dayToInt(d: day) {
  if (d.month == undefined) {
    return d.day;
  }
  if (d.year == undefined) {
    return d.day + (d.month * 31);
  }
  return (d.day - 1) + ((d.month - 1) * 31) + (d.year * 372);
}

function filterCal(c: cal): cal {
  return c.filter((e) => {
    if (e.at.month == undefined) {
      return true;
    }
    if (e.at.year == undefined) {
      return true; //yearly events
    }
    return dayToInt(getDayNow()) - 1 < dayToInt(e.at);
  });
}

function yearPair(d: day): day { //next yearly event
  const now = getDayNow();
  const monthly = d.month == undefined;

  if (monthly) {
    d.month = now.month;
  }

  if (d.year == undefined) {
    d.year = now.year;
  }

  if (d.month == undefined) {
    throw "fk";
  }

  if (monthly && dayToInt(d) < dayToInt(now)) {
    d.month++;
  }

  if (d.month > 12) {
    d.month = 1;
  }

  if (d.year == undefined) {
    throw "fk";
  }

  if (dayToInt(d) < dayToInt(now)) {
    d.year++;
  }

  return d;
}

function sortCal(c: cal): cal {
  return c.sort((a, b) => {
    return dayToInt(yearPair(a.at)) - dayToInt(yearPair(b.at));
  });
}


function eventToString(ev: event) {
  if (ev.at.year != undefined) {
    return ev.name + " " + ev.at.day + "." + ev.at.month + "." + ev.at.year;
  }
  return ev.name + " " + ev.at.day + "." + ev.at.month;
}

function supCal() {
  const today = dayToInt(getDayNow());
  const cal = loadCal();
  const ev: event[] = [];
  let next: event | undefined = undefined;
  cal.forEach((d) => {
    if (dayToInt(d.at) == today) {
      ev.push(d);
    } else if (dayToInt(d.at) > today && next == undefined) {
      next = d;
    }
  });

  console.log("Today:");
  ev.forEach((e) => {
    console.log("\t" + e.name);
  });
  if (ev.length == 0) {
    console.log("\t" + "nothing special");
  }

  if (next != undefined) {
    console.log("Soon:");
    console.log("\t" + eventToString(next));
  }

  savCal(cal);
}

function addCal(rest: Rest) { //[monthly?/yearly?] [day] [month?] [year?] [name]
  const newDay: day = { day: 0 };

  let mv = 0;

  if (rest[0] == "yearly" || rest[0] == "monthly") {
    newDay.year = undefined;
    mv++;
  } else {
    newDay.year = parseInt(rest[3]);
  }

  if (rest[0] == "monthly") {
    newDay.month = undefined;
    mv++;
  } else {
    newDay.month = parserInt(rest[2]);
  }

  if (mv == 0) {
    newDay.day = parserInt(rest[0]);
  } else {
    newDay.day = parserInt(rest[1]);
  }

  const name = rest.slice(mv + 1).join(" ");

  const cal = loadCal();

  cal.push({ name: name, at: newDay });

  savCal(cal);
}

function delCal(rest: Rest) {
  let cal = loadCal();
  const index = parserInt(rest[0]) - 1;
  cal = cal.filter((_e, i) => {
    return i != index;
  });
  savCal(cal);
}
function listCal() {
  loadCal().forEach((e, i) => {
    console.log((1 + i) + ". " + eventToString(e));
  });
}
function clearCal() {
  savCal([]);
}

function help() {
  console.log("Usage :");
  console.log("\tbree cal - current event");
  console.log("\tbree cal [command] [argument/s]");
  console.log("Commands :");
  console.log("\thelp - lists all the available commands");
  console.log("\tsup - current event");
  console.log("\tadd [day] [month] [year] [name] - adds one time event");
  console.log("\tadd yearly [day] [month] [name] - adds every year event");
  console.log("\tadd monthly [day] [name] - adds every month event");
  console.log("\tlist - lists entire calendar");
  console.log("\tdel - removes event");
  console.log("\tclear - wipes data");
  console.log("Types :");
  console.log("\tday : 1-31");
  console.log("\tmonth : 1-12");
  console.log("\tyear : XXXX");
}

export const cal: Branch = {
  b: {
    help: {
      f: help,
    },
    sup: {
      f: supCal,
    },
    add: {
      f: addCal,
    },
    del: {
      f: delCal,
    },
    list: {
      f: listCal,
    },
    clear: {
      f: clearCal,
    },
  },
  f: supCal,
};
