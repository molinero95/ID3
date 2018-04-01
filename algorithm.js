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
    getP() {
        let p = {};
        this.parsedData.forEach(elem => {
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
        let p = this.getP(); //calculamos la p
        let n = this.getN(p);
        let r = this.getR(p, n);
        let merit = {};
        Object.keys(p).forEach(elem => {
            merit[elem] = this.getMerit(r[elem], p[elem], n[elem]);
        });
        //ahora que tenemos el merito, del menor calculamos sus ramas -> comprobamos si son todos si, o no y si 
        //tiene sis y noes recursividad
        
    }

}