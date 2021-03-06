// Service for storing and serving information

app.factory('infoService', function($cookies, $http, $q, $resource, $window) {
    var metaDescription = "";
    
    var KEY_LOCALE = "locale"; // key for storing locale in cookies
    var DEFAULT_LOCALE = 'en';
    
    var DEFAULT_TITLE = "Takeshi Mochida";
    var titles = {};
    var pageClass = "";

    // set locale cookie to default if it doesn't exist
    if (typeof($cookies.get(KEY_LOCALE)) == 'undefined') {
        $cookies.put("locale", DEFAULT_LOCALE);
    }

    return {
        getDescription: function() {
            return metaDescription;
        },
        setDescription: function(description) {
            metaDescription = description;
        },

        getLocale: function() {
            return $cookies.get(KEY_LOCALE);
        },
        setLocale: function(newLocale) {
            $cookies.put(KEY_LOCALE, newLocale);
            $window.location.reload();
        },
        getTranslations: function($scope, className) {
            var locale = this.getLocale();
            var filePath = 'translations/' + locale + '/' + className + '.json';
            $resource(filePath).get(function (data) {
                if (typeof(data) != 'undefined') {
                    $scope.texts = data;
                }
            });
        },

        getTitles: function($scope) {
            var locale = this.getLocale();
            var filePath = 'translations/' + locale + '/titles.json';
            
            $http.get(filePath)
                .then(function(response) {
                    if (typeof response.data != 'undefined') {
                        titles = response.data;
                        DEFAULT_TITLE = titles.default;
                    }
                });
        },
        getTitle: function() {
            if(pageClass === "") {
                return DEFAULT_TITLE;
            } else {
                return titles[pageClass] + titles.suffix;
            }
        },
        setClass: function(newClass) {
            pageClass = newClass;
        }
    }
});
