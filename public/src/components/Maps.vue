<template>
    <GmapMap
    :center="SFLatLng"
    :zoom="13.25"
    map-type-id="roadmap"
    style="width: 100%; height: 100%;">
        <gmap-circle :center="SFLatLng" :radius="circleRadius" :options="{editable: true, strokeColor: 'black'}" :draggable="true" @radius_changed="update('radius', $event)" @center_changed="update('center', $event)"></gmap-circle>
        <template v-for="item in history">
           <gmap-circle :center="getLatLng(item.query)" :radius="parseFloat(item.query.radius)" :key="item.timestamp" :options="{ strokeColor: 'red' }" :draggable="false" :editable="false"></gmap-circle>
           <gmap-marker :position="getLatLng(item.query)" :options="{label: String(item.id)}" :key="item.id"></gmap-marker>
        </template>
    </GmapMap>
    
</template>
<script>
  export default {
    name: 'Maps',
    props:['history', 'updateCircle'],
    data: () => ({
        SFLatLng: {lat:37.7598202, lng:-122.4522538},
        circleRadius: 2500,
        circleCenter: {}
    }),
    methods: {
        update(prop, value) {
            if (prop === 'radius') {
                this.circleRadius = Math.min(value,40000);
            } else if (prop === 'center') {
                this.circleCenter = value.toJSON();
            }
            this.updateCircle(this.circleCenter,Math.round(this.circleRadius));
        },
        getLatLng: function(query){
            return {lat: parseFloat(query.latitude), lng: parseFloat(query.longitude)};
        }
    },
    computed: {
        
    }
  }
</script>