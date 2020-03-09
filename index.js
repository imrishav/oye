#!/usr/bin/env node

const debounce = require("lodash.debounce");
const chokidar = require("chokidar");
const prog = require("caporal");
const fs = require("fs");
const { spawn } = require("child_process");

prog
  .version("1.0.0")
  .argument("[filename]", "Name of a File")
  .action(async ({ filename }) => {
    const name = filename || "index.js";
    try {
      await fs.promises.access(name);
    } catch (error) {
      throw new Error(`Could Not Find the ${name}`);
    }

    const start = debounce(() => {
      spawn("node", [name], { stdio: "inherit" });
    }, 100);

    chokidar
      .watch(".")
      .on("add", start)
      .on("change", start)
      .on("unlink", start);
  });

prog.parse(process.argv);
