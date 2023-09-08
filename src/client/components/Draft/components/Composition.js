
import React from 'react';
import PropTypes from 'prop-types';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

import { scalingFeatures, teamFeatures } from '../../Hero/constants/attributes';

import styles from './Composition.scss';

class TeamComposition extends React.Component { 
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  // to render graph
  buildGraph = (radiantStats, direStats) => {
    let keys = Object.keys(radiantStats);
    let ds1 = {
      label: 'Radiant',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    };
    let ds2 = {
      label: 'Dire',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    };
    for(let k of keys) {
      ds1.data.push(radiantStats[k]);
      ds2.data.push(direStats[k]);
    }
    let graphData = {
      labels: keys,
      datasets: [ds1, ds2],
    };
    console.log('graphData -- ', graphData);
    return graphData;
  }

  analyseTeam = (heroes, stats) => {
    console.log(stats);
    console.log(heroes);

    let res = {
      'Initiation' : [false, ""],
      'Tower-Taking': [false, ""],
      'Roshan': [false, ""],
    };

    let maxInitiation = 0;
    let maxTower = 0;
    let maxRosh = 0;
    

    let secondaryInitiation = 0;
    let secondaryTower = 0;
    let secondaryRosh = 0;

    for(let h of heroes) {

      let initiation;
      let tower;
      let rosh;

      for(let c of h['contributions']) {
        if(c.feature === 'Initiation') initiation = c.value;
        if(c.feature === 'Roshan') rosh = c.value;
        if(c.feature === 'Tower-Taking') tower = c.value;
      }

      // check for initiator
      if(initiation >= 4 && initiation > maxInitiation) {
        maxInitiation = initiation;
        res['Initiation'] = [true, h['localized_name']];
      };
      if(initiation === 3) secondaryInitiation++;

      // check for tower-hitter
      if(tower >= 4 && tower > maxTower) {
        maxTower = tower;
        res['Tower-Taking'] = [true, h['localized_name']];
      }
      if(tower === 3) secondaryTower++;

      // check for Roshan
      if(rosh >= 4 && rosh > maxRosh) {
        maxRosh = rosh;
        res['Roshan'] = [true, h['localized_name']];
      }
      if(rosh === 3) secondaryRosh++;
    }

    // check secondaries
    if(secondaryInitiation >= 3) res['Initiation'] = [true, "Team Effort"];
    if(secondaryTower >= 3) res['Tower-Taking'] = [true, "Team Effort"];
    if(secondaryRosh >= 3) res['Roshan'] = [true, "Team Effort"];

    // check pickoff OR teamfight
    if(stats['Teamfight'] - stats['Pickoff'] > 2) res['Strategy'] = "Focus on Teamfights";
    if(stats['Pickoff'] - stats['Teamfight'] > 2) res['Strategy'] = "Focus on Pickoffs";


    console.log('res -- ', res);
    return res;
  }

  compareTeams = (t1, t2) => {
    // waveclear


    // lane strength 


    // scaling / teamfight


    // vision


    // pace

  }

  getAverage = (elems) => {
    console.log('elems -- ', elems);
    let agg = 0;
    let len = 0;
    for(let e of elems) {
      if(!e) continue;
      agg += parseInt(e.value);
      len++;
    }
    return len > 0 ? agg / len : agg;
  }

  getMax = (elems) => {
    let max = 0;
    for(let e of elems) {
      if(!e) continue;
      let val = parseInt(e.value);
      max = val > max ? val : max;
    }
    return max;
  }

  getStats = (team) => {
    console.log('team -- ', team);
    let stats = {};

    for(let feature of teamFeatures) {
      stats[feature] = this.getAverage(team.map(h => h.contributions.filter(c => c.feature === feature)[0]));
    }
    for(let feature of scalingFeatures) {
      stats[feature] = this.getAverage(team.map(h => h.stats.filter(c => c.feature === feature)[0]));
    }
    console.log('stats -- ', stats); 
    return stats;
  }


  /* UI Elements */

  getTeamStatElement = (statName, analysis) => {
    let bool = analysis[0];
    let hero = analysis[1];

    return (
      <div className="row">
        <div className="label">{statName}</div>
        <div className={""}></div>
        <div className="hero"></div>
      </div>
    );
  }



  render() {
    let { radiant, dire, } = this.props; 
    let radiantStats = this.getStats(radiant);
    let direStats = this.getStats(dire);

    let graphData = this.buildGraph(radiantStats, direStats);

    let radiantAnalysis = this.analyseTeam(radiant, radiantStats);
    let direAnalysis = this.analyseTeam(dire, direStats);
    let comparativeAnalysis = this.compareTeams(radiant, dire);

    return (
      <div className='flex-column'>
        <div className='graph'>
          <Line options={options} data={graphData} />
        </div>
        
        <div className='comparison flex-row'>
          <div className={`radiant ${styles.analysis}`}>
            <div>Radiant</div>
            {
              Object.keys(radiantAnalysis).map(k => {
                return <div>{radiantAnalysis[k]}</div>
              })
            }

          </div>
          <div className={`dire ${styles.analysis}`}>
            <div>Dire</div>
            {
              Object.keys(direAnalysis).map(k => {
                return <div>{direAnalysis[k]}</div>
              })
            }
            
          </div>
        </div>
      </div>
    )
  }
}

TeamComposition.propTypes = {
  radiant: PropTypes.array.isRequired,
  dire: PropTypes.array.isRequired,
};

export default TeamComposition;



/*
<div className='flex-row'>
              { radiantStats && Object.keys(radiantStats).map(r => {
                return (
                  <div>
                    <div>{r}</div>
                    <div>{radiantStats[r]}</div>
                  </div>
                );
              })}
            </div>
            */