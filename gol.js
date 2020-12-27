cc = 0;
dim = 8;
winning_score = 10;
grid = null;
prev = null;

function create_grid() {

    for (var i=0; i<dim; i++) {
        var row = $("<tr id=" + i + "></tr>");
        for (var j=0; j<dim; j++) {
            var cell = $("<td id=" + i + "_" + j +"></td>").addClass("tcell");
            row.append(cell);
        }
        $('tbody').append(row);
    }
    $('td').each(function() {$(this).addClass('border_blue')});
}

function initialize_grid() {
    cc = 0;
    border_color = cc % 2 == 0 ? 'border_red' : 'border_blue';
    $('td').each(function() {$(this).removeClass(border_color)});
    border_color = cc % 2 == 0 ? 'border_blue' : 'border_red';
    $('td').each(function() {$(this).addClass(border_color)});
    // wipe out dots
    for (var i=0; i<dim; i++) {
        for (var j=0; j<dim; j++) {
            update_cell(i, j, "empty");
        }
    }
    // put initial dots
    update_cell(0, 0, "blue");
    update_cell(0, 1, "blue");
    update_cell(1, 0, "blue");
    update_cell(1, 1, "blue");

    update_cell(dim-1, dim-1, "blue");
    update_cell(dim-1, dim-2, "blue");
    update_cell(dim-2, dim-1, "blue");
    update_cell(dim-2, dim-2, "blue");

    update_cell(0, dim-1, "red");
    update_cell(0, dim-2, "red");
    update_cell(1, dim-1, "red");
    update_cell(1, dim-2, "red");

    update_cell(dim-1, 0, "red");
    update_cell(dim-2, 0, "red");
    update_cell(dim-1, 1, "red");
    update_cell(dim-2, 1, "red");

    parse_grid();
    prev = JSON.stringify(grid);

    update_score();

    //$('#undo_button').click(false);
}

function parse_grid () {
    grid = [];
    for (var i=0; i<dim; i++) {
        var grid_row = []
        for (var j=0; j<dim; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (cell.hasChildNodes()) {
                grid_row.push(cell.children[0].children[0].className.split("block ")[1].split("dot")[0]);
            }
            else {
                grid_row.push("empty");
            }
        }
        grid.push(grid_row);
    }
}

function count_neighbours(i, j) {
    var count = {"blue": 0, "red": 0, "empty": 0};
    var neihbours = [
        [i, j - 1],
        [i, j + 1],
        [i - 1, j],
        [i - 1, j - 1],
        [i - 1, j + 1],
        [i + 1, j],
        [i + 1, j - 1],
        [i + 1, j + 1]
    ];
    //console.log("Neighbours: " + JSON.stringify(neihbours));
    for (var ii in neihbours) {
        var x = neihbours[ii][0];
        var y = neihbours[ii][1];
        if (x < 0 || y < 0 || x >= dim || y >= dim)
            continue;
        //console.log("Doing neighbours: " + x + " and " + y);
        count[grid[x][y]]++;
    }
    var majority = count["blue"] > count["red"] ? "blue" : "red";
    var nc = count["blue"] + count["red"]
    //console.log("Counting neighbours done");
    return [nc, majority]
}

function update_cell(x, y, color, size='block') {
    //console.log("Updating cell x: " + x + " and y: " + y + " with: " + color);
    var cell = document.getElementById(x + "_" + y);
    if (cell.hasChildNodes())
        cell.removeChild(cell.children[0]);
    if (color != "empty") {
        var cstyle = color + "dot";
        var sblk = $("<div></div>").addClass("sblock");
        var blk = $("<div></div>").addClass(size);
        blk.addClass(cstyle);
        sblk.append(blk);
        cell.append(sblk[0]);
    }
}

