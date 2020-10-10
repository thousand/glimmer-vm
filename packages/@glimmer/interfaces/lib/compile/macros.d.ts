import * as WireFormat from './wire-format';
import { NamedBlocks, ContainingMetadata } from '../template';
import { TemplateCompilationContext } from '../program';
import { StatementCompileAction } from './encoder';
import { CompileTimeResolver } from '../serialize';
import { Option } from '../core';

export interface Macros {
  blocks: MacroBlocks;
  inlines: MacroInlines;
}

export interface MacroContext {
  resolver: CompileTimeResolver;
  meta: ContainingMetadata;
}

export type BlockMacro = (
  params: WireFormat.Core.Params,
  hash: WireFormat.Core.Hash,
  blocks: NamedBlocks,
  context: MacroContext
) => StatementCompileAction[];

export type AppendMacro = (
  name: string,
  params: Option<WireFormat.Core.Params>,
  hash: Option<WireFormat.Core.Hash>,
  context: MacroContext
) => StatementCompileAction[];

export type MissingBlockMacro = (
  name: string,
  params: WireFormat.Core.Params,
  hash: WireFormat.Core.Hash,
  blocks: NamedBlocks,
  context: MacroContext
) => StatementCompileAction[];

export interface MacroBlocks {
  add(name: string, func: BlockMacro): void;
  addMissing(func: MissingBlockMacro): void;
  compile(
    name: string,
    params: WireFormat.Core.Params,
    hash: WireFormat.Core.Hash,
    blocks: NamedBlocks,
    context: TemplateCompilationContext
  ): StatementCompileAction[];
}

export class MacroInlines {
  add(name: string, func: AppendMacro): void;
  addMissing(func: AppendMacro): void;
  compile(
    sexp: WireFormat.Statements.Append,
    context: TemplateCompilationContext
  ): StatementCompileAction[];
}
