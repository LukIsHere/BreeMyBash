import { tasks } from "./command/time/tasks.ts";
import { schedule } from "./command/time/schedule.ts";
import { encode } from "./command/tools/base.ts"
import {Branch, path} from "./utils/branch.ts"
import { cal } from "./command/time/calendar.ts";
import { done } from "./command/tools/done.ts";
import { art } from "./command/tools/art.ts";

function help(){
  console.log("Try:")
  console.log("\tbree task help")
  console.log("\tbree plan help")
  console.log("\tbree cal help")
}

const main:Branch = {
    b:{
      "help":{
        f:help
      },
      "task":tasks,
      "tasks":tasks,
      "encode":encode,
      "plan":schedule,
      "cal":cal,
      "done":done,
      "art":art
    },
    f:help
}

path(main);