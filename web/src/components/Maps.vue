<template>
    <div>
        <v-btn class="mx-2" dark large color="primary" @click="setCircleToMapCenter">
            Move Circle to View
        </v-btn>
        <GmapMap
        :center="mapCenter"
        :zoom="13.25"
        @center_changed="updateMapCenter"
        map-type-id="roadmap"
        style="width: 100%; min-height: 90vh;">
            <gmap-circle :center="circleCenter" :radius="circleRadius" :options="{editable: true, strokeColor: 'black'}" :draggable="true" @radius_changed="update('radius', $event)" @center_changed="update('center', $event)"></gmap-circle>
            <template v-for="item in history">
            <gmap-circle :center="getLatLng(item.query)" :radius="parseFloat(item.query.radius)" :key="item.timestamp" :options="{ strokeColor: 'red' }" :draggable="false" :editable="false"></gmap-circle>
            <gmap-marker :position="getLatLng(item.query)" :options="{label: String(item.id)}" :key="item.id"></gmap-marker>
            </template>
        </GmapMap>
    </div>
</template>
<script>
  export default {
    name: 'Maps',
    props:['history', 'updateCircle'],
    data: () => ({
        mapCenter: {lat:37.7598202, lng:-122.4522538},
        mapCenterReported: {},
        circleCenter: {lat:37.7598202, lng:-122.4522538},
        circleRadius: 2500,
        circleCenterReported: {}
    }),
    methods: {
        update(prop, value) {
            if (prop === 'radius') {
                this.circleRadius = Math.min(value,40000);
            } else if (prop === 'center') {
                this.circleCenterReported = value.toJSON();
            }
            this.updateCircle(this.circleCenter,Math.round(this.circleRadius));
        },
        getLatLng: function(query){
            return {lat: parseFloat(query.latitude), lng: parseFloat(query.longitude)};
        },
        setCircleToMapCenter: function(){
            this.circleCenter = this.mapCenterReported;
        },
        updateMapCenter(latLng){
            this.mapCenterReported = { lat: latLng.lat(), lng: latLng.lng()};
        }
    },
    computed: {
        
    }
  }
</script>