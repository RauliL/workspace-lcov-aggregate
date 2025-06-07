import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";
import lineByLine from "n-readlines";
import { getWorkspaceInfo } from "workspace-info";

const printInfo = (message: string) =>
  process.stdout.write(`${chalk.blue(message)}\n`);

const printWarning = (message: string) =>
  process.stderr.write(`${chalk.yellow(message)}\n`);

const printError = (message: string) =>
  process.stderr.write(`${chalk.red(message)}\n`);

const processWorkspace = (
  name: string,
  location: string,
): string[] | undefined => {
  const relativePath = path.relative(process.cwd(), location);
  const lcovInfoPath = path.join(location, "coverage", "lcov.info");
  const result: string[] = [];

  if (!fs.existsSync(lcovInfoPath)) {
    printWarning(`No \`lcov.info' found for \`${name}'.`);
    return;
  }

  printInfo(`Processing \`${name}'...`);

  const lineReader = new lineByLine(lcovInfoPath);
  let lineBuffer: Buffer | false;

  while ((lineBuffer = lineReader.next())) {
    const line = lineBuffer.toString("utf-8");
    const match = /^SF:(.+)$/.exec(line);

    if (match) {
      result.push(`SF:${path.join(relativePath, match[1])}`);
    } else {
      result.push(line);
    }
  }

  return result;
};

const aggregateResults = (cwd: string, results: string[][]) => {
  const outputDir = path.join(cwd, "coverage");
  const outputFile = path.join(outputDir, "lcov.info");

  printInfo(`Creating \`${outputFile}'...`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.open(outputFile, "w", (err, fd) => {
    if (err) {
      printError(String(err));
      return;
    }

    results.forEach((lines) =>
      lines.forEach((line) => fs.writeSync(fd, `${line}\n`)),
    );
    fs.closeSync(fd);
  });
};

export const run = async () => {
  const cwd = process.cwd();
  const workspaces = await getWorkspaceInfo({ cwd });
  const names = Object.keys(workspaces);
  const results: string[][] = [];

  if (names.length === 0) {
    printError("No workspaces found.");
    process.exit(1);
  }

  for (const name of names) {
    const result = processWorkspace(name, workspaces[name].location);

    if (result) {
      results.push(result);
    }
  }

  aggregateResults(cwd, results);
  process.stdout.write(`${chalk.green("Done!")}\n`);
};
