const fs = require('fs-extra-promise');
const _ = require('lodash');
const Promise = require('bluebird');



task( `Add Action-Type` )
.then( (assistant, options = {}) => {
	console.log('Add Action Type');
	return assistant.list('./tests/example/actions',{extensions:['.js']})
	.then( results => {
		const regexpActionId = /([a-zA-Z0-9]+)Action[s]?.js+/;
		const items = _.filter( _.map( results, name => {
			if( regexpActionId.test( name ) ){
				const id = regexpActionId.exec( name )[1];
				return {label:name,value:{
					id,name
				}};
			}else{
				return null;
			}
		} ) );


		if( _.size( items ) == 0 ){
			return assistant.alert('No Actions/Reducers found...');
		}else{
			return assistant.ask([
				{
					name : 'action',
					type : 'choose',
					message : 'Add Action_Type for...',
					options : {
						items
					}
				}
			])
			.then( options => {
				return assistant.ask([
					{
						name : 'actionTypeName',
						message : `Action Type name...`,
						options : {
							value : `${options.action.id.toUpperCase()}_`,
						} 
					}
				])
				.then( ( result ) => _.merge( options, result ) );
			})
			.then( ( result ) => {
				const {action,actionTypeName} = result;
				const {id,name} = action;
				const NAME = `${actionTypeName}`.toUpperCase();
				const nameCamelCased = _.camelCase( NAME );
	
				const options = {id,name,NAME,nameCamelCased};
				console.log( 'Add ActionType', options );
	
				return Promise.mapSeries([
					() => assistant.template( `./tests/example/constants/ActionTypes.js`, '../templates/ActionTypes.js', options ),
					() => {
						return assistant.render( '../templates/ActionTypeConstant.js', options )
						.then( code => {
							console.log('Add code', code);
							return assistant.append( `./tests/example/constants/ActionTypes.js`, code ) 
						})
					},
					() => assistant.insertCodeBlock( `./tests/example/actions/${name}Actions.js`, 'IMPORT_ACTION_TYPE', `\t${NAME},\n` ),
					() => {
						return assistant.render( '../templates/BasicActionFunc.js', options )
						.then( code => assistant.insertCodeBlock( `./tests/example/actions/${name}Actions.js`, 'ACTION', code ) )
					},
					() => assistant.insertCodeBlock( `./tests/example/reducers/${name}Reducer.js`, 'IMPORT_ACTION_TYPE', `\t${NAME},\n` ),
					() => {
						return assistant.render( '../templates/BasicReducerFunc.js', options )
						.then( code => assistant.insertCodeBlock( `./tests/example/reducers/${name}Reducer.js`, 'REDUCER', code ) )
					}
				], handler => handler() );
				// inject the variable
				//_.includes( includes, ACTION ) ? () => assistant.template( `./tests/example/actions/${name}Actions.js`, '../templates/BasicActions.js', options ) : null,
				
			});
		}
		
	} )
} );

