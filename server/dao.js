'use strict';
const sqlite = require('sqlite3').verbose();
const moment = require('moment');
const db = new sqlite.Database('./db/exam1-car-rental.sqlite', (err) => { if (err) throw err; });
const bcrypt = require('bcrypt'); //used to check if decrypted and encrypted passwords are equals or not
const saltRounds = 10;

//Get all the available cars from the catalogue
exports.getCars = function () {
    return new Promise((resolve, reject) => {
        const sql = `select * from vehicles`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const cars = rows.map((e) => ({
                id: e.id,
                category: e.category,
                brand: e.brand,
                model: e.model
            }));
            resolve(cars);
        });
    });
};

//Check if provided credentials are valid or not
exports.checkPassword = function (username, plainPassword) {
    return new Promise((resolve, reject) => {
        getUserByUsername(username).then((user) => {
            // Load hash from your password DB.
            if (user) {
                bcrypt.compare(plainPassword, user.hash, function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        if (res) {
                            resolve({
                                userID: user.id,
                                name: user.username
                            });
                            return;
                        } else {
                            reject(null);
                        }
                    }
                });
            }
        }).catch((err) => { reject(err) });
    });
}

//Get the number of available cars for the given period and the vehicle id of the first available one
exports.getAvailableCars = (cat, date) => {
    return new Promise((resolve, reject) => {
        const sql =
            `
        SELECT count(*) AS available, id 
        FROM vehicles  
        WHERE category=?
        and id not in 
        (SELECT vehicle_id
        FROM Reservations R
        WHERE r.cat = ?
        AND ( (date(r.start)<=date(?) AND date(r.end)>=date(?))
        OR (date(r.start)>=date(?) AND date(r.end)<=date(?))  
        OR  (date(r.start)<=date(?) AND date(r.end)>=date(?))  )
        )
        `
        db.get(sql, [cat, cat, date[0], date[0], date[0], date[1], date[1], date[1]], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({});
            } else {
                let res = {
                    available: row.available,
                    id: row.id
                }
                resolve(res);
            }
        });
    });
}

//Get username from userID
exports.getUserById = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'select * from users where id = ?';
        db.get(sql, [user], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({});
            } else {
                const u = {
                    username: row.username,
                }
                resolve(u);
            }
        });
    });
}

//Given the username, it returns passed user rent to evaluate fidelity discount
exports.getPastRent = (user) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT count(*) as total 
        FROM Reservations 
        WHERE username=?
        AND date(end) < date()`;
        db.get(sql, [user], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({});
            } else {
                const u = {
                    total: row.total,
                }
                resolve(u);
            }
        });
    });
}

//Get user details from username, used by checkPassword (above)
const getUserByUsername = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'select * from users where username = ?';
        db.get(sql, [user], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({});
            } else {
                const u = {
                    id: row.id,
                    username: row.username,
                    hash: row.password
                }
                resolve(u);
            }
        });
    });
}

//Insert a new rent given the needed attributes 
exports.addRent = function (rent) {
    return new Promise((resolve, reject) => {
        const sql = `insert into Reservations(cat,km,n_days,start,end,age,extra_driver, extra_ins,username,vehicle_id,final_price) 
        values(?,?,?,?,?,?,?,?,?,?,?)`;
        db.all(sql, [rent.cat, rent.km, rent.n_days, rent.date[0], rent.date[1], rent.age, rent.ex_drivers, rent.ex_insurance, rent.user, rent.vehicle_id,rent.final_price], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
}

//Get the list of all the rents a user has
exports.getRent = function (user) {
    return new Promise((resolve, reject) => {
        const sql = `select * from reservations where username=?`;
        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const res = rows.map((e) => ({
                id: e.id,
                cat: e.cat,
                km: e.km,
                n_days: e.n_days,
                start: e.start,
                end: e.end,
                age: e.age,
                extra_driver: e.extra_driver,
                extra_ins: e.extra_ins,
                username: e.username,
                vehicle_id: e.vehicle_id,
                final_price: e.final_price
            }));
            resolve(res);
        });
    });
};

exports.deleteRentById = function (rentID) {
    return new Promise((resolve, reject) => {
        const sql = `delete from reservations where id =?;`;
        db.all(sql, [rentID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};