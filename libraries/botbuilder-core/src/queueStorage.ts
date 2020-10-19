/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Activity } from 'botframework-schema';

export const QueueStorageStateKey = Symbol('QueueStorageStateKey');

/**
 * QueueStorage describes the set of methods required to queue activities for later consumption
 */
export abstract class QueueStorage<T = unknown> {
    /**
     * Used to get and set queue storage instances on turn context state
     */
    public static stateKey = Symbol('queueStorage.stateKey');

    public abstract queueActivity(activity: Activity, visibilityTimeout?: number, timeToLive?: number): Promise<T>;
}
