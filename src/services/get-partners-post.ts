export class GetPartnersPost {
  public query = {
    searchTerm: "",
    verbatim: true,
    location: {
      latitude: null,
      longitude: null,
      radius: 50.0,
      cityName: ""
    }
  };

  ranges = {
    bucketToFrom: {
      "ONLINEPARTNER": 0,
      "OFFLINEPARTNER": 0,
      "VEHICLEOFFER": 0,
      "TRAVELOFFER": 0
    },
    rangeSize: 50
  };
  filter?;
  sort?;
  showmap = true;
  template = "unified";

  constructor(location = {
    latitude: 52.5219,
    longitude: 13.4132
  }, bucket = 0, searchTerm, showOnlyPartnersWithCampaign, sortByCriterion, sortOrder, radius, pfNummerArray) {
    this.query.searchTerm = searchTerm;
    this.query.location.latitude = location.latitude;
    this.query.location.longitude = location.longitude;
    this.query.location.radius = radius;
    this.ranges.bucketToFrom.OFFLINEPARTNER = bucket;
    this.ranges.bucketToFrom.ONLINEPARTNER = bucket;
    if (pfNummerArray.length > 0) {
      this.filter = {
        buckets: ["OFFLINEPARTNER", "ONLINEPARTNER"],
        PARTNER_NUMBER: pfNummerArray
      };
    }
    else {
      this.filter = {
        buckets: ["OFFLINEPARTNER", "ONLINEPARTNER"],
      };
      if (showOnlyPartnersWithCampaign) {
        this.filter.PARTNER_HAS_CAMPAIGN = ["true"];
      }
      this.sort = {
        criterion: "RELEVANCE",
        order: "ASC"
      }
      this.sort.criterion = sortByCriterion;
      this.sort.order = sortOrder;
    }
  };
}

