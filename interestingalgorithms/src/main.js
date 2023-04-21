import { createApp } from 'vue'
import App from './App'
import AntsAlgorithm from './AntsAlgorithm'
import CanvasPoints from './CanvasPoints'
import Tree from './Tree'
import TreeNode from './Treenode'
import Genetic from './Genetic'

createApp(App).mount('#app')
createApp(AntsAlgorithm).mount('#ants')
createApp(CanvasPoints).mount('#CanvasPoints')
createApp(Tree).mount('#tree')
createApp(TreeNode).mount('#treenode')
createApp(Genetic).mount('#genetic')