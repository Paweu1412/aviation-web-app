import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';

import App from './pages/App';

const root = ReactDOM.createRoot(document.getElementById('EFTPanelContainer'));

var customPanel = false;
document.addEventListener('beforeunload', function () {
  customPanel = false;
}, false);
class EFTPanel extends HTMLElement {
  constructor() {
    super();
    var iframe = document.querySelector("#EFTPanelContainer");
    if (iframe) {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  }
  connectedCallback() {
    var self = this;

    this.m_MainDisplay = document.querySelector("#MainDisplay");
    this.m_MainDisplay.classList.add("hidden");

    this.m_Footer = document.querySelector("#Footer");
    this.m_Footer.classList.add("hidden");

    var iframe = document.querySelector("#EFTPanelContainer");
    if (iframe) {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  }
  updateImage() {
  }
}
window.customElements.define("ingamepanel-essential-flight-tool", EFTPanel);