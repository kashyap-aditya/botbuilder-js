/**
 * @module botbuilder-dialogs-adaptive
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import moment = require('moment');
import { ActivityEventNames, QueueStorage } from 'botbuilder-core';

import {
    BoolExpression,
    BoolExpressionConverter,
    Expression,
    StringExpression,
    StringExpressionConverter,
} from 'adaptive-expressions';

import {
    Converter,
    ConverterFactory,
    Dialog,
    DialogConfiguration,
    DialogContext,
    DialogTurnResult,
} from 'botbuilder-dialogs';

export interface ContinueConversationLaterConfiguration extends DialogConfiguration {
    date?: string | Expression | StringExpression;
    disabled?: boolean | string | Expression | BoolExpression;
    value?: unknown;
}

export class ContinueConversationLater
    extends Dialog<Record<string, unknown>>
    implements ContinueConversationLaterConfiguration {
    public static $kind = 'Microsoft.ContinueConversationLater';

    constructor(date?: string) {
        super();

        if (typeof date === 'string') {
            this.date = new StringExpression(date);
        }
    }

    public date: StringExpression;

    public disabled: BoolExpression;

    public value: unknown;

    public getConverter(property: keyof ContinueConversationLaterConfiguration): Converter | ConverterFactory {
        switch (property) {
            case 'date':
                return new StringExpressionConverter();
            case 'disabled':
                return new BoolExpressionConverter();
            default:
                return super.getConverter(property);
        }
    }

    async beginDialog(dc: DialogContext): Promise<DialogTurnResult<unknown>> {
        const state = dc.state;

        if (this.disabled && this.disabled.getValue(state)) {
            return dc.endDialog();
        }

        const dateValue = this.date.getValue(state);
        const date = moment(dateValue);
        if (!date.isValid) {
            throw new Error();
        }

        const now = moment();
        if (date.isBefore(now)) {
            throw new Error();
        }

        // Compute visibility delay and ttl from date
        const visibility = date.diff(now);
        const ttl = visibility + 1000 * 60 * 2;

        // TODO(joshgummersall) verify this
        const activity = dc.context.activity;
        activity.name = ActivityEventNames.ContinueConversation;

        // TODO(joshgummersall): this
        let queueStorage: QueueStorage;

        const result = await queueStorage.queueActivity(activity, visibility, ttl);
        return dc.endDialog(result);
    }
}
