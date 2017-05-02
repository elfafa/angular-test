'use strict';

angular

    .module('myApp.main', [
        'ngRoute',
        'ui.bootstrap',
        'ui.mask'
    ])

    // define the route > controller / view associations
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'main/template.html',
            controller : 'MainCtrl'
        });
    }])

    // controller for the view
    .controller('MainCtrl', [ '$scope', function(
        $scope
    ) {
        var _self = this;

        // minimum characters
        const MIN_CHAR = 2;

        // init scope
        $scope.initScope = function()
        {
            $scope.customer = {
                'open'    : true,
                'is_valid': false,
                'details' : {
                    'firstname': '',
                    'lastname' : '',
                },
                'errors': {
                    'firstname': '',
                    'lastname' : '',
                },
            };
            $scope.credit_card = {
                'open'    : false,
                'is_valid': false,
                'details' : {
                    'card_holder': '',
                    'card_number': '',
                    'expire_date': '',
                    'cvc'        : '',
                },
                'errors': {
                    'card_holder': '',
                    'card_number': '',
                    'expire_date': '',
                    'cvc'        : '',
                },
            };
            $scope.summary = {
                'open': false,
            };
        };

        // check is form field is valid
        $scope.checkFormField = function(type, field)
        {
            var error = '';
            if ('credit_card' === type && 'expire_date' === field) {
                if (! _self.isValidExpiry($scope.credit_card.details[field])) {
                    error = 'Please, fill a valid expire date';
                } else if (! _self.isFutureExpiry($scope.credit_card.details[field])) {
                    error = 'Please, fill an expire date in the future';
                }
            }
            if (
                '' === error
                && (
                    'undefined' === typeof $scope[type].details[field]
                    || MIN_CHAR > $scope[type].details[field].length
                )
            ) {
                error = 'Please, fill this information';
            }
            $scope[type].errors[field] = error;

            return error;
        };

        // submit form
        $scope.submitForm = function(type)
        {
            var is_valid = true;
            $.each($scope[type].details, function(index, value) {
                is_valid = ('' === $scope.checkFormField(type, index)) && is_valid;
            });
            if ($scope[type].is_valid = is_valid) {
                $scope[type].open    = false;
                if ('customer' === type) {
                    $scope.credit_card.open = true;
                } else {
                    $scope.summary.open = true;
                }
            }
        };

        // check if expire date is valid
        this.isValidExpiry = function(value)
        {
            var date = moment('01/'+value, 'D/M/YY');
            if (null === date || ! date.isValid()) {
                return false;
            }

            return ('01/'+value).indexOf(date.format('D/M/YY')) >= 0
                || ('01/'+value).indexOf(date.format('DD/MM/YY')) >= 0
            ;
        };

        // check if expire date is in the future
        this.isFutureExpiry = function(value)
        {
            var date = moment('01/'+value, 'D/M/YY');

            return (moment().diff(date) < 0);
        };

        $scope.initScope();
    }])

;