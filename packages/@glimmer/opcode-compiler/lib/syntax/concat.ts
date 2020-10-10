import {
  Encoder,
  TemplateCompilationContext,
  CompileTimeConstants,
  HighLevelOpcodeType,
  CompileAction,
  StatementCompileAction,
  ExpressionCompileAction,
  SingleBuilderOperand,
} from '@glimmer/interfaces';
import pushBuilderOp from './push-builder';
import pushCompileOp from './push-compile';
import pushResolutionOp from './push-resolution';
import { assertNever } from '@glimmer/util';

export function concat(context: TemplateCompilationContext, actions: CompileAction[]): void {
  let { encoder } = context;
  let { constants } = context.syntax.program;

  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];

    if (Array.isArray(action)) {
      let [head, ...tail] = action;
      encoder.push(constants, head, ...(tail as SingleBuilderOperand[]));
    } else if (typeof action === 'number') {
      encoder.push(constants, action);
    } else if (action.type === HighLevelOpcodeType.Builder) {
      pushBuilderOp(context, action);
    }
  }
}

export function concatExpressions(
  encoder: Encoder,
  context: TemplateCompilationContext,
  actions: ExpressionCompileAction[],
  constants: CompileTimeConstants
): void {
  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];

    if (Array.isArray(action)) {
      let [head, ...tail] = action;
      encoder.push(constants, head, ...(tail as SingleBuilderOperand[]));
    } else if (typeof action === 'number') {
      encoder.push(constants, action);
    } else if (action.type === HighLevelOpcodeType.Resolution) {
      pushResolutionOp(encoder, context, action, constants);
    } else if (action.type === HighLevelOpcodeType.Builder) {
      pushBuilderOp(context, action);
    } else if (action.type === HighLevelOpcodeType.Error) {
      encoder.error({
        problem: action.op1.problem,
        span: {
          start: action.op1.start,
          end: action.op1.end,
        },
      });
    } else {
      throw assertNever(action, 'unexpected action kind');
    }
  }
}

export function concatStatements(
  context: TemplateCompilationContext,
  actions: StatementCompileAction[]
): void {
  let { encoder } = context;
  let { constants } = context.syntax.program;

  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];

    if (Array.isArray(action)) {
      let [head, ...tail] = action;
      encoder.push(constants, head, ...(tail as SingleBuilderOperand[]));
    } else if (typeof action === 'number') {
      context.encoder.push(constants, action);
    } else if (action.type === HighLevelOpcodeType.Compile) {
      pushCompileOp(context, action);
    } else if (action.type === HighLevelOpcodeType.Resolution) {
      pushResolutionOp(context.encoder, context, action, context.syntax.program.constants);
    } else if (action.type === HighLevelOpcodeType.Builder) {
      pushBuilderOp(context, action);
    } else if (action.type === HighLevelOpcodeType.Error) {
      context.encoder.error({
        problem: action.op1.problem,
        span: {
          start: action.op1.start,
          end: action.op1.end,
        },
      });
    } else {
      throw assertNever(action, `unexpected action type`);
    }
  }
}
