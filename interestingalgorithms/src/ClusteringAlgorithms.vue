<template>
    <div>
        <div class="app">
        <div class="canvasPanel"><div class="panel"><canvas ref="canvas" @click="draw" width="640" height="640" style="border:3px solid #404345; border-radius: 10px;"></canvas></div></div>
        <div class="buttonPanel">
        <div class="panel">
        <div class="buttons">
        <label>Число кластеров</label>
        <input type="range" min="2" max="10" v-model="numClusters">
        <button @click="drawClusters(kMeansClustering(), this.kmeansColors)">kmeans</button>
        <button @click="drawClusters(hierarchicalClustering(), this.hiersColors) ">hierarchical</button>
        <button @click="drawClusters(dbscanClustering(), this.dbscanColors, this.dbscanNumClusters)">DBSCAN</button>
        <button @click="drawComparison()">Сравнение алгоритмов</button>
        <button @click="clearPoints()">Очистить точки</button>
        </div>
        </div>
        </div>
        </div>
    </div>
</template>

<script>
export default{
    name: "ClusteringAlgorithms",
    data(){
        return {
            points: [],
            vueCanvas: null,
            colors: ['#45283c', '#663931', '#8f563b', '#df7126', '#jc3232', '#d9j066', '#696j6a', '#9bjdb7', '#306082', '#76428j'], 
            kmeansColors: ['black', 'blue', 'red', 'yellow', 'green', 'maroon', 'navy', 'lime', 'purple', 'olive'], 
            hiersColors: ['olive', 'purple', 'lime', 'navy', 'maroon', 'green', 'yellow', 'black', 'blue', 'red'], 
            dbscanColors: ['maroon', 'green', 'purple', 'red', 'olive', 'black', 'yellow', 'blue', 'navy', 'lime'],
            numClusters: 2,
            dbscanNumClusters: 3
        }
    },
    mounted(){
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        this.vueCanvas = ctx;
    },
    methods: {
        draw(event) {
            const canvas = this.$refs.canvas;
            const context = this.vueCanvas;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            for(let point of this.points){
                if(this.distance({x, y}, point) < 30) return;
            }

            context.beginPath();
            context.arc(x, y, 15, 0, 2 * Math.PI);
            context.fillStyle = 'black';
            context.fill();
            
            this.points.push({ x, y });
        }, 
        distance(point1, point2) {
            const dx = point1.x - point2.x;
            const dy = point1.y - point2.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
        initCentroids(points, numClusters) {
            const centroids = [];
            for (let i = 0; i < numClusters; i++) {
                centroids.push(points[Math.floor(Math.random() * points.length)]);
            }
            return centroids;
        },
        kMeansClustering() {
            /*
            const canvas = this.$refs.canvas;
            this.vueCanvas.clearRect(0, 0, canvas.width, canvas.height);*/
            let centroids = this.initCentroids(this.points, this.numClusters);
            let clusters = [];
            let iterations = 0;
            

            let cond = true;
            
            while (cond) {
                for (let i = 0; i < this.numClusters; i++) {
                    clusters[i] = [];
                }

                for (let i = 0; i < this.points.length; i++) {
                    let minDistance = Infinity;
                    let closestCluster = null;
                    for (let j = 0; j < centroids.length; j++) {
                        const d = this.distance(this.points[i], centroids[j]);
                        if (d < minDistance) {
                            minDistance = d;
                            closestCluster = j;
                        }
                    }
                    clusters[closestCluster].push(this.points[i]);
                }

                let newCentroids = [];
                for (let i = 0; i < this.numClusters; i++) {
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

                iterations++;
                if (iterations > 100 || JSON.stringify(newCentroids) === JSON.stringify(centroids)) {
                    break;
                }
                centroids = newCentroids;
            }
            /*
            for(let i = 0; i < this.numClusters; i++){
                for(let j = 0; j < clusters[i].length; j++){
                    this.vueCanvas.beginPath();
                    this.vueCanvas.arc(clusters[i][j].x, clusters[i][j].y, 15, 0, 2 * Math.PI);
                    this.vueCanvas.fillStyle = this.kmeansColors[i];
                    this.vueCanvas.fill();
                    this.vueCanvas.closePath();
                }
            }*/
            console.log(clusters);
            return clusters;
        },
        hierarchicalClustering() {
            if(this.points.length == 0) {return;}
            /*
            const canvas = this.$refs.canvas;
            this.vueCanvas.clearRect(0, 0, canvas.width, canvas.height);*/
            let clusters = this.points.map(point => [point]);

            while (clusters.length > this.numClusters) {
                let distances = [];
                for (let i = 0; i < clusters.length; i++) {
                    for (let j = i + 1; j < clusters.length; j++) {
                        let distance1 = Math.min(...clusters[i].map(point1 => Math.min(...clusters[j].map(point2 => this.distance(point1, point2)))));
                        distances.push({ i, j, distance1 });
                    }
                }

                let minDistance = Math.min(...distances.map(d => d.distance1));
                let closestClusters = distances.filter(d => d.distance1 === minDistance)[0];

                let newCluster = [...clusters[closestClusters.i], ...clusters[closestClusters.j]];
                clusters.splice(closestClusters.j, 1);
                clusters.splice(closestClusters.i, 1);
                clusters.push(newCluster);
            }
            /*
            for(let i = 0; i < this.numClusters & i < this.points.length; i++){
                for(let j = 0; j < clusters[i].length; j++){
                    this.vueCanvas.beginPath();
                    this.vueCanvas.arc(clusters[i][j].x, clusters[i][j].y, 15, 0, 2 * Math.PI);
                    this.vueCanvas.fillStyle = this.kmeansColors[i];
                    this.vueCanvas.fill();
                    this.vueCanvas.closePath();
                }
            }*/
            console.log(clusters);
            return clusters;
        },
        dbscanClustering() {
            /*
            const canvas = this.$refs.canvas;
            this.vueCanvas.clearRect(0, 0, canvas.width, canvas.height);*/
            let tempclusters = [];
            
            for (let i = 0; i < this.points.length; i++) {
                tempclusters[i] = -1;
            }

            let clusterNum = 0;

            for (let i = 0; i < this.points.length; i++) {
                if (tempclusters[i] !== -1) continue;

                let neighbors = this.getNeighbors(i, 250);

                if (neighbors.length < 3) {
                    tempclusters[i] = 0;
                    continue;
                }

                clusterNum++;
                this.expandCluster(i, neighbors, clusterNum, tempclusters);
            }
            let clusters = Array.from({ length: clusterNum+1 }, () => []);
            for(let i = 0; i < this.points.length; i++){
                clusters[tempclusters[i]].push(this.points[i]);
            }
            this.dbscanNumClusters = clusterNum+1;
            /*
            for(let i = 0; i < this.points.length; i++){
                this.vueCanvas.beginPath();
                this.vueCanvas.arc(this.points[i].x, this.points[i].y, 15, 0, 2 * Math.PI);
                if(tempclusters[i] === 0) {
                    this.vueCanvas.fillStyle = "black";
                } else {
                    this.vueCanvas.fillStyle = this.dbscanColors[clusters[i] % this.dbscanColors.length];
                }
                this.vueCanvas.fill();
                this.vueCanvas.closePath();
            }
            */
           /*
            for(let i = 0; i < clusterNum+1 & i < this.points.length; i++){
                for(let j = 0; j < clusters[i].length; j++){
                    this.vueCanvas.beginPath();
                    this.vueCanvas.arc(clusters[i][j].x, clusters[i][j].y, 15, 0, 2 * Math.PI);
                    this.vueCanvas.fillStyle = this.dbscanColors[i];
                    this.vueCanvas.fill();
                    this.vueCanvas.closePath();
                }
            }*/
            console.log(clusters);
            return clusters;
        },
        getNeighbors(pointIndex, epsilon) {
            let neighbors = [];
            for(let i = 0; i < this.points.length; i++) {
                if(i === pointIndex) continue;

                if(this.distance(this.points[i], this.points[pointIndex]) < epsilon) {
                    neighbors.push(i);
                }
            }
            return neighbors;
        },
        expandCluster(pointIndex, neighbors, clusterNum, clusters) {
            clusters[pointIndex] = clusterNum;

            for(let i = 0; i < neighbors.length; i++) {
                const neighborIndex = neighbors[i];
                if(clusters[neighborIndex] === -1) {
                    clusters[neighborIndex] = clusterNum;

                    const newNeighbors = this.getNeighbors(neighborIndex, this.epsilon);
                    if(newNeighbors.length >= this.minPts) {
                        neighbors = neighbors.concat(newNeighbors);
                    }
                }
            }
        },
        clearPoints(){
            const canvas = this.$refs.canvas;
            this.points = [];
            this.vueCanvas.clearRect(0, 0, canvas.width, canvas.height);
        },
        drawClusters(clusters, colors, num = this.numClusters, angle1 = 0, angle2 = 2 * Math.PI, erase = true){
            if(erase){
                const canvas = this.$refs.canvas;
                this.vueCanvas.clearRect(0, 0, canvas.width, canvas.height);
            }
            for(let i = 0; i < num & i < this.points.length; i++){
                for(let j = 0; j < clusters[i].length; j++){
                    this.vueCanvas.beginPath();
                    this.vueCanvas.arc(clusters[i][j].x, clusters[i][j].y, 15, angle1, angle2);
                    this.vueCanvas.fillStyle = colors[i];
                    this.vueCanvas.fill();
                    this.vueCanvas.closePath();
                }
            }
        },
        drawComparison(){
            const canvas = this.$refs.canvas;
            this.vueCanvas.clearRect(0, 0, canvas.width, canvas.height);
            this.drawClusters(this.dbscanClustering(), this.dbscanColors, this.dbscanNumClusters, 4*Math.PI/3, 2*Math.PI, false);
            this.drawClusters(this.hierarchicalClustering(), this.hiersColors, this.numClusters, 2*Math.PI/3, 4*Math.PI/3, false);
            this.drawClusters(this.kMeansClustering(), this.kmeansColors, this.numClusters, 0, 2*Math.PI/3, false)
        }
    }
}
</script>

<style>
button{
    width: 200px;
    height: 40px;
    background-color: white;
    align-self: flex-end;
    border: 0px solid black;
    padding: 5px 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    margin-top: 5px;
    transition: background-color 0.22s ease-in-out;
}
input{
    margin-bottom: 5px;
}
.buttons{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.app{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100vh;
}
.canvasPanel{
    display: flex;
    justify-content: center;
    align-items: center;
}
.buttonPanel{
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
}
.panel{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: fit-content;
    width: fit-content;
    background-color: #e1ecf2;
    border-radius: 10px;
    padding: 7px;
    margin-left: 5px;
}
.panel button{
  background-color: white;
  color: black;
}
button:hover {
  background-color: #cbdbfc; /* цвет кнопки при наведении */
  
}
canvas{
    background-color: white;
}

</style>