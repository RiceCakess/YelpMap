<template>
    <div style="max-height: 93vh; overflow:auto;">
        <v-card outlined class="mx-auto">
            <v-card-title>Settings</v-card-title>
            <v-card-text>
                <v-row>
                <v-col cols="6">
                    <v-autocomplete
                        :items="categories"
                        :filter="customFilter"
                        item-text="title"
                        item-value="alias"
                        label="Categories"
                        v-model="selectedCategories"
                        auto-select-first
                    ></v-autocomplete>
                </v-col>
                 <v-col cols="6">
                     <v-btn class="mx-2" fab dark large color="primary" @click="query">
                        <v-icon dark>mdi-magnify</v-icon>
                    </v-btn>
                </v-col>
               </v-row>
            </v-card-text>
        </v-card>
        <br>
        <v-card outlined>
            <v-card-title>Past Searches
                <v-btn class="mx-2" raised dark large color="primary" @click="refreshHistory">
                    <v-icon dark>mdi-refresh</v-icon>
                </v-btn>
            </v-card-title>
            <v-list class="fill-height">
                <template v-for="(item,index) in history">
                    <v-list-item :key="item.id">
                        
                        <v-list-item-icon>
                            <h1>{{item.id}}</h1>
                            <v-icon color="red" large>mdi-map-marker</v-icon>
                        </v-list-item-icon>
                        
                        <v-list-item-content>
                            <v-list-item-title>
                                 {{timeSince(new Date(item.timestamp))}} ago
                            </v-list-item-title>
                            <v-list-item-subtitle></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn v-if="item.status===1" class="mx-2" raised dark large color="primary" @click="getFile(item.filepath)">
                                <v-icon dark>mdi-download-outline</v-icon>
                            </v-btn>
                            <v-btn v-if="item.status !== 1" class="mx-2" raised dark large color="primary" >
                                <span v-if="item.status===0">IN PROGRESS</span>
                                <span v-if="item.status===2">FAILED</span>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                    <v-divider
                        v-if="index + 1 < history.length"
                        :key="item.radius"
                    ></v-divider>
                </template>
            </v-list>
        </v-card>
    </div>
</template>

