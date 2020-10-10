import {
  Encoder,
  TemplateCompilationContext,
  CompileTimeConstants,
  HighLevelOpcodeType,
  CompileAction,
  StatementCompileAction,
  ExpressionCompileAction,
} from '@glimmer/interfaces';
import pushBuilderOp from './push-builder';
import pushCompileOp from './push-compile';
import pushResolutionOp from './push-resolution';
import { assertNever } from '@glimmer/util';

export function concat(context: TemplateCompilationContext, actions: CompileAction[]): void {
  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];

    if (typeof action === 'number') {
      context.encoder.push(context.syntax.program.constants, action);
    } else if (action.type === HighLevelOpcodeType.OpcodeWrapper) {
      let { op, op1 } = action;
      context.encoder.push(context.syntax.program.constants, op, ...op1);
    } else if (action.type === HighLevelOpcodeType.Builder) {
      pushBuilderOp(context, action);
    }
  }
}

export function concatExpressions(
  encoder: Encoder,
  context: TemplateCompilationContext,
  action: ExpressionCompileAction | ExpressionCompileAction[],
  constants: CompileTimeConstants
): void {
  if (Array.isArray(action)) {
    for (let item of action) {
      concatExpressions(encoder, context, item, constants);
    }
  } else if (typeof action === 'number') {
    context.encoder.push(context.syntax.program.constants, action);
  } else if (action.type === HighLevelOpcodeType.OpcodeWrapper) {
    let { op, op1 } = action;
    encoder.push(context.syntax.program.constants, op, ...op1);
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

export function concatStatements(
  context: TemplateCompilationContext,
  action: StatementCompileAction | StatementCompileAction[]
): void {
  if (Array.isArray(action)) {
    for (let item of action) {
      concatStatements(context, item);
    }
  } else if (typeof action === 'number') {
    context.encoder.push(context.syntax.program.constants, action);
  } else if (action.type === HighLevelOpcodeType.OpcodeWrapper) {
    let { op, op1 } = action;
    context.encoder.push(context.syntax.program.constants, op, ...op1);
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
