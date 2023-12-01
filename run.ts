import { getYear, getDay } from "./shared";
import(`./${getYear()}/${getDay()}/code.ts`)
    .then(module=>module.default!());