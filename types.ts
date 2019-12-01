import NodeCache = require("node-cache")

export class Location {
    lat : number
    long : number
    streetName ?: string = null
    constructor(lat : number, long : number, streetName ?: string){
        this.lat = lat
        this.long = long
        this.streetName = streetName
    }
}

export class Passenger{
    name : string
    location : Location
    constructor(name : string, location : Location){
        this.name = name
        this.location = location
    }
}

export class Driver extends Passenger{

}

