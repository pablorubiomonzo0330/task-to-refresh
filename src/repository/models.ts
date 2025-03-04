export interface Shipment{
    shipmentId: string,
    trackingKey: TrackingKey,
    states: State[],
    createdAt: Date
}

export interface TrackingKey{
    carrier: string,
    trackingNumber: string
}

export interface State{
    title: string,
    createdAt: Date
}