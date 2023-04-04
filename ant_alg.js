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

function antAlg(file) {
    let reader = new FileReader();
    reader.readAsText(file.files[0])
    reader.onload = function () {

        let readRes = (reader.result).split("\r\n");
        let numCities = readRes[0].split(" ").length;
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
        let distCities = [];
        let pheromone = [];
        let closeness = [];

        for (let i = 0; i < readRes.length; i++) {
            distCities[i] = (readRes[i].split(" ")).map(Number);
        }
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
                if (tour.distance < best.distance) {best = tour;} //console.log(best);}
            }
            pheromone = pheromoneUpdate(thisIter, numCities, pheromone, pheromoneConst, pheromoneRemain)
        }
        console.log("best way: ");
        console.log(best);
    }
}