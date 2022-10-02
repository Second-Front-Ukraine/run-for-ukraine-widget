import React from 'react';
import logo from './logo.svg';
import './App.css';
import Widget from './components/Widget';

export interface AppProps {
  campaign: string;
  lang?: string;
}

function App(props: AppProps) {
  return (
    <div className="App">
      <Widget campaign={props.campaign} lang={props.lang}/>
    </div>
  );
}

export default App;
