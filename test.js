import fs from "fs";
import archiver from "archiver";
import path from "path";
const write = fs.createWriteStream(path.join(process.cwd(), "test.gz"));
const archive = archiver("zip", { zlib: 9 });

archive.on("close", () => {
  console.log("its done my friend");
});
archive.append(fs.createReadStream(path.join(process.cwd(), "file.txt")), {
  name: "file0-or-change-this-whatever.txt"
});
archive.append(fs.createReadStream(path.join(process.cwd(), "files.txt")), {
  name: "file02-or-change-this-whatever.txt"
});
archive.pipe(write);
archive.finalize();
