
define( [ "ui/validation/validation" ], function() {

"use strict";

/**
 * example:
 *
    <s-validation class="ui form">
        <p>
        <input class="ui text" ng-model="info.name"
           validators="[ 'required', { min: 6 }, { max: 12 }, { unique: uniqueName } ]"
           messages="[ { required: 'This field is required' }, { unique: 'This name has exists' } ]"
           placeholder="Please enter your name" />
        </p>

        <p>
        <input class="ui text" ng-model="info.age" validators="[ 'required', 'number' ]" placeholder="Your age?" />
        </p>
        <p>
        <input class="ui text" ng-model="info.email" validators="[ 'email' ]" placeholder="Yours email?" />
        </p>
        <p><input class="ui text" ng-model="info.phone" validators="[ 'phone' ]" placeholder="Phone number?" /></p>
        <p>
        <label class="ui select">
            <select ng-model="info.sex"
                    validators="[ 'required' ]" >
                    <option value="">Choose your gender</option>
                    <option value="0">Female</option>
                    <option value="1">Male</option>
            </select>
        </label>

        <input class="ui button transition primary" type="submit" ng-click="push( info )" >
        </p>

    </s-validation>
 * */

angular.module( "$ui.validation", [] )
    .directive( "sValidation", function() {

        function link( $scope, $element, $attrs, undefined, transclude ) {

            var validation;

            $element.html( transclude( $scope ) );

            validation = $( $element ).validation();

            $element
            .find( "input:submit" )

            /** Validate the form */
            .on( "click", function( e ) {

                if ( !validation.validate() ) {
                    e.stopImmediatePropagation();
                }

                e.preventDefault();
            } )

            /** Change the click event priority */
            .each( function() {

                var handlers = $._data( this, "events" )[ "click" ];
                handlers.splice( 0, 0, handlers.pop() );
            } );
        }

        return {
            transclude  : true,
            replace     : true,
            template    : "<div class='ui form'></div>",
            link        : link
        };
    } );
} );
