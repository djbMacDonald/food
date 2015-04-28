describe('GraphFactory', function() {

  beforeEach(module('foodApp'));

  beforeEach(inject(function(_requestFactory_, _$httpBackend_) {
    requestFactory = _requestFactory_;
    $httpBackend = _$httpBackend_;
  }));

  var array =
    [{name: 'place1', location: '(1, 2)'},
    {name: 'place2', location: '(3, 4)'},
    {name: 'place3', location: '(5, 6)'}];

  describe('requests', function() {

    it('should make a request to the food license database', function() {
      $httpBackend.whenGET("https://data.cityofboston.gov/resource/gb6y-34cq.json?$limit=3000&$$app_token=o8G9RFyZIGBbm4xexFrdV0Rfk").respond(array);

      requestFactory.getFoodPlaces();
      $httpBackend.flush();
      expect(requestFactory.foodPlaces.length).toBe(3);
    });

    it('should make a request to the food license database', function() {
      $httpBackend.whenGET("https://data.cityofboston.gov/resource/hda6-fnsh.json?$limit=3000&$$app_token=o8G9RFyZIGBbm4xexFrdV0Rfk").respond(array);

      requestFactory.getDrinkPlaces();
      $httpBackend.flush();
      expect(requestFactory.drinkPlaces.length).toBe(3);
    });

    it('should correctly interpret latitude and logitude from the liquor license database', function() {
      $httpBackend.whenGET("https://data.cityofboston.gov/resource/hda6-fnsh.json?$limit=3000&$$app_token=o8G9RFyZIGBbm4xexFrdV0Rfk").respond(array);

      requestFactory.getDrinkPlaces();
      $httpBackend.flush();
      expect(requestFactory.drinkPlaces[0]).toEqual([1,2]);
      expect(requestFactory.drinkPlaces[1]).toEqual([3,4]);
      expect(requestFactory.drinkPlaces[2]).toEqual([5,6]);
    });

  });

});
