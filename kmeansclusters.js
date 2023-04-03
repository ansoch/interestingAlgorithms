
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

            // Кластеризация по алгоритму к-средних
            function hierarchicalClustering(points, numClusters) {
                // Создание начальных кластеров из отдельных точек
                let clusters = points.map(point => [point]);

                while (clusters.length > numClusters) {
                    // Вычисление расстояний между всеми кластерами
                    let distances = [];
                    for (let i = 0; i < clusters.length; i++) {
                    for (let j = i + 1; j < clusters.length; j++) {
                        let distance1 = Math.min(...clusters[i].map(point1 => Math.min(...clusters[j].map(point2 => distance(point1, point2)))));
                        distances.push({ i, j, distance1 });
                    }
                    }

                    // Нахождение пары кластеров с наименьшим расстоянием
                    let minDistance = Math.min(...distances.map(d => d.distance1));
                    let closestClusters = distances.filter(d => d.distance1 === minDistance)[0];

                    // Объединение пары кластеров в один
                    let newCluster = [...clusters[closestClusters.i], ...clusters[closestClusters.j]];
                    clusters.splice(closestClusters.j, 1);
                    clusters.splice(closestClusters.i, 1);
                    clusters.push(newCluster);
                }

                return clusters;
            }
let clusters = hierarchicalClustering(points, 3);
console.log(clusters);