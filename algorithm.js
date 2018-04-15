class Algorithm {
    //titulo: array
    //data: matriz
    constructor(titles, data) {
        this.titles = titles;
        this.colums = titles.length;
        this.resultName = this.titles[this.colums - 1];
        this.parseInitData(data);
        this.start(); 
    }

    /*
    this.parsedData =
        [
            {
                timbre: uno
                tamaño: grande
                portero: si
                clase: +
            }
            {
                timbre: varios
                tamaño: grande
                portero: no
                clase: -
            }
        ]
    */

    parseInitData(data) {
        this.parsedData = [];
        for (let i = 0; i < data.length / this.titles.length; i++) {
            //vamos a crear un array de objetos
            this.parsedData[i] = {};
            this.titles.forEach((element, index) => {
                this.parsedData[i][element] = data[i * this.colums + index];
            });
        }
        this.N = this.parsedData.length;
    }

    //Para obtener P necesitamos que sea si o sí el resultado
    //para cada fila obtenemos si si o si no y aumentamos el valor de numerador cuando corresponde y denom siempre para cada key
    getP(parsedData) {
        let p = {};
        parsedData.forEach(elem => {
            Object.keys(elem).forEach(key => {
                let value = elem[key];
                if (key !== this.resultName) {
                    if (!p[key])
                        p[key] = {};
                    if (!p[key][value]) {
                        p[key][value] = {};
                        p[key][value]["numerador"] = 0;
                        p[key][value]["denominador"] = 0;
                    }
                    if (String(elem[this.resultName]).toLowerCase() === "si" || String(elem[this.resultName]).toLowerCase() === "sí")//Si el resultado es Si
                        p[key][value]["numerador"]++;
                    p[key][value]["denominador"]++;
                }
            });
        });
        return p;
    }

    getN(p) {
        let n = {};
        Object.keys(p).forEach(elem => {
            Object.keys(p[elem]).forEach(key => {
                if (!n[elem])
                    n[elem] = {};
                n[elem][key] = {};
                n[elem][key]["numerador"] = p[elem][key]["denominador"] - p[elem][key]["numerador"];
                n[elem][key]["denominador"] = p[elem][key]["denominador"];
            });
        });
        return n;
    }

    getR(p, n) {
        let r = {};
        Object.keys(p).forEach(elem => {
            Object.keys(p[elem]).forEach(key => {
                if (!r[elem])
                    r[elem] = {};
                r[elem][key] = {};
                r[elem][key]["numerador"] = p[elem][key]["numerador"] + n[elem][key]["numerador"];
                r[elem][key]["denominador"] = this.N;
            });
        });
        return r;
    }

    infor(p, n) {   //falta separar por num y denom
        if(p === 0)
            p = 1;
        if(n === 0)
            n = 1;
        return -p * Math.log2(p) - n * Math.log2(n);
    }

    //sum(ri * infor(pi,ni))
    getMerit(rs, ps, ns) {
        let result = 0;
        Object.keys(rs).forEach(key => {    //rs, ps y ns comparten claves
            result += rs[key]["numerador"] / rs[key]["denominador"] *
                this.infor(ps[key]["numerador"] / ps[key]["denominador"], ns[key]["numerador"] / ns[key]["denominador"])
        });
        return result;
    }

    start() {
        let min = this.doID3(this.parsedData);
        let branches = this.getBranchesFromMin(min, this.parsedData);
        this.tree = this.setTree(branches, min, this.parsedData);
        let position = [];  //almacenamos las claves del arbol para llegar a rec
        let parsedData = this.checkIfRecExists(this.tree, position); 
        position = position.reverse();
        while(parsedData){
            let min = this.doID3(parsedData);
            let branches = this.getBranchesFromMin(min, parsedData);
            let treeBranch = this.setTree(branches, min, parsedData);
            this.setATreeBranchInPosition(this.tree, treeBranch, position)
            position = [];
            parsedData = this.checkIfRecExists(this.tree, position);
            position = position.reverse();
        }
        let paintTree = new Tree(this.tree);
        paintTree.paint("resultText");
    }


    doID3(parsedData){
        let p = this.getP(parsedData);
        let n = this.getN(p);
        let r = this.getR(p, n);
        let merit = {};
        let min = null;
        Object.keys(p).forEach(elem => {
            merit[elem] = this.getMerit(r[elem], p[elem], n[elem]);
            if(min === null)
                min = elem;
            else if(merit[min] > merit[elem]){
                min = elem;
            }
        });
        return min;
    }

    setATreeBranchInPosition(treePosition, treeBranch, position){
        if(position.length > 1){    //accedemos a la posicion
            let key = position.pop();
            this.setATreeBranchInPosition(treePosition[key], treeBranch, position);
        }
        else if(position.length == 1){
            let key = position.pop();
            treePosition[key] = treeBranch
        }
    }

    getBranchesFromMin(min, parsedData){
        let branches = {};
        parsedData.forEach(data => {
            let res = data[this.resultName];
            let dat = [data[min]];
            if(!branches[dat])
                branches[dat] = {};
            if(!branches[dat][res]){
                branches[dat][res] = 0;
                branches[dat][res]++;
            }
        });
        return branches;
    }

    //Vamos generando el arbol y borrando los elementos de parsedData
    //Vamos a añadir un objeto a los rec
    setTree(branches, min, parsedData){
        let res = {};
        res[min] = {};
        let keys = Object.keys(branches);
        keys.forEach((k, index) => {
            let result = Object.keys(branches[k]);
            if(result.length > 1){
                res[min][k] = {};
                res[min][k].parsedData = this.setNewParsedData(min, k, parsedData); 
                res[min][k].rec = true;
            }
            else //length == 1 -> o si o no
                res[min][k] = result[0];
            
        });
        return res;
    }

    setNewParsedData(key, value, parsedData){
        let result = [];
        parsedData.forEach((data, index) => {
            if(data[key] === value){
                let dataKeys = Object.keys(data);
                let pushThis = {};
                dataKeys.forEach(dataKey => {
                    if(dataKey !== key)
                        pushThis[dataKey] = data[dataKey];
                })
                result.push(pushThis);
            }
        });
        return result;
    }

    //Recorremos el arbol, y para quellos que tengan el atributo rec a true devolvemos los datos preparados
    checkIfRecExists(object, position){
        if(typeof(object) !== "object")
            return false;
        else{
            let keys = Object.keys(object);
            let i = 0;
            let found = false;
            while(i < keys.length && !found) {
                let item = object[keys[i]];
                if(item.rec){
                    position.push(keys[i]);
                    found = this.getDataFromObject(item);
                    item.rec = false;
                }
                else{
                    position.push(keys[i]);
                    found = this.checkIfRecExists(item, position);
                    if(!found)
                        position.pop();
                }
                i++;
            }
            return found;
        }
    }

    getDataFromObject(object) {
        let keys = Object.keys(object);
        if(keys[0] === "rec")
            return object[keys[1]];
        return object[keys[0]];
    }

}

//http://bl.ocks.org/d3noob/8329447
//http://visjs.org/docs/network/