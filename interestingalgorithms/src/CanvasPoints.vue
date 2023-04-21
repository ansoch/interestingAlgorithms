<template>
    <canvas ref="canvas" @click="draw" width="640" height="640" style="border:3px solid #404345; border-radius: 10px;"></canvas>
    <button @click="clearCanvas()">очистить точки</button>
</template>

<script>
// eslint-disable-next-line no-unused-vars
export default {
    name: "CanvasPoints",
    data() {
        return {
            points: [],
            vueCanvas: null,
        };
    },
    mounted(){
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        this.vueCanvas = ctx;
        this.$emit('canvasCreated', canvas);
    },
    methods: {
        sendPoints() {
            this.$emit('array-sent', this.points);
        },
        draw(event) {
            const canvas = this.$refs.canvas;
            const context = this.vueCanvas;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            for(let point of this.points){
                if(this.distance([x, y], point) < 30) return;
            }

            context.beginPath();
            context.arc(x, y, 15, 0, 2 * Math.PI);
            context.fillStyle = 'black';
            context.fill();
            
            this.points.push([ x, y ]);
            this.sendPoints();
        }, 
        distance(point1, point2) {
            const dx = point1[0] - point2[0];
            const dy = point1[1] - point2[1];
            return Math.sqrt(dx * dx + dy * dy);
        },
        clearPoints(){
            const canvas = this.$refs.canvas;
            //this.points = [];
            this.vueCanvas.clearRect(0, 0, canvas.width, canvas.height);
            this.sendPoints();
        },
        clearCanvas(){
            const canvas = this.$refs.canvas;
            this.points = [];
            this.vueCanvas.clearRect(0, 0, canvas.width, canvas.height);
            this.sendPoints();
        }
    }
};
</script>

<style>

</style>