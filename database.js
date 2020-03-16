module.exports = (function() {
    "use strict";

    const mysql = require("mysql");
    const fs = require("fs")

    const parameters = {
        /* secret */
    };

    class MAXDatabase {
        constructor() {
        }

        open() {
            this.connection = mysql.createConnection(parameters);
            this.connection.connect();
        }

        getSubmissionResult(userId) {
            return new Promise((resolve, reject) => {
                const query = `select probId, successful from MEIJI_MAX_PROGRAM_RESULT where userId='${userId}' union select probId, successful from MEIJI_MAX_DRILL_RESULT where userId='${userId}' and probId regexp '^(30|31)$'`;
                this.connection.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    const result = results.reduce((object, row) => {
                        object[row.probId] = row.successful;
                        return object;
                    }, {});
                    resolve(result);
                });
            });
        }

        getUserData(classroom) {
            return new Promise((resolve, reject) => {
                const query = `select userId, grade, klass, attendanceNumber, userName, pos, date from MEIJI_MAX_USER_DATA where pos like '${classroom}%' and date like concat(curdate(), ' %') and hour(date) between 13 and 17`;
                this.connection.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results);
                });
            });
        }

        getProblemList(prog, section) {
            return new Promise((resolve, reject) => {
                fs.readFile("problem-list.json", "utf8", (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    const list = JSON.parse(data);
                    const result = list.reduce((object, row) => {
                        if (row.prog === prog && row.section === section) {
                            object[row.level - 1].push(row);
                        }
                        return object;
                    }, [[], [], [], [], []]);
                    resolve(result);
                });
            });
        }

        close() {
            this.connection.end();
        }
    }

    return {
        MAXDatabase
    };
})();
