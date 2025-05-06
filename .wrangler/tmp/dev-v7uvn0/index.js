var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return "";
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/crypto/node.mjs
var webcrypto = new Proxy(globalThis.crypto, { get(_, key) {
  if (key === "CryptoKey") {
    return globalThis.CryptoKey;
  }
  if (typeof globalThis.crypto[key] === "function") {
    return globalThis.crypto[key].bind(globalThis.crypto);
  }
  return globalThis.crypto[key];
} });
var createCipher = /* @__PURE__ */ notImplemented("crypto.createCipher");
var createDecipher = /* @__PURE__ */ notImplemented("crypto.createDecipher");
var pseudoRandomBytes = /* @__PURE__ */ notImplemented("crypto.pseudoRandomBytes");
var Cipher = /* @__PURE__ */ notImplementedClass("crypto.Cipher");
var Decipher = /* @__PURE__ */ notImplementedClass("crypto.Decipher");

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/crypto/constants.mjs
var SSL_OP_ALL = 2147485776;
var SSL_OP_ALLOW_NO_DHE_KEX = 1024;
var SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION = 262144;
var SSL_OP_CIPHER_SERVER_PREFERENCE = 4194304;
var SSL_OP_CISCO_ANYCONNECT = 32768;
var SSL_OP_COOKIE_EXCHANGE = 8192;
var SSL_OP_CRYPTOPRO_TLSEXT_BUG = 2147483648;
var SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS = 2048;
var SSL_OP_LEGACY_SERVER_CONNECT = 4;
var SSL_OP_NO_COMPRESSION = 131072;
var SSL_OP_NO_ENCRYPT_THEN_MAC = 524288;
var SSL_OP_NO_QUERY_MTU = 4096;
var SSL_OP_NO_RENEGOTIATION = 1073741824;
var SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION = 65536;
var SSL_OP_NO_SSLv2 = 0;
var SSL_OP_NO_SSLv3 = 33554432;
var SSL_OP_NO_TICKET = 16384;
var SSL_OP_NO_TLSv1 = 67108864;
var SSL_OP_NO_TLSv1_1 = 268435456;
var SSL_OP_NO_TLSv1_2 = 134217728;
var SSL_OP_NO_TLSv1_3 = 536870912;
var SSL_OP_PRIORITIZE_CHACHA = 2097152;
var SSL_OP_TLS_ROLLBACK_BUG = 8388608;
var ENGINE_METHOD_RSA = 1;
var ENGINE_METHOD_DSA = 2;
var ENGINE_METHOD_DH = 4;
var ENGINE_METHOD_RAND = 8;
var ENGINE_METHOD_EC = 2048;
var ENGINE_METHOD_CIPHERS = 64;
var ENGINE_METHOD_DIGESTS = 128;
var ENGINE_METHOD_PKEY_METHS = 512;
var ENGINE_METHOD_PKEY_ASN1_METHS = 1024;
var ENGINE_METHOD_ALL = 65535;
var ENGINE_METHOD_NONE = 0;
var DH_CHECK_P_NOT_SAFE_PRIME = 2;
var DH_CHECK_P_NOT_PRIME = 1;
var DH_UNABLE_TO_CHECK_GENERATOR = 4;
var DH_NOT_SUITABLE_GENERATOR = 8;
var RSA_PKCS1_PADDING = 1;
var RSA_NO_PADDING = 3;
var RSA_PKCS1_OAEP_PADDING = 4;
var RSA_X931_PADDING = 5;
var RSA_PKCS1_PSS_PADDING = 6;
var RSA_PSS_SALTLEN_DIGEST = -1;
var RSA_PSS_SALTLEN_MAX_SIGN = -2;
var RSA_PSS_SALTLEN_AUTO = -2;
var POINT_CONVERSION_COMPRESSED = 2;
var POINT_CONVERSION_UNCOMPRESSED = 4;
var POINT_CONVERSION_HYBRID = 6;
var defaultCoreCipherList = "";
var defaultCipherList = "";
var OPENSSL_VERSION_NUMBER = 0;
var TLS1_VERSION = 0;
var TLS1_1_VERSION = 0;
var TLS1_2_VERSION = 0;
var TLS1_3_VERSION = 0;

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/crypto.mjs
var constants = {
  OPENSSL_VERSION_NUMBER,
  SSL_OP_ALL,
  SSL_OP_ALLOW_NO_DHE_KEX,
  SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
  SSL_OP_CIPHER_SERVER_PREFERENCE,
  SSL_OP_CISCO_ANYCONNECT,
  SSL_OP_COOKIE_EXCHANGE,
  SSL_OP_CRYPTOPRO_TLSEXT_BUG,
  SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS,
  SSL_OP_LEGACY_SERVER_CONNECT,
  SSL_OP_NO_COMPRESSION,
  SSL_OP_NO_ENCRYPT_THEN_MAC,
  SSL_OP_NO_QUERY_MTU,
  SSL_OP_NO_RENEGOTIATION,
  SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION,
  SSL_OP_NO_SSLv2,
  SSL_OP_NO_SSLv3,
  SSL_OP_NO_TICKET,
  SSL_OP_NO_TLSv1,
  SSL_OP_NO_TLSv1_1,
  SSL_OP_NO_TLSv1_2,
  SSL_OP_NO_TLSv1_3,
  SSL_OP_PRIORITIZE_CHACHA,
  SSL_OP_TLS_ROLLBACK_BUG,
  ENGINE_METHOD_RSA,
  ENGINE_METHOD_DSA,
  ENGINE_METHOD_DH,
  ENGINE_METHOD_RAND,
  ENGINE_METHOD_EC,
  ENGINE_METHOD_CIPHERS,
  ENGINE_METHOD_DIGESTS,
  ENGINE_METHOD_PKEY_METHS,
  ENGINE_METHOD_PKEY_ASN1_METHS,
  ENGINE_METHOD_ALL,
  ENGINE_METHOD_NONE,
  DH_CHECK_P_NOT_SAFE_PRIME,
  DH_CHECK_P_NOT_PRIME,
  DH_UNABLE_TO_CHECK_GENERATOR,
  DH_NOT_SUITABLE_GENERATOR,
  RSA_PKCS1_PADDING,
  RSA_NO_PADDING,
  RSA_PKCS1_OAEP_PADDING,
  RSA_X931_PADDING,
  RSA_PKCS1_PSS_PADDING,
  RSA_PSS_SALTLEN_DIGEST,
  RSA_PSS_SALTLEN_MAX_SIGN,
  RSA_PSS_SALTLEN_AUTO,
  defaultCoreCipherList,
  TLS1_VERSION,
  TLS1_1_VERSION,
  TLS1_2_VERSION,
  TLS1_3_VERSION,
  POINT_CONVERSION_COMPRESSED,
  POINT_CONVERSION_UNCOMPRESSED,
  POINT_CONVERSION_HYBRID,
  defaultCipherList
};

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/crypto.mjs
var workerdCrypto = process.getBuiltinModule("node:crypto");
var {
  Certificate,
  checkPrime,
  checkPrimeSync,
  // @ts-expect-error
  Cipheriv,
  createCipheriv,
  createDecipheriv,
  createDiffieHellman,
  createDiffieHellmanGroup,
  createECDH,
  createHash,
  createHmac,
  createPrivateKey,
  createPublicKey,
  createSecretKey,
  createSign,
  createVerify,
  // @ts-expect-error
  Decipheriv,
  diffieHellman,
  DiffieHellman,
  DiffieHellmanGroup,
  ECDH,
  fips,
  generateKey,
  generateKeyPair,
  generateKeyPairSync,
  generateKeySync,
  generatePrime,
  generatePrimeSync,
  getCipherInfo,
  getCiphers,
  getCurves,
  getDiffieHellman,
  getFips,
  getHashes,
  getRandomValues,
  hash,
  Hash,
  hkdf,
  hkdfSync,
  Hmac,
  KeyObject,
  pbkdf2,
  pbkdf2Sync,
  privateDecrypt,
  privateEncrypt,
  publicDecrypt,
  publicEncrypt,
  randomBytes,
  randomFill,
  randomFillSync,
  randomInt,
  randomUUID,
  scrypt,
  scryptSync,
  secureHeapUsed,
  setEngine,
  setFips,
  sign,
  Sign,
  subtle,
  timingSafeEqual,
  verify,
  Verify,
  X509Certificate
} = workerdCrypto;
var webcrypto2 = {
  // @ts-expect-error
  CryptoKey: webcrypto.CryptoKey,
  getRandomValues,
  randomUUID,
  subtle
};
var crypto_default = {
  /**
   * manually unroll unenv-polyfilled-symbols to make it tree-shakeable
   */
  Certificate,
  Cipher,
  Cipheriv,
  Decipher,
  Decipheriv,
  ECDH,
  Sign,
  Verify,
  X509Certificate,
  // @ts-expect-error @types/node is out of date - this is a bug in typings
  constants,
  createCipheriv,
  createDecipheriv,
  createECDH,
  createSign,
  createVerify,
  diffieHellman,
  getCipherInfo,
  hash,
  privateDecrypt,
  privateEncrypt,
  publicDecrypt,
  publicEncrypt,
  scrypt,
  scryptSync,
  sign,
  verify,
  // default-only export from unenv
  // @ts-expect-error unenv has unknown type
  createCipher,
  // @ts-expect-error unenv has unknown type
  createDecipher,
  // @ts-expect-error unenv has unknown type
  pseudoRandomBytes,
  /**
   * manually unroll workerd-polyfilled-symbols to make it tree-shakeable
   */
  DiffieHellman,
  DiffieHellmanGroup,
  Hash,
  Hmac,
  KeyObject,
  checkPrime,
  checkPrimeSync,
  createDiffieHellman,
  createDiffieHellmanGroup,
  createHash,
  createHmac,
  createPrivateKey,
  createPublicKey,
  createSecretKey,
  generateKey,
  generateKeyPair,
  generateKeyPairSync,
  generateKeySync,
  generatePrime,
  generatePrimeSync,
  getCiphers,
  getCurves,
  getDiffieHellman,
  getFips,
  getHashes,
  getRandomValues,
  hkdf,
  hkdfSync,
  pbkdf2,
  pbkdf2Sync,
  randomBytes,
  randomFill,
  randomFillSync,
  randomInt,
  randomUUID,
  secureHeapUsed,
  setEngine,
  setFips,
  subtle,
  timingSafeEqual,
  // default-only export from workerd
  fips,
  // special-cased deep merged symbols
  webcrypto: webcrypto2
};

