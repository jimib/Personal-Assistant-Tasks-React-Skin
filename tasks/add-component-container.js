const _ = require('lodash');
const Promise = require('bluebird');

const TASK_NAME = 'Add Component/Container';

const COMPONENT = 'component';
const COMPONENT_STYLESHEET = 'component-stylesheet';
const CONTAINER = 'container';
const DIR_CLIENT = './client';

task( TASK_NAME )
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
					{label : 'Component', value: COMPONENT, enabled: true},
					{label : 'Component Stylesheet', value: COMPONENT_STYLESHEET, enabled: true},
					{type : 'seperator'},
					{label : 'Container', value: CONTAINER, enabled: true}
				]
			}
		}
	])
	.then( ( options ) => {
		const {name,includes} = options;
		//do something about this
		return Promise.mapSeries( _.filter([
			_.includes( includes, COMPONENT ) ? () => assistant.template( `${DIR_CLIENT}/components/${name}Component.js`, '../templates/BasicComponent.js', options ) : null,
			_.includes( includes, COMPONENT ) ? () => assistant.editCodeBlock( `${DIR_CLIENT}/components/${name}Component.js`, 'PROPTYPES', {language:'javascript'} ) : null,
			_.includes( includes, COMPONENT ) ? () => assistant.editCodeBlock( `${DIR_CLIENT}/components/${name}Component.js`, 'RENDER', {language:'jsx'} ) : null,
			_.includes( includes, COMPONENT_STYLESHEET ) ? () => assistant.template( `${DIR_CLIENT}/components/css/${name}Component.styl`, '../templates/BasicComponentStyle.styl', options ) : null,
			_.includes( includes, COMPONENT_STYLESHEET ) ? () => assistant.editCode( `${DIR_CLIENT}/components/css/${name}Component.styl`, {language:'stylus'} ) : null,
			_.includes( includes, CONTAINER ) ? () => assistant.template( `${DIR_CLIENT}/containers/${name}Container.js`, '../templates/BasicContainer.js', options ) : null,
			_.includes( includes, CONTAINER ) ? () => assistant.editCodeBlock( `${DIR_CLIENT}/containers/${name}Container.js`, 'MAP_PROPS', {language:'javascript'} ) : null,
			_.includes( includes, CONTAINER ) ? () => assistant.editCodeBlock( `${DIR_CLIENT}/containers/${name}Container.js`, 'MAP_DISPATCH', {language:'javascript'} ) : null
		]), handler => handler() );
	})
} );