// Генерация случайных точек
function generateRandomPoints(numPoints) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    points.push({ x, y });
  }
  return points;
}

// Расчет расстояния между двумя точками
function distance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Инициализация центроидов
function initCentroids(points, numClusters) {
  const centroids = [];
  for (let i = 0; i < numClusters; i++) {
    centroids.push(points[Math.floor(Math.random() * points.length)]);
  }
  return centroids;
}

// Кластеризация по алгоритму к-средних
function kMeansClustering(points, numClusters) {
  let centroids = initCentroids(points, numClusters);
  let clusters = [];
  let iterations = 0;
  
  while (true) {
    // Создание пустых кластеров
    for (let i = 0; i < numClusters; i++) {
      clusters[i] = [];
    }

    // Распределение точек по кластерам
    for (let i = 0; i < points.length; i++) {
      let minDistance = Infinity;
      let closestCluster = null;
      for (let j = 0; j < centroids.length; j++) {
        const d = distance(points[i], centroids[j]);
        if (d < minDistance) {
          minDistance = d;
          closestCluster = j;
        }
      }
      clusters[closestCluster].push(points[i]);
    }

    // Пересчет центроидов
    let newCentroids = [];
    for (let i = 0; i < numClusters; i++) {
      if (clusters[i].length > 0) {
        const sumX = clusters[i].reduce((acc, point) => acc + point.x, 0);
        const sumY = clusters[i].reduce((acc, point) => acc + point.y, 0);
        const centroidX = sumX / clusters[i].length;
        const centroidY = sumY / clusters[i].length;
        newCentroids.push({ x: centroidX, y: centroidY });
      } else {
        newCentroids.push(centroids[i]);
      }
    }

    // Проверка на завершение алгоритма
    iterations++;
    if (iterations > 100 || JSON.stringify(newCentroids) === JSON.stringify(centroids)) {
      break;
    }
    centroids = newCentroids;
  }

  return clusters;
}

// Пример использования
const points = generateRandomPoints(100);
let clusters = kMeansClustering(points, 2);
console.log(clusters[0].length);
