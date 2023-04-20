/*function calculateEntropy(data) {
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
function informationGain(data, attributeIndex) {
    const attributeValues = new Set();
    for (let i = 0; i < data.length; i++) {
      attributeValues.add(data[i][attributeIndex]);
    }
    let gain = entropy(data);
    for (const value of attributeValues) {
      const subset = data.filter(row => row[attributeIndex] === value);
      gain -= subset.length / data.length * entropy(subset);
    }
    return gain;
}*/
function buildDecisionTree(data, features) {
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
    function calculateInformationGain1(data, featureIndex, leftData, rightData) {
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
            const infoGain = calculateInformationGain1(data, featureIndex, leftData, rightData);
            if (infoGain > bestInfoGain) {
            bestThreshold = threshold;
            bestInfoGain = infoGain;
            }
        }
        return bestThreshold;
    } 
    // Проверяем, что все элементы в данных имеют одинаковый класс
    
    if (data.every((item) => item[item.length - 1] === data[0][data[0].length - 1])) {
        return { value: data[0][data[0].length - 1]};
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
        //this.treeFeatures.push(bestFeatureIndex);
    }
    
    
    // Создаем узел дерева с выбранным признаком
    const tree = { featureIndex: bestFeatureIndex, children: [] };
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
            const subtree = this.buildDecisionTree(newData, newFeatures);
            tree.children.push({ value: value, subtree: subtree, trueValue: value, isRed: false });
        });
    }
    
    return tree;
}
let data1 = [
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
]

let tree = buildDecisionTree(data1, [0,1,2,3,4]);
console.log(tree);
console.log(tree.children);
console.log(tree.children[0]);
console.log(tree.children[1]);
console.log(tree.children[0].subtree);
console.log(tree.children[1].subtree);
console.log(tree.children[0].subtree.children[0]);
console.log(tree.children[0].subtree.children[1]);
console.log(tree.children[1].subtree.children[0]);
console.log(tree.children[1].subtree.children[1].subtree);
console.log(tree.children[0].subtree.children[0].subtree);
console.log(tree.children[0].subtree.children[1].subtree);
console.log(tree.children[1].subtree.children[0].subtree);
console.log(tree.children[1].subtree.children[1].subtree);