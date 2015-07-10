
define( [ "ui/validation/validation" ], function() {

"use strict";

/**
 * example:
 *
 <s-validation>

     <input class="ui text" ng-model="info.name"
        validators="[ 'required', { min: 6 }, { max: 12 }, { unique: uniqueName } ]"
        messages="[ { required: 'This field is required' }, { unique: 'This name has exists' } ]"/>

     <input class="ui text" ng-model="info.age" validators="[ 'required', 'number' ]" />
     <input class="ui text" ng-model="info.email" validators="[ 'email' ]" />
     <input class="ui text" ng-model="info.phone" validators="[ 'phone' ]" />
     <select ng-model="info.sex" validators="[ 'required' ]"></select>

     <input class="ui button transition primary" type="submit" ng-click="push( info )" >
 </s-validation>
 * */

angular.module( "$ui.validation", [] )
    .directive( "sValidation", function() {

        function link( $scope, $element, $attrs, transclude ) {

            var validation = $( $element ).validation();

            $element
            .delegate( "input:submit", "click", function( e ) {

                console.log( "Validation" );
                e.stopImmediatePropagation();
                e.preventDefault();
            } );
        }

        return {
            transclude  : true,
            template    : "<div class='ui validation' ng-transclude></div>",
            replace     : "true",
            link        : link
        };
    } );
} );
