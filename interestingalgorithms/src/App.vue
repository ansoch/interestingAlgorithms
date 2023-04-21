<template>
    <div class="leftPanel">
    <div class="panel">
        <button @click="changeAlgorithm('clusters')">Кластеризация</button>
        <button @click="changeAlgorithm('ants')">Муравьиный алгоритм</button>
        <button @click="changeAlgorithm('genetic')">Генетический алгоритм</button>
        <button @click="changeAlgorithm('tree')">Дерево решений</button>
        
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
            activeComponent: 'ClusteringAlgorithms',
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
.leftPanel{
    float:left;
    margin: 5px
}
</style>