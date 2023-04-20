data = [
  [2,'Tom',12],
  [3,'Tom',14],
  [4,'Alex',8],
  [21,'Alex',9],
  [13,'Alex',10],
  [8,'Tom',11]
]
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
function buildDecisionTree(data, features) {
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
      const subtree = buildDecisionTree(newData, newFeatures);
      tree.children.push({ value: value, subtree: subtree });
    });
    
    return tree;
}
let tree = buildDecisionTree(data, [0,1,2]);
console.log(tree);
function generateHtmlForNode(node) {
  let html = '';
  if (node.value) {
    html += `<div>${node.value}</div>`;
  } else {
    html += `<div>Feature: ${node.featureIndex}</div>`;
    node.children.forEach((child) => {
      html += `<div>Value: ${child.value}</div>`;
      html += generateHtmlForNode(child.subtree);
    });
  }
  return html;
}
generateHtmlForNode(tree);

/*
console.log(tree);
console.log(tree.children[0]);
console.log(tree.children[1]);
console.log(tree.children[0].subtree);
console.log(tree.children[1].subtree);
console.log(tree.children[0].subtree.children[0]);
console.log(tree.children[0].subtree.children[1]);
console.log(tree.children[0].subtree.children[0].subtree);
console.log(tree.children[0].subtree.children[1].subtree);
console.log(tree.children[0].subtree.children[0].subtree.children[0]);
console.log(tree.children[0].subtree.children[0].subtree.children[1]);
console.log(tree.children[0].subtree.children[0].subtree.children[2]);
console.log(tree.children[0].subtree.children[1].subtree.children[0]);
console.log(tree.children[0].subtree.children[1].subtree.children[1]);
console.log(tree.children[0]);
console.log(tree.children[1]);
console.log(tree.children[2]);
console.log(tree.children[3]);
console.log(tree.children[4]);
console.log(tree.children[5]);
console.log(tree.children[0].subtree);
console.log(tree.children[1].subtree);
console.log(tree.children[2].subtree);
console.log(tree.children[3].subtree);
console.log(tree.children[4].subtree);
console.log(tree.children[5].subtree);
*/

if (typeof data0bestFeatureIndex === 'number') {
  // Сортируем данные по значению признака
  data.sort((a, b) => abestFeatureIndex - bbestFeatureIndex);
  // Вычисляем пороговые значения
  const thresholds = ;
  for (let i = 0; i < data.length - 1; i++) {
    if (dataibestFeatureIndex !== datai + 1bestFeatureIndex) {
      thresholds.push((dataibestFeatureIndex + datai + 1bestFeatureIndex) / 2);
    }
  }
  // Рекурсивно строим поддеревья для каждого порогового значения
  thresholds.forEach((threshold) => {
    const newData = data.filter((item) => itembestFeatureIndex <= threshold);
    const subtree1 = this.buildDecisionTree(newData, newFeatures);
    const subtree2 = this.buildDecisionTree(data.filter((item) => itembestFeatureIndex > threshold), newFeatures);
    tree.children.push({ value: <= ${threshold}, subtree: subtree1, isRed: false });
    tree.children.push({ value: > ${threshold}, subtree: subtree2, isRed: false });
  });
} else {
  // Создаем узел дерева с выбранным признаком
  const tree = { featureIndex: bestFeatureIndex, children:  };
  // Рекурсивно строим поддеревья для каждого значения выбранного признака
  const featureValues = new Set(data.map((item) => itembestFeatureIndex));
  const newFeatures = features.filter((item) => item !== bestFeatureIndex);
  featureValues.forEach((value) => {
    const newData = data.filter((item) => itembestFeatureIndex === value);
    const subtree = this.buildDecisionTree(newData, newFeatures);
    tree.children.push({ value: value, subtree: subtree, isRed: false });
  });
} 