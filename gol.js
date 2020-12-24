cc = 0;
dim = 10;
grid = null;

function create_grid() {
    for (var i=0; i<dim; i++) {
        var row = $("<tr id=" + i + "></tr>");
        for (var j=0; j<dim; j++) {
            var cell = $("<td id=" + i + "_" + j +"></td>").addClass("tcell");
            row.append(cell);
        }
        $('tbody').append(row);
    }
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

function grow_grid_gol() {
    ng = [];
    for (var i=0; i<dim; i++) {
        for (var j=0; j<dim; j++) {
            ret = count_neighbours(i, j);
            nc = ret[0];
            majority = ret[1];
            if (grid[i][j] == "empty") {
                if (nc == 3)
                    ng[i][j] = majority;
                else
                    ng[i][j] = "empty";
            }
            else {
                if (nc < 2 || nc > 3)
                    ng[i][j] = "empty";
                else
                    ng[i][j] = grid[i][j];
            }
        }
    }
    grid = ng;
}

function update_cell(x, y, color) {
    //console.log("Updating cell x: " + x + " and y: " + y);
    var cell = document.getElementById(x + "_" + y);
    if (cell.hasChildNodes())
        cell.removeChild(cell.children[0]);
    if (color == "red" || color == "blue") {
        var cstyle = color == "red" ? 'reddot' : 'bluedot';
        var sblk = $("<div></div>").addClass("sblock");
        var blk = $("<div></div>").addClass("block");
        blk.addClass(cstyle);
        cell.append(sblk.append(blk))
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
    console.log("Candidate Neighbours: " + JSON.stringify(neihbours));
    for (var ii in neihbours) {
        var x = neihbours[ii][0];
        var y = neihbours[ii][1];
        if (x < 0 || y < 0 || x >= dim || y >= dim)
            continue;
        console.log("Doing neighbour: " + x + " and " + y);
        var ret = count_neighbours(x, y);
        console.log("counted neighbour: " + x + " and " + y);
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
        console.log("Done neighbour: " + x + " and " + y);
    }
    grid = JSON.parse(JSON.stringify(ng));
}

function render_grid() {
    for (var i=0; i<dim; i++) {
        var row = $("<tr id=" + i + "></tr>");
        for (var j=0; j<dim; j++) {
            var cell = $("<td id=" + i + "_" + j +"></td>").addClass("tcell");
            row.append(cell);
        }
        $('tbody').append(row);
    }
}

create_grid();

$('td').click(function(event) {
    if ($(this).find("div").length) 
        return;
    
    globalThis.cc += 1;
    color = globalThis.cc % 2 == 0 ? 'reddot' : 'bluedot';

    var sblk = $("<div></div>").addClass("sblock");
    var blk = $("<div></div>").addClass("block");
    
    blk.addClass(color);
    $(this).append(sblk.append(blk));
    id = event.target.id;
    i = parseInt(id.split("_")[0]);
    j = parseInt(id.split("_")[1]);
    console.log("Clicked on i: " + i + ", j: " + j);
    parse_grid();
    //sleep for some time.
    //make graphic to show changes
    grow_grid(i, j);
    //render_grid();
});

