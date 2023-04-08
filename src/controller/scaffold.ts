import path = require("path");
import fs = require("fs");

export class Scaffold {
  pathes = [
    "../scaffold/module/controller.mustache",
    "../scaffold/module/public.mustache",
    "../scaffold/module/repository.mustache"
  ];

  addModule(name: string, targetPath: string) {
    try {
      for (const p of this.pathes) {
        const joinedPath = path.join(__dirname, p);
        const fileAsText = this.readFile(joinedPath);
        let pathToBeSavedTo = `${targetPath}`;
        const replacedText = this.replacePlaceholderWithModuleName(
          name,
          fileAsText
        );
        let fileName = this.getFileName(p)?.replace("mustache", "dart");
        if (fileName?.match("public|base")) {
          pathToBeSavedTo += `/public`;
        }
        pathToBeSavedTo += `/${fileName}`;
        this.addFileIfDoesNotExist(pathToBeSavedTo, replacedText);
      }
    } catch (e) {
      console.log(e);
    }
  }

  getFileName(path: string) {
    return path.split("/").pop();
  }

  addFileIfDoesNotExist(path: string, text: string) {
    if (!fs.existsSync(path)) {
      const fileName = this.getFileName(path);
      const pathWithoutFileName = path.replace(`/${fileName}`, "");
      if (!fs.existsSync(pathWithoutFileName)) {
        fs.mkdirSync(pathWithoutFileName);
      }
      fs.writeFileSync(path, text);
    }
  }

  readFile(path: string) {
    return fs.readFileSync(path, "utf8");
  }

  replacePlaceholderWithModuleName(moduleName: string, fileAsText: string) {
    return fileAsText.replace(/{{moduleName}}/g, `${moduleName}Controller`);
  }
}