function grow_grid(i, j) {
    var ng = JSON.parse(JSON.stringify(grid));
    var neihbours = [
        [i, j - 1],
        [i, j + 1],
        [i - 1, j],
        [i - 1, j - 1],
        [i - 1, j + 1],
        [i + 1, j],
        [i + 1, j - 1],
        [i + 1, j + 1]
    ];
    //console.log("Candidate Neighbours: " + JSON.stringify(neihbours));
    for (var ii in neihbours) {
        var x = neihbours[ii][0];
        var y = neihbours[ii][1];
        if (x < 0 || y < 0 || x >= dim || y >= dim)
            continue;
        //console.log("Doing neighbour: " + x + " and " + y);
        var ret = count_neighbours(x, y);
        //console.log("counted neighbour: " + x + " and " + y);
        var nc = ret[0];
        var majority = ret[1];
        if (grid[x][y] == "empty") {
            if (nc == 3)
                ng[x][y] = majority;
            else
                ng[x][y] = "empty";
        }
        else {
            if (nc < 2 || nc > 3)
                ng[x][y] = "empty";
            else
                ng[x][y] = grid[x][y];
        }
        update_cell(x, y, ng[x][y]);
        //console.log("Done neighbour: " + x + " and " + y);
    }
    grid = JSON.parse(JSON.stringify(ng));
}

function undo_grid() {
    for (var i=0; i<dim; i++) {
        for (var j=0; j<dim; j++) {
            update_cell(i, j, grid[i][j]);
        }
    }
    cc--;
    border_color = globalThis.cc % 2 == 0 ? 'border_red' : 'border_blue';
    $('td').each(function() {$(this).removeClass(border_color)});
    border_color = globalThis.cc % 2 == 0 ? 'border_blue' : 'border_red';
    $('td').each(function() {$(this).addClass(border_color)});

    update_score();
}

function update_score() {
    var count = grid.flatMap((a) => a).reduce((a, b) => { a[b] =a[b] +1; return a;}, {"blue": 0, "red": 0, "empty": 0});
    var bc = document.getElementById("bc")
    var rc = document.getElementById("rc")
    bc.innerText = count.blue;
    rc.innerText = count.red;

    if(count.blue >= winning_score)
         on_winning("Blue");
    else if (count.red >= winning_score)
        on_winning("Red");
}

function on_winning(winner) {
    confetti.start(2000);
        swal(winner +" Won the Game!", {
            buttons: {
                playAgain : "Play Again!",
                share: "Share",
            }
        })
        .then((value) => {
            switch (value) {
                case "playAgain":
                    initialize_grid();
                    //
                break;
                case "share":
                    swal("This game is stupid!", "Don't Share it!");
                    initialize_grid();
                    //
                break;
            }
        });
}

function game_desc(){
    var src = "rules.png";
    swal({
        title: "Hello World",
        text: "ehehe",
        imageUrl: "rules.png"
     });
    //swal("Rules/ description", "Game of Life Dvitiye, Do Whatever!");
}

$('#undo_button').click(() => {
    grid = JSON.parse(prev);
    undo_grid();
    //$('#undo_button').click(false);
})

create_grid();
initialize_grid();

$('td').click(function(event) {
    if ($(this).find("div").length) 
        return;
    //$('#undo_button').click("true");
    prev = JSON.stringify(grid);
    globalThis.cc += 1;
    id = event.target.id;
    i = parseInt(id.split("_")[0]);
    j = parseInt(id.split("_")[1]);
    var color = globalThis.cc % 2 == 0 ? 'red' : 'blue';
    update_cell(i, j, color);
    parse_grid();
    grow_grid(i, j);
    update_score();

    /*
    var timeout = 1000;
    setTimeout(function() {
        update_cell(i, j, "gold", "big_block");
    }, timeout);

    setTimeout(function() {
        update_cell(i, j, color);
        parse_grid();
    }, timeout);

    setTimeout(function() {
        grow_grid(i, j);
    }, timeout);
    */

    border_color = globalThis.cc % 2 == 0 ? 'border_red' : 'border_blue';
    $('td').each(function() {$(this).removeClass(border_color)});
    border_color = globalThis.cc % 2 == 0 ? 'border_blue' : 'border_red';
    $('td').each(function() {$(this).addClass(border_color)});
});

