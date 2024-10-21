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
        <p>E-mail: pa.nosalski@gmail.com</p>
        <a href="https://www.buymeacoffee.com/essentialflighttool">buymeacoffee.com/essentialflighttool</a>
      </div>

      <div className="version">
        <span>21/10/2024 18:10 v1.03</span>
      </div>
    </div>
  )
}

export default Settings;