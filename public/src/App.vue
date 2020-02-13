<template>
  <v-app>
    <v-content>
      <v-container fluid class="fill-height">
        <v-row class="fill-height">
          <v-col cols="6">
            <Query :history="history"></Query>
          </v-col>
          <v-col cols="6" style="padding: 0px; ">
            <Maps :history="history"></Maps>
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
  }),
  methods: {
        getHistory: function() {
          let vm = this;
          axios.get('http://10.0.0.23:3001/api/history'
          ).then((res => {
              console.log(res);
              vm.history = res.data;
          })).catch(err => {
              console.log(err);
          });
      },
  },
  mounted: function () {
      this.getHistory();
  },
};
</script>
