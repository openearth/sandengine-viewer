<template>
<div class="layer-control">
  <draggable class="draggable" v-model="computedList" @start="drag=true" @end="drag=false">
    <v-list dense pt-0 v-for="layer in layers" :key="layer.id">
      <v-list-tile id="list-tile">
        <v-list-tile-action>
          <v-switch v-model="layer.active"></v-switch>
        </v-list-tile-action>
        <v-list-tile-title>{{layer.name}}</v-list-tile-title>
        <v-list-tile-action style="display:-webkit-box">
          <!-- <v-icon>{{layer.icon}}</v-icon> -->
          <v-tooltip bottom  v-if="layer.clickable">
            <v-icon slot="activator" >
              fa-area-chart
            </v-icon>
            <span>This layer is clickable and a card with a graph will appear.</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" small style="min-width:30px" v-on:click.native="addInfoCard(layer.id)">
              <v-icon>fa-question</v-icon>
            </v-btn>
            <span>A card will appear with more information about this layer.</span>
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>

      <div class="bar-wrapper">
        <div :style="layer.css" class='bar' v-if="layer.css"></div>
        <div class='bartext'>{{layer.range}} <span class='barspan'> </span> </div>
        <div class='information' v-html="layer.info">{{layer.info}}
        </div>
      </div>
  </v-list>
</draggable>

</div>
</template>

<script src="./layer-control.js"></script>

<style>
.bartext {
  text-align: justify;
  width: 100%;
  clear: left;
}

.bar {
  width: 100%;
  height: 10px;
}

.barspan {
  width: 100%;
  display: inline-block;
}

.information {
  /* TODO: remove span trick? */
  margin-top: -1rem;
  text-align: left;
}

.bar-wrapper {
  padding: 0 16px;
  display: block;
  width: 100%;
  margin-bottom: 10px;
}

.legend .list__tile {
  height: 200px;
}

.navigation-drawer .list {
  cursor: move;
}

.list.list--dense:hover {
  background-color: lightgrey;
}

.layer-control {
  max-height: 100%;
  overflow-y: scroll;
}
</style>
