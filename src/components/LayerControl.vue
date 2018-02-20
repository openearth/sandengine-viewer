<template>
  <div class="layer-control">
    <v-list dense pt-0>
        <v-list-tile v-for="layer in layers" :key="layer.id">
          <v-list-tile-action>
            <v-switch  v-model="layer.active"></v-switch>
          </v-list-tile-action>
          <v-list-tile-title>{{layer.name}}</v-list-tile-title>
          <v-list-tile-action>
            <v-icon>{{layer.icon}}</v-icon>
          </v-list-tile-action>
        </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <v-subheader>
        Legenda
    </v-subheader>
    <v-list dense pt-0>
        <v-list-tile  v-for="legend in legends" :key="legend">
          <v-list-tile-title></v-list-tile-title>
       </v-list-tile>
    </v-list>
  </div>
</template>
<script src="./layer-control.js"></script>
