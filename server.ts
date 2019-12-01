import * as Express from "express"
import * as http from "http2"
import * as socket from "socket.io"
import * as nodeCache from "node-cache"
import { EVENT_REGISTER_SERVICE_LOCATION, EVENT_REGISTER_ME, EVENT_WHOSE_CLOSE, EVENT_CLOSE_DRIVER, EVENT_HAIL_DRIVER, EVENT_UPDATE_DRIVER_LOCATION, EVENT_PICKUP_PASSENGER, EVENT_ENTER_RIDE, EVENT_HAIL_DRIVER_2 } from "./event"
import { register_service_location, register_me_for_driver, driver_is_close, update_driver_location, whose_close, hail_driver, register_me_for_passenger, enter_ride, pickup_passenger, login, register } from "./controller"
import { AppServer } from "./util"

const app = Express()
const server = http.createServer(app)
const io = socket(server)
const passengers = io.of("/passengers")
const drivers = io.of("/drivers")
const appServer = new AppServer()
appServer.express = app
appServer.cacher = new nodeCache()
appServer.driverSpace = drivers
appServer.passengerSpace = passengers

drivers.on("connection", socket => {
    socket.on(EVENT_REGISTER_SERVICE_LOCATION, (...args) => {
        register_service_location(socket, appServer, args)
    })
    
    socket.on(EVENT_REGISTER_ME, (...args) => {
        register_me_for_driver(socket, appServer, args)
    })

    socket.on(EVENT_CLOSE_DRIVER, (...args) => {
        driver_is_close(socket, appServer, args)
    })

    socket.on(EVENT_UPDATE_DRIVER_LOCATION, (...args) => {
        update_driver_location(socket, appServer, args)
    })

    socket.on(EVENT_PICKUP_PASSENGER, (...args) => {
        pickup_passenger(socket, appServer, args)
    })

    socket.on("disconnect", () => {
        if(socket["username"]) delete socket["username"]
    })
})

passengers.on("connection", socket => {
    socket.on(EVENT_WHOSE_CLOSE, (...args) => {
        whose_close(socket, appServer, args)
    })

    socket.on(EVENT_HAIL_DRIVER, (...args) => {
        hail_driver(socket, appServer, args)
    })

    socket.on(EVENT_HAIL_DRIVER_2, (...args) => {
        // chek user account fpr money
    })

    socket.on(EVENT_REGISTER_ME, (...args) => {
        register_me_for_passenger(socket, appServer, args)
    })

    socket.on("disconnect", () => {
        if(socket["username"]) socket["username"] = null
    })

    socket.on(EVENT_ENTER_RIDE, (...args) => {
        enter_ride(socket, appServer, args)
    })
})

app.post("api/v1/register", register)

app.post("api/v1/login", login)

server.listen(3000, () => {
    console.log("iRide Server is turned on, time to fuck some requests")
})
