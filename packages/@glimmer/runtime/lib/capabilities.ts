import {
  ComponentCapabilities,
  ComponentManager,
  WithUpdateHook,
  WithPrepareArgs,
  WithCreateInstance,
  WithDynamicLayout,
} from '@glimmer/interfaces';
import { check, CheckNumber } from '@glimmer/debug';

export const enum Capability {
  DynamicLayout = 0b000000000001,
  DynamicTag = 0b000000000010,
  PrepareArgs = 0b000000000100,
  CreateArgs = 0b000000001000,
  AttributeHook = 0b000000010000,
  ElementHook = 0b000000100000,
  DynamicScope = 0b000001000000,
  CreateCaller = 0b000010000000,
  UpdateHook = 0b000100000000,
  CreateInstance = 0b001000000000,
  Wrapped = 0b010000000000,
  WillDestroy = 0b100000000000,
}

/**
 * Converts a ComponentCapabilities object into a 32-bit integer representation.
 */
export function capabilityFlagsFrom(capabilities: ComponentCapabilities): Capability {
  return (
    0 |
    (capabilities.dynamicLayout ? Capability.DynamicLayout : 0) |
    (capabilities.dynamicTag ? Capability.DynamicTag : 0) |
    (capabilities.prepareArgs ? Capability.PrepareArgs : 0) |
    (capabilities.createArgs ? Capability.CreateArgs : 0) |
    (capabilities.attributeHook ? Capability.AttributeHook : 0) |
    (capabilities.elementHook ? Capability.ElementHook : 0) |
    (capabilities.dynamicScope ? Capability.DynamicScope : 0) |
    (capabilities.createCaller ? Capability.CreateCaller : 0) |
    (capabilities.updateHook ? Capability.UpdateHook : 0) |
    (capabilities.createInstance ? Capability.CreateInstance : 0) |
    (capabilities.wrapped ? Capability.Wrapped : 0) |
    (capabilities.willDestroy ? Capability.WillDestroy : 0)
  );
}

export interface CapabilityMap {
  [Capability.DynamicLayout]: WithDynamicLayout;
  [Capability.DynamicTag]: ComponentManager;
  [Capability.PrepareArgs]: WithPrepareArgs;
  [Capability.CreateArgs]: ComponentManager;
  [Capability.AttributeHook]: ComponentManager;
  [Capability.ElementHook]: ComponentManager;
  [Capability.DynamicScope]: ComponentManager;
  [Capability.CreateCaller]: ComponentManager;
  [Capability.UpdateHook]: WithUpdateHook;
  [Capability.CreateInstance]: WithCreateInstance;
  [Capability.Wrapped]: ComponentManager;
  [Capability.WillDestroy]: ComponentManager;
}

export function managerHasCapability<F extends keyof CapabilityMap>(
  _manager: ComponentManager,
  capabilities: Capability,
  capability: F
): _manager is CapabilityMap[F] {
  check(capabilities, CheckNumber);
  return !!(capabilities & capability);
}

export function hasCapability<F extends keyof CapabilityMap>(
  capabilities: Capability,
  capability: F
): boolean {
  check(capabilities, CheckNumber);
  return !!(capabilities & capability);
}