// dist/index.js
import path from "path";
var objectToString = Object.prototype.toString;
var isArray = Array.isArray || /* @__PURE__ */ __name(function isArrayPolyfill(object) {
  return objectToString.call(object) === "[object Array]";
}, "isArrayPolyfill");
function isFunction(object) {
  return typeof object === "function";
}
__name(isFunction, "isFunction");
function typeStr(obj) {
  return isArray(obj) ? "array" : typeof obj;
}
__name(typeStr, "typeStr");
function escapeRegExp(string) {
  return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
__name(escapeRegExp, "escapeRegExp");
function hasProperty(obj, propName) {
  return obj != null && typeof obj === "object" && propName in obj;
}
__name(hasProperty, "hasProperty");
function primitiveHasOwnProperty(primitive, propName) {
  return primitive != null && typeof primitive !== "object" && primitive.hasOwnProperty && primitive.hasOwnProperty(propName);
}
__name(primitiveHasOwnProperty, "primitiveHasOwnProperty");
var regExpTest = RegExp.prototype.test;
function testRegExp(re, string) {
  return regExpTest.call(re, string);
}
__name(testRegExp, "testRegExp");
var nonSpaceRe = /\S/;
function isWhitespace(string) {
  return !testRegExp(nonSpaceRe, string);
}
__name(isWhitespace, "isWhitespace");
var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;"
};
function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, /* @__PURE__ */ __name(function fromEntityMap(s) {
    return entityMap[s];
  }, "fromEntityMap"));
}
__name(escapeHtml, "escapeHtml");
var whiteRe = /\s*/;
var spaceRe = /\s+/;
var equalsRe = /\s*=/;
var curlyRe = /\s*\}/;
var tagRe = /#|\^|\/|>|\{|&|=|!/;
function parseTemplate(template, tags) {
  if (!template)
    return [];
  var lineHasNonSpace = false;
  var sections = [];
  var tokens = [];
  var spaces = [];
  var hasTag = false;
  var nonSpace = false;
  var indentation = "";
  var tagIndex = 0;
  function stripSpace() {
    if (hasTag && !nonSpace) {
      while (spaces.length)
        delete tokens[spaces.pop()];
    } else {
      spaces = [];
    }
    hasTag = false;
    nonSpace = false;
  }
  __name(stripSpace, "stripSpace");
  var openingTagRe, closingTagRe, closingCurlyRe;
  function compileTags(tagsToCompile) {
    if (typeof tagsToCompile === "string")
      tagsToCompile = tagsToCompile.split(spaceRe, 2);
    if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
      throw new Error("Invalid tags: " + tagsToCompile);
    openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*");
    closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1]));
    closingCurlyRe = new RegExp("\\s*" + escapeRegExp("}" + tagsToCompile[1]));
  }
  __name(compileTags, "compileTags");
  compileTags(tags || mustache.tags);
  var scanner = new Scanner(template);
  var start, type, value, chr, token, openSection;
  while (!scanner.eos()) {
    start = scanner.pos;
    value = scanner.scanUntil(openingTagRe);
    if (value) {
      for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
        chr = value.charAt(i);
        if (isWhitespace(chr)) {
          spaces.push(tokens.length);
          indentation += chr;
        } else {
          nonSpace = true;
          lineHasNonSpace = true;
          indentation += " ";
        }
        tokens.push(["text", chr, start, start + 1]);
        start += 1;
        if (chr === "\n") {
          stripSpace();
          indentation = "";
          tagIndex = 0;
          lineHasNonSpace = false;
        }
      }
    }
    if (!scanner.scan(openingTagRe))
      break;
    hasTag = true;
    type = scanner.scan(tagRe) || "name";
    scanner.scan(whiteRe);
    if (type === "=") {
      value = scanner.scanUntil(equalsRe);
      scanner.scan(equalsRe);
      scanner.scanUntil(closingTagRe);
    } else if (type === "{") {
      value = scanner.scanUntil(closingCurlyRe);
      scanner.scan(curlyRe);
      scanner.scanUntil(closingTagRe);
      type = "&";
    } else {
      value = scanner.scanUntil(closingTagRe);
    }
    if (!scanner.scan(closingTagRe))
      throw new Error("Unclosed tag at " + scanner.pos);
    if (type == ">") {
      token = [type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace];
    } else {
      token = [type, value, start, scanner.pos];
    }
    tagIndex++;
    tokens.push(token);
    if (type === "#" || type === "^") {
      sections.push(token);
    } else if (type === "/") {
      openSection = sections.pop();
      if (!openSection)
        throw new Error('Unopened section "' + value + '" at ' + start);
      if (openSection[1] !== value)
        throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
    } else if (type === "name" || type === "{" || type === "&") {
      nonSpace = true;
    } else if (type === "=") {
      compileTags(value);
    }
  }
  stripSpace();
  openSection = sections.pop();
  if (openSection)
    throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
  return nestTokens(squashTokens(tokens));
}
__name(parseTemplate, "parseTemplate");
function squashTokens(tokens) {
  var squashedTokens = [];
  var token, lastToken;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];
    if (token) {
      if (token[0] === "text" && lastToken && lastToken[0] === "text") {
        lastToken[1] += token[1];
        lastToken[3] = token[3];
      } else {
        squashedTokens.push(token);
        lastToken = token;
      }
    }
  }
  return squashedTokens;
}
__name(squashTokens, "squashTokens");
function nestTokens(tokens) {
  var nestedTokens = [];
  var collector = nestedTokens;
  var sections = [];
  var token, section;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];
    switch (token[0]) {
      case "#":
      case "^":
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case "/":
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
    }
  }
  return nestedTokens;
}
__name(nestTokens, "nestTokens");
function Scanner(string) {
  this.string = string;
  this.tail = string;
  this.pos = 0;
}
__name(Scanner, "Scanner");
Scanner.prototype.eos = /* @__PURE__ */ __name(function eos() {
  return this.tail === "";
}, "eos");
Scanner.prototype.scan = /* @__PURE__ */ __name(function scan(re) {
  var match = this.tail.match(re);
  if (!match || match.index !== 0)
    return "";
  var string = match[0];
  this.tail = this.tail.substring(string.length);
  this.pos += string.length;
  return string;
}, "scan");
Scanner.prototype.scanUntil = /* @__PURE__ */ __name(function scanUntil(re) {
  var index = this.tail.search(re), match;
  switch (index) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
  }
  this.pos += match.length;
  return match;
}, "scanUntil");
function Context(view, parentContext) {
  this.view = view;
  this.cache = { ".": this.view };
  this.parent = parentContext;
}
__name(Context, "Context");
Context.prototype.push = /* @__PURE__ */ __name(function push(view) {
  return new Context(view, this);
}, "push");
Context.prototype.lookup = /* @__PURE__ */ __name(function lookup(name) {
  var cache = this.cache;
  var value;
  if (cache.hasOwnProperty(name)) {
    value = cache[name];
  } else {
    var context2 = this, intermediateValue, names, index, lookupHit = false;
    while (context2) {
      if (name.indexOf(".") > 0) {
        intermediateValue = context2.view;
        names = name.split(".");
        index = 0;
        while (intermediateValue != null && index < names.length) {
          if (index === names.length - 1)
            lookupHit = hasProperty(intermediateValue, names[index]) || primitiveHasOwnProperty(intermediateValue, names[index]);
          intermediateValue = intermediateValue[names[index++]];
        }
      } else {
        intermediateValue = context2.view[name];
        lookupHit = hasProperty(context2.view, name);
      }
      if (lookupHit) {
        value = intermediateValue;
        break;
      }
      context2 = context2.parent;
    }
    cache[name] = value;
  }
  if (isFunction(value))
    value = value.call(this.view);
  return value;
}, "lookup");
function Writer() {
  this.templateCache = {
    _cache: {},
    set: /* @__PURE__ */ __name(function set(key, value) {
      this._cache[key] = value;
    }, "set"),
    get: /* @__PURE__ */ __name(function get(key) {
      return this._cache[key];
    }, "get"),
    clear: /* @__PURE__ */ __name(function clear3() {
      this._cache = {};
    }, "clear")
  };
}
__name(Writer, "Writer");
Writer.prototype.clearCache = /* @__PURE__ */ __name(function clearCache() {
  if (typeof this.templateCache !== "undefined") {
    this.templateCache.clear();
  }
}, "clearCache");
Writer.prototype.parse = /* @__PURE__ */ __name(function parse(template, tags) {
  var cache = this.templateCache;
  var cacheKey = template + ":" + (tags || mustache.tags).join(":");
  var isCacheEnabled = typeof cache !== "undefined";
  var tokens = isCacheEnabled ? cache.get(cacheKey) : void 0;
  if (tokens == void 0) {
    tokens = parseTemplate(template, tags);
    isCacheEnabled && cache.set(cacheKey, tokens);
  }
  return tokens;
}, "parse");
Writer.prototype.render = /* @__PURE__ */ __name(function render(template, view, partials, config2) {
  var tags = this.getConfigTags(config2);
  var tokens = this.parse(template, tags);
  var context2 = view instanceof Context ? view : new Context(view, void 0);
  return this.renderTokens(tokens, context2, partials, template, config2);
}, "render");
Writer.prototype.renderTokens = /* @__PURE__ */ __name(function renderTokens(tokens, context2, partials, originalTemplate, config2) {
  var buffer = "";
  var token, symbol, value;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    value = void 0;
    token = tokens[i];
    symbol = token[0];
    if (symbol === "#") value = this.renderSection(token, context2, partials, originalTemplate, config2);
    else if (symbol === "^") value = this.renderInverted(token, context2, partials, originalTemplate, config2);
    else if (symbol === ">") value = this.renderPartial(token, context2, partials, config2);
    else if (symbol === "&") value = this.unescapedValue(token, context2);
    else if (symbol === "name") value = this.escapedValue(token, context2, config2);
    else if (symbol === "text") value = this.rawValue(token);
    if (value !== void 0)
      buffer += value;
  }
  return buffer;
}, "renderTokens");
Writer.prototype.renderSection = /* @__PURE__ */ __name(function renderSection(token, context2, partials, originalTemplate, config2) {
  var self = this;
  var buffer = "";
  var value = context2.lookup(token[1]);
  function subRender(template) {
    return self.render(template, context2, partials, config2);
  }
  __name(subRender, "subRender");
  if (!value) return;
  if (isArray(value)) {
    for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
      buffer += this.renderTokens(token[4], context2.push(value[j]), partials, originalTemplate, config2);
    }
  } else if (typeof value === "object" || typeof value === "string" || typeof value === "number") {
    buffer += this.renderTokens(token[4], context2.push(value), partials, originalTemplate, config2);
  } else if (isFunction(value)) {
    if (typeof originalTemplate !== "string")
      throw new Error("Cannot use higher-order sections without the original template");
    value = value.call(context2.view, originalTemplate.slice(token[3], token[5]), subRender);
    if (value != null)
      buffer += value;
  } else {
    buffer += this.renderTokens(token[4], context2, partials, originalTemplate, config2);
  }
  return buffer;
}, "renderSection");
Writer.prototype.renderInverted = /* @__PURE__ */ __name(function renderInverted(token, context2, partials, originalTemplate, config2) {
  var value = context2.lookup(token[1]);
  if (!value || isArray(value) && value.length === 0)
    return this.renderTokens(token[4], context2, partials, originalTemplate, config2);
}, "renderInverted");
Writer.prototype.indentPartial = /* @__PURE__ */ __name(function indentPartial(partial, indentation, lineHasNonSpace) {
  var filteredIndentation = indentation.replace(/[^ \t]/g, "");
  var partialByNl = partial.split("\n");
  for (var i = 0; i < partialByNl.length; i++) {
    if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
      partialByNl[i] = filteredIndentation + partialByNl[i];
    }
  }
  return partialByNl.join("\n");
}, "indentPartial");
Writer.prototype.renderPartial = /* @__PURE__ */ __name(function renderPartial(token, context2, partials, config2) {
  if (!partials) return;
  var tags = this.getConfigTags(config2);
  var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
  if (value != null) {
    var lineHasNonSpace = token[6];
    var tagIndex = token[5];
    var indentation = token[4];
    var indentedValue = value;
    if (tagIndex == 0 && indentation) {
      indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
    }
    var tokens = this.parse(indentedValue, tags);
    return this.renderTokens(tokens, context2, partials, indentedValue, config2);
  }
}, "renderPartial");
Writer.prototype.unescapedValue = /* @__PURE__ */ __name(function unescapedValue(token, context2) {
  var value = context2.lookup(token[1]);
  if (value != null)
    return value;
}, "unescapedValue");
Writer.prototype.escapedValue = /* @__PURE__ */ __name(function escapedValue(token, context2, config2) {
  var escape = this.getConfigEscape(config2) || mustache.escape;
  var value = context2.lookup(token[1]);
  if (value != null)
    return typeof value === "number" && escape === mustache.escape ? String(value) : escape(value);
}, "escapedValue");
Writer.prototype.rawValue = /* @__PURE__ */ __name(function rawValue(token) {
  return token[1];
}, "rawValue");
Writer.prototype.getConfigTags = /* @__PURE__ */ __name(function getConfigTags(config2) {
  if (isArray(config2)) {
    return config2;
  } else if (config2 && typeof config2 === "object") {
    return config2.tags;
  } else {
    return void 0;
  }
}, "getConfigTags");
Writer.prototype.getConfigEscape = /* @__PURE__ */ __name(function getConfigEscape(config2) {
  if (config2 && typeof config2 === "object" && !isArray(config2)) {
    return config2.escape;
  } else {
    return void 0;
  }
}, "getConfigEscape");
var mustache = {
  name: "mustache.js",
  version: "4.2.0",
  tags: ["{{", "}}"],
  clearCache: void 0,
  escape: void 0,
  parse: void 0,
  render: void 0,
  Scanner: void 0,
  Context: void 0,
  Writer: void 0,
  /**
   * Allows a user to override the default caching strategy, by providing an
   * object with set, get and clear methods. This can also be used to disable
   * the cache by setting it to the literal `undefined`.
   */
  set templateCache(cache) {
    defaultWriter.templateCache = cache;
  },
  /**
   * Gets the default or overridden caching object from the default writer.
   */
  get templateCache() {
    return defaultWriter.templateCache;
  }
};
var defaultWriter = new Writer();
mustache.clearCache = /* @__PURE__ */ __name(function clearCache2() {
  return defaultWriter.clearCache();
}, "clearCache2");
mustache.parse = /* @__PURE__ */ __name(function parse2(template, tags) {
  return defaultWriter.parse(template, tags);
}, "parse2");
mustache.render = /* @__PURE__ */ __name(function render2(template, view, partials, config2) {
  if (typeof template !== "string") {
    throw new TypeError('Invalid template! Template should be a "string" but "' + typeStr(template) + '" was given as the first argument for mustache#render(template, view, partials)');
  }
  return defaultWriter.render(template, view, partials, config2);
}, "render2");
mustache.escape = escapeHtml;
mustache.Scanner = Scanner;
mustache.Context = Context;
mustache.Writer = Writer;
var mustache_default = mustache;
var form_default = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rescue Card Generator</title>
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
      rel="stylesheet"
    />
    <link
      rel="icon"
      href="https://assets.knightgil.com/favicon.png"
      type="image/png"
    />
    <style>
      .error-flash {
        animation: flash 0.5s ease-in-out;
      }

      @keyframes flash {
        0% {
          border-color: #f56565; /* Red border */
          box-shadow: 0 0 0 0.2rem rgba(245, 101, 101, 0.25);
        }
        100% {
          border-color: #e0e0e0; /* Default border color (adjust if needed) */
          box-shadow: none;
        }
      }

      /* Tooltip styles */
      .tooltip {
        position: relative;
        display: inline-block;
      }

      .tooltip .tooltiptext {
        visibility: hidden;
        width: 150px;
        background-color: #374151; /* Dark gray */
        color: #f3f4f6; /* Light gray */
        text-align: center;
        border-radius: 0.375rem;
        padding: 0.5rem;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
      }

      .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
      }

      .tooltip .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #374151 transparent transparent transparent;
      }

      /* Form styling to match card */
      .form-container {
        background-color: #f9fafb; /* Light gray background */
        border-radius: 0.5rem;
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 2rem;
        max-width: 600px; /* Slightly wider form */
        width: 100%;
      }

      .form-title {
        color: #dc2626; /* Red color */
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-label {
        display: block;
        color: #374151; /* Dark gray */
        font-weight: bold;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }

      .form-input,
      .form-select,
      .form-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db; /* Light gray border */
        border-radius: 0.375rem;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
        font-size: 0.875rem;
      }

      .form-input:focus,
      .form-select:focus,
      .form-textarea:focus {
        outline: none;
        border-color: #6366f1; /* Indigo focus color */
        box-shadow:
          rgba(99, 102, 241, 0.25) 0px 1px 2px 0px,
          rgba(99, 102, 241, 0.1) 0px 0px 0px 3px;
      }

      .form-error {
        color: #dc2626; /* Red error text */
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }

      .submit-button {
        background-color: #dc2626; /* Red submit button */
        color: #f9fafb; /* Light gray text */
        font-weight: bold;
        padding: 0.75rem 1.5rem;
        border-radius: 0.375rem;
        border: none;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.15s ease-in-out;
      }

      .submit-button:hover {
        background-color: #b91c1c; /* Darker red on hover */
      }
    </style>
  </head>

  <body class="bg-gray-100 flex justify-center items-center min-h-screen">
    <div
      id="particles-js"
      style="position: fixed; width: 100%; height: 100%; z-index: -1"
    ></div>
    <img src="https://assets.knightgil.com/logo.jpg" alt="logo" />
    <div class="form-container">
      <h1 class="form-title">Rescue Card Generator</h1>
      <form
        id="generatorForm"
        method="POST"
        action="/"
        enctype="multipart/form-data"
      >
        <div class="form-group">
          <label for="name" class="form-label tooltip">
            Name:
            <span class="tooltiptext"
              >The name that will appear on the card.</span
            >
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            class="form-input"
            aria-describedby="name-error"
          />
          <p id="name-error" class="form-error hidden">Please enter a name.</p>
        </div>
        <div class="form-group">
          <label for="photo" class="form-label tooltip">
            Profile Photo (Max 1MB):
            <span class="tooltiptext"
              >A photo to display on the card. Maximum size is 1MB.</span
            >
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            class="form-input"
            onchange="validateFileSize()"
          />
          <p id="fileSizeError" class="form-error hidden">
            File size exceeds 1MB.
          </p>
        </div>
        <div class="form-group">
          <label for="extraInformation" class="form-label tooltip">
            Extra Information:
            <span class="tooltiptext"
              >Any additional information (Markdown accepted).</span
            >
          </label>
          <textarea
            id="extraInformation"
            name="markdownContent"
            rows="5"
            class="form-textarea"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="pin" class="form-label tooltip">
            PIN:
            <span class="tooltiptext">A 4-digit PIN for security.</span>
          </label>
          <input
            type="password"
            id="pin"
            name="pin"
            minlength="4"
            maxlength="4"
            required
            class="form-input"
            aria-describedby="pin-error"
          />
          <p id="pin-error" class="form-error hidden">
            Please enter a 4-digit PIN.
          </p>
        </div>
        <div class="form-group">
          <label for="bloodType" class="form-label tooltip">
            Blood Type:
            <span class="tooltiptext">The person's blood type.</span>
          </label>
          <select id="bloodType" name="bloodType" class="form-select">
            <option value="">Select Blood Type</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
        <div class="form-group">
          <label for="allergies" class="form-label tooltip">
            Allergies:
            <span class="tooltiptext">Any known allergies.</span>
          </label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="medications" class="form-label tooltip">
            Medications:
            <span class="tooltiptext">Current medications.</span>
          </label>
          <input
            type="text"
            id="medications"
            name="medications"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="medicalConditions" class="form-label tooltip">
            Medical Conditions:
            <span class="tooltiptext">Existing medical conditions.</span>
          </label>
          <input
            type="text"
            id="medicalConditions"
            name="medicalConditions"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="emergencyContactName" class="form-label tooltip">
            Emergency Contact Name:
            <span class="tooltiptext">Name of the emergency contact.</span>
          </label>
          <input
            type="text"
            id="emergencyContactName"
            name="emergencyContactName"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="emergencyContactPhone" class="form-label tooltip">
            Emergency Contact Phone:
            <span class="tooltiptext"
              >Phone number of the emergency contact.</span
            >
          </label>
          <input
            type="text"
            id="emergencyContactPhone"
            name="emergencyContactPhone"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="emergencyContactRelationship" class="form-label tooltip">
            Emergency Contact Relationship:
            <span class="tooltiptext"
              >Relationship to the emergency contact.</span
            >
          </label>
          <input
            type="text"
            id="emergencyContactRelationship"
            name="emergencyContactRelationship"
            class="form-input"
          />
        </div>
        <button type="submit" class="submit-button">
          Generate Rescue Card
        </button>
      </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"><\/script>

    <script>
      const MAX_FILE_SIZE_MB = 1;
      const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
      const fileInput = document.getElementById("photo");
      const photoLabel = document.getElementById("photoLabel");
      const fileSizeError = document.getElementById("fileSizeError");
      const form = document.getElementById("generatorForm");
      let isFileSizeErrorVisible = false; // Track if the error is currently visible

      function validateFileSize() {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          if (file.size > MAX_FILE_SIZE_BYTES) {
            fileSizeError.classList.remove("hidden");
            fileInput.value = ""; // Clear the invalid file
            triggerErrorFeedback();
            isFileSizeErrorVisible = true;
          } else {
            fileSizeError.classList.add("hidden");
            fileInput.classList.remove("error-flash");
            isFileSizeErrorVisible = false;
          }
        } else {
          fileInput.classList.remove("error-flash");
          isFileSizeErrorVisible = false;
        }
      }

      function triggerErrorFeedback() {
        fileInput.classList.add("error-flash");
        setTimeout(() => {
          fileInput.classList.remove("error-flash");
        }, 500); // Remove flash after 0.5 seconds
        photoLabel.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to the error
      }

      form.addEventListener("submit", function (event) {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          if (file.size > MAX_FILE_SIZE_BYTES) {
            event.preventDefault(); // Prevent form submission
            fileSizeError.classList.remove("hidden");
            triggerErrorFeedback();
            isFileSizeErrorVisible = true;
          }
        } else if (isFileSizeErrorVisible) {
          // If there was a previous error and no file is selected, ensure error is visible and scroll
          fileSizeError.classList.remove("hidden");
          triggerErrorFeedback();
        }
      });
    <\/script>
    <script>
      particlesJS("particles-js", {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: ["#e60000", "#808080", "#404040"], // Vibrant red, medium gray, dark gray
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
            polygon: {
              nb_sides: 5,
            },
            image: {
              src: "",
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#808080", // Medium gray lines
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: false,
                mode: "grab",
              },
              onclick: {
                enable: false,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity_out: 0.8,
                speed: 3,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          retina_detect: true,
        },
      });
    <\/script>
  </body>
