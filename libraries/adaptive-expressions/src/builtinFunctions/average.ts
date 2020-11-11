/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EvaluateExpressionDelegate, ExpressionEvaluator } from '../expressionEvaluator';
import { ExpressionType } from '../expressionType';
import { FunctionUtils } from '../functionUtils';
import { ReturnType } from '../returnType';

/**
 * Return the average of a numeric array.
 */
export class Average extends ExpressionEvaluator {
    /**
     * Initializes a new instance of the [Average](xref:adaptive-expressions.Average) class.
     */
    public constructor() {
        super(ExpressionType.Average, Average.evaluator(), ReturnType.Number, FunctionUtils.validateUnary);
    }

    /**
     * @private
     */
    private static evaluator(): EvaluateExpressionDelegate {
        return FunctionUtils.apply((args: Readonly<unknown[]>): number => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const args0 = args[0] as any[];
            return args0.reduce((x: number, y: number): number => x + y) / args0.length;
        }, FunctionUtils.verifyNumericList);
    }
}
