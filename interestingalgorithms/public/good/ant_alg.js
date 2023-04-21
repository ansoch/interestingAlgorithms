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
    let i = 0; while (1){
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


function antAlg(citiesCords) {
    let distCities = getDist(citiesCords);
    let numCities = citiesCords.length;
    let antAmount = numCities;
    let pheromone = [];
    let closeness = [];
    best = new Tour([], 99999999999);

    for (let i = 0; i < numCities; i++) {
        pheromone.push([]);
        closeness.push([])
        for (let j = 0; j < numCities; j++) {
            pheromone[i].push(startPheromone);
            closeness[i].push(closeConst / distCities[i][j]);
        }
    }
    getBestPath(citiesCords, distCities, numCities, antAmount, pheromone, closeness);
}

//
let best = new Tour;
let timer;
let stopFlag = 0;
document.getElementById("stop").onclick = () => stopFlag = 1;

let alpha = 1;
let beta = 3;
let closeConst = 200;
let startPheromone = 0.2;
let pheromoneConst = 10;
let pheromoneRemain = 0.8;
let iterAmount = 1000;
let counter = 0;

//
function getBestPath(citiesCords, distCities, numCities, antAmount, pheromone, closeness){
    let thisIter;
    let tour;
    let time = 0;
    counter++;
    thisIter = [];
    console.log(counter);
    console.log(best.distance);

    for (let j = 0; j < antAmount; j++){

        tour = new Tour;
        tour.generateTour(j, numCities, distCities, pheromone, closeness, alpha, beta)
        thisIter.push(tour);

        if (tour.distance < best.distance) {
            counter = 0;
            time = 300;
            best = tour;
            drawTour(citiesCords, best);
        }
    }

    pheromone = pheromoneUpdate(thisIter, numCities, pheromone, pheromoneConst, pheromoneRemain)
    if (counter < iterAmount && stopFlag === 0) timer = setTimeout(getBestPath, time, citiesCords, distCities, numCities, antAmount, pheromone, closeness);
    else stopFlag = 0;
}