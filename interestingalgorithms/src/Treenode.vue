<template>
    <div>
        <ul v-if="node.children">
        <li v-for="(child, index) in node.children" :key="index"><div :class="{ 'red-branch': child.isRed }">({{ node.featureIndex+1 }}){{ child.value }}</div>
        <tree-node :node="child.subtree"></tree-node>
        </li>
        </ul>
    </div>
  </template>
  
<script>
  export default {
    name: 'TreeNode',
    props: {
      node: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style>
.red-branch {
  color: red;
}
</style>