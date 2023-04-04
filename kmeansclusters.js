
function generateRandomPoints(numPoints) {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const x = Math.floor(Math.random() * 100);
      const y = Math.floor(Math.random() * 100);
      points.push({ x, y });
    }
    return points;
  }

  let points = generateRandomPoints(100);


            function distance(point1, point2) {
            const dx = point1.x - point2.x;
            const dy = point1.y - point2.y;
            return Math.sqrt(dx * dx + dy * dy);
            }

            function initMedoids(points, numClusters) {
                const medoids = [];
                for (let i = 0; i < numClusters; i++) {
                  let randomIndex = Math.floor(Math.random() * points.length);
                  while (medoids.includes(points[randomIndex])) {
                    randomIndex = Math.floor(Math.random() * points.length);
                  }
                  medoids.push(points[randomIndex]);
                }
                return medoids;
              }
            function pamClustering(points, numClusters) {
                let medoids = initMedoids(points, numClusters);
                let clusters = [];
                let iterations = 0;
              
                while (true) {
                  // Создание пустых кластеров
                  for (let i = 0; i < numClusters; i++) {
                    clusters[i] = [];
                  }
              
                  // Распределение точек по медоидам
                  for (let i = 0; i < points.length; i++) {
                    let minDistance = Infinity;
                    let closestMedoid = null;
                    for (let j = 0; j < medoids.length; j++) {
                      const d = distance(points[i], medoids[j]);
                      if (d < minDistance) {
                        minDistance = d;
                        closestMedoid = j;
                      }
                    }
                    clusters[closestMedoid].push(points[i]);
                  }
              
                  // Пересчет медоидов
                  let newMedoids = [];
                  for (let i = 0; i < numClusters; i++) {
                    const cluster = clusters[i];
                    let minDistanceSum = Infinity;
                    let newMedoid = null;
                    for (let j = 0; j < cluster.length; j++) {
                      const candidateMedoid = cluster[j];
                      const distanceSum = cluster.reduce((acc, point) => acc + distance(point, candidateMedoid), 0);
                      if (distanceSum < minDistanceSum) {
                        minDistanceSum = distanceSum;
                        newMedoid = candidateMedoid;
                      }
                    }
                    newMedoids.push(newMedoid);
                  }
              
                  // Проверка на завершение алгоритма
                  iterations++;
                  if (iterations > 100 || JSON.stringify(newMedoids) === JSON.stringify(medoids)) {
                    break;
                  }
                  medoids = newMedoids;
                }
                return clusters;
              }
let clusters = pamClustering(points, 3);
console.log(clusters);