import {
  CompileTimeConstants,
  CompileTimeResolver,
  ContainingMetadata,
  Encoder,
  ExpressionCompileAction,
  HighLevelResolutionOp,
  HighLevelResolutionOpcode,
  IfResolvedOp,
  Op,
  Option,
  ResolveHandle,
  TemplateCompilationContext,
  WireFormat,
} from '@glimmer/interfaces';
import { exhausted } from '@glimmer/util';
import { error, op } from '../opcode-builder/encoder';
import { Call, PushPrimitive } from '../opcode-builder/helpers/vm';
import { concatExpressions } from './concat';
import { EXPRESSIONS } from './expressions';

export default function pushResolutionOp(
  encoder: Encoder,
  context: TemplateCompilationContext,
  operation: HighLevelResolutionOp,
  constants: CompileTimeConstants
): void {
  switch (operation.op) {
    case HighLevelResolutionOpcode.Expr:
      concatExpressions(encoder, context, expr(operation.op1, context.meta), constants);
      break;
    case HighLevelResolutionOpcode.IfResolved: {
      concatExpressions(encoder, context, ifResolved(context, operation), constants);
      break;
    }
    case HighLevelResolutionOpcode.ResolveFree: {
      throw new Error('Unimplemented HighLevelResolutionOpcode.ResolveFree');
    }

    case HighLevelResolutionOpcode.ResolveAmbiguous: {
      let { upvar, allowComponents } = operation.op1;
      let resolver = context.syntax.program.resolver;
      let name = context.meta.upvars![upvar];

      let resolvedHelper = resolver.lookupHelper(name, context.meta.referrer);
      let expressions: ExpressionCompileAction[];

      if (resolvedHelper) {
        expressions = Call({ handle: resolvedHelper, params: null, hash: null });
      } else {
        if (allowComponents) {
          let resolvedComponent = resolver.lookupComponent(name, context.meta.referrer);

          if (resolvedComponent) {
            throw new Error(`unimplemented {{component-name}}`);
          }
        }

        expressions = [op(Op.GetVariable, 0), op(Op.GetProperty, name)];
      }

      concatExpressions(encoder, context, expressions, constants);

      break;
    }

    default:
      return exhausted(operation);
  }
}

export function expr(
  expression: WireFormat.Expression,
  meta: ContainingMetadata
): ExpressionCompileAction[] {
  if (Array.isArray(expression)) {
    return EXPRESSIONS.compile(expression, meta);
  } else {
    return [PushPrimitive(expression), op(Op.PrimitiveReference)];
  }
}

function ifResolved(
  context: TemplateCompilationContext,
  { op1 }: IfResolvedOp
): ExpressionCompileAction[] {
  let { kind, name, andThen, span } = op1;

  let resolved = resolve(context.syntax.program.resolver, kind, name, context.meta.referrer);

  if (resolved !== null) {
    return andThen(resolved);
  } else {
    return [error(`Unexpected ${kind} ${name}`, span.start, span.end)];
  }
}

function resolve(
  resolver: CompileTimeResolver,
  kind: ResolveHandle,
  name: string,
  referrer: unknown
): Option<number> {
  switch (kind) {
    case ResolveHandle.Modifier:
      return resolver.lookupModifier(name, referrer);
    case ResolveHandle.Helper:
      return resolver.lookupHelper(name, referrer);
    case ResolveHandle.ComponentDefinition: {
      let component = resolver.lookupComponent(name, referrer);
      return component && component.handle;
    }
  }
}
