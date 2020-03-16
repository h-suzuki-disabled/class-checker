const express = require("express");
const { query, validationResult } = require("express-validator");
const helmet = require("helmet");
const { getClassInformation } = require("./classinfo");

const app = express();
app.use(helmet());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("/home/ubuntu/classroom-map/public/index.html");
});

app.get("/classinfo", [
        query("classroom").matches(/A20[12]|A30[78]/),
        query("prog").isInt({ min: 1, max: 2 }).toInt(),
        query("section").isInt({ min: 0, max: 12 }).toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    const classroom = req.query.classroom;
    const prog = req.query.prog;
    const section = req.query.section;
    (async function() {
        try{
            const info = await getClassInformation(classroom, prog, section);
            res.json(info);
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }
    })();
});

app.listen(3000, () => {
    console.log("listeneing on port 3000");
});
