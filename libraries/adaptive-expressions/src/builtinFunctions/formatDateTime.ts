/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import moment from 'moment';

import { Expression } from '../expression';
import { EvaluateExpressionDelegate, ExpressionEvaluator } from '../expressionEvaluator';
import { ExpressionType } from '../expressionType';
import { FunctionUtils } from '../functionUtils';
import { InternalFunctionUtils } from '../functionUtils.internal';
import { ReturnType } from '../returnType';

/**
 * Return a timestamp in the specified format.
 * Format reference: https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings
 */
export class FormatDateTime extends ExpressionEvaluator {
    /**
     * Initializes a new instance of the [FormatDateTime](xref:adaptive-expressions.FormatDateTime) class.
     */
    public constructor() {
        super(ExpressionType.FormatDateTime, FormatDateTime.evaluator(), ReturnType.String, FormatDateTime.validator);
    }

    /**
     * @private
     */
    private static evaluator(): EvaluateExpressionDelegate {
        return FunctionUtils.applyWithError((args: Readonly<(Date | string)[]>): { value: unknown; error: string } => {
            let error: string;
            let arg: Date | string = args[0];
            if (typeof arg === 'string') {
                error = InternalFunctionUtils.verifyTimestamp(arg.toString());
            } else {
                arg = arg.toISOString();
            }
            let value: unknown;
            if (!error) {
                let dateString: string;
                if (arg.endsWith('Z')) {
                    dateString = new Date(arg).toISOString();
                } else {
                    try {
                        dateString = new Date(`${arg}Z`).toISOString();
                    } catch (err) {
                        dateString = new Date(arg).toISOString();
                    }
                }

                value =
                    args.length === 2
                        ? moment(dateString)
                              .utc()
                              .format(FunctionUtils.timestampFormatter(args[1] as string))
                        : dateString;
            }

            return { value, error };
        });
    }

    /**
     * @private
     */
    private static validator(expression: Expression): void {
        FunctionUtils.validateOrder(expression, [ReturnType.String], ReturnType.String);
    }
}
