$(() => {
    $("#fill").on("click", readFiles);
    $("#generateTable").on("click", createEmptyTable);
    $("#resultado").hide();
    $("#resBtn").on("click", showHideResult);
    $("#plusRBtn").on("click", addRow);
    $("#plusCBtn").on("click", addColumn);
    $("#minRBtn").on("click", delRow);
    $("#minCBtn").on("click", delColumn);
    $("#queryBtn").on("click", queryResult);
    createEmptyTable();
})

let titles;
let content;
let changes = true;
let completed = false;
let alg = null;

function readFiles(event) {
    let file1 = $("#file1").prop("files")[0];
    let ext1 = file1.name.split(".")[file1.name.split(".").length - 1];
    let file2 = $("#file2").prop("files")[0];
    let ext2 = file2.name.split(".")[file2.name.split(".").length - 1];
    if (String(ext1).toLowerCase() !== "txt" || String(ext2).toLowerCase() !== "txt")
        alert("Introduzca sólo archivos .txt");
    else {
        changes = true;
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


function parse(text) {
    text= text.trim();
    text = text.replace(/(\r\n|\n|\r)/gm, ":");
    let split = text.split(":");
    let result = [];
    split.forEach(element => {
        if (element.length > 0){
            let data = element.split(",");
            data.forEach((d, index) => data[index] = d.trim());
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
    getDataFromTable();
    if (!div.is(":visible")) {
        if(!completed)
            alert("No hay datos");
        else {
            if(changes){
                alg = new Algorithm(titles, content);
                changes = false;
            }
            div.show();
            div.prop("display", "visible");
            $("#resBtn").text("Cerrar").removeClass("btn-primary").addClass("btn-secondary");
            setLabelsAndInputs();

        }
    }
    else {
        div.hide();
        div.prop("display", "visible");
        $("#resBtn").text("Resultado").removeClass("btn-secondary").addClass("btn-primary");
        removeLabelsAndInputs();
    }
}


function setLabelsAndInputs(){
    let button = $("#queryBtn");
    for(let i = 0; i < titles.length - 1; i++){
        let div = $("<div></div>");
        div.addClass("queryDiv");
        let label = $("<label></label>");
        let input = $("<input type=text placeholder=Respuesta>");
        label.text(titles[i]);
        div.append(label);
        div.append(input);
        button.before(div);
    }
}


function removeLabelsAndInputs(){
    $(".queryDiv").each(function(index, item){
        $(item).remove();
    });
}


function queryResult(){
    let data = {};
    $(".queryDiv input").each(function(index, item){
        data[titles[index]] = $(item).val().toLowerCase().trim();
    });
    alert(alg.getResultFromData(data));
}