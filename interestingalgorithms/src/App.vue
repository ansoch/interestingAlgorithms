<template>
    <div class="leftPanel">
        <button @click="changeAlgorithm('clusters')">Кластеризация</button>
        <button @click="changeAlgorithm('ants')">Муравьиный алгоритм</button>
        <button @click="changeAlgorithm('genetic')">Генетический алгоритм</button>
        <button @click="changeAlgorithm('tree')">Дерево решений</button>
        <div class="links">
        <a href="/good/genetic.html">Другие страницы</a>
        <a href="/good/templates/index.html">Нейронная сеть</a>
        </div>
    </div>
    <div v-if="activeComponent === 'clusters'">
      <ClusteringAlgorithms />
    </div>
    <div v-if="activeComponent === 'ants'">
      <AntsAlgorithm />
    </div>
    <div v-if="activeComponent === 'genetic'">
      <GeneticAlgorithm />
    </div>
    <div v-if="activeComponent === 'tree'">
      <TreeAlgorithm />
    </div>
</template>

<script>
import AntsAlgorithm from './AntsAlgorithm'
import TreeAlgorithm from './TreeAlgorithm'
import GeneticAlgorithm from './GeneticAlgorithm'
import ClusteringAlgorithms from './ClusteringAlgorithms'
export default{
    components:{
        AntsAlgorithm, ClusteringAlgorithms, GeneticAlgorithm, TreeAlgorithm
    },
    data(){
        return {
            activeComponent: 'clusters',
        }
    },
    methods:{
        changeAlgorithm(component){
            this.activeComponent = component;
        }
    }
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
.links{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    bottom: 0;
}
.leftPanel{
    display: flex;
    flex-direction: column;
    float:left;
    margin: 5px;
    
    align-items: center;
    height: 100vh;
    width: fit-content;
    background-color: #e1ecf2;
    border-radius: 10px;
    padding: 15px;
    margin-left: 5px;
}
</style>