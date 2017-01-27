/**
 * Created by annikawestphaling on 26.01.17.
 */

export class GetPartnersPost {
  public query = {
    searchTerm: "",
    verbatim: true,
    location: {
      latitude: 52.5247,
      longitude: 13.4054,
      radius: 50.0,
      cityName: ""
    }
  };

  ranges = {
    bucketToFrom: {
      "ONLINEPARTNER": "0",
      "OFFLINEPARTNER": "0",
      "VEHICLEOFFER": "0",
      "TRAVELOFFER": "0"
    },
    rangeSize: 25
  };
  filter = {
    buckets: ["OFFLINEPARTNER", "ONLINEPARTNER", "TRAVELOFFER", "VEHICLEOFFER"]
  };
  showmap = true;
  template = "unified";

  constructor() {};
}
/*
{"query":{"searchTerm":"","verbatim":true,"location2":{"latitude":48.1365,"longitude":11.5645,"radius":50,"cityName":""}},"ranges":{"bucketToFrom":{"ONLINEPARTNER":"0","OFFLINEPARTNER":"0","VEHICLEOFFER":"0","TRAVELOFFER":"0"},"rangeSize":25},"filter":{"buckets":["OFFLINEPARTNER","ONLINEPARTNER","TRAVELOFFER","VEHICLEOFFER"]},"showmap":true,"template":"unified"}
{
  "query": {"searchTerm": "mode", "verbatim": true, "location": {"latitude": 52.5247, "longitude": 13.4054, "radius": 50.0, "cityName": "Berlin"} },
  "ranges": { "bucketToFrom": {
  "ONLINEPARTNER": "0", "OFFLINEPARTNER": "0", "VEHICLEOFFER": "0", "TRAVELOFFER": "0"
},
  "rangeSize": 25 },
  "filter": {
  "buckets": ["OFFLINEPARTNER", "ONLINEPARTNER", "TRAVELOFFER", "VEHICLEOFFER"]
},
  "showmap": "true", "template": "unified"
}
*/
