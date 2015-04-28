#Eat and Drink

This app shows the locations in Boston with active food establishment licenses. The data can be shown either as a set of circles or as a heatmap. Locations that also have liquor licenses are shown as blue circles. Those without liquor licenses have red circles.

With either circles or heatmap the data can be filtered by the year when the license was added to the city's database. The map will show all locations where the license was added on or after the year on the slider. So if the year '2009' is selected, the visible locations will be the ones with licenses added between 2009 and now.

Clicking on a circle will bring up an info window displaying the business name, address, and phone number.

The app is deployed at eat-and-drink.herokuapp.com

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Current issues

I am having some difficulty getting Jasmine to work with Google maps. So some features are currently untested.
Clicking on some circles will not display info windows. The vast majority of circles work correctly. Once testing is running with maps, hopefully the reason for the error will become apperent.

## Credits

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

The Google maps code comes from Google: https://developers.google.com/maps/documentation/javascript/

The topoJsonjavscript file comes from Mike Bostock: https://github.com/mbostock/topojson

The Boston city limits topoJson file comes from the Boston Redevelopment Authority: https://github.com/BostonRedevelop/BRA_webmap_static

The list of active food establishment licenses comes from the city of Boston: https://data.cityofboston.gov/Permitting/Active-Food-Establishment-Licenses/gb6y-34cq

The list of active liquor licenses comes from the city of Boston: https://data.cityofboston.gov/dataset/Liquor-Licenses/hda6-fnsh
