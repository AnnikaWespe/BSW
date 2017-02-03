
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

