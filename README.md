#Eat and Drink

This app shows the locations in Boston with active food establishment licenses. The data can be shown either as a set of circles or as a heatmap. Locations that also have liquor licenses are shown as blue circles. Those without liquor licenses have red circles.

With either circles or heatmap the data can be filtered by the year when the license was added to the city's database. The map will show all locations where the license was added on or before the year on the slider. So if the year '2009' is selected, the visible locations will be the ones with licenses added between 2006 and 2009 (2006 is the first year licenses were added).

Clicking on a circle will bring up an info window displaying the business name, address, and phone number.

The app is deployed at eat-and-drink.herokuapp.com

## Set up

After cloning the repo, run `npm install && bower install`. To preview the app locally run `grunt serve`.

## Testing

Running `grunt test` will run the unit tests with karma.

## Current issues

Clicking on some circles will not display info windows. The vast majority of circles seem to be working correctly.
Some establishments do not have a latitude and longitude associated with them. I had hoped to use google geocoder to look up the lat. and long. based on the given address, but google has a rate limit on geocoding. Running all the needed addresses through at the needed speed would noticably slow the loading of the app. For now I have chosing general performance over completion.

## Credits

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

The Google maps code comes from Google: https://developers.google.com/maps/documentation/javascript/

The topoJsonjavscript file comes from Mike Bostock: https://github.com/mbostock/topojson

The Boston city limits topoJson file comes from the Boston Redevelopment Authority: https://github.com/BostonRedevelop/BRA_webmap_static

The list of active food establishment licenses comes from the city of Boston: https://data.cityofboston.gov/Permitting/Active-Food-Establishment-Licenses/gb6y-34cq

The list of active liquor licenses comes from the city of Boston: https://data.cityofboston.gov/dataset/Liquor-Licenses/hda6-fnsh
