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
    count = {"blue": 0, "red": 0, "empty": 0};
    neihbours = [
        [i, j - 1],
        [i, j + 1],
        [i - 1, j],
        [i - 1, j - 1],
        [i - 1, j + 1],
        [i + 1, j],
        [i + 1, j - 1],
        [i + 1, j + 1]
    ];
    for (var i in neihbours) {
        x = neihbours[i][0];
        y = neihbours[i][1];
        if (x < 0 || y < 0 || x >= dim || y >= dim)
            continue;
        count[grid[x][y]]++;
    }
    majority = count["blue"] > count["red"] ? "blue" : "red";
    nc = count["blue"] + count["red"]
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

$('td').click(function() {
    if ($(this).find("div").length) 
        return;
    
    globalThis.cc += 1;
    color = globalThis.cc % 2 == 0 ? 'reddot' : 'bluedot';

    var sblk = $("<div></div>").addClass("sblock");
    var blk = $("<div></div>").addClass("block");
    
    blk.addClass(color);
    $(this).append(sblk.append(blk));
    parse_grid();
    grow_grid_gol();
    render_grid();
});

