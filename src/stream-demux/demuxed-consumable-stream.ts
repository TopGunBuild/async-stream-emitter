import { ConsumableStream, ConsumableStreamConsumer } from '../consumable-stream/consumable-stream';

export class DemuxedConsumableStream<T> extends ConsumableStream<T>
{
    name: string;
    private _streamDemux: any;

    /**
     * Constructor
     */
    constructor(streamDemux: any, name: string)
    {
        super();
        this.name         = name;
        this._streamDemux = streamDemux;
    }

    createConsumer(timeout?: number): ConsumableStreamConsumer<T>
    {
        return this._streamDemux.createConsumer(this.name, timeout);
    }

    hasConsumer(consumerId)
    {
        return this._streamDemux.hasConsumer(this.name, consumerId);
    }

    getConsumerStats(consumerId)
    {
        if (!this.hasConsumer(consumerId))
        {
            return undefined;
        }
        return this._streamDemux.getConsumerStats(consumerId);
    }

    getConsumerStatsList()
    {
        return this._streamDemux.getConsumerStatsList(this.name);
    }

    getBackpressure()
    {
        return this._streamDemux.getBackpressure(this.name);
    }

    getConsumerBackpressure(consumerId)
    {
        if (!this.hasConsumer(consumerId))
        {
            return 0;
        }
        return this._streamDemux.getConsumerBackpressure(consumerId);
    }
}
