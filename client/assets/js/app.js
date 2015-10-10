(function() {
  'use strict';


  var app =  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ]);
  app.config(config)
  app.run(run)


  // This controller works to use data submitted by user for use in this controller. -JMS

  app.controller('colorCalcCtrl', function($scope) {
    $scope.list = [];

    $scope.addCard = function() {
      // Push the user generated hex colors to the history cards -JMS
      $scope.list.push({bColor: $scope.bColor, rColor: $scope.rColor});
      // Reset the input and current card to default color values -JMS
      $scope.bColor = '';
      $scope.rColor = '';
    };

    $scope.getColor = function () {
      console.log('Hello from getColor');
      testVar();

      function getColorFunction(colorString, hslDifferences, mode) {

        // default mode: sass
        var mode = typeof mode !== 'undefined' ? mode : "sass";

        var colorFunction = colorString;

        // H
        if (hslDifferences[0] !== 0) { // if hue changes
          var invH = hslDifferences[0] * -1;
          var hueFunction = ( mode == "sass" ) ? "adjust-hue" : "spin";
          colorFunction = hueFunction + "( " + colorFunction + ", " + invH + "deg )";
        }

        // S
        if (hslDifferences[1] < 0) { // if second color is more saturated
          var absS = Math.abs(hslDifferences[1]);
          colorFunction = "saturate( " + colorFunction + ", " + absS + " )";
        } else if (hslDifferences[1] > 0) { // if second color is less saturated
          colorFunction = "desaturate( " + colorFunction + ", " + hslDifferences[1] + " )";
        }

        // L
        if (hslDifferences[2] < 0) { // if second color is lighter
          var absL = Math.abs(hslDifferences[2]);
          colorFunction = "lighten( " + colorFunction + ", " + absL + " )";
        } else if (hslDifferences[2] > 0) { // if second color is darker
          colorFunction = "darken( " + colorFunction + ", " + hslDifferences[2] + " )";
        }

        console.log(hslDifferences);
        return ( colorFunction );

      }

      function getColorDifferences(start, end) {

        var differences = [];

        var startColor = Color(start);
        var endColor = Color(end);

        var startColorHSL = startColor.hslArray();
        var endColorHSL = endColor.hslArray();

        for (var i = 0; i < 3; i++) {
          differences[i] = startColorHSL[i] - endColorHSL[i];
        }

        return ( differences );

      }

      // Variables from the forked repo starting on line :57 -JMS
      var startColor = $scope.rColor;
      var endColor = $scope.rColor;
      var differences = getColorDifferences(startColor, endColor);
      var outputText = getColorFunction(startColor, differences);

    };

  })

  // Custom filter to reverse the order of the array so that the latest entry resides on top. -JMS
  app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  })
  // Keep this semicolon -JMS
  ;


  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
