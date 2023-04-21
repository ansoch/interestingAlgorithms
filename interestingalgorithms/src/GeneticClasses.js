function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
// eslint-disable-next-line no-unused-vars
class City{
    constructor(num, closeCities = []) {
        this.num = num;
        this.closeCities = closeCities;
    }
    findCloseCities(numCities, numCloseCities, distCities){
        for (let i = 0; this.closeCities.length < numCloseCities; i++){
            if (i !== this.num) this.closeCities.push(i);
        }
        this.closeCities.sort((a, b) => {
            return(distCities[this.num][a] - distCities[this.num][b])
        })

        for (let i = numCloseCities; i < numCities; i++) {
            if (i === this.num) continue;
            for (let j = this.closeCities.length - 1; j >= 0; j--) {
                if (distCities[this.num][i] < distCities[this.num][this.closeCities[j]]) {
                    this.closeCities[j] = i;
                    this.closeCities.sort((a, b) => {
                        return (distCities[this.num][a] - distCities[this.num][b])
                    })
                    break;
                }
            }
        }
    }
}
// eslint-disable-next-line no-unused-vars
class Tour{
    constructor(tour = [], distance = 0) {
        this.tour = tour;
        this.distance = distance;
    }

    generateTour(numCities, numCloseCities, distCities, cities, chanceUseCloseCity){
        let curCity = cities[getRandomInt(numCities)];
        this.tour.push(curCity.num);
        let nextCity = cities[this.tour[0]];
        for (let i = 0; i < numCities; i++){
            //console.log(this.tour);
            nextCity = cities[this.tour[0]];
            if (getRandomInt(99) <= chanceUseCloseCity){
                for (let j = 0; j < numCloseCities; j++){
                    if (!(this.tour.includes(curCity.closeCities[j]))) nextCity = cities[curCity.closeCities[j]];
                }
            }
            if (nextCity === cities[this.tour[0]])for (let j = 0; j < numCities; j++){
                if(!(this.tour.includes(j))) nextCity = cities[j];
            }
            this.distance += distCities[curCity.num][nextCity.num];
            curCity = nextCity;
            this.tour.push(curCity.num);
        }

    }
    calculateDist(distCities){
        this.distance = 0;
        for (let i = 1; i < this.tour.length; i++) this.distance += distCities[this.tour[i-1]][this.tour[i]];
    }
    mutate(distCities){
        let a = 1+getRandomInt(this.tour.length-2);
        let b = 1+getRandomInt(this.tour.length-2);
        if (a > b) {let t = a; a = b; b = t;}

        let mutating = [];
        for (let i = a; i < b; i++) mutating[i-a] = this.tour[i];
        mutating.reverse();
        for (let i = a; i < b; i++) this.tour[i] = mutating[i-a];
        this.calculateDist(distCities);
    }
}