</html>
`;
var card_default = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rescue Card</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="icon" href="/favicon.png" type="image/png">
</head>
<body class="bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
        <h1 class="text-2xl font-bold text-red-600 text-center mb-6">RESCUE CARD</h1>

        <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="flex justify-center items-center">
                <img src="data:{{photoContentType}};base64,{{photo}}" alt="Profile Photo" class="rounded-full w-24 h-24 object-cover">
            </div>
            <div class="flex flex-col justify-center items-center">
                <h2 class="text-xl font-semibold text-gray-800">{{name}}</h2>
            </div>
            <div class="flex justify-center items-center">
                <div id="qrcode" class="mx-auto"></div>
            </div>
        </div>

        <div class="mb-4 border-t pt-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Personal Information</h3>
            <div class="grid grid-cols-2 gap-2">
                <div><span class="font-bold">Blood Type:</span> {{bloodType || 'N/A'}}</div>
                <div><span class="font-bold">Allergies:</span> {{allergies || 'N/A'}}</div>
                <div><span class="font-bold">Medications:</span> {{medications || 'N/A'}}</div>
            </div>
        </div>

        <div class="mb-4 border-t pt-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Medical Details</h3>
            <div><span class="font-bold">Medical Conditions:</span> {{medicalConditions || 'N/A'}}</div>
        </div>

        <div class="mb-4 border-t pt-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Additional Information</h3>
            <div class="prose">
                <pre class="whitespace-pre-wrap text-sm text-gray-700">{{markdownContent || 'No additional information provided.'}}</pre>
            </div>
        </div>

        <div class="border-t pt-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Emergency Contact</h3>
            <div>
                <span class="font-bold">Name:</span> {{emergencyContactName || 'N/A'}
            </div>
            <div>
                <span class="font-bold">Phone:</span> {{emergencyContactPhone || 'N/A'}
            </div>
            <div>
                <span class="font-bold">Relationship:</span> {{emergencyContactRelationship || 'N/A'}
            </div>
        </div>

        <footer class="text-center text-gray-500 text-sm mt-4 border-t pt-4">
            Created: {{creationTimestamp}}<br>
            <a href="/{{profileId}}" class="text-blue-500 hover:underline">Update Profile</a>
        </footer>
    </div>

    <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"><\/script>
    <script>
        const qrcodeDiv = document.getElementById('qrcode');
        const urlToEncode = window.location.origin + '/card/' + '{{profileId}}';

        const qrcode = new QRCode(qrcodeDiv, {
            text: urlToEncode,
            width: 96, // Slightly smaller QR code
            height: 96, // Slightly smaller QR code
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    <\/script>
</body>
</html>
`;
var update_card_default = '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Update Rescue Card</title>\n    <link\n      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"\n      rel="stylesheet"\n    />\n  </head>\n  <body class="bg-gray-100 flex justify-center items-center min-h-screen">\n    <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full">\n      <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">\n        Update Rescue Card\n      </h1>\n      <p>\n        Update form for profile ID: ${profileId} (Functionality to be\n        implemented)\n      </p>\n      <a\n        href="/"\n        class="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"\n        >Back to Generator</a\n      >\n    </div>\n  </body>\n</html>\n';
var card_pin_default = `<!DOCTYPE html>
<html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Enter PIN</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <link rel="icon" href="/favicon.png" type="image/png">
          </head>
          <body class="bg-gray-100 flex justify-center items-center min-h-screen">
              <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                  <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">Enter PIN</h1>
                  <form method="GET" action="/card/{{contentHash}}">
                      <div class="mb-4">
                          <label for="pin" class="block text-gray-700 text-sm font-bold mb-2">PIN:</label>
                          <input type="password" id="pin" name="pin" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                      </div>
                      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">View Card</button>
                  </form>
                  <p class="mt-4 text-gray-600 text-sm">If you've lost your PIN, please contact the card creator.</p>
              </div>
          </body>
          </html>
`;
var incorrect_pin_default = '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>PIN Incorrect</title>\n    <link\n      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"\n      rel="stylesheet"\n    />\n    <link rel="icon" href="/favicon.png" type="image/png" />\n    <style>\n      .error-container {\n        background-color: #fff;\n        border-radius: 0.5rem;\n        box-shadow:\n          0 4px 6px -1px rgba(0, 0, 0, 0.1),\n          0 2px 4px -1px rgba(0, 0, 0, 0.06);\n        padding: 3rem;\n        text-align: center;\n        max-width: 500px;\n        width: 100%;\n      }\n\n      .error-heading {\n        color: #dc2626; /* Red color for error */\n        font-size: 2.5rem;\n        font-weight: bold;\n        margin-bottom: 1rem;\n      }\n\n      .error-message {\n        color: #4a5568;\n        font-size: 1.125rem;\n        margin-bottom: 2rem;\n      }\n\n      .back-button {\n        background-color: #6b7280; /* Gray button */\n        color: #fff;\n        font-weight: bold;\n        padding: 0.75rem 1.5rem;\n        border-radius: 0.375rem;\n        text-decoration: none;\n        transition: background-color 0.15s ease-in-out;\n      }\n\n      .back-button:hover {\n        background-color: #4b5563; /* Darker gray on hover */\n      }\n    </style>\n  </head>\n  <body class="bg-gray-100 flex justify-center items-center min-h-screen">\n    <div class="error-container">\n      <h1 class="error-heading">PIN Incorrect</h1>\n      <p class="error-message">\n        The PIN you entered is incorrect. Please try again.\n      </p>\n      <button\n        type="button"\n        class="back-button"\n        onclick="window.history.back();"\n      >\n        Go Back\n      </button>\n    </div>\n  </body>\n</html>\n';
var card_error_filesize_default = '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>File Too Large</title>\n    <link\n      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"\n      rel="stylesheet"\n    />\n    <link rel="icon" href="/favicon.png" type="image/png" />\n    <style>\n      .error-container {\n        background-color: #fff;\n        border-radius: 0.5rem;\n        box-shadow:\n          0 4px 6px -1px rgba(0, 0, 0, 0.1),\n          0 2px 4px -1px rgba(0, 0, 0, 0.06);\n        padding: 3rem;\n        text-align: center;\n        max-width: 500px;\n        width: 100%;\n      }\n\n      .error-heading {\n        color: #dc2626; /* Red color for error */\n        font-size: 2rem;\n        font-weight: bold;\n        margin-bottom: 1rem;\n      }\n\n      .error-message {\n        color: #4a5568;\n        font-size: 1.125rem;\n        margin-bottom: 2rem;\n      }\n\n      .back-button {\n        background-color: #6b7280; /* Gray button */\n        color: #fff;\n        font-weight: bold;\n        padding: 0.75rem 1.5rem;\n        border-radius: 0.375rem;\n        text-decoration: none;\n        transition: background-color 0.15s ease-in-out;\n        cursor: pointer;\n      }\n\n      .back-button:hover {\n        background-color: #4b5563; /* Darker gray on hover */\n      }\n    </style>\n  </head>\n  <body class="bg-gray-100 flex justify-center items-center min-h-screen">\n    <div class="error-container">\n      <h1 class="error-heading">File Too Large</h1>\n      <p class="error-message">\n        The uploaded image file is too large. The maximum allowed size is 1MB.\n      </p>\n      <button\n        type="button"\n        class="back-button"\n        onclick="window.history.back();"\n      >\n        Go Back\n      </button>\n    </div>\n  </body>\n</html>\n';
var MAX_FILE_SIZE = 1 * 1024 * 1024;
var PUBLIC_PATH = path.join(process.cwd(), "public");
async function getBase64(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  return base64;
}
__name(getBase64, "getBase64");
var index_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    if (false) {
      await seedLocalR2(env2);
    }
    if (url.pathname === "/") {
      if (request.method === "GET") {
        return new Response(form_default, {
          headers: { "Content-Type": "text/html" }
        });
      } else if (request.method === "POST") {
        console.log("post started");
        const formData = await request.formData();
        const name = formData.get("name");
        const photoFile = formData.get("photo");
        const markdownContent = formData.get("markdownContent");
        const pin = formData.get("pin");
        const bloodType = formData.get("bloodType");
        const allergies = formData.get("allergies");
        const medications = formData.get("medications");
        const medicalConditions = formData.get("medicalConditions");
        const emergencyContactName = formData.get("emergencyContactName");
        const emergencyContactPhone = formData.get("emergencyContactPhone");
        const emergencyContactRelationship = formData.get(
          "emergencyContactRelationship"
        );
        console.log("const setup");
        let photoBase64 = null;
        let photoContentType = null;
        if (photoFile instanceof File && photoFile.size > 0) {
          if (photoFile.size <= MAX_FILE_SIZE) {
            photoBase64 = await getBase64(photoFile);
            photoContentType = photoFile.type;
          } else {
            const html2 = mustache_default.render(card_error_filesize_default);
            return new Response(html2, { status: 400 });
          }
        }
        const profileData = {
          name,
          photo: photoBase64,
          markdownContent,
          pin,
          bloodType,
          allergies,
          medications,
          medicalConditions,
          emergencyContactName,
          emergencyContactPhone,
          emergencyContactRelationship,
          creationTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
          profileId: crypto_default.createHash("sha256").update(JSON.stringify(formData)).digest("hex")
        };
        console.log("pre mustache");
        const html = mustache_default.render(card_default, profileData);
        const filename = `${profileData.profileId}-${pin}.html`;
        console.log("post mustache worked");
        try {
          const r2Result = await env2.R2.put(filename, html, {
            contentType: "text/html"
          });
          console.log("R2 Put Result (Success):", JSON.stringify(r2Result));
          return Response.redirect(
            `${url.origin}/card/${profileData.profileId}?pin=${pin}`,
            303
          );
        } catch (error3) {
          console.error("Error saving to R2:", error3);
          return new Response("Error saving Rescue Card", { status: 500 });
        }
      }
    } else if (url.pathname.startsWith("/card/")) {
      const parts = url.pathname.split("/");
      const contentHash = parts[2];
      const pin = url.searchParams.get("pin");
      const filename = `${contentHash}-${pin}.html`;
      const r2Object = await env2.R2.get(filename);
      if (!pin) {
        const cardPinHtml = mustache_default.render(card_pin_default, {
          contentHash
        });
        return new Response(cardPinHtml, {
          headers: { "Content-Type": "text/html" }
        });
      } else {
        if (r2Object && r2Object.body) {
          const htmlContent = await new Response(r2Object.body).text();
          return new Response(htmlContent, {
            headers: { "Content-Type": "text/html" }
          });
        } else {
          const htmlContent = mustache_default.render(incorrect_pin_default);
          return new Response(htmlContent, {
            status: 404,
            "Content-Type": "text/html"
          });
        }
      }
    } else if (url.pathname.startsWith("/")) {
      const profileId = url.pathname.split("/")[2];
      const htmlContent = mustache_default.render(update_card_default);
      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" }
      });
    }
    return new Response("Not Found", { status: 404 });
  }
};

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-mUWl09/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = index_default;

// ../../.nvm/versions/node/v22.2.0/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-mUWl09/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

mustache/mustache.mjs:
  (*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   *)
*/
//# sourceMappingURL=index.js.map
