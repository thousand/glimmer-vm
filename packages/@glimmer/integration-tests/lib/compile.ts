import { precompile as rawPrecompile } from '@glimmer/compiler';
import {
  AnnotatedModuleLocator,
  Environment,
  SerializedTemplateWithLazyBlock,
  Template,
  WireFormat,
} from '@glimmer/interfaces';
import { templateFactory, TemplateFactory } from '@glimmer/opcode-compiler';
import { assign } from '@glimmer/util';
import { PrecompileOptions } from '@glimmer/syntax';

export const DEFAULT_TEST_META: AnnotatedModuleLocator = Object.freeze({
  kind: 'unknown',
  meta: {},
  module: 'some/template',
  name: 'default',
});

// TODO: This fundamentally has little to do with testing and
// most tests should just use a more generic preprocess, extracted
// out of the test environment.
export function preprocess(
  template: string,
  meta?: AnnotatedModuleLocator,
  options?: PrecompileOptions
): Template<AnnotatedModuleLocator> {
  let wrapper = JSON.parse(rawPrecompile(template, options));
  let factory = templateFactory<AnnotatedModuleLocator>(wrapper);
  return factory.create(meta || DEFAULT_TEST_META);
}

export function createTemplate(
  templateSource: string,
  options?: PrecompileOptions,
  runtimeMeta?: unknown
): TemplateFactory<AnnotatedModuleLocator> {
  let wrapper: SerializedTemplateWithLazyBlock<AnnotatedModuleLocator> = JSON.parse(
    rawPrecompile(templateSource, options)
  );

  if (runtimeMeta) {
    wrapper.meta.meta = runtimeMeta;
  }

  return templateFactory<AnnotatedModuleLocator>(wrapper);
}

export interface TestCompileOptions extends PrecompileOptions {
  env: Environment;
}

export function precompile(
  string: string,
  options?: TestCompileOptions
): WireFormat.SerializedTemplate<unknown> {
  let wrapper: WireFormat.SerializedTemplateWithLazyBlock<unknown> = JSON.parse(
    rawPrecompile(string, options)
  );

  return assign(wrapper, { block: JSON.parse(wrapper.block) });
}

export function syntaxErrorFor(
  message: string,
  code: string,
  moduleName: string,
  line: number,
  column: number
): Error {
  let quotedCode = code ? `\n\n|\n|  ${code.split('\n').join('\n|  ')}\n|\n\n` : '';

  return new Error(
    `Syntax Error: ${message}: ${quotedCode}(error occurred in '${moduleName}' @ line ${line} : column ${column})`
  );
}
