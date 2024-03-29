import { PointlineJS } from '@pointlinejs/pointlinejs';
import { ChartConfigType } from '@pointlinejs/vendor/treant/Treant';
import './styles/super-simple.css';

var simple_chart_config = {
  chart: {
    container: '#OrganiseChart-simple',
  },

  nodeStructure: {
    text: { name: 'Parent node' },
    children: [
      {
        text: { name: 'First child' },
      },
      {
        text: { name: 'Second child' },
      },
    ],
  },
};

// // // // // // // // // // // // // // // // // // // // // // // //

// var config = {
// 	container: "#OrganiseChart-simple"
// };

// var parent_node = {
// 	text: { name: "Parent node" }
// };

// var first_child = {
// 	parent: parent_node,
// 	text: { name: "First child" }
// };

// var second_child = {
// 	parent: parent_node,
// 	text: { name: "Second child" }
// };

// var simple_chart_config = [
// 	config, parent_node,
// 		first_child, second_child
// ];

const graphJS = new PointlineJS(
  simple_chart_config as unknown as ChartConfigType
);
graphJS.draw();
