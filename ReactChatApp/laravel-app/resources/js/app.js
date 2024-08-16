import React from 'react';
import ReactDOM from 'react-dom';
import ChatApp from './components/ChatApp';

if (document.getElementById('app')) {
    ReactDOM.render(<ChatApp />, document.getElementById('app'));
}
