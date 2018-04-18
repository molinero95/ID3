
//Añade una fila por abajo a la tabla.
function addRow() {
    $("#rows").prop("value", Number($("#rows").val()) + 1);
    addTableRow(Number($("#cols").val()))
}
//Borra la fila inferior de la tabla
function delRow() {
    removeTableRow();
}
//Añade una columna por la derecha  a la tabla
function addColumn() {
    $("#cols").prop("value", Number($("#cols").val()) + 1);
    addTableColumn();
}
//Borra la columna a la derecha de la tabla
function delColumn() {
    removeTableColumn();
}

//Añade una fila de la tabla, sin limite
function addTableRow(columns) {
    let headerRow = $("<tr></tr>");
    for (let j = 0; j < columns; j++) {
        let cell = $("<td></td>");
        cell.addClass("cell");
        let text = $("<input type=text placeholder=Dato>");
        if(j === columns - 1)
            text= $("<input type=text placeholder=Si/No>");
        cell.append(text);
        headerRow.append(cell);
    }
    $("table").append(headerRow);
}


//Borra una fila de la tabla, hasta tener 4 en total (Incluido titulos)
function removeTableRow() {
    if (Number($("#rows").val()) > 4) {
        $("tr").last().remove();
        $("#rows").prop("value", Number($("#rows").val()) - 1);
    }
}

//Añade una columna a la tabla por la derecha, modificando la columna resultado
function addTableColumn() {
    //Añadimos cabecera
    let cell = $("<th></th>");
    $($($("thead")[0].lastChild)[0].lastChild).attr("placeholder", "Titulo");
    cell.addClass("cell");
    let text = $("<input type=text placeholder=Respuesta>");
    text.addClass("tableTitle");
    cell.append(text);
    $("thead").append(cell);
    //Añadimos el resto
    $("tr").each((ind, data) => {
        $($($(data)[0].lastChild)[0].lastChild).attr("placeholder", "Dato");
        let cell = $("<td></td>");
        cell.addClass("cell");
        let text = $("<input type=text placeholder=Si/No>");
        cell.append(text);
        $(data).append(cell);
    });
}

//Borra una columna de la tabla por la derecha, cambiando la columna de resultado a la anterior
function removeTableColumn() {
    if (Number($("#cols").val()) > 4) {
        $("#cols").prop("value", Number($("#cols").val()) - 1);
        $("th").last().remove();
        $("tr").each((ind, data) => {
            $(data.lastChild).remove();
            $($($(data)[0].lastChild)[0].lastChild).attr("placeholder", "Si/No");
        });
        $($($("thead")[0].lastChild)[0].lastChild).attr("placeholder", "Respuesta");
    }
}



//Crea la tabla vacia inicial
function createEmptyTable() {
    let rows = Number($("#rows").val());
    let cols = Number($("#cols").val());
    if (isNaN(rows) || isNaN(cols) || rows === 0 || cols === 0)
        alert("Introduzca los datos correctamente");
    else {
        titles = [];
        content = [];
        $("table").remove();
        $("#tableC").append("<table></table>");
        $("table").addClass("table table-condensed");
        setTableTitle(cols);
        setTableData(rows, cols);
    }
}

//Crea la tabla desde un fichero
function createTableFromFile(titles, content) {
    let rows = Number(content.length / titles.length + 1);  //+1 por los titulos
    let cols = Number(titles.length);
    if (isNaN(rows) || isNaN(cols) || rows === 0 || cols === 0)
        alert("Introduzca los datos correctamente");
    else {
        $("table").remove();
        $("#rows").val(rows);
        $("#cols").val(cols);
        $("#tableC").append("<table></table>");
        $("table").addClass("table table-condensed");
        setTableTitle(cols, titles);
        setTableData(rows, cols, content);
    }
}


