$(function() {
    "use strict";
    
    let classroom ="";

    $("#show").on("click", () => {
        classroom = $("#classroom").val();
        $("#map").empty();
        createMap();
    });

    const noneList = {
        "A201": ["A4", "A5", "A9", "B9", "C9", "D9", "E9", "F9", "G9", "H9", "I9"],
        "A202": ["A4", "A5", "A9", "B9", "C9", "D9", "E9", "F9", "G9", "H9", "I9"],
        "A307": ["A1", "A9", "B9", "C9"],
        "A308": ["G9", "H9", "I9"],
    };


    const $updateButton = $("#update");
    $updateButton.on("click", () => {
        $updateButton.prop("disabled", true);
        $updateButton.val("更新中です…");
        const prog = $("#prog").val();
        const section = $("#section").val();
        fetch(`/admin/classroom-map/classinfo?classroom=${classroom}&prog=${prog}&section=${section}`, {
            credentials: "same-origin"
        }).then((response) => {
            return response.json();
        }).then((users) => {
            $("#classmap-title").text(`${classroom} プログラム実習${prog} 第${section}課`);
            updateMap(users);
            $updateButton.prop("disabled", false);
            $updateButton.val("更新");
        }).catch((err) => {
            console.log(err);
            $updateButton.prop("disabled", false);
            $updateButton.val("更新");
        });
    });

    function createMap() {
        const cols = "IHGFEDCBA".split("");
        const $table = $("<table></table>");
        for (let i = 9; i > 0; i--) {
            const $row = $("<tr></tr>");
            for (let col of cols) {
                if (noneList[classroom].indexOf(`${col}${i}`) >= 0) {
                    $row.append("<td></td>");
                    continue;
                }
                const id = `${classroom}-${col}${i}`;
                $row.append(`<td id="${id}" class="absent">${id}</td>`);
            }
            $table.append($row);
        }
        const $map = $("#map");
        $map.append(`<p id="classmap-title">${classroom}</p>`);
        $map.append($table);
    }

    function updateMap(users) {
        for (let user of users) {
            const $seat = $(`#${user.pos}`);
            if (!$seat) {
                continue;
            }
            $seat.text(user.userName);
            $seat.removeClass().addClass(`level${user.level}`);
        }
    }
});
