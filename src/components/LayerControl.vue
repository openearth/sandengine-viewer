<template>
<div class="layer-control">
  <v-list dense pt-0 v-for="layer in layers" :key="layer.id">
    <v-list-tile>
      <v-list-tile-action>
        <v-switch v-model="layer.active"></v-switch>
      </v-list-tile-action>
      <v-list-tile-title>{{layer.name}}</v-list-tile-title>
      <v-list-tile-action>
        <v-icon>{{layer.icon}}</v-icon>
      </v-list-tile-action>
    </v-list-tile>
    
    <v-list-tile>
      <div :style="layer.css" class='bar'></div>
      <div class='bartext'>{{layer.range}} <span> </span> </div>
      <div class='info' v-html="layer.info" >{{layer.info}} </div>
    </v-list-tile>
  </v-list>
</div>
</template>
<script src="./layer-control.js"></script>
