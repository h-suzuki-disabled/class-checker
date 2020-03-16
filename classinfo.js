module.exports = (function() {
    "use strict";

    const { MAXDatabase } = require("./database");

    async function getClassInformation(classroom, prog, section) {
        const connection = new MAXDatabase();
        connection.open();
        const users = await connection.getUserData(classroom);
        const problems = await connection.getProblemList(prog, section);
        for (let user of users) {
            const results = await connection.getSubmissionResult(user.userId);
            user.level = getClearLevel(user, problems, results);
        }
        connection.close();
        return users;
    }

    function getClearLevel(user, problems, results) {
        let clearLevel = 0;
        for (let level of problems) {
            if (level.length === 0) {
                continue;
            }
            let flag = false;
            for (let problem of level) {
                if (!(problem.problemId in results) || !results[problem.problemId]) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                break;
            }
            clearLevel++;
        }
        return clearLevel;
    }

    return {
        getClassInformation
    }
})();
