/* This file is generated by build/debug.js */

export const enum MachineOp {
  PushFrame = 0,
  PopFrame = 1,
  InvokeVirtual = 2,
  InvokeStatic = 3,
  Jump = 4,
  Return = 5,
  ReturnTo = 6,
  Size = 7,
}

export const enum Op {
  Helper = 16,
  SetNamedVariables = 17,
  SetBlocks = 18,
  SetVariable = 19,
  SetBlock = 20,
  GetVariable = 21,
  GetProperty = 22,
  GetBlock = 23,
  SpreadBlock = 24,
  HasBlock = 25,
  HasBlockParams = 26,
  Concat = 27,
  Constant = 28,
  Primitive = 29,
  PrimitiveReference = 30,
  ReifyU32 = 31,
  Dup = 32,
  Pop = 33,
  Load = 34,
  Fetch = 35,
  RootScope = 36,
  VirtualRootScope = 37,
  ChildScope = 38,
  PopScope = 39,
  Text = 40,
  Comment = 41,
  AppendHTML = 42,
  AppendSafeHTML = 43,
  AppendDocumentFragment = 44,
  AppendNode = 45,
  AppendText = 46,
  OpenElement = 47,
  OpenDynamicElement = 48,
  PushRemoteElement = 49,
  StaticAttr = 50,
  DynamicAttr = 51,
  ComponentAttr = 52,
  FlushElement = 53,
  CloseElement = 54,
  PopRemoteElement = 55,
  Modifier = 56,
  BindDynamicScope = 57,
  PushDynamicScope = 58,
  PopDynamicScope = 59,
  CompileBlock = 60,
  PushBlockScope = 61,
  PushSymbolTable = 62,
  InvokeYield = 63,
  JumpIf = 64,
  JumpUnless = 65,
  JumpEq = 66,
  AssertSame = 67,
  Enter = 68,
  Exit = 69,
  ToBoolean = 70,
  EnterList = 71,
  ExitList = 72,
  Iterate = 73,
  Main = 74,
  ContentType = 75,
  CurryComponent = 76,
  PushComponentDefinition = 77,
  PushDynamicComponentInstance = 78,
  PushCurriedComponent = 79,
  ResolveDynamicComponent = 80,
  ResolveCurriedComponent = 81,
  PushArgs = 82,
  PushEmptyArgs = 83,
  PopArgs = 84,
  PrepareArgs = 85,
  CaptureArgs = 86,
  CreateComponent = 87,
  RegisterComponentDestructor = 88,
  PutComponentOperations = 89,
  GetComponentSelf = 90,
  GetComponentTagName = 91,
  GetComponentLayout = 92,
  BindEvalScope = 93,
  SetupForEval = 94,
  PopulateLayout = 95,
  InvokeComponentLayout = 96,
  BeginComponentTransaction = 97,
  CommitComponentTransaction = 98,
  DidCreateElement = 99,
  DidRenderLayout = 100,
  InvokePartial = 101,
  ResolveMaybeLocal = 102,
  Debugger = 103,
  Size = 104,
  StaticComponentAttr = 105,
}
