// Получаем элемент canvas
const canvas = document.getElementById('myCanvas');
          
// Получаем контекст рисования на canvas
const ctx = canvas.getContext('2d');

// Создаем массив для хранения точек
let points = [];

// Обработчик события клика на canvas
canvas.addEventListener('click', function(event) {
 // Получаем координаты клика
 const x = event.offsetX;
 const y = event.offsetY;

 // Добавляем точку в массив
 points.push({ x, y });

 // Отрисовываем точку на canvas
 ctx.beginPath();
 ctx.arc(x, y, 15, 0, 2 * Math.PI);
 ctx.fillStyle = 'black';
 ctx.fill();
 ctx.closePath();
});
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
function kmeansclusters(points, ctx){
    let clusters = kMeansClustering(points, 3);
    console.log(clusters[0].length);
    console.log(clusters[1].length);
    console.log(clusters[2].length);
    for(let i = 0; i < clusters[0].length; i++){
        ctx.beginPath();
        ctx.arc(clusters[0][i].x, clusters[0][i].y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }
    for(let i = 0; i < clusters[1].length; i++){
        ctx.beginPath();
        ctx.arc(clusters[1][i].x, clusters[1][i].y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
    for(let i = 0; i < clusters[2].length; i++){
        ctx.beginPath();
        ctx.arc(clusters[2][i].x, clusters[2][i].y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();
    }
}
const clusterBtn = document.getElementById('kmeansButton');
clusterBtn.addEventListener('click', kmeansclusters(points, ctx));