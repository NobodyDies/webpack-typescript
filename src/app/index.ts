import template from './index.pug';
import style from './index.scss';


var myAppModule = angular.module('myApp', []);

myAppModule.filter('greet', function() {
	return function(name) {
		return 'Hello, ' + name + '!';
	};
});
