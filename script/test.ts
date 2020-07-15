import { exec } from "child_process";

exec('cd ./resource && "../lib/7z" a -r guide.zip @../lib/guide && cd ..');
