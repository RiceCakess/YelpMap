<template>
  <v-app>
    <v-content>
      <v-container fluid class="fill-height">
        <v-row class="fill-height">
          <v-col cols="6">
            <Query :history="history" :circleCenter="circleCenter" :circleRadius="circleRadius" :refreshHistory="refreshHistory"></Query>
          </v-col>
          <v-col cols="6" style="padding: 0px; ">
            <Maps :history="history" :updateCircle="updateCircle" ></Maps>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
/* eslint-disable no-unused-vars */
import Maps from './components/Maps.vue';
import Query from './components/Query.vue';
const axios = require('axios').default;
export default {
  name: 'App',

  components: {
    "Maps": Maps,
    "Query": Query,
  },

  data: () => ({
      history: [],
      circleCenter: {lat:37.7598202, lng:-122.4522538},
      circleRadius: 2500,
  }),
  methods: {
      refreshHistory: function() {
          let vm = this;
          console.log("history refreshed");
          axios.get('https://dchen.xyz/api/history'
          ).then((res => {
              //console.log(res);
              res.data.map(x => { x.query = JSON.parse(x.query); });
              vm.history = res.data;
          })).catch(err => {
              console.log(err);
          });
      },
      loop: function(){
        let vm = this;
        setTimeout(function(){
            vm.refreshHistory();
            vm.loop();
        }, 1000*30);
      },
      updateCircle: function(loc, rad){
        this.circleCenter = loc;
        this.circleRadius = rad;
      }
  },
  mounted: function () {
      this.refreshHistory();
      this.loop();
  },
};
</script>
