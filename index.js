const globCallback = require("glob");
const fs = require("fs").promises;
const replaceInFiles = require("replace-in-files");
const { promisify } = require("util");
const { pascalCase, paramCase, camelCase } = require("change-case");
const glob = promisify(globCallback);

const converter = pascalCase;

/**
 * parseFile
 * @comment
 */

async function parseFile(oldFilePath) {
	const filePathArray = oldFilePath.split("/");
	const oldFileName = filePathArray[filePathArray.length - 1].split(".")[0];
	if (oldFileName.match("Product")) return;
	if (oldFileName.match("Shop")) return;
	const newFileName = oldFileName + "Service";
	const newFilePath = oldFilePath.replace(oldFileName, newFileName);
	await fs.rename(oldFilePath, newFilePath);
	await replaceImportPath({ oldImportPath: oldFileName, newImportPath: newFileName });
}

/**
 * replaceImportPath
 * @comment
 */

async function replaceImportPath({ oldImportPath, newImportPath }) {
	const { paths } = await replaceInFiles({
		files: ["../../../client/src/**/*.vue", "../../../client/src/**/*.ts"],
		from: new RegExp(oldImportPath, "g"),
		to: newImportPath,
		saveOldFile: false,
		onlyFindPathsWithoutReplace: false,
	});
	return paths;
}

async function convert() {
	const files = await glob(`../../../client/src/services/**/*.ts`);
	for (file of files) {
		await parseFile(file);
	}
}

(async () => {
	await convert();
})();
