var map;

            function loadMapScenario() {
                map = new Microsoft.Maps.Map(document.getElementById('myMap'), {


                    /* No need to set credentials if already passed in URL */
                    center: new Microsoft.Maps.Location(29.4241, -98.4936),
                    //29.4241, -98.4936
                    zoom: 12
                });
                
                Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
                    var options = {
                        maxResults: 4,
                        businessSuggestions: true,
                        map: map
                    };
                    var manager = new Microsoft.Maps.AutosuggestManager(options);
                    manager.attachAutosuggest('#searchBox', '#searchBoxContainer', selectedSuggestion);
                    
                    
                });
                
                function selectedSuggestion(suggestionResult) {
                    map.entities.clear();
                    map.setView({ bounds: suggestionResult.bestView });
                    var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
                    map.entities.push(pushpin);
                    document.getElementById('printoutPanel').innerHTML =suggestionResult.formattedSuggestion;// + '<br> Lat: ' + suggestionResult.location.latitude + '<br> Lon: ' + suggestionResult.location.longitude; 
                    
                    Microsoft.Maps.Events.addHandler(pushpin, 'click', function(){
                        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                            var loc;
                            var latcoords;
                            var longcoords;
                            navigator.geolocation.getCurrentPosition(function(position){
                                latcoords = position.coords.latitude;
                                longcoords = position.coords.longitude;
                                loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);

                                var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
                                // Set Route Mode to walking
                                directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
                                var waypoint1 = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(latcoords,longcoords) });
                                var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(suggestionResult.location.latitude,suggestionResult.location.longitude) });
                                directionsManager.addWaypoint(waypoint1);
                                directionsManager.addWaypoint(waypoint2);
                                // Set the element in which the itinerary will be rendered
                                directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('printoutPanel2') });
                                directionsManager.calculateDirections();
                            });
                            
                            
                        });
                    });
                }
                
                
                

                
            }