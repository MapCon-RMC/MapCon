import type { NextApiRequest } from "next";
import { Session } from "next-auth";

function PrettyOBJ(obj: object, name: string) {
    let prettyObj = `\x1b[93m${name}:\x1b[0m {`;
    if (obj && Object.keys(obj).length > 0) {
        prettyObj += '\n';
        for (const key in obj) {
            prettyObj += `\t    ${key}: ${obj[key]} \n`;
        }
        prettyObj += '\t}';
    } else {
        prettyObj += '}';
    }
    return prettyObj;
}

function LogRequest(filename, req: NextApiRequest, session: Session | Object) {
    const pathSeparator = process.platform === 'win32' ? '\\' : '/';
    const pathParts = filename.split(pathSeparator);
    const lastDir = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];
    const queryString = PrettyOBJ(req.query, 'Query');
    const bodyString = PrettyOBJ(req.body, 'Body');
    const authorString = session && 'user' in session ? PrettyOBJ((session as Session).user, 'Author') : PrettyOBJ({}, 'Author');
    const date = new Date();
    console.debug(`\x1b[92mReceived request:\x1b[0m ${date.toLocaleDateString()+" "+date.toLocaleTimeString()}
        \x1b[93mMethod:\x1b[0m ${req.method} \x1b[91mat file:\x1b[0m \x1b[4m${lastDir}/${fileName}\x1b[0m
        ${bodyString}
        ${queryString}
        ${authorString}`
    );
}

export { LogRequest };