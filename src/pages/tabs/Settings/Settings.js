import './Settings.scss';

const Settings = () => {
  return (
    <div className="Settings">
      {/* <div className="upper">
        <span>INOP 😊</span>
        <p>Here you will soon be able to change the language of this add-on! Stay tuned.</p>
      </div> */}

      <div className="lower">
        <span>About me 📧</span>
        <p>Discord: pavvciu</p>
        <p>E-mail: fordcrown2009@gmail.com</p>
        <a href="https://www.buymeacoffee.com/essentialflighttool">buymeacoffee.com/essentialflighttool</a>
      </div>

      <div className="version">
        <span>12.09.2023 20:31 v1.02</span>
      </div>
    </div>
  )
}

export default Settings;