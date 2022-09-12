
import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { addHeroRequest, updateHeroRequest } from '../HeroActions';

import { 
  binaryFeatures, scalingFeatures, teamFeatures, 
  strengths, weaknesses, synergies,  
} from '../constants/attributes';


class HeroForm extends React.Component {
  
  constructor(props) {
    super(props);

    let features = scalingFeatures.map((elem) => {
      return { feature: elem, value: '1' };
    });
    let contributions = teamFeatures.map((elem) => {
      return { feature: elem, value: '1' };
    })

    this.state = {
      id: null,
      name: "",
      localized_name: "",
      attr: "",
      attack_type: "",
      position: "00000",

      binaryFeatures: [],

      features: features, 
      /*features: [
        {feature: 'Magic Damage', value: '1'},
        {feature: 'Physical Damage', value: '1'},
        {feature: 'Pure Damage', value: '1'},
        {feature: 'Physical Resistance', value: '1'},
        {feature: 'Magical Resistance', value: '1'},
        {feature: 'Burst', value: '1'},
        {feature: 'Mobility', value: '1'},
        {feature: 'Tankiness', value: '1'},
        {feature: 'Teamfight', value: '1'},
      ],*/

      weaknessesSelected: [],
      strengthsSelected: [],
      synergiesSelected: [],

      teamContributions: contributions, 
      /*teamContributions: [
        {feature: 'Initiation', value: '1'},
        {feature: 'Waveclear', value: '1'},
        {feature: 'Roshan', value: '1'},
        {feature: 'Tower-Taking', value: '1'},
        {feature: 'Damage', value: '1'},  
      ],*/
    };

    this.id = React.createRef();
    this.localized_name = React.createRef();
    this.name = React.createRef();
    this.attr = React.createRef();
    this.attack_type = React.createRef();
    this.weaknessText = React.createRef();
    this.strengthText = React.createRef();
  }

  componentDidMount() {
    let hero = this.props.hero;
    //console.log('heroform', hero);
    if(hero) {
      let state = {
        id: hero.id,
        name: hero.name,
        localized_name: hero.localized_name,
        attr: hero.attr,
        attack_type: hero.attack_type,
        position: hero.position,
        binaryFeatures: hero.utilities,
        features: hero.stats,
        weaknessesSelected: hero.weaknesses,
        synergiesSelected: hero.synergies,
        strengthsSelected: hero.strengths,
        teamContributions: hero.contributions,
      };
      this.setState(state);
    }
  }

  componentDidUpdate(prevProps) {
    const hero = this.props.hero;
    if (hero && prevProps.hero !== hero) {
      this.id.current.value = hero.id;
      this.localized_name.current.value = hero.localized_name;
      this.name.current.value = hero.name;
      this.attr.current.value = hero.attr;
      this.attack_type.current.value = hero.attack_type;

      let features = scalingFeatures.map((elem) => {
        let matches = hero.stats.filter(obj => obj.feature === elem);
        if(matches.length > 0) {
          return matches[0];
        } else {
          return { feature: elem, value: '1' };
        }
      });
      let teamContributions = teamFeatures.map((elem) => {
        let matches = hero.contributions.filter(obj => obj.feature === elem);
        if(matches.length > 0) {
          return matches[0];
        } else {
          return { feature: elem, value: '1' };
        }
      });
      //console.log(features);
      //console.log(teamContributions);

      let state = {
        id: hero.id,
        name: hero.name,
        localized_name: hero.localized_name,
        attr: hero.attr,
        attack_type: hero.attack_type,
        position: hero.position,
        binaryFeatures: hero.utilities,
        features,
        weaknessesSelected: hero.weaknesses,
        synergiesSelected: hero.synergies, 
        strengthsSelected: hero.strengths,
        teamContributions,
      };
      this.setState(state);
    }
  }

  /* change ID */

  handleIdChange = (evt) => {
    
  }

  fetchHeroData = () => {

  }

  /* add/update strengths */

  handleSelectStrength = (val) => {
    let strengths = this.state.strengthsSelected;
    strengths.push({
      feature: val,
      multiplier: 1.0,
    });
    this.setState({ strengthsSelected: strengths });
  }

  handleRemoveStrength = (item) => {
    let strengths = this.state.strengthsSelected;
    for(let feature of strengths) {
      if(feature.feature === item.feature) {
        strengths.splice(strengths.indexOf(feature), 1);
      }
    }
    this.setState({ strengthsSelected: strengths });
  }

  handleChangeStrength = (evt, item) => {
    let val = evt.target.value;
    let i = this.state.strengthsSelected.indexOf(item);
    
    if(val < 0 || val > 5) return;

    let elem = this.state.strengthsSelected[i];
    elem.multiplier = val;
    
    let strengths = this.state.strengthsSelected;
    strengths[i] = elem;

    this.setState({ strengthsSelected: strengths });
  }


