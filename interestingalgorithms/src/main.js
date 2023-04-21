import { createApp } from 'vue'
import App from './App'
import AntsAlgorithm from './AntsAlgorithm'
import CanvasPoints from './CanvasPoints'
import TreeAlgorithm from './TreeAlgorithm'
import TreeNode from './Treenode'
import GeneticAlgorithm from './GeneticAlgorithm'
import ClusteringAlgorithms from './ClusteringAlgorithms'

createApp(App).mount('#app')
createApp(AntsAlgorithm).mount('#ants')
createApp(CanvasPoints).mount('#CanvasPoints')
createApp(TreeAlgorithm).mount('#tree')
createApp(TreeNode).mount('#treenode')
createApp(GeneticAlgorithm).mount('#genetic')
createApp(ClusteringAlgorithms).mount('#clustering')