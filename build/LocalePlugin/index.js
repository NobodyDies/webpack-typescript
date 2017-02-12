const path = require('path'),
	fs=require('fs'),
	globExtra = require('glob-extra'),
	i18n_compile = require('i18n-compile'),
	yamljs = require('yamljs');

function fromDir(paths, cb){
	console.log('fromDir ------------', paths);

	globExtra.expandPaths(paths, {}, cb)
		.then((files) => {
			files.forEach((file) => {
				console.log('before');
				let content = fs.readFileSync(file, 'utf-8');
				content = '{' + content.substring(0, content.length-1) + '}';
				content = JSON.stringify(JSON.parse(content));
				fs.writeFileSync(file, content);
				content = yamljs.stringify(JSON.parse(content), 20, 2);
				fs.writeFileSync(file + '.yaml', content);
				i18n_compile([file + '.yaml'], path.resolve(file + '<lang>.json'), {langPlace: '<lang>'});
				console.log('after');

			})
		})
		.done(()=> {
			if(cb) {
				cb()
			}
		});
}

function LocalePlugin (options) {
	this.paths = options.paths?options.paths:[];
	this.outputDirectory = options.outputDirectory?options.outputDirectory:''
}

LocalePlugin.prototype.apply = function(compiler) {
	compiler.plugin('done', () =>  {
		console.log('this', this);

		console.log(this.paths);
		fromDir(this.paths);
	});
};

LocalePlugin.loader =  function(options) {
	return { loader: require.resolve("./loader"), options: options };
};
module.exports = LocalePlugin;