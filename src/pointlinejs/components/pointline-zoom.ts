import { injectable } from "inversify";
import Panzoom from '@panzoom/panzoom';

@injectable()
export class PointlineZoom {
    public initZoom(containerId: string) {
        const mainContainer = document.getElementById(containerId);
        if (mainContainer) {
            const panzoom = Panzoom(mainContainer, {
                disablePan: true
            });
            mainContainer.addEventListener('wheel', panzoom.zoomWithWheel);
        }
    }
}