import { convertFolder } from "./yml2json";
import { resolvePage } from "./page";

convertFolder("../guide", "../temp/guide", resolvePage);
