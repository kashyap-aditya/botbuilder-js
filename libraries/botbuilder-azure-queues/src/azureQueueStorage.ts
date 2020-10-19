/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { QueueClient, QueueServiceClient, StoragePipelineOptions } from '@azure/storage-queue';
import { Activity, QueueStorage } from 'botbuilder';

/**
 * AzureQueueStorage adds messages to an Azure Storage Queues
 */
export class AzureQueuesStorage implements QueueStorage<string> {
    private readonly _queueClient: QueueClient;
    private _initializePromise: Promise<unknown>;

    constructor(connectionString: string, queueName: string, options?: StoragePipelineOptions) {
        const serviceClient = QueueServiceClient.fromConnectionString(connectionString, options);
        this._queueClient = serviceClient.getQueueClient(queueName);
    }

    private _initialize(): Promise<unknown> {
        if (!this._initializePromise) {
            this._initializePromise = this._queueClient.createIfNotExists();
        }
        return this._initializePromise;
    }

    public async queueActivity(activity: Activity, visibilityTimeout?: number, timeToLive?: number): Promise<string> {
        await this._initialize();

        const payload = JSON.stringify(activity);
        const encoded = Buffer.from(payload, 'utf-8').toString('base64');

        const response = await this._queueClient.sendMessage(encoded, {
            visibilityTimeout,
            messageTimeToLive: timeToLive,
        });

        return JSON.stringify(response);
    }
}
