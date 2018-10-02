const fs = require('fs-extra-promise');
const _ = require('lodash');
const Promise = require('bluebird');

const ACTION = 'action';
const REDUCER = 'reducer';

task( `Add Action/Reducer` )
.then( (assistant, options = {}) => {

	return assistant.ask([
		{
			name : 'name',
			message : `Name`,
			default : options.name
		},
		{
			type: 'multiselect',
			name: 'includes',
			message : 'Include...',
			options: {
				items: [
					{label : 'Action', value: ACTION, enabled: true},
					{label : 'Reducer', value: REDUCER, enabled: true}
				]
			}
		}
	])
	.then( ( options ) => {
		const {name,includes} = options;
		//do something about this
		return Promise.mapSeries( _.filter([
			() => assistant.template( `./tests/example/reducers/index.js`, '../templates/Reducers.js', options ).catch( err => null ),
			() => assistant.insertCodeBlock( `./tests/example/reducers/index.js`, 'REDUCER_IMPORT', `import ${name.toLowerCase()} from './${name}Reducer.js'` ),
			() => assistant.insertCodeBlock( `./tests/example/reducers/index.js`, 'REDUCER_EXPORT', `${name.toLowerCase()},` ),
			_.includes( includes, ACTION ) ? () => assistant.template( `./tests/example/actions/${name}Actions.js`, '../templates/BasicActions.js', options ) : null,
			_.includes( includes, REDUCER ) ? () => assistant.template( `./tests/example/reducers/${name}Reducer.js`, '../templates/BasicReducer.js', options ) : null,
			_.includes( includes, REDUCER ) ? () => assistant.editCodeBlock( `./tests/example/reducers/${name}Reducer.js`, 'INIT_STATE', {language:'javascript'} ) : null
		]), handler => handler() )
		.then( () => {
			return {tasks:{type:'react',options:{name}}};
		});
	});
} );

