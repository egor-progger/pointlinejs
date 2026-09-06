import { PointlineJS } from '@pointlinejs/pointlinejs';
import { ChartConfigType } from '@pointlinejs/vendor/treant/Treant';
import './styles/draggable-example.css';

const chart_config: ChartConfigType = {
  chart: {
    container: '#draggable-example',

    animateOnInit: true,

    node: {
      draggable: true,
    },
    animation: {
      nodeAnimation: 'easeOutBounce',
      nodeSpeed: 700,
      connectorsAnimation: 'bounce',
      connectorsSpeed: 700,
    },
  },
  nodeStructure: {
    image: '../headshots/6.jpg',
    stackChildren: true,
    children: [
      {
        stackChildren: true,
        image: '../headshots/2.jpg',
        children: [
          {
            image: '../headshots/1.jpg',
          },
        ],
      },
      {
        image: '../headshots/7.jpg',
        childrenDropLevel: 1,
        stackChildren: true,
        children: [
          {
            image: '../headshots/8.jpg',
          },
        ],
      },
      {
        pseudo: true,
        children: [
          {
            image: '../headshots/4.jpg',
          },
          {
            image: '../headshots/5.jpg',
          },
        ],
      },
    ],
  },
};

const pointlineJS = new PointlineJS(chart_config as unknown as ChartConfigType);
pointlineJS.draw();
