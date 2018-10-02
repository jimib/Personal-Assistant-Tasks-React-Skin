const path = require('path');
const fs = require('fs-extra-promise');
const util = require('util');
const _ = require('lodash');
//add it to the projects package
const dirRoot = path.resolve( __dirname, '..', '..', '..', '..');
const dirModule = path.resolve( __dirname, '..' );

const pathToModuleTasks = path.relative( dirRoot, path.resolve( dirModule, 'tasks' ) );

const pckModule = require( path.resolve( dirModule, 'package.json' ) );

if( dirRoot != dirModule ){
	const pathToPackage = path.resolve( dirRoot, 'package.json' );
	
	fs.existsAsync( pathToPackage )
	.then( exists => {
		if( !exists ){
			console.error(`Unable to install '${pckModule.name}' as no package.json in root`);
		}else{
			return fs.readJSONAsync( pathToPackage )
			.then( pckRoot => {
				//make sure the required props exists
				pckRoot.assistant = pckRoot.assistant || {};
				pckRoot.assistant.tasks = util.isArray( pckRoot.assistant.tasks ) ? pckRoot.assistant.tasks : [];
				//add the path to our module tasks
				if( _.includes( pckRoot.assistant.tasks, pathToModuleTasks ) == false ){
					pckRoot.assistant.tasks.push( pathToModuleTasks );
					fs.writeJSONAsync( pathToPackage, pckRoot );
				}
			} );
		}
	} );
}