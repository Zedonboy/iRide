import * as crypto from "crypto"
import * as nodeCache from "node-cache"
import { Namespace } from "socket.io"
export function get_random_string(bytes ?: number) : Promise<string> {
    return new Promise((res, rej) =>{
        let buf = crypto.randomBytes(bytes ? bytes : 24)
        res(buf.toString('utf8'))
    })
}

export class AppServer{
    express : Express.Application
    cacher : nodeCache
    driverSpace : Namespace
    passengerSpace : Namespace
}