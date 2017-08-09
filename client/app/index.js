import $ from 'jquery';
window.$ = window.jQuery = $;
import React from 'react';
import ReactDOM from 'react-dom';
import {Controller} from 'cerebral';
import Model from 'cerebral/models/immutable';
import {Container} from 'cerebral-view-react';
import Devtools from 'cerebral-module-devtools';

import Blockchain from './modules/Blockchain';
import BallotList from './components/BallotList';

const controller = Controller(Model({}));
window.controller = controller;
controller.addModules({
  blockchain: Blockchain(),
  devtools: Devtools()
});

const app = (
  <Container controller={controller}>
    <BallotList />
  </Container>
);

ReactDOM.render(app, document.getElementById('root'));
