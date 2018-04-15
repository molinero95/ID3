class Tree  {
    constructor(tree){
        this.counterId = 1;
        this.nodesArray = [];
        this.edgesArray = [];
        this.setTreeRec(tree);
    }


    setTreeRec(branch, parentId){
        if(!parentId){   //root
            let key = Object.keys(branch)[0];
            this.nodesArray.push({id: this.counterId, label: key, color: "#B2129A", font: {color: "white"}});
            this.counterId++;
            if(typeof(branch[key]) === "object")
                this.setTreeRec(branch[key], this.counterId - 1);
            this.nodes = new vis.DataSet(this.nodesArray);
            this.edges = new vis.DataSet(this.edgesArray);
            var container = document.getElementById('mynetwork');
        }
        else{
            let keys = Object.keys(branch);
            keys.forEach(k => {
                let counter = this.counterId;
                if(keys.length === 1)
                    this.nodesArray.push({id: this.counterId, label: k, color: "#14CCC0", font: {color: "white"}});
                else{
                    this.nodesArray.push({id: this.counterId, label: k, color: "#FFD519"});
                    if(typeof(branch[k]) === "string"){
                        this.counterId++;
                        this.nodesArray.push({id: this.counterId, label: branch[k], color: "#569fff", font: {color: "white"}});
                        this.edgesArray.push({from: counter, to: this.counterId, arrows: 'to'});
                    }

                }
                this.edgesArray.push({from: parentId, to: counter, arrows: 'to'});
                this.counterId++;
                if(typeof(branch[k]) === "object")
                    this.setTreeRec(branch[k], counter);
            });
        }
    }

    paint (ubication){
        let container = document.getElementById(ubication);
        let data = {
            nodes: this.nodes,
            edges: this.edges
        };
        let options = {
            autoResize: true
        };
        new vis.Network(container, data, options);
    }
}