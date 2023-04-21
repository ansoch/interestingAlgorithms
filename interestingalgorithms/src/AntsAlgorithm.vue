<template>
    <div class="app">
    <div class="canvasPanel"><div class="panel"><CanvasPoints @canvasCreated="onCanvasCreated" @array-sent="onArraySent" ref="childCanvas"> </CanvasPoints></div></div>
    <div class="panel"> <div class="buttons"><button @click="antAlg(this.citiesCords)">Сгенерировать путь</button></div></div>
    </div>
</template>
  
<script>
    import CanvasPoints from './CanvasPoints';
export default {
    name: "AntsAlgorithm",
    components: {
        CanvasPoints
    },
    data() {
      return {
        canvas: null,
        ctx: null,
        gens: 0,
        citiesCords: []
      };
    },
    methods: {
        onArraySent(array) {
            this.citiesCords = array;
        },
        onCanvasCreated(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
        },
        antAlg(citiesCords) {
            const self = this;
            function getDist(cities){
                let distCities = [];

                let dist = 0;
                for (let i = 0; i < cities.length; i++){
                    distCities.push([])
                    for (let j = 0; j < cities.length; j++){
                        dist = Math.round(Math.sqrt(
                            Math.pow(cities[i][0] - cities[j][0], 2) + Math.pow(cities[i][1] - cities[j][1], 2)
                        ));
                        distCities[i].push(dist);
                    }
                }
                return distCities;
            }

            class Tour {
                constructor(tour = [], distance = 0) {
                    this.tour = tour;
                    this.distance = distance;
                }

                generateTour(curNum, numCities, distCities, pheromone, closeness, alpha, beta){
                    let curCity = curNum;
                    this.tour.push(curCity);
                    let nextCity = this.tour[0];
                    for (let i = 0; i < numCities - 1; i++){
                        nextCity = chooseNext(curCity, numCities, this.tour, pheromone, closeness, alpha, beta);
                        this.distance += distCities[curCity][nextCity];
                        curCity = nextCity;
                        this.tour.push(curCity);
                    }
                    nextCity = this.tour[0];
                    this.tour.push(nextCity);
                    this.distance += distCities[curCity][nextCity];
                }
            }
            function chooseNext(curNum, numCities, curTour, pheromone, closeness, alpha, beta){
                let citiesAttract = [];
                let sum = 0;
                let a = 0;
                for (let i = 0; i < numCities; i++){
                    if (curTour.includes(i)) a = 0;
                    else a = Math.pow(pheromone[curNum][i], alpha) * Math.pow(closeness[curNum][i], beta);
                    citiesAttract.push(a);
                    sum += a;
                }
                for (let i = 0; i < numCities; i++) citiesAttract[i] /= sum;
                //console.log(sum);
                a = Math.random();
                let curr = 0;
                let j = 1;
                let i = 0; while (j){
                    curr += citiesAttract[i];
                    if (curr >= a) break;
                    i++;
                }
                return i;
            }

            function pheromoneUpdate(iter, numCities, pheromone, pheromoneConst, pheromoneRemain){
                for (let i = 0; i < pheromone[0].length; i++){
                    pheromone[i].map(elem => elem*pheromoneRemain);
                }
                for (let j = 0; j < iter.length; j++){
                    for (let i = 1; i < iter[j].tour.length; i++){
                        pheromone[iter[j].tour[i-1]][iter[j].tour[i]] += pheromoneConst/iter[j].distance;
                        pheromone[iter[j].tour[i]][iter[j].tour[i-1]] += pheromoneConst/iter[j].distance;
                    }
                }
                return pheromone;
            }
            function restore(cities){
				for (let i = 0; i < cities.length; i++) {
					self.ctx.beginPath();
					self.ctx.arc(cities[i][0], cities[i][1], 15, 0, 2 * Math.PI);
					self.ctx.fill();
				}
			}
            function drawTour(citiesCoords, tour){
                self.$refs.childCanvas.clearPoints();
                restore(citiesCoords);
                self.ctx.beginPath();
                self.ctx.moveTo(citiesCoords[tour.tour[0]][0], citiesCoords[tour.tour[0]][1]);
                for(let i = 1; i < tour.tour.length; i++){
                    self.ctx.lineTo(citiesCoords[tour.tour[i]][0], citiesCoords[tour.tour[i]][1])
                }
                self.ctx.stroke();  
            }

            let distCities = getDist(citiesCords);
            let numCities = citiesCords.length;
            //
            let alpha = 1;
            let beta = 3;
            let closeConst = 200;
            let startPheromone = 0.2;
            let pheromoneConst = 10;
            let pheromoneRemain = 0.8;
            let antAmount = numCities;
            let iterAmount = 1000;
            //
            let pheromone = [];
            let closeness = [];

            for (let i = 0; i < numCities; i++) {
                pheromone.push([]);
                closeness.push([])
                for (let j = 0; j < numCities; j++) {
                    pheromone[i].push(startPheromone);
                    closeness[i].push(closeConst / distCities[i][j]);
                }
            }
            let thisIter;
            let tour;
            let best = new Tour([], 99999999999);
            for (let i = 0; i < iterAmount; i++){
                thisIter = [];
                for (let j = 0; j < antAmount; j++){
                    tour = new Tour;
                    tour.generateTour(j, numCities, distCities, pheromone, closeness, alpha, beta)
                    thisIter.push(tour);
                    if (tour.distance < best.distance) {
                        best = tour;
                        drawTour(citiesCords, best);
                    } //console.log(best);}
                }
                pheromone = pheromoneUpdate(thisIter, numCities, pheromone, pheromoneConst, pheromoneRemain)
            }
            console.log("best way: ");
            console.log(best);
        }
    }
  };
</script>

<style>
button{
    background: none;
    align-self: flex-end;
}
</style>