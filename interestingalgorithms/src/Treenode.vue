<template>
    <div>
        <ul v-if="node.children">
        <li v-for="(child, index) in node.children" :key="index"><div>{{ child.value }}</div>
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

<style></style>