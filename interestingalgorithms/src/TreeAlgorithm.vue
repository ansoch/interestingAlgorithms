<template>
    <div class="treeApp">
    <div class="panel">
     <textarea id="csv-text" v-model="csvData"></textarea>
     <div><button @click="printTree()">Сгененерировать дерево</button></div>
     <div>
     <input type="text" v-model="csvInput"> 
     </div>
     <div><button @click="printRedTree()">Сгенерировать запрос</button></div>
     </div>
     <div><tree-node :node="tree"></tree-node></div>
     </div>
</template>

<script>
    import TreeNode from './Treenode.vue'
    function calculateEntropy(data) {
        const class_counts = {};
        for (let row of data) {
        const label = row[row.length - 1];
        if (label in class_counts) {
            class_counts[label]++;
        } else {
            class_counts[label] = 1;
        }
        }
    
        let entropy = 0;
        const total_count = data.length;
        for (let label in class_counts) {
        const count = class_counts[label];
        const probability = count / total_count;
        entropy -= probability * Math.log2(probability);
        }
    
        return entropy;
    }
    //прикол
    // eslint-disable-next-line no-unused-vars
    function calculateInformationGain(data, feature) {
        const totalEntropy = calculateEntropy(data);
        
        const group_1 = data.filter(row => row[feature] === 0);
        const group_2 = data.filter(row => row[feature] === 1);
        const entropy_1 = calculateEntropy(group_1);
        const entropy_2 = calculateEntropy(group_2);
    
        const weight_1 = group_1.length / data.length;
        const weight_2 = group_2.length / data.length;
        const weightedEntropy = weight_1 * entropy_1 + weight_2 * entropy_2;
    
        const informationGain = totalEntropy - weightedEntropy;
        console.log(informationGain);
    
        return informationGain;
    }
    function calculateInformationGainSeparated(data, featureIndex, leftData, rightData) {
        const totalEntropy = calculateEntropy(data);
        const leftEntropy = calculateEntropy(leftData);
        const rightEntropy = calculateEntropy(rightData);
        const leftWeight = leftData.length / data.length;
        const rightWeight = rightData.length / data.length;
        const informationGain = totalEntropy - (leftWeight * leftEntropy) - (rightWeight * rightEntropy);
        return informationGain;
    }
    function findThreshold(data, featureIndex) {
        const values = data.map((item) => item[featureIndex]).sort();
        let bestThreshold = null;
        let bestInfoGain = -1;
        for (let i = 0; i < values.length - 1; i++) {
            const threshold = (values[i] + values[i + 1]) / 2;
            const leftData = data.filter((item) => item[featureIndex] <= threshold);
            const rightData = data.filter((item) => item[featureIndex] > threshold);
            const infoGain = calculateInformationGainSeparated(data, featureIndex, leftData, rightData);
            if (infoGain > bestInfoGain) {
            bestThreshold = threshold;
            bestInfoGain = infoGain;
            }
        }
        return bestThreshold;
    }
    export default {
    name: "TreeAlgorithm",
    components: {
        TreeNode
    },
    data() {
        return {
            csvData: '',
            data: [],
            tree: {},
            csvInput: '',
            treeFeatures: [],
            data1: [
                [5.1,3.5,1.4,0.2,'setosa'],
                [4.9,3.0,1.4,0.2,'setosa'],
                [4.7,3.2,1.3,0.2,'setosa'],
                [4.6,3.1,1.5,0.2,'setosa'],
                [5.0,3.6,1.4,0.2,'setosa'],
                [5.4,3.9,1.7,0.4,'setosa'],
                [4.6,3.4,1.4,0.3,'setosa'],
                [5.0,3.4,1.5,0.2,'setosa'],
                [4.4,2.9,1.4,0.2,'setosa'],
                [4.9,3.1,1.5,0.1,'setosa'],
                [5.4,3.7,1.5,0.2,'setosa'],
                [7.0,3.2,4.7,1.4,'versicolor'],
                [6.4,3.2,4.5,1.5,'versicolor'],
                [6.9,3.1,4.9,1.5,'versicolor'],
                [5.5,2.3,4.0,1.3,'versicolor'],
                [6.5,2.8,4.6,1.5,'versicolor'],
                [5.7,2.8,4.5,1.3,'versicolor'],
                [6.3,3.3,4.7,1.6,'versicolor'],
                [4.9,2.4,3.3,1.0,'versicolor'],
                [6.6,2.9,4.6,1.3,'versicolor'],
                [5.2,2.7,3.9,1.4,'versicolor']
            ],
            dataFeatures: []
        }   
    },
    methods:{
        csvToFeatures(){
            let rows = this.csvData.split('\n');
            this.data = [];
            for(let i = 0; i < rows.length; i++){
                this.data[i] = rows[i].split(',')
            }
            for(let i = 0; i < this.data.length; i++){
                for(let j = 0; j < this.data[i].length; j++){
                    let num = parseFloat(this.data[i][j]);
                    if(!isNaN(num)){
                        this.data[i][j] = num;
                    }
                }
            }
        },
        buildDecisionTree(data, features) { 
            const tree = { featureIndex: 0, children: [] };
            
            if (data.every((item) => item[item.length - 1] === data[0][data[0].length - 1])) {
                tree.featureIndex = data[0].length - 1;
                tree.children.push({value: data[0][data[0].length - 1], subtree: {value: data[0][data[0].length - 1]}, trueValue: data[0][data[0].length - 1], isRed: false});
                return tree;
            }
            if (features.length === 0) {
                const classCounts = {};
                data.forEach((item) => {
                    if (!classCounts[item[item.length - 1]]) {
                    classCounts[item[item.length - 1]] = 0;
                    }
                    classCounts[item[item.length - 1]]++;
                });
                const maxClass = Object.keys(classCounts).reduce((a, b) => classCounts[a] > classCounts[b] ? a : b);
                //return { value: maxClass};
                tree.featureIndex = data[0].length - 1;
                tree.children.push({value: maxClass, subtree: {value: maxClass}, trueValue: maxClass, isRed: false});
                //return { tree};
                return { value: maxClass};
            }
            
            let bestFeatureIndex = 0;
            let bestFeatureInfoGain = -1;
            for (let i = 0; i < features.length; i++) {
                const featureIndex = features[i];
                const infoGain = calculateEntropy(data, featureIndex);
                if (infoGain > bestFeatureInfoGain) {
                    bestFeatureIndex = featureIndex;
                    bestFeatureInfoGain = infoGain;
                }
            }
            tree.featureIndex = bestFeatureIndex;
            
            if (typeof(data[0][bestFeatureIndex]) === 'number'){
                //const featureValues = new Set(data.map((item) => item[bestFeatureIndex]));
                const newFeatures = features.filter((item) => item !== bestFeatureIndex);
                const threshold = findThreshold(data, bestFeatureIndex);

                const lesserData = data.filter((item) => item[bestFeatureIndex] < threshold);
                const greaterData = data.filter((item) => item[bestFeatureIndex] >= threshold);

                const lesserSubtree = this.buildDecisionTree(lesserData, newFeatures);
                const greaterSubtree = this.buildDecisionTree(greaterData, newFeatures);

                tree.children.push({ value: "<" + threshold, subtree: lesserSubtree, trueValue: threshold, isRed: false });
                tree.children.push({ value: ">=" + threshold, subtree: greaterSubtree, trueValue: threshold, isRed: false });
            }
            else{
                const featureValues = new Set(data.map((item) => item[bestFeatureIndex]));
                const newFeatures = features.filter((item) => item !== bestFeatureIndex);
                featureValues.forEach((value) => {
                    const newData = data.filter((item) => item[bestFeatureIndex] === value);
                    let subtree = {children: [], value: value};
                    if(newFeatures.length != 0) {subtree = this.buildDecisionTree(newData, newFeatures)}
                    tree.children.push({ value: value, subtree: subtree, trueValue: value, isRed: false });
                });
            }
            
            return tree;
        },
        printTree(){
            this.csvToFeatures();
            console.log(this.csvData);
            console.log(this.data);
            let num = this.data[0].length;
            let features = [];
            for(let i = 0; i < num; i++){
                features.push(i);
            }
            console.log(features);
            this.dataFeatures = features;
            this.tree = this.buildDecisionTree(this.data, features);
            console.log(this.tree);
        },
        printRedTree(){
            this.tree = this.buildDecisionTree(this.data, this.dataFeatures);
            const request = this.csvInput.split(',');
            for(let i = 0; i < request.length; i++){
                let num = parseFloat(request[i]);
                if(!isNaN(num)){
                    request[i] = num;
                }
            }
            console.log(request);

            
            let currentNode = this.tree;
            let path = [];

            let isEnd = true;
            
            while (isEnd) {
                const featureValue = request[currentNode.featureIndex];
                let nextNode;
                console.log(nextNode); 
                if(currentNode.children.length > 0){
                    if(typeof(currentNode.children[0].trueValue) === "string"){
                        for (let i = 0; i < currentNode.children.length; i++) {
                            if (currentNode.children[i].value === featureValue) {
                                nextNode = currentNode.children[i].subtree;
                                path.push(currentNode.children[i])
                                break;
                            }
                        }
                    }
                    else{
                        if(featureValue < currentNode.children[0].trueValue){
                            nextNode = currentNode.children[0].subtree;
                            path.push(currentNode.children[0])
                        }
                        else{
                            nextNode = currentNode.children[1].subtree;
                            path.push(currentNode.children[1])
                        }
                    }
                }

                if (!nextNode) {
                    break; 
                }
                if(currentNode.children[0].value === nextNode.value) break;
                currentNode = nextNode;
            }
            console.log(path);
            
            for (let i = 0; i < path.length; i++) {
                path[i].isRed = true;
                console.log('xdd');
                console.log(path[i]);
            }
            
        }
    }
  };
  </script>

<style>
textarea {
  height: 350px;
  width: 250px;
}
.treeApp{
    display: flex;
    align-items: flex-start;
    height: 100vh;
}
</style>