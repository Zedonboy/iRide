import { Request, Response } from "express";
import { Socket} from "socket.io";
import * as knex from "knex";
import * as axios from "axios";

import { Passenger, Driver } from "./types";
import {
  EVENT_WHOSE_CLOSE,
  EVENT_CLOSE_DRIVER,
  EVENT_HAIL_DRIVER
} from "./event";
import { get_random_string, AppServer } from "./util";

const db = knex({
  client: "mysql",
  connection: {
    host: "",
    user: "hell",
    password: "",
    database: ""
  }
});

let driverTable = {};
let passengerTable = {};

export function register(req: Request, res: Response) {
  // validate inputs.
  let body = req.body;
}

export function login(req: Request, res: Response) {
  let body = req.body;
}

/**
 * Function used by passenger to ask which group of driver are close
 * @param socket 
 * @param app 
 * @param arg [Passenger : Passenger]
 */

export function whose_close(socket: Socket, app: AppServer, arg: any[]) {
  // call native library to get closest service points
  let room = "";
  let passenger = arg[0] as Passenger;
  app.driverSpace.to(room).emit(EVENT_WHOSE_CLOSE, passenger);
  // make a room broadcast on whos close. with locationdata as params
}

/**
 * Functions used by driver to report his close
 * @param socket 
 * @param app 
 * @param arg [price, passenger(been refered), Driver himself]
 */

export function driver_is_close(socket: Socket, app: AppServer, arg: any[]) {
  let price = arg[0];
  let passenger = arg[1] as Passenger;
  let driver = arg[2] as Driver;
  get_random_string().then(pairRef => {
    app.cacher.set(pairRef, parseInt(price), 60 * 60 * 24);
    let passengerSocket = passengerTable[passenger.name] as Socket;
    if(passengerSocket){
      passengerSocket.emit(EVENT_CLOSE_DRIVER, driver, price, pairRef);
    }
  });
}

/**
 * A function used by pasenger to hail a driver
 * @param socket 
 * @param app 
 * @param arg [driverUsername, payment_referal code, pair code to verify agreed amt, passenger]
 * @returns calls driver socket and tell it a passenger has hailed
 */

export function hail_driver(socket: Socket, app: AppServer, arg: any[]) {
  let driverName = arg[0] as string
  let refCode = arg[1] as string
  let pairCode = arg[2] as string
  let driverSoc = driverTable[driverName] as Socket;
  let passenger = arg[3] as Passenger
  if (!refCode) return;
  axios.default
    .get(`https://www.api.paystack.co/transaction/verify/${refCode}`)
    .then(resp => {
      let status = resp.data.data.status;
      let amount = resp.data.data.amount;
      if (status == "success") {
        // save ref as pair code.
        let agreedAmt = app.cacher.get(pairCode) as number
        if(agreedAmt){
          if(parseInt(amount) >= agreedAmt){
            driverSoc.emit(EVENT_HAIL_DRIVER, passenger);
            if (parseInt(amount) > agreedAmt) {
              let balance = parseInt(amount) - agreedAmt
              // save balance to user database
            }
          }
        }
      }
    });
}

/**
 * Function for maping username to a socket
 * @param socket 
 * @param app 
 * @param arg [passengerUsername]
 */

export function register_me_for_passenger(
  socket: Socket,
  app: AppServer,
  arg: any[]
) {
  let passengerName = arg[0] as string
  passengerTable[passengerName] = socket;
}

/**
 * A function to map driverUsername to Socket
 * @param socket 
 * @param app 
 * @param arg [driverUsername]
 */

export function register_me_for_driver(
  socket: Socket,
  app: AppServer,
  arg: any[]
) {
  let driverName = arg[0] as string
  driverTable[driverName] = socket;
}

/**
 * A function used to update driver location
 * @param socket 
 * @param app 
 * @param arg []
 */

export function update_driver_location(
  socket: Socket,
  app: AppServer,
  arg: any[]
) {
  // call native lib.
}

/**
 * 
 * @param socket 
 * @param app 
 * @param args []
 */

export function register_service_location(
  socket: Socket,
  app: AppServer,
  args: any[]
) {
  // call native lib
}

/**
 * 
 * @param socket 
 * @param app 
 * @param arg 
 */
export function pickup_passenger(socket: Socket, app: AppServer, arg: any[]) {
  
}

/**
 * 
 * @param socket 
 * @param app 
 * @param arg 
 */

export function enter_ride(socket: Socket, app: AppServer, arg: any[]) {
  
}