<script>
    const axios = require('axios').default;
    import { saveAs } from 'file-saver';
    export default {
        name: 'Query',
        props:['history', 'circleCenter', 'circleRadius', 'refreshHistory'],
        data: () => ({
            selectedCategories: "restaurants",
            categories: [{title: "All Restaurants", alias:"restaurants"}, {"title":"Afghan","alias":"afghani"},{"title":"African","alias":"african"},{"title":"Arabian","alias":"arabian"},{"title":"Argentine","alias":"argentine"},{"title":"Armenian","alias":"armenian"},{"title":"Asian Fusion","alias":"asianfusion"},{"title":"Australian","alias":"australian"},{"title":"Austrian","alias":"austrian"},{"title":"Bangladeshi","alias":"bangladeshi"},{"title":"Basque","alias":"basque"},{"title":"Barbeque","alias":"bbq"},{"title":"Belgian","alias":"belgian"},{"title":"Brasseries","alias":"brasseries"},{"title":"Brazilian","alias":"brazilian"},{"title":"Breakfast & Brunch","alias":"breakfast_brunch"},{"title":"British","alias":"british"},{"title":"Buffets","alias":"buffets"},{"title":"Bulgarian","alias":"bulgarian"},{"title":"Burgers","alias":"burgers"},{"title":"Burmese","alias":"burmese"},{"title":"Cafes","alias":"cafes"},{"title":"Cafeteria","alias":"cafeteria"},{"title":"Cajun/Creole","alias":"cajun"},{"title":"Cambodian","alias":"cambodian"},{"title":"Caribbean","alias":"caribbean"},{"title":"Catalan","alias":"catalan"},{"title":"Cheesesteaks","alias":"cheesesteaks"},{"title":"Chicken Wings","alias":"chicken_wings"},{"title":"Chicken Shop","alias":"chickenshop"},{"title":"Chinese","alias":"chinese"},{"title":"Comfort Food","alias":"comfortfood"},{"title":"Creperies","alias":"creperies"},{"title":"Cuban","alias":"cuban"},{"title":"Czech","alias":"czech"},{"title":"Delis","alias":"delis"},{"title":"Diners","alias":"diners"},{"title":"Dinner Theater","alias":"dinnertheater"},{"title":"Eritrean","alias":"eritrean"},{"title":"Ethiopian","alias":"ethiopian"},{"title":"Filipino","alias":"filipino"},{"title":"Fish & Chips","alias":"fishnchips"},{"title":"Fondue","alias":"fondue"},{"title":"Food Court","alias":"food_court"},{"title":"Food Stands","alias":"foodstands"},{"title":"French","alias":"french"},{"title":"Game Meat","alias":"gamemeat"},{"title":"Gastropubs","alias":"gastropubs"},{"title":"Georgian","alias":"georgian"},{"title":"German","alias":"german"},{"title":"Gluten-Free","alias":"gluten_free"},{"title":"Greek","alias":"greek"},{"title":"Guamanian","alias":"guamanian"},{"title":"Halal","alias":"halal"},{"title":"Hawaiian","alias":"hawaiian"},{"title":"Himalayan/Nepalese","alias":"himalayan"},{"title":"Hong Kong Style Cafe","alias":"hkcafe"},{"title":"Honduran","alias":"honduran"},{"title":"Hot Dogs","alias":"hotdog"},{"title":"Fast Food","alias":"hotdogs"},{"title":"Hot Pot","alias":"hotpot"},{"title":"Hungarian","alias":"hungarian"},{"title":"Iberian","alias":"iberian"},{"title":"Indonesian","alias":"indonesian"},{"title":"Indian","alias":"indpak"},{"title":"Irish","alias":"irish"},{"title":"Italian","alias":"italian"},{"title":"Japanese","alias":"japanese"},{"title":"Kebab","alias":"kebab"},{"title":"Korean","alias":"korean"},{"title":"Kosher","alias":"kosher"},{"title":"Laotian","alias":"laotian"},{"title":"Latin American","alias":"latin"},{"title":"Malaysian","alias":"malaysian"},{"title":"Mediterranean","alias":"mediterranean"},{"title":"Mexican","alias":"mexican"},{"title":"Middle Eastern","alias":"mideastern"},{"title":"Modern European","alias":"modern_european"},{"title":"Mongolian","alias":"mongolian"},{"title":"Moroccan","alias":"moroccan"},{"title":"American (New)","alias":"newamerican"},{"title":"New Mexican Cuisine","alias":"newmexican"},{"title":"Nicaraguan","alias":"nicaraguan"},{"title":"Noodles","alias":"noodles"},{"title":"Pakistani","alias":"pakistani"},{"title":"Pan Asian","alias":"panasian"},{"title":"Persian/Iranian","alias":"persian"},{"title":"Peruvian","alias":"peruvian"},{"title":"Pizza","alias":"pizza"},{"title":"Polish","alias":"polish"},{"title":"Polynesian","alias":"polynesian"},{"title":"Pop-Up Restaurants","alias":"popuprestaurants"},{"title":"Portuguese","alias":"portuguese"},{"title":"Poutineries","alias":"poutineries"},{"title":"Live/Raw Food","alias":"raw_food"},{"title":"Russian","alias":"russian"},{"title":"Salad","alias":"salad"},{"title":"Sandwiches","alias":"sandwiches"},{"title":"Scandinavian","alias":"scandinavian"},{"title":"Scottish","alias":"scottish"},{"title":"Seafood","alias":"seafood"},{"title":"Singaporean","alias":"singaporean"},{"title":"Slovakian","alias":"slovakian"},{"title":"Somali","alias":"somali"},{"title":"Soul Food","alias":"soulfood"},{"title":"Soup","alias":"soup"},{"title":"Southern","alias":"southern"},{"title":"Spanish","alias":"spanish"},{"title":"Sri Lankan","alias":"srilankan"},{"title":"Steakhouses","alias":"steak"},{"title":"Supper Clubs","alias":"supperclubs"},{"title":"Sushi Bars","alias":"sushi"},{"title":"Syrian","alias":"syrian"},{"title":"Taiwanese","alias":"taiwanese"},{"title":"Tapas Bars","alias":"tapas"},{"title":"Tapas/Small Plates","alias":"tapasmallplates"},{"title":"Tex-Mex","alias":"tex-mex"},{"title":"Thai","alias":"thai"},{"title":"American (Traditional)","alias":"tradamerican"},{"title":"Turkish","alias":"turkish"},{"title":"Ukrainian","alias":"ukrainian"},{"title":"Uzbek","alias":"uzbek"},{"title":"Vegan","alias":"vegan"},{"title":"Vegetarian","alias":"vegetarian"},{"title":"Vietnamese","alias":"vietnamese"},{"title":"Waffles","alias":"waffles"},{"title":"Wraps","alias":"wraps"}]
        }),
        methods: {
            query() {
                let vm = this;
                axios.get('https://dchen.xyz/api/download',{
                    params:{
                        latitude: this.circleCenter.lat,
                        longitude: this.circleCenter.lng,
                        radius: this.circleRadius,
                        "categories": this.selectedCategories
                    }
                }).then(response => { 
                    console.log(response);
                    vm.getHistory();
                }).catch(error => {
                    console.log(error);
                });
            },
            getFile(name){
                if(typeof name === undefined || name === null){
                    alert("No file to download");
                    return;
                }
                console.log(name);
                saveAs('https://dchen.xyz/static/' + name,name);
            },
            customFilter (item, queryText) {
                const textOne = item.title.toLowerCase()
                const textTwo = item.alias.toLowerCase()
                const searchText = queryText.toLowerCase()

                return textOne.indexOf(searchText) > -1 ||
                    textTwo.indexOf(searchText) > -1
            },
            timeSince(date) {
                var seconds = Math.floor((new Date() - date) / 1000);
                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return interval + " years";
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return interval + " months";
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + " days";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + " hours";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " minutes";
                }
                return Math.floor(seconds) + " seconds";
            }
        },
        mounted: function () {
            
        },
    }
</script>