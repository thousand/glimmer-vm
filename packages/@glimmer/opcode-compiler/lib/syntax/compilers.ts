import { ContainingMetadata, SexpOpcode, SexpOpcodeMap } from '@glimmer/interfaces';
import { assert } from '@glimmer/util';

export type CompilerFunction<TSexp, TCompileAction> = (
  sexp: TSexp,
  meta: ContainingMetadata
) => TCompileAction[];

export class Compilers<TSexpOpcodes extends SexpOpcode, TCompileAction> {
  private names: {
    [name: number]: number;
  } = {};

  private funcs: CompilerFunction<any, TCompileAction>[] = [];

  add<TSexpOpcode extends TSexpOpcodes>(
    name: TSexpOpcode,
    func: CompilerFunction<SexpOpcodeMap[TSexpOpcode], TCompileAction>
  ): void {
    this.names[name] = this.funcs.push(func) - 1;
  }

  compile(sexp: SexpOpcodeMap[TSexpOpcodes], meta: ContainingMetadata): TCompileAction[] {
    let name = sexp[0];
    let index = this.names[name];
    let func = this.funcs[index];
    assert(!!func, `expected an implementation for ${sexp[0]}`);

    return func(sexp, meta);
  }
}
