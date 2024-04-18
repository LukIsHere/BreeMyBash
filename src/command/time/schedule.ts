import { readJSON, writeJSON } from "../../utils/filesystem.ts";
import { nowTime } from "../../utils/time.ts";
import { Rest } from "../../utils/branch.ts";
import { logTask } from "./tasks.ts";
import { Branch } from "../../utils/branch.ts";
import { loadTasks } from "./tasks.ts";
import { struct, validate } from "../../utils/validator.ts";

/*
this deffinetly requires rewriting
*/

type time = { hour: number; min: number };
type period = { from: time; to: time };
type event = { name: string; group?: string; at: period };
type day = event[];
type week = day[];

const timeStruct:struct = {
  type:"obj",
  keys:{
    hour:{type:"num"},
    min:{type:"num"}
  }
}

const periodStruct:struct = {
  type:"obj",
  keys:{
    from:timeStruct,
    to:timeStruct
  }
}
const eventStruct:struct = {
  type:"obj",
  keys:{
    name:{type:"str"},
    at:periodStruct
  }
}
const dayStruct:struct = {
  type:"arr",
  content:eventStruct
}
const weekStruct:struct = {
  type:"lst",
  size:7,
  content:dayStruct
}

function validateWeekStruct(w: week|undefined): week {
  validate(weekStruct,w);
  return w as week;
}

function loadSchedule(): week {
  try {
    return validateWeekStruct(readJSON<week>("schedule")); //add actuall check
  } catch {
    clearSchedule();
    return [[], [], [], [], [], [], []];
  }
}
function saveSchedule(data: week) {
  writeJSON("schedule", data);
}

function getTimeNow(): time {
  const t = nowTime();
  return { hour: t.hour, min: t.min };
}

function getDayNow(): number {
  return nowTime().weekday;
}

function clearSchedule() {
  saveSchedule([[], [], [], [], [], [], []]);
}

function toSinglieIntTime(t: time) {
  return (t.hour * 60) + t.min;
}

function sortDay(d: day) {
  return d.sort((a, b) => {
    return toSinglieIntTime(a.at.from) - toSinglieIntTime(b.at.from);
  });
}

function overLapCheck(d: day) {
  d = sortDay(d);

  for (let i = 0; i < d.length - 1; i++) {
    if (toSinglieIntTime(d[i].at.to) > toSinglieIntTime(d[i + 1].at.from)) {
      return true;
    }
  }

  return false;
}

function getDay(num: number, w: week): day { //1-7
  if (num > 7 || num < 0) {
    throw "no such day " + num;
  }

  if (w[num] == undefined) {
    w[num] = [];
  }

  return w[num];
}

function timeToString(t: time) {
  let out = "";

  if (t.hour < 10) {
    out += "0";
  }
  out += t.hour;

  out += ":";

  if (t.min < 10) {
    out += "0";
  }
  out += t.min;

  return out;
}

function eventToString(e: event) {
  return e.name + " " + timeToString(e.at.from) + "-" + timeToString(e.at.to);
}

function parseTime(arg: string) {
  const inter = arg.split(":");
  const t: time = { hour: parseInt(inter[0]), min: parseInt(inter[1]) };

  if (t.hour < 0 || t.hour > 23 || t.min < 0 || t.min > 60) {
    throw "invalid time format";
  }

  return t;
}

function logEvent(e: event) {
  console.log("\t" + eventToString(e));
  if (e.group != undefined) {
    logTask(loadTasks(), e.group);
  }
}

function eventWhen(e: event): "past" | "present" | "future" {
  const now = toSinglieIntTime(getTimeNow());

  if (now < toSinglieIntTime(e.at.from)) {
    return "future";
  }

  if (now > toSinglieIntTime(e.at.to)) {
    return "past";
  }

  return "present";
}

function validateEvent(e: event) {
  if (toSinglieIntTime(e.at.from) > toSinglieIntTime(e.at.to)) {
    throw timeToString(e.at.from) + ">" + timeToString(e.at.to);
  }
}

function getDayToday() {
  return getDay(getDayNow(), loadSchedule());
}

function nextDay(num: number) {
  if (num == 7) {
    return 1;
  }

  return num + 1;
}

function getDayTommorow() {
  return getDay(nextDay(getDayNow()), loadSchedule());
}
type relative = { now?: event; next?: event; tommorow: boolean };
function nowRelative(): relative {
  const rel: relative = { tommorow: false };

  getDayToday().forEach((e) => {
    switch (eventWhen(e)) {
      case "present":
        rel.now = e;
        break;
      case "future":
        if (rel.next == undefined) {
          rel.next = e;
        }
    }
  });
  getDayTommorow().forEach((e) => {
    if (rel.next == undefined) {
      rel.next = e;
      rel.tommorow = true;
    }
  });
  return rel;
}

function linkGroup(rest: Rest) { //[day] [index] [group]
  const day = parseInt(rest[0]);
  const index = parseInt(rest[1]);

  rest = rest.slice(2);

  const sch = loadSchedule();
  const theDay = getDay(day, sch);

  if (index >= theDay.length) {
    throw "not in scope";
  }

  theDay[index].group = rest.join(" ");

  sch[day] = theDay;
  console.log("linked");
  logEvent(theDay[index]);
  saveSchedule(sch);
}
function show(rest: Rest) { //[day] [inder]/[index]
  if (rest.length == 0) {
    throw "no index";
  }
  let day = parseInt(rest[0]);
  if (rest.length == 1) {
    day = getDayNow();
    rest = rest.splice(1);
  }
  const index = parseInt(rest[0]) - 1;

  const sch = loadSchedule();
  const theDay = getDay(day, sch);

  if (sch[day].length < index) {
    logEvent(theDay[index]);
  } else {
    listAll([day.toString()]);
    throw "out of scope";
  }
}
function unlinkGroup(rest: Rest) { //[day] [index] [group]
  const day = parseInt(rest[0]);
  const index = parseInt(rest[1]);

  rest = rest.slice(2);

  const sch = loadSchedule();
  const theDay = getDay(day, sch);

  if (index >= theDay.length) {
    throw "not in scope";
  }

  theDay[index].group = undefined;

  sch[day] = theDay;
  console.log("unlinked");
  logEvent(theDay[index]);
  saveSchedule(sch);
}
function addToSchedule(rest: Rest) { //[day] [from] [to] [group:name]
  const day = parseInt(rest[0]);
  const from = parseTime(rest[1]);
  const to = parseTime(rest[2]);
  rest = rest.slice(3);
  const r = rest.join(" ");
  let name = r;
  let group = undefined;
  if (r.includes(":")) {
    name = r.split(":")[0];

    group = r.split(":")[1];
  }

  const sch = loadSchedule();
  let d = getDay(day, sch);

  const ev: event = { name: name, group: group, at: { from: from, to: to } };
  validateEvent(ev);
  d.push(ev);

  d = sortDay(d);
  if (overLapCheck(d)) {
    throw "this event overlaps existing event";
  }
  sch[day] = d;

  saveSchedule(sch);
}
function listAll(rest: Rest = []) { //[day(today)]
  let day = getDayNow();
  if (rest.length != 0) {
    day = parseInt(rest[0]);
  }

  const theDay = getDay(day, loadSchedule());
  if (theDay.length == 0) {
    console.log("nothing");
  }

  for (let i = 0; i < theDay.length; i++) {
    console.log((i + 1) + ". " + eventToString(theDay[i]));
  }
}
function state() {
  const rel = nowRelative();
  //console.log(timeToString(getTimeNow()));

  console.log("Now:");
  if (rel.now != undefined) {
    logEvent(rel.now);
  } else {
    console.log("\tnothing right now");
  }
  console.log("Next:");
  if (rel.next != undefined) {
    if (rel.tommorow) {
      console.log("\t(tommorow) " + eventToString(rel.next));
    } else {
      console.log(eventToString(rel.next));
    }
  } else {
    console.log("\tnothing soon");
  }
}
function today() {
  console.log("Plan:");
  const day = getDayToday();
  day.forEach((e, i) => {
    if (eventWhen(e) == "present") {
      console.log("\t" + (i + 1) + ". " + eventToString(e) + " (now)");
    }
    console.log("\t" + (i + 1) + ". " + eventToString(e));
  });
}
function removeFromSchedule(rest: Rest) { //[day] [index]
  const day = parseInt(rest[0]);
  const index = parseInt(rest[1]) - 1;
  const sch = loadSchedule();
  const oldDay = getDay(day, sch);
  const newDay: event[] = [];
  for (let i = 0; i < oldDay.length; i++) {
    if (index == i) {
      continue;
    }
    newDay.push(oldDay[i]);
  }
  sch[day] = newDay;

  saveSchedule(sch);
  listAll();
}

function cacher(f: (rest: Rest) => void): (rest: Rest) => void {
  return (rest: Rest) => {
    try {
      f(rest);
    } catch (err) {
      if (typeof err == "string") {
        console.log(err);
        help();
      } else {
        console.log(err);
      }
    }
  };
}

function help() {
  console.log("Usage :");
  console.log("\tbree plan - current and next event");
  console.log("\tbree plan [command] [argument/s]");
  console.log("Commands :");
  console.log("\thelp - lists all the available commands");
  console.log("\tlist [day?] - lists all day events");
  console.log("\ttoday - all events today");
  console.log("\tshow [day?] [index] - shows event and linked tasks");
  console.log("\tadd [day] [time start] [time end] [group:name] - adds event");
  console.log("\tadd [day] [time start] [time end] [name] - adds event");
  console.log("\tlink [day] [index] [grout] - add group");
  console.log("\tunlink [day] [index] - remove group");
  console.log("\tclear - wipes data");
  console.log("Types :");
  console.log("\tday : 1-7");
  console.log("\ttime : hour:min");
  console.log("? - optional");
}

export const schedule: Branch = {
  f: cacher(state),
  b: {
    help: {
      f: help,
    },
    del: {
      f: cacher(removeFromSchedule),
    },
    add: {
      f: cacher(addToSchedule),
    },
    list: {
      f: cacher(listAll),
    },
    link: {
      f: cacher(linkGroup),
    },
    unlink: {
      f: cacher(unlinkGroup),
    },
    show: {
      f: cacher(show),
    },
    clear: {
      f: clearSchedule,
    },
    today: {
      f: cacher(today),
    },
  },
};
