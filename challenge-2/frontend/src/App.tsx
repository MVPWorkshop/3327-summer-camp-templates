import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRouter from './router';
import { Provider } from 'react-redux'
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <AppRouter/>
      </HashRouter>
    </Provider>
  );
}

export default App;
