import './styles/action-buttons.css';
import { PointlineJS } from '@pointlinejs/pointlinejs';
import { ChartConfigType } from '@pointlinejs/vendor/treant/Treant';

var chart_config = {
  chart: {
    container: "#action-buttons-example",

    connectors: {
      type: 'step'
    },
    node: {
      HTMLclass: 'nodeExample1'
    }
  },
  actionsId: 'guiButtons',
  nodeStructure: {
    text: {
      name: "Mark Hill",
      title: "Chief executive officer",
      contact: "Tel: 01 213 123 134",
    },
    image: "../headshots/2.jpg",
    children: [
      {
        text: {
          name: "Joe Linux",
          title: "Chief Technology Officer",
        },
        stackChildren: true,
        image: "../headshots/1.jpg",
      },
      {
        stackChildren: true,
        text: {
          name: "Linda May",
          title: "Chief Business Officer",
        },
        image: "../headshots/5.jpg",
      },
      {
        text: {
          name: "John Green",
          title: "Chief accounting officer",
          contact: "Tel: 01 213 123 134",
        },
        image: "../headshots/6.jpg",
        children: [
          {
            text: {
              name: "Erica Reel",
              title: "Chief Customer Officer"
            },
            link: {
              href: "http://www.google.com"
            },
            image: "../headshots/10.jpg"
          }
        ]
      }
    ]
  }
};

const pointlinejs = new PointlineJS(chart_config as unknown as ChartConfigType, 'guiButtons');
await pointlinejs.draw();