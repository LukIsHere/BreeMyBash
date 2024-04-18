import { Branch, Rest } from "../../utils/branch.ts";
import { readJSON, writeJSON } from "../../utils/filesystem.ts";
import { parserInt } from "../../utils/parse.ts";
import { crossOut } from "../../utils/parse.ts";
import { struct, validate } from "../../utils/validator.ts";

/*
this deffinetly requires rewriting
*/

type task = { name: string; done: boolean };
type taskList = { [name: string]: task[] };

const taskListStruct: struct = {
  type: "dic",
  content: {
    type: "arr",
    content: {
      type: "obj",
      keys: { name: { type: "str" }, done: { type: "bol" } }
    },
  },
};

function validateTaskList(taskList: taskList | undefined) {
  validate(taskListStruct, taskList);
  return taskList as taskList;
}

export function loadTasks(): taskList {
  try {
    return validateTaskList(readJSON<taskList>("task")); //add actuall check
  } catch (error) {
    console.error(error);
    saveTasks({});
    return {};
  }
}
function saveTasks(data: taskList) {
  writeJSON("task", data);
}
function help() {
  console.log("Usage :");
  console.log("\tbree task [command] [argument/s]");
  console.log("\tbree tasks [command] [argument/s]");
  console.log("Commands :");
  console.log("\thelp - lists all the available commands");
  console.log("\tadd [name or group:name] - adds tasks to the list");
  console.log("\tdel [index/es] - removes tasks from list");
  console.log("\tdone [index/es] - marks task/s as done");
  console.log("\tundone [index/es] - unmarks task/s as done");
  console.log("\tclear - wipes the entire tasks list");
}

function logTaskCMD() {
  logTask(loadTasks());
}
export function logTask(
  lists: taskList,
  group: string | undefined = undefined,
) {
  console.log("To-do:");
  const listNames: string[] = Object.keys(lists);
  if (listNames.length == 0) {
    console.error("no tasks");
  }

  let index = 1;

  listNames.forEach((name) => {
    if (name != "") {
      console.log("  " + name);
    }

    if (group != undefined && name != group) {
      index += lists[name].length;
      return;
    }

    lists[name].forEach((t) => {
      if (t.done) {
        console.log("\t" + index + ". " + crossOut(t.name));
      } else {
        console.log("\t" + index + ". " + t.name);
      }
      index++;
    });
  });
}

function addTask(rest: Rest) {
  let name = rest.join(" ");
  let listName: string = "";
  if (name.includes(":")) {
    listName = name.split(":")[0];
    name = name.split(":").slice(1).join(":");
  }
  const lists = loadTasks();
  if (name != "") {
    if (lists[listName] == undefined) {
      lists[listName] = [];
    }
    lists[listName].push({ "name": name, "done": false });
  } else {
    console.log("no name is a stupid name");
  }
  saveTasks(lists);
  logTask(lists);
}

function showTasks(rest: Rest) {
  if (rest.length == 0) {
    console.log("To-do");
  }

  let name: string | undefined = rest.join(" ");
  if (rest.length == 0) {
    name = undefined;
  }
  const lists = loadTasks();
  if (name == undefined || lists[name] != undefined) {
    return logTask(lists, name);
  }
  console.log("no such group");
}

function delTask(rest: Rest) {
  const nums: number[] = [];
  rest.forEach((n) => {
    nums.push(parserInt(n));
  });
  const newList: taskList = {};
  const lists = loadTasks();

  const listNames: string[] = Object.keys(lists);
  if (listNames.length == 0) {
    console.error("no tasks");
  }

  let index = 1;

  listNames.forEach((name) => {
    const arr: task[] = [];
    lists[name].forEach((task) => {
      if (!nums.includes(index)) {
        arr.push(task);
      }
      index++;
    });
    if (arr.length != 0 || name == "") { //we shouldn't remove default list or it will be out of order
      newList[name] = arr;
    }
  });

  saveTasks(newList);
  logTask(newList);
}
function doneTask(rest: Rest) {
  const nums: number[] = [];
  rest.forEach((n) => {
    nums.push(parserInt(n));
  });

  const lists = loadTasks();
  const listNames: string[] = Object.keys(lists);
  let index = 1;

  listNames.forEach((name) => {
    for (let i = 0; i < lists[name].length; i++) {
      if (nums.includes(index)) {
        lists[name][i].done = true;
      }
      index++;
    }
  });

  saveTasks(lists);
  logTask(lists);
}
function unDone(rest: Rest) {
  const nums: number[] = [];
  rest.forEach((n) => {
    nums.push(parserInt(n));
  });

  const lists = loadTasks();
  const listNames: string[] = Object.keys(lists);
  let index = 1;

  listNames.forEach((name) => {
    for (let i = 0; i < lists[name].length; i++) {
      if (nums.includes(index)) {
        lists[name][i].done = false;
      }
      index++;
    }
  });

  saveTasks(lists);
  logTask(lists);
}
function clearTasks(_rest: Rest) {
  saveTasks({});
  logTaskCMD();
}

function catcher(fun: (rest: Rest) => void) {
  return (rest: Rest) => {
    try {
      fun(rest);
    } catch (err) {
      if (typeof err == "string") {
        console.log(err);
        help();
        return;
      }
      console.log("save might be corupted : " + err);
      console.log("try running 'bree task clear' !IT WILL WIPE ALL DATA!");
    }
  };
}

export const tasks: Branch = {
  b: {
    help: {
      f: help,
    },
    show: {
      f: showTasks,
    },
    undone: {
      f: catcher(unDone),
    },
    done: {
      f: catcher(doneTask),
    },
    add: {
      f: catcher(addTask),
    },
    del: {
      f: catcher(delTask),
    },
    clear: {
      f: clearTasks,
    },
  },
  f: logTaskCMD,
};
