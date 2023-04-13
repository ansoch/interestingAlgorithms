<template>
     <textarea id="csv-text" v-model="csvData"></textarea>
     <div><button @click="printTree()">test</button></div>
     <div><tree-node :node="tree"></tree-node></div>
</template>

<script>
    import TreeNode from './Treenode.vue'
  export default {
    name: "TreeAlgorithm",
    components: {
        TreeNode
    },
    data() {
        return {
            csvData: '',
            data: [],
            tree: {}
        }   
    },
    methods:{
        butt(){
            console.log(this.csvData);
        },
        csvToFeatures(){
            let rows = this.csvData.split('\n');
            this.data = [];
            for(let i = 0; i < rows.length; i++){
                this.data[i] = rows[i].split(',')
            }
        },
        buildDecisionTree(data, features) {
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
            
                // вычисляем энтропию
                let entropy = 0;
                const total_count = data.length;
                for (let label in class_counts) {
                const count = class_counts[label];
                const probability = count / total_count;
                entropy -= probability * Math.log2(probability);
                }
            
                return entropy;
            }
            function calculateInformationGain(data, feature) {
                const total_entropy = calculateEntropy(data);
                
                // разбиваем данные на две группы по значению признака
                const group_1 = data.filter(row => row[feature] === 0);
                const group_2 = data.filter(row => row[feature] === 1);
            
                // вычисляем энтропию после разбиения
                const entropy_1 = calculateEntropy(group_1);
                const entropy_2 = calculateEntropy(group_2);
            
                // вычисляем взвешенную сумму энтропий
                const weight_1 = group_1.length / data.length;
                const weight_2 = group_2.length / data.length;
                const weighted_entropy = weight_1 * entropy_1 + weight_2 * entropy_2;
            
                // вычисляем информационный выигрыш
                const information_gain = total_entropy - weighted_entropy;
            
                return information_gain;
            }
            // Проверяем, что все элементы в данных имеют одинаковый класс
            if (data.every((item) => item[item.length - 1] === data[0][data[0].length - 1])) {
            return { value: data[0][data[0].length - 1] };
            }
            
            // Проверяем, что больше не осталось признаков
            if (features.length === 0) {
            const classCounts = {};
            data.forEach((item) => {
                if (!classCounts[item[item.length - 1]]) {
                classCounts[item[item.length - 1]] = 0;
                }
                classCounts[item[item.length - 1]]++;
            });
            const maxClass = Object.keys(classCounts).reduce((a, b) => classCounts[a] > classCounts[b] ? a : b);
            return { value: maxClass };
            }
            
            // Находим признак с максимальной информативностью
            let bestFeatureIndex = 0;
            let bestFeatureInfoGain = -1;
            for (let i = 0; i < features.length; i++) {
            const featureIndex = features[i];
            const infoGain = calculateInformationGain(data, featureIndex);
            if (infoGain > bestFeatureInfoGain) {
                bestFeatureIndex = featureIndex;
                bestFeatureInfoGain = infoGain;
            }
            }
            
            // Создаем узел дерева с выбранным признаком
            const tree = { featureIndex: bestFeatureIndex, children: [] };
            
            // Рекурсивно строим поддеревья для каждого значения выбранного признака
            const featureValues = new Set(data.map((item) => item[bestFeatureIndex]));
            const newFeatures = features.filter((item) => item !== bestFeatureIndex);
            featureValues.forEach((value) => {
            const newData = data.filter((item) => item[bestFeatureIndex] === value);
            const subtree = this.buildDecisionTree(newData, newFeatures);
            tree.children.push({ value: value, subtree: subtree });
            });
            
            return tree;
        },
        printTree(){
            this.csvToFeatures();
            let num = this.data[0].length;
            let features = [];
            for(let i = 0; i < num; i++){
                features.push(i);
            }
            this.tree = this.buildDecisionTree(this.data, features);
            console.log(this.tree);

        }
    }
  };
  </script>

<style></style>