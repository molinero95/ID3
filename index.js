$(() =>{
    $("#fill").on("click", readFiles);
    $("#generateTable").on("click", createEmptyTable);
    $("#resultado").hide();
    $("#resBtn").on("click", showHideResult);
    createEmptyTable();
})

function readFiles(event){
    let file1 = $("#file1").prop("files")[0];
    let ext1 = file1.name.split(".")[file1.name.split(".").length - 1];
    let file2 = $("#file2").prop("files")[0];
    let ext2 = file2.name.split(".")[file2.name.split(".").length - 1];
    if(String(ext1).toLowerCase() !== "txt" || String(ext2).toLowerCase() !== "txt")
        alert("Introduzca sólo archivos .txt");
    else{
        let fr = new FileReader();
        //CUIDADO AQUI con el titulo. Comprobar que las columnas coinciden con los titulos
        let titlesStr;
        let contentStr;
        fr.readAsText(file1);
        fr.onload = function(){
            titlesStr = this.result;
            fr.readAsText(file2);
            fr.onload = function(){
                contentStr = this.result;
                let titles = parse(titlesStr);
                let content = parse(contentStr);
                console.log(titles);
                console.log(content);
                if(checkIfCorrect(titles, content)){
                    createTableFromFile(titles, content);
                }
                else{
                    alert("Error, los ficheros no son correctos, compruebe los datos");
                }
            }
        }
        
    }
    //fr.readAsText()
}

function createEmptyTable() {
    let rows = Number($("#rows").val());
    let cols = Number($("#cols").val());
    if(isNaN(rows) || isNaN(cols) || rows === 0 || cols === 0)
        alert("Introduzca los datos correctamente");
    else{
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
    if(isNaN(rows) || isNaN(cols) || rows === 0 || cols === 0)
        alert("Introduzca los datos correctamente");
    else{
        $("table").remove();
        $("#tableC").append("<table></table>");
        $("table").addClass("table table-condensed");
        setTableTitle(cols, titles);
        setTableData(rows, cols, content);
    }
}



function setTableTitle(columns, data){
    let headerHead = $("<thead></thead>")
    if(data){   //leido desde archivo
        for(let i = 0; i < columns; i++){
            let header = $("<th></th>");
            header.addClass("cell");
            let text = $("<input type=text placeholder=titulo>");
            text.addClass("tableTitle");
            text.val(data[i]); 
            header.append(text);
            headerHead.append(header);
        }
    }
    else{   //creado a mano
        for(let i = 0; i < columns; i++){
            let header = $("<th></th>");
            header.addClass("cell");
            let text = $("<input type=text placeholder=titulo>");
            text.addClass("tableTitle");
            header.append(text);
            headerHead.append(header);
        }
    }
    $("table").append(headerHead);

}

function setTableData(rows, columns, data){
    if(data){
        for(let i = 0; i < rows - 1; i++){
            let headerRow = $("<tr></tr>");
            headerRow.addClass("tableRow");
            for(let j = 0; j < columns; j++){
                let cell = $("<td></td>");
                cell.addClass("cell");
                let text = $("<input type=text placeholder=dato>");
                text.val(data[i*j + j]);
                cell.append(text);
                headerRow.append(cell);
            }
            $("table").append(headerRow);
        }
    }
    else{
        for(let i = 0; i < rows - 1; i++){
            let headerRow = $("<tr></tr>");
            headerRow.addClass("tableRow");
            for(let j = 0; j < columns; j++){
                let cell = $("<td></td>");
                cell.addClass("cell");
                let text = $("<input type=text placeholder=dato>");
                cell.append(text);
                headerRow.append(cell);
            }
            $("table").append(headerRow);
        }
    }

}


function parse(text){
    text = text.replace(/(\r\n|\n|\r)/gm,":");
    let split = text.split(":");
    let result = [];
    split.forEach(element => {
        if(element.length > 0) result = result.concat(element.split(","));
    });
    /*split.forEach((element, index) => {
        split[index] = element.replace(/(\r\n|\n|\r)/gm,"");
    });*/
    return result;
}


function checkIfCorrect(title, content) {
    if(content.length % title.length === 0)
        return true;
    return false;
}
function showHideResult(){
    let div = $("#resultado");
    console.log(div);
    if(!div.is(":visible")){
        div.show();
        div.prop("display", "visible");
    }
    else{
        div.hide();
        div.prop("display", "visible");

    }
}