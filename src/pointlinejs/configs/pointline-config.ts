export type PointlineJSConfig = {
    /**
     * id html containter for draw action buttons
     */
    actionsId: string;
    /**
     * enable panZoom on main html container which defined
     * in chart.container
     * @default false
     */
    enablePanZoom: boolean;
}

export const defaultPointLineJSConfig: PointlineJSConfig = {
    actionsId: '',
    enablePanZoom: false
}