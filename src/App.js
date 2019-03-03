
import React, { Component } from 'react';
import logo from './logo.svg';
import arrow from './arrow.png';
import './App.css';
import arrow_anim from './arrow-animation.gif';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';

import { Layout, Header, Navigation, Drawer, Content, Button, Dialog, DialogTitle, DialogContent, DialogActions} from 'react-mdl';

/* YANDEX key */
const API_KEY = "trnsl.1.1.20180820T200821Z.671d5ee62a4f1ea9.63ee10658bb6c39cdc93c78e747361c598572e23";


function getStyles(name, that) {
  return {
    fontWeight:
      that.state.name.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
}


class App extends Component {
  constructor(props){
    super(props) 

    this.state={text:"Type something",output:"Resulting text is shown here", languages:[], language:[], chain:{}, temp:""}
  }

  translate = () => {
    if(this.state.languages.length <= 0){
      this.setState({output: this.state.temp})
      return;
    }
    let text = this.state.temp || this.state.text;
    let language = this.state.languages.shift();
    fetch("https://translate.yandex.net/api/v1.5/tr.json/translate?lang="+language+"&key=" + API_KEY + "&text="+ text  +"&[options=1]&[format=plain]", {method: 'post'})
    .then((res) => res.json()).then((json) => json.text[0])
    .then((data) => {
      this.setState({temp: data})
      console.log({code: language, text: data})
      this.setState(prevState => ({chain: {
        ...prevState.chain,
        [language]: data
      }}))
      //&this.setState({output: data});
      this.translate();

    })
   //this.setState({output:data}
  }

  randomLanguage = (list, le_code) => {
    if(this.state.languages.length >= 5){
      this.setState({languages: this.state.languages.concat(le_code.split("-")[0] + "-" +"en")});
      console.log(this.state.languages)
      return;
    }
    console.log({_var: le_code,number: 5});
    const filtered = list.filter(language => language.includes(le_code + "-"));
    const chosen_lang = filtered[Math.floor(Math.random()*filtered.length)];
    var split = chosen_lang.split("-")[1]
    this.setState({languages: this.state.languages.concat(chosen_lang)});
    this.fetchLanguage(null, split)
  }

  fetchLanguage = (event ,code) => {
    if(event){
      this.state.languages = [];
      this.state.chain = {};
      this.state.temp = "";
      console.log("I am logging this");
    }

    var lang = code || 'en';
    fetch("https://translate.yandex.net/api/v1.5/tr.json/getLangs?key="+API_KEY, {method: 'post'}).then((res) => res.json().then((json) => this.randomLanguage(json.dirs, lang)))
  }

  selectLanguage = () => {

  }

  render() {
    return (

<MuiThemeProvider>
<div style={{height: '300px', position: 'relative'}}>
<Layout style={{background: 'url(http://www.getmdl.io/assets/demos/transparent.jpg) center / cover'}}>
    <Header transparent title="English to English" style={{color: 'white'}}>

    </Header>

    <div align = "center">

          <DialogContent>
            <p style={{color:"white"}}>It's fairly simple to use. All you have to do is <br/>
            <b>fetch the languages</b> then type something and finally translate.</p>
          </DialogContent>

      </div>
    <Content />
    
</Layout>

</div>

<div align =" center">
<div>
  <TextField
    value={this.state.text}
    hintText="MultiLine with rows: 2 and rowsMax: 4"
    multiLine={true}
    rows={2}
    rowsMax={4}
    onChange={(event)=> this.setState({text:event.target.value})}
  />
  </div>
  <RaisedButton label="Translate"
  onClick={this.translate}  disabled={this.state.languages <= 0}/>
  <RaisedButton label="Fetch languages"
  onClick={this.fetchLanguage}/>
  <div>
  <TextField
    value={this.state.output}
    hintText="MultiLine with rows: 2 and rowsMax: 4"
    multiLine={true}
    rows={2}
    rowsMax={4}
    onChange={() => console.log("change")} />  
  
 </div>
 <a href="http://translate.yandex.com/" style={{color:"black"}}>Powered by Yandex.Translate</a>
 <div>
       {Object.keys(this.state.chain).map((key, index) => {
        return <div>
          <img src={arrow} className="arrow" alt="arrow"/>
          <h4>{this.state.chain[key]}</h4>
        </div>
      })
      }  
  </div>

 </div>


</MuiThemeProvider>
      
    );
  }
}

export default App;
