<template>
    <div class="app">
        <div class="panel"><canvas id="canvas" height="600" width="600" style="border: 1px solid black;"></canvas></div>
        <div class="panel"><div class="buttons">
            
        </div></div>
    </div>
</template>

<script>
function findPath(field, start, end) {
    if (!field) return;

    function isCorrectCell(x, y) {
        return x >= 0 && x < field.length && y >= 0 && y < field[0].length && field[x][y] === 1;
    }

    function heuristic(cell) {
        let x = cell[0] - end[0];
        let y = cell[1] - end[1];
        return Math.sqrt(x * x + y * y);
    }

    function getNeighbors(cell) {
        const [row, col] = cell;
        let neighbors = [];
        if (isCorrectCell(row - 1, col)) neighbors.push([row - 1, col]);
        if (isCorrectCell(row, col - 1)) neighbors.push([row, col - 1]);
        if (isCorrectCell(row + 1, col)) neighbors.push([row + 1, col]);
        if (isCorrectCell(row, col + 1)) neighbors.push([row, col + 1]);
        return neighbors;
    }

    class PriorityQueue {
        constructor() {
            this.elements = [];
        }

        isEmpty() {
            return this.elements.length === 0;
        }

        enqueue(node, priority) {
            this.elements.push({node, priority});
            this.elements.sort((a, b) => a.priority - b.priority);
        }

        dequeue() {
            return this.elements.shift().node;
        }
    }

    let open = new PriorityQueue();
    let cameFrom = {};
    let closed = [];
    let gScore = {[start]: 0};
    let fScore = {[start]: heuristic(start)};

    open.enqueue(start, fScore[start]);

    function reconstructPath(current) {
        let path = [current];

        while (current in cameFrom) {
            current = cameFrom[current];
            path.unshift(current);
        }

        closed.push(end);
        return {
            optimal: path,
            closed: closed
        };
    }

    while (!open.isEmpty()) {
        let current = open.dequeue();

        if (current[0] === end[0] && current[1] === end[1]) {
            return reconstructPath(current);
        }

        let currentScore = gScore[current] + heuristic(current);

        fScore[current] = currentScore;

        if (!(current in closed) || currentScore < fScore[cameFrom[current]]) {
            closed.push(current);

            let neighbors = getNeighbors(current);

            for (let neighbor of neighbors) {
                const neighborScore = gScore[current] + 1;
                if (!(neighbor in gScore) || neighborScore < gScore[neighbor]) {
                    gScore[neighbor] = neighborScore;
                    const neighborPriority = neighborScore + heuristic(neighbor);
                    open.enqueue(neighbor, neighborPriority);
                    cameFrom[neighbor] = current;
                }
            }
        }
    }

    return {
        optimal: [],
        closed: closed
    };
}
function generateMaze(n) {
    if (n === undefined) {
        return;
    }
    const size = 2 * n + 1;
    let countOfVisited = 0;
    let maze = new Array(size).fill(0).map(() => new Array(size).fill(0));
    let points = [];
    let visited = new Array(size).fill(0).map(() => new Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i % 2 !== 0 && j % 2 !== 0) maze[i][j] = 1;
        }
    }
    let current = {
        x: 1,
        y: 1
    };
    let wandering = [];
    while (countOfVisited < n * n) {
        let neibs = getNear(current, visited, size);
        wandering.push([current.x, current.y]);
        if (neibs.length !== 0) {
            points.push(current);
            let newPoint = neibs[Math.floor(Math.random() * neibs.length)];
            if (newPoint.x < current.x) maze[newPoint.x + 1][newPoint.y] = 1;
            else if (newPoint.x > current.x) maze[newPoint.x - 1][newPoint.y] = 1;
            else if (newPoint.y < current.y) maze[newPoint.x][newPoint.y + 1] = 1;
            else if (newPoint.y > current.y) maze[newPoint.x][newPoint.y - 1] = 1;
            visited[newPoint.x][newPoint.y] = 1;
            countOfVisited += 1;
            current = newPoint;
        } else if (points.length !== 0) {
            current = points.pop();
        } else {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (i % 2 !== 0 && j % 2 !== 0 && visited[i][j] === 0) {
                        current.x = j;
                        current.y = i;
                    }
                }
            }
        }
    }
    wandering.push([current.x, current.y]);
    return {
        maze: maze,
        wandering: wandering
    };
}


function getNear(point, visited, size) {
    let neighbours = []
    if (point.y - 2 >= 0) {
        if (!visited[point.x][point.y - 2]) {
            neighbours.push({
                x: point.x,
                y: point.y - 2
            });
        }
    }
    if (point.x + 2 < size) {
        if (!visited[point.x + 2][point.y]) {
            neighbours.push({
                x: point.x + 2,
                y: point.y
            });
        }
    }
    if (point.y + 2 < size) {
        if (!visited[point.x][point.y + 2]) {
            neighbours.push({
                x: point.x,
                y: point.y + 2
            });
        }
    }
    if (point.x - 2 >= 0) {
        if (!visited[point.x - 2][point.y]) {
            neighbours.push({
                x: point.x - 2,
                y: point.y
            });
        }
    }
    return neighbours;
}

//export {generateMaze};

export default {
    name: "AStarAlgorithm",
    data(){
        return{

        }
    }
}
</script>

<style></style>