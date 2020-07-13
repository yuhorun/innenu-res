import { convertFolder } from "./yml2json";
import { resolvePage } from "./page";

convertFolder("../res", "../guide", resolvePage);
