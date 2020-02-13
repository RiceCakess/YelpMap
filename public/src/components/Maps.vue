<template>
    <GmapMap
    :center="SFLatLng"
    :zoom="13.25"
    map-type-id="roadmap"
    style="width: 100%; height: 100%;">
        <gmap-circle :bounds="circleBounds" :center="SFLatLng" :radius="circleRadius" :options="{editable: true, strokeColor: 'black'}" :draggable="true" @radius_changed="updateCircle('radius', $event)" @center_changed="updateCircle('center', $event)"></gmap-circle>
        <template v-for="item in history">
           <gmap-circle :center="item.coordinates" :radius="item.radius" :key="item.radius" :options="{ strokeColor: 'red' }" :draggable="false" :editable="false"></gmap-circle>
           <gmap-marker :position="item.coordinates" :options="{label: String(item.id)}" :key="item.id"></gmap-marker>
        </template>
    </GmapMap>
    
</template>
<script>
  export default {
    name: 'Maps',
    props:['history'],
    data: () => ({
        SFLatLng: {lat:37.7598202, lng:-122.4522538},
        circleBounds:{},
        currentCircleCenter: {},
        circleRadius: 2500,
        
    }),
    methods: {
        updateCircle(prop, value) {
            if (prop === 'radius') {
                this.circleRadius = Math.min(value,40000);
            } else if (prop === 'center') {
                this.currentCircleCenter = value.toJSON();
            }
        },
    }
  }
</script>