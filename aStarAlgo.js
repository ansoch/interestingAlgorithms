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

//export {findPath};