
define( [ "ui/validation/validation" ], function() {

"use strict";

/**
 * example:
 *
    <s-validation class="ui form">
        <p class="row">
        <label>Name:</label>
        <input class="ui text" ng-model="info.name"
                               validators="[ 'required', { unique: uniqueName }, { minLength: 6 }, { maxLength: 12 } ]"
                               messages="[ { required: 'This field is required' }, { unique: 'This name has exists' } ]"
                               placeholder="Please enter your name" />
        </p>

        <p class="row">
        <label>Age:</label>
        <label class="ui select">
            <select ng-model="info.age"
                    validators="[ 'required' ]" >
                    <option value="">Choose your age</option>
                    <option ng-repeat="i in [ 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36 ]" value="{{ i }}">{{ i }}</option>
            </select>
        </label>
        </p>

        <p class="row">
        <label>Gender:</label>
        <span class="ui radioes">
            <input name="sex" class="ui radio" ng-model="info.sex" value="1" validators="[ 'required' ]" type="radio" /> Female
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            <input name="sex" class="ui radio" ng-model="info.sex" value="0" type="radio" /> Male
        </span>
        </p>

        <p class="row">
        <label>Email:</label>
        <input class="ui text" ng-model="info.email" validators="[ 'email' ]" placeholder="Yours email?" />
        </p>

        <p class="row">
        <label>Phone:</label>
        <input class="ui text" ng-model="info.phone" validators="[ 'phone' ]" placeholder="Phone number?" />
        </p>

        <p class="row">
        <label>Colors:</label>
        <span class="ui checkboxes">
             <label class="ui checkbox">
                 <input name="colors" type="checkbox" value="black" validators="[ { minLength: 1 } ]" />
                 <label>Black</label>
             </label>

             <label class="ui checkbox">
                 <input name="colors" type="checkbox" value="white" />
                 <label>White</label>
             </label>

             <label class="ui checkbox">
                 <input name="colors" type="checkbox" value="red" />
                 <label>Red</label>
             </label>
        </span>
        </p>

        <p class="row">
        <label>Seed feedback:</label>
        <label class="ui switch">
            <input type="checkbox" ng-model="info.feedback" value="Y" validators="[ 'required' ]" />
        </label>
        </p>

        <p>
        <input class="ui button transition" type="reset">
        <input class="ui button transition primary" type="submit" ng-click="push( info )" >
        </p>

    </s-validation>
 * */

angular.module( "$ui.validation", [] )
    .directive( "sValidation", function() {

        function link( $scope, $element, $attrs, undefined, transclude ) {

            var
            selector4inputs = ":input[validators]:visible:not(:button)",
            eles,
            validation,
            custom = {};

            function parse( names, values ) {

                values = values.slice( -names.length );

                for ( var i = 0, length = values.length; i < length; ++i ) {

                    var
                    value = values[i],
                    key = "object" === typeof value && Object.keys( value )[0],
                    handler = key && value[ key ];

                    if ( typeof handler === "function" ) {
                        custom[ names[i].replace( /^:\s*/, "" ) ] = handler;
                    }
                }
            }

            $element.html( transclude( $scope ) );

            eles = $element.find( selector4inputs );

            for ( var i = eles.length; --i >= 0; ) {

                var validators = eles[i].getAttribute( "validators" );

                try {
                    eval( validators );
                } catch ( ex ) {
                    parse( validators.match( /:\s*(\w+)/g ), $scope.$parent.$eval( validators ) );
                }
            }

            validation = $element.validation( {
                selector    : selector4inputs,
                message     : $scope.message,
                custom      : custom
            } );

            $element
            .find( "input:submit" )

            /** Validate the form */
            .on( "click", function( e ) {

                validation.validate().fail( function() {
                    e.stopImmediatePropagation();
                } );

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
            scope       : {
                message : "@"
            },
            template    : "<form class='ui form validation'></form>",
            link        : link
        };
    } );
} );
