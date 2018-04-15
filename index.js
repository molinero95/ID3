$(() => {
    $("#fill").on("click", readFiles);
    $("#generateTable").on("click", createEmptyTable);
    $("#resultado").hide();
    $("#resBtn").on("click", showHideResult);
    $("#plusRBtn").on("click", addRow);
    $("#plusCBtn").on("click", addColumn);
    $("#minRBtn").on("click", delRow);
    $("#minCBtn").on("click", delColumn);
    createEmptyTable();
})

let titles;
let content;

function readFiles(event) {
    let file1 = $("#file1").prop("files")[0];
    let ext1 = file1.name.split(".")[file1.name.split(".").length - 1];
    let file2 = $("#file2").prop("files")[0];
    let ext2 = file2.name.split(".")[file2.name.split(".").length - 1];
    if (String(ext1).toLowerCase() !== "txt" || String(ext2).toLowerCase() !== "txt")
        alert("Introduzca sólo archivos .txt");
    else {
        let fr = new FileReader();
        let titlesStr;
        let contentStr;
        fr.readAsText(file1, 'ISO-8859-1');
        fr.onload = function () {
            titlesStr = this.result;
            fr.readAsText(file2, 'ISO-8859-1');
            fr.onload = function () {
                contentStr = this.result;
                titles = parse(titlesStr);
                content = parse(contentStr);
                if (checkIfCorrect(titles, content)) {
                    createTableFromFile(titles, content);
                }
                else {
                    alert("Error, los ficheros no son correctos, compruebe los datos");
                }
            }
        }

    }
}

function createEmptyTable() {
    let rows = Number($("#rows").val());
    let cols = Number($("#cols").val());
    if (isNaN(rows) || isNaN(cols) || rows === 0 || cols === 0)
        alert("Introduzca los datos correctamente");
    else {
        $("table").remove();
        $("#tableC").append("<table></table>");
        $("table").addClass("table table-condensed");
        setTableTitle(cols);
        setTableData(rows, cols);
    }
}

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

function addRow() {
    $("#rows").prop("value", Number($("#rows").val()) + 1);
    addTableRow(Number($("#cols").val()))
}
function delRow() {
    removeTableRow();
}
function addColumn() {
    $("#cols").prop("value", Number($("#cols").val()) + 1);
    addTableColumn();
}
function delColumn() {
    removeTableColumn();
}


function setTableTitle(columns, data) {
    let headerHead = $("<thead></thead>")
    if (data) {   //leido desde archivo
        for (let i = 0; i < columns; i++) {
            let header = $("<th></th>");
            header.addClass("cell");
            let text = $("<input type=text placeholder=Titulo>");
            text.addClass("tableTitle");
            text.val(data[i].trim());
            header.append(text);
            headerHead.append(header);
        }
    }
    else {   //creado a mano
        for (let i = 0; i < columns; i++) {
            let header = $("<th></th>");
            header.addClass("cell");
            let text = $("<input type=text placeholder=Titulo>");
            if(i === columns - 1)
                    text= $("<input type=text placeholder=Respuesta>");
            text.addClass("tableTitle");
            header.append(text);
            headerHead.append(header);
        }
    }
    $("table").append(headerHead);

}

function setTableData(rows, columns, data) {
    if (data) {
        for (let i = 0; i < rows - 1; i++) {
            let headerRow = $("<tr></tr>");
            headerRow.addClass("tableRow");
            for (let j = 0; j < columns; j++) {
                let cell = $("<td></td>");
                cell.addClass("cell");
                let text = $("<input type=text placeholder=Dato>");
                text.val(data[i * columns + j].trim());
                cell.append(text);
                headerRow.append(cell);
            }
            $("table").append(headerRow);
        }
    }
    else {
        for (let i = 0; i < rows - 1; i++) {
            let headerRow = $("<tr></tr>");
            headerRow.addClass("tableRow");
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
    }

}

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

function removeTableRow() {
    if (Number($("#rows").val()) > 4) {
        $("tr").last().remove();
        $("#rows").prop("value", Number($("#rows").val()) - 1);
    }
}

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


function parse(text) {
    text= text.trim();
    text = text.replace(/(\r\n|\n|\r)/gm, ":");
    let split = text.split(":");
    let result = [];
    split.forEach(element => {
        if (element.length > 0){
            let data = element.split(",");
            data.forEach((d, index) => data[index] = d.trim().replace(/\s/g,''));
            result = result.concat(data);
    }
    });
    return result;
}


function checkIfCorrect(title, content) {
    if (content.length % title.length === 0)
        return true;
    return false;
}
function showHideResult() {
    let div = $("#resultado");
    if (!div.is(":visible")) {
        if(!titles || !content)
            alert("No hay datos");
        else {
            let id3 = new Algorithm(titles, content);
            div.show();
            div.prop("display", "visible");
            $("#resBtn").text("Cerrar").removeClass("btn-primary").addClass("btn-secondary");

        }
    }
    else {
        div.hide();
        div.prop("display", "visible");
        $("#resBtn").text("Resultado").removeClass("btn-secondary").addClass("btn-primary");
    }
}