import "./styles/main.scss";
import image1 from '../headshots/1.jpg';
import image2 from '../headshots/2.jpg';
import image3 from '../headshots/3.jpg';
import image4 from '../headshots/4.jpg';
import image5 from '../headshots/5.jpg';
import image6 from '../headshots/6.jpg';
import image7 from '../headshots/7.jpg';
import image8 from '../headshots/8.jpg';
import image9 from '../headshots/9.jpg';
import image10 from '../headshots/10.jpg';
import image11 from '../headshots/11.jpg';
import { PointlineJS } from "@pointlinejs/pointlinejs";
import { ChartConfigType } from "@treantjs/Treant";

var config = {
    container: "#basic-example",

    connectors: {
        type: 'step'
    },
    node: {
        HTMLclass: 'nodeExample1'
    }
},
    ceo = {
        text: {
            name: "Mark Hill",
            title: "Chief executive officer",
            contact: "Tel: 01 213 123 134",
        },
        image: "../headshots/2.jpg"
    },

    cto = {
        parent: ceo,
        text: {
            name: "Joe Linux",
            title: "Chief Technology Officer",
        },
        stackChildren: true,
        image: "../headshots/1.jpg"
    },
    cbo = {
        parent: ceo,
        stackChildren: true,
        text: {
            name: "Linda May",
            title: "Chief Business Officer",
        },
        image: "../headshots/5.jpg"
    },
    cdo = {
        parent: ceo,
        text: {
            name: "John Green",
            title: "Chief accounting officer",
            contact: "Tel: 01 213 123 134",
        },
        image: "../headshots/6.jpg"
    },
    cio = {
        parent: cto,
        text: {
            name: "Ron Blomquist",
            title: "Chief Information Security Officer"
        },
        image: "../headshots/8.jpg"
    },
    // ciso = {
    //     parent: cto,
    //     text: {
    //         name: "Michael Rubin",
    //         title: "Chief Innovation Officer",
    //         contact: { val: "we@aregreat.com", href: "mailto:we@aregreat.com" }
    //     },
    //     image: "../headshots/9.jpg"
    // },
    cio2 = {
        parent: cdo,
        text: {
            name: "Erica Reel",
            title: "Chief Customer Officer"
        },
        link: {
            href: "http://www.google.com"
        },
        image: "../headshots/10.jpg"
    },
    ciso2 = {
        parent: cbo,
        text: {
            name: "Alice Lopez",
            title: "Chief Communications Officer"
        },
        image: "../headshots/7.jpg"
    },
    // ciso3 = {
    //     parent: cbo,
    //     text: {
    //         name: "Mary Johnson",
    //         title: "Chief Brand Officer"
    //     },
    //     image: "../headshots/4.jpg"
    // },
    // ciso4 = {
    //     parent: cbo,
    //     text: {
    //         name: "Kirk Douglas",
    //         title: "Chief Business Development Officer"
    //     },
    //     image: "../headshots/11.jpg"
    // },
    chart_config = [
        config,
        ceo,
        cto,
        cbo,
        cdo,
        cio,
        // ciso,
        cio2,
        ciso2,
        // ciso3,
        // ciso4
    ];

// Antoher approach, same result
// JSON approach


// var chart_config = {
//     chart: {
//         container: "#basic-example",

//         connectors: {
//             type: 'step'
//         },
//         node: {
//             HTMLclass: 'nodeExample1'
//         }
//     },
//     nodeStructure: {
//         text: {
//             name: "Mark Hill",
//             title: "Chief executive officer",
//             contact: "Tel: 01 213 123 134",
//         },
//         image: "../headshots/2.jpg",
//         children: [
//             {
//                 text: {
//                     name: "Joe Linux",
//                     title: "Chief Technology Officer",
//                 },
//                 stackChildren: true,
//                 image: "../headshots/1.jpg",
//                 children: [
//                 ]
//             },
//             {
//                 stackChildren: true,
//                 text: {
//                     name: "Linda May",
//                     title: "Chief Business Officer",
//                 },
//                 image: "../headshots/5.jpg",
//                 children: [
//                 ]
//             },
//             {
//                 text: {
//                     name: "John Green",
//                     title: "Chief accounting officer",
//                     contact: "Tel: 01 213 123 134",
//                 },
//                 image: "../headshots/6.jpg",
//                 children: [
//                     {
//                         text: {
//                             name: "Erica Reel",
//                             title: "Chief Customer Officer"
//                         },
//                         link: {
//                             href: "http://www.google.com"
//                         },
//                         image: "../headshots/10.jpg"
//                     }
//                 ]
//             }
//         ]
//     }
// };


const graphJS = new PointlineJS(chart_config as unknown as ChartConfigType);
graphJS.draw();