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
      <div class="bar-wrapper">
        <div :style="layer.css" class='bar'></div>
        <div class='bartext'>{{layer.range}} <span class='barspan'> </span> </div>
        <div class='information' v-html="layer.info" >{{layer.info}} </div>
      </div>
    </v-list-tile>
  </v-list>
</div>
</template>

<script src="./layer-control.js"></script>

<style>
.bartext {
  height: 10px;
  margin-left: 10%;
  text-align: justify;
  width: 80%;
  clear: left;
}

.barspan {
  width: 100%;
  height: 1em;
  display: inline-block;
}

.bar-wrapper {
  display: block;
  width: 100%;
}
</style>