  /* add/update synergies */

  handleSelectSynergy = (val) => {
    let synergies = this.state.synergiesSelected;
    synergies.push({
      feature: val,
      multiplier: 1.0,
    });
    this.setState({ synergiesSelected: synergies });
  }

  handleRemoveSynergy = (item) => {
    let synergies = this.state.synergiesSelected;
    for(let feature of synergies) {
      if(feature.feature === item.feature) {
        synergies.splice(synergies.indexOf(feature), 1);
      }
    }
    this.setState({ synergiesSelected: synergies });
  }

  handleChangeSynergy = (evt, item) => {
    let val = evt.target.value;
    let i = this.state.synergiesSelected.indexOf(item);
    
    if(val < 0 || val > 5) return;

    let elem = this.state.synergiesSelected[i];
    elem.multiplier = val;
    
    let synergies = this.state.synergiesSelected;
    synergies[i] = elem;

    this.setState({ synergiesSelected: synergies });
  }

  /* add/update weaknesses */

  handleSelectWeakness = (evt) => {
    let weaknesses = this.state.weaknessesSelected;
    weaknesses.push({
      feature: evt.target.value,
      multiplier: 1.0,
    });
    this.setState({ weaknessesSelected: weaknesses });
  }

  handleRemoveWeakness = (item) => {
    let weaknesses = this.state.weaknessesSelected;
    for(let feature of weaknesses) {
      if(feature.feature === item.feature) {
        weaknesses.splice(weaknesses.indexOf(feature), 1);
      }
    }
    this.setState({ weaknessesSelected: weaknesses });
  }

  handleChangeWeakness = (evt, item) => {
    let val = evt.target.value;
    if(val < 0 || val > 5) return;

    let i = this.state.weaknessesSelected.indexOf(item);
    let elem = this.state.weaknessesSelected[i];
    elem.multiplier = val;
    
    let weaknesses = this.state.weaknessesSelected;
    weaknesses[i] = elem;

    this.setState({ weaknessesSelected: weaknesses });
  }

  /* update feature */

  handleUpdateFeature = (evt, item) => {
    let val = evt.target.value;
    if(val < 0 || val > 5) return;

    let i = this.state.features.indexOf(item);
    let elem = this.state.features[i];
    elem.value = val;
    
    let contributions = this.state.features;
    contributions[i] = elem;

    this.setState({ features: contributions });
  }

  /* update team contribution */

  handleUpdateContribution = (evt, item) => {
    let val = evt.target.value;
    if(val < 0 || val > 5) return;

    let i = this.state.teamContributions.indexOf(item);
    let elem = this.state.teamContributions[i];
    elem.value = val;
    
    let contributions = this.state.teamContributions;
    contributions[i] = elem;

    this.setState({ teamContributions: contributions });
  }

  /* toggle binary Feature checkboxes */
  
  isFeatureChecked(option) {
    let state = this.state.binaryFeatures.includes(option);
    //console.log('option --> ', option, state);
    return state;
  }

  handleCheckboxChanged = (option) => {
    console.log('handleCheckboxChanged --> ', option);
    let selected = this.state.binaryFeatures;

    // add or remove checkbox 'option' from array
    selected.includes(option) 
      ? selected.splice(selected.indexOf(option), 1) 
      : selected.push(option);

    this.setState({binaryFeatures: selected});
  }

  /* change Position */

  isPositionChecked(idx) {
    let state = this.state.position[idx] === '1';
    //console.log('position ', idx, state);
    return state;
  }

  togglePosition = (idx) => {
    let str = this.state.position;
    str = str[idx] === '0' ? str.replaceAt(idx, '1') : str.replaceAt(idx, '0');
    this.setState({position: str});
  }

  /* HTTP request */

  handleSubmit = () => {
    console.log(this.weaknessText.current.value.split(/\r?\n/)); // for newline delimiter
    //console.log(this.weaknessText.current.value.split(',')); // for comma delimiter
    // can use whichever returns longer array (simple fix)
    console.log(this.strengthText.current.value.split(/\r?\n/)); // for newline delimiter

    let hero = {
      id: this.id.current.value,
      localized_name: this.localized_name.current.value,
      name: this.name.current.value,
      attr: this.attr.current.value,
      attack_type: this.attack_type.current.value,
      position: this.state.position,
      utilities: this.state.binaryFeatures, 
      stats: this.state.features,
      strengths: this.state.strengthsSelected, 
      weaknesses: this.state.weaknessesSelected,
      synergies: this.state.strengthsSelected,
      contributions: this.state.teamContributions,
    };

    //console.log('submit hero --> ', hero);
    //console.log('props hero --> ', this.props.hero);

    /*if(this.props.hero) {
      this.props.dispatch(updateHeroRequest(hero, this.props.hero._id));
    } else {
      this.props.dispatch(addHeroRequest(hero));
    }*/
  }
  
  render() {
    //console.log('hero form --> ', this.props.hero);

    return (
      <div>
        <div className="flex-column pad-list form">
          Hero Form
          <input type="number" id="heroId" placeholder="heroId" onChange={this.handleIdChange} min="1" max="137" ref={this.id} />
          <input type="text" id="name" placeholder="name" ref={this.name} />
          <input type="text" id="localized_name" placeholder="localized_name" ref={this.localized_name} />
          <input type="text" id="attr" placeholder="attribute" ref={this.attr} />
          <input type="text" id="attack_type" placeholder="attack type" ref={this.attack_type} />

          <div>Utility:</div>
          <div className="indent-children features">
            {binaryFeatures.map((item, index) => (
              <div key={`feature${index}`}>
                <input value={item} type="checkbox" onClick={() => this.handleCheckboxChanged(item)} 
                  checked={this.isFeatureChecked(item)} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div>Synergies:</div>
          <select onChange={e => this.handleSelectSynergy(e.target.value)}>
            { synergies.map((item, index) => {
              return <option key={index} value={item}>{item}</option>
            })}
          </select>
          <div className="indent-children synergies">
            { this.state.synergiesSelected.map((item, index) => (
              <div key={`strength${index}`}>
                <input type="number" min="1.0" max="5.0" step="0.1" value={item.value} onChange={(evt) => this.handleChangeSynergy(evt, item)} />
                <span>{item.feature}</span>
                <span className="left-padded click-cursor" onClick={() => this.handleRemoveSynergy(item)}>x</span>
              </div>
            ))}
          </div>

          <div>Strengths:</div>
          <select onChange={e => this.handleSelectStrength(e.target.value)}>
            { strengths.map((item, index) => {
              return <option key={index} value={item}>{item}</option>
            })}
          </select>
          <div className="indent-children features">
            { this.state.strengthsSelected.map((item, index) => (
              <div key={`strength${index}`}>
                <input type="number" min="1.0" max="5.0" step="0.1" value={item.multiplier} onChange={(evt) => this.handleChangeStrength(evt, item)} />
                <span>{item.feature}</span>
                <span className="left-padded click-cursor" onClick={() => this.handleRemoveStrength(item)}>x</span>
              </div>
            ))}
          </div>
          
          <div>Weaknesses:</div>
          <select onChange={(evt) => this.handleSelectWeakness(evt)}>
            { weaknesses.map((item, index) => {
              return <option key={index} value={item}>{item}</option>
            })}
          </select>
          <div className="indent-children features">
            { this.state.weaknessesSelected.map((item, index) => (
              <div key={`weakness${index}`}>
                <input type="number" min="1.0" max="5.0" step="0.1" value={item.multiplier} onChange={(evt) => this.handleChangeWeakness(evt, item)} />
                <span>{item.feature}</span>
                <span className="left-padded click-cursor" onClick={() => this.handleRemoveWeakness(item)}>x</span>
              </div>
            ))}
          </div>

          <div>Features:</div>
          <div className="indent-children features">
            {this.state.features.map((item, index) => (
              <div key={`feature${index}`}>
                <input type="number" min="1" max="5" value={item.value} onChange={(evt) => this.handleUpdateFeature(evt, item)} />
                <span>{item.feature}</span>
              </div>
            ))}
          </div>

          <div>Team Contribution:</div>
          <div className="indent-children features">
            {this.state.teamContributions.map((item, index) => (
              <div key={`contribution${index}`}>
                <input type="number" min="1" max="5" value={item.value} onChange={(evt) => this.handleUpdateContribution(evt, item)} />
                <span>{item.feature}</span>
              </div>
            ))}
          </div>

          <div>Positions:</div>
          <div className="indent-children positions">
            {[...Array(5).keys()].map((val, index) => {
              return (<div key={`position${index}`}>
                <input type="checkbox" value={`pos${val + 1}`} id={`pos${val + 1}`} onChange={() => this.togglePosition(val)} 
                  checked={this.isPositionChecked(index)} />
                <span>Pos{val + 1}</span>
              </div>);
            })} 
          </div>

          <div>WeaknessText:</div>
          <div>
            <textarea id='weaknessesTextbox' ref={this.weaknessText} />
          </div>

          <div>StrengthText:</div>
          <div>
            <textarea id='strengthsTextbox' ref={this.strengthText} />
          </div>

          <button onClick={this.handleSubmit}>Submit</button>

        </div>
      </div> 
    );
  }
}

HeroForm.propTypes = {

}

export default HeroForm;