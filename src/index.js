
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Root from './containers/Root';

import store from './store/store';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/index.scss';

render(
	<Provider store={store}>
		<Root/>
	</Provider>,
	document.getElementById('root')
);