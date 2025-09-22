import { PointlineJS } from '@pointlinejs/pointlinejs';
import { ChartConfigType } from '@pointlinejs/vendor/treant/Treant';
import './styles/collapsable.css';

const chart_config: ChartConfigType = {
  chart: {
    rootOrientation: 'WEST',
    container: '#collapsable-example',

    animateOnInit: true,

    node: {
      collapsable: true,
    },
    animation: {
      nodeAnimation: 'easeOutBounce',
      nodeSpeed: 700,
      connectorsAnimation: 'bounce',
      connectorsSpeed: 700,
    },
  },
  nodeStructure: {
    image: 'img/malory.png',
    stackChildren: true,
    children: [
      {
        stackChildren: true,
        text: {
          name: 'lana',
          href: {
            href: 'http://www.google.com',
            target: '_blank',
            val: 'lana'
          },
        },
        image: 'img/lana.png',
        collapsed: true,
        children: [
          {
            image: 'img/figgs.png',
          },
        ],
      },
      {
        image: 'img/sterling.png',
        childrenDropLevel: 1,
        stackChildren: true,
        children: [
          {
            image: 'img/woodhouse.png',
          },
        ],
      },
      {
        pseudo: true,
        children: [
          {
            image: 'img/cheryl.png',
          },
          {
            image: 'img/pam.png',
          },
        ],
      },
    ],
  },
};

const graphJS = new PointlineJS(chart_config as unknown as ChartConfigType);
graphJS.draw();
