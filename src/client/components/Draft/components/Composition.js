
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

  getAnalysis = (radiantStats, direStats) => {
    let analysis = {};


    return analysis;
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

  render() {
    let { radiant, dire, } = this.props; 
    let radiantStats = this.getStats(radiant);
    let direStats = this.getStats(dire);

    let graphData = this.buildGraph(radiantStats, direStats);
    let analysis = this.getAnalysis(radiantStats, direStats);

    return (
      <div className='flex-column'>
        <div className='graph'>
          <Line options={options} data={graphData} />
        </div>
        
        <div className='comparison flex-column'>
          <div className='radiant'>
            <div>Radiant</div>
            
          </div>
          <div className='dire'>
            <div>Dire</div>
            
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