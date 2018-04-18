//Obtiene los titulos y el contenido de la tabla
function getDataFromTable(){
    titles = [];
    content = [];
    getTitles();
    if(completed)
        getContent();
}

//Obtiene los titulos de la tabla, si falta alguno pone el completed a false
function getTitles(){
    completed = true;
    $("th input").each(function(index, elem) {
        let value = $(elem).val().trim();
        if(value.length === 0)
            completed = false;
        titles.push(value);
    });
}

//Obtiene el contenido de la tabla, si falta alguno pone el completed a false
function getContent(){
    $("td input").each(function(index, elem) {
        let value = $(elem).val().trim().toLowerCase();
        if(value.length === 0)
            completed = false;
        content.push(value);
    });
}

//Establece los valores de titulo a la tabla:
    //Si se lee de fichero
    //Si se crea vacia con X filas e Y columnas
    function setTableTitle(columns, data) {
        let headerHead = $("<thead></thead>")
        if (data) {   //leido desde archivo
            for (let i = 0; i < columns; i++) {
                let header = $("<th></th>");
                header.addClass("cell");
                let text = $("<input type=text placeholder=Titulo>");
                text.change(() =>{
                    changes = true;
                })
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
    
    //Establece los valores del contenido a la tabla:
        //Si se lee de fichero
        //Si se crea vacia con X filas e Y columnas
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