import { Option, WireFormat } from '@glimmer/interfaces';
import {
  EMPTY_BLOCKS,
  invokeStaticBlock,
  MacrosImpl,
  resolveLayoutForTag,
  staticComponent,
} from '@glimmer/opcode-compiler';

export class TestMacros extends MacrosImpl {
  constructor() {
    super();

    let { blocks, inlines } = this;

    blocks.add('identity', (_params, _hash, blocks) => {
      return invokeStaticBlock(blocks.get('default')!);
    });

    blocks.add('render-else', (_params, _hash, blocks) => {
      return invokeStaticBlock(blocks.get('else')!);
    });

    blocks.addMissing((name, params, hash, blocks, context) => {
      let component = resolveLayoutForTag(name, context);

      if (component !== null) {
        return staticComponent(component, [params, hashToArgs(hash), blocks]);
      }

      return [];
    });

    inlines.addMissing((name, params, hash, context) => {
      let component = resolveLayoutForTag(name, context);

      if (component !== null) {
        return staticComponent(component, [params!, hashToArgs(hash), EMPTY_BLOCKS]);
      }

      return [];
    });
  }
}

function hashToArgs(hash: Option<WireFormat.Core.Hash>): Option<WireFormat.Core.Hash> {
  if (hash === null) return null;
  let names = hash[0].map((key) => `@${key}`);
  return [names as [string, ...string[]], hash[1]];
}
