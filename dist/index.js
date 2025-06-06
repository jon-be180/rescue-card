// node_modules/mustache/mustache.mjs
var objectToString = Object.prototype.toString;
var isArray = Array.isArray || function isArrayPolyfill(object) {
  return objectToString.call(object) === "[object Array]";
};
function isFunction(object) {
  return typeof object === "function";
}
function typeStr(obj) {
  return isArray(obj) ? "array" : typeof obj;
}
function escapeRegExp(string) {
  return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function hasProperty(obj, propName) {
  return obj != null && typeof obj === "object" && propName in obj;
}
function primitiveHasOwnProperty(primitive, propName) {
  return primitive != null && typeof primitive !== "object" && primitive.hasOwnProperty && primitive.hasOwnProperty(propName);
}
var regExpTest = RegExp.prototype.test;
function testRegExp(re, string) {
  return regExpTest.call(re, string);
}
var nonSpaceRe = /\S/;
function isWhitespace(string) {
  return !testRegExp(nonSpaceRe, string);
}
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
  return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
    return entityMap[s];
  });
}
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
function Scanner(string) {
  this.string = string;
  this.tail = string;
  this.pos = 0;
}
Scanner.prototype.eos = function eos() {
  return this.tail === "";
};
Scanner.prototype.scan = function scan(re) {
  var match = this.tail.match(re);
  if (!match || match.index !== 0)
    return "";
  var string = match[0];
  this.tail = this.tail.substring(string.length);
  this.pos += string.length;
  return string;
};
Scanner.prototype.scanUntil = function scanUntil(re) {
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
};
function Context(view, parentContext) {
  this.view = view;
  this.cache = { ".": this.view };
  this.parent = parentContext;
}
Context.prototype.push = function push(view) {
  return new Context(view, this);
};
Context.prototype.lookup = function lookup(name) {
  var cache = this.cache;
  var value;
  if (cache.hasOwnProperty(name)) {
    value = cache[name];
  } else {
    var context = this, intermediateValue, names, index, lookupHit = false;
    while (context) {
      if (name.indexOf(".") > 0) {
        intermediateValue = context.view;
        names = name.split(".");
        index = 0;
        while (intermediateValue != null && index < names.length) {
          if (index === names.length - 1)
            lookupHit = hasProperty(intermediateValue, names[index]) || primitiveHasOwnProperty(intermediateValue, names[index]);
          intermediateValue = intermediateValue[names[index++]];
        }
      } else {
        intermediateValue = context.view[name];
        lookupHit = hasProperty(context.view, name);
      }
      if (lookupHit) {
        value = intermediateValue;
        break;
      }
      context = context.parent;
    }
    cache[name] = value;
  }
  if (isFunction(value))
    value = value.call(this.view);
  return value;
};
function Writer() {
  this.templateCache = {
    _cache: {},
    set: function set(key, value) {
      this._cache[key] = value;
    },
    get: function get(key) {
      return this._cache[key];
    },
    clear: function clear() {
      this._cache = {};
    }
  };
}
Writer.prototype.clearCache = function clearCache() {
  if (typeof this.templateCache !== "undefined") {
    this.templateCache.clear();
  }
};
Writer.prototype.parse = function parse(template, tags) {
  var cache = this.templateCache;
  var cacheKey = template + ":" + (tags || mustache.tags).join(":");
  var isCacheEnabled = typeof cache !== "undefined";
  var tokens = isCacheEnabled ? cache.get(cacheKey) : void 0;
  if (tokens == void 0) {
    tokens = parseTemplate(template, tags);
    isCacheEnabled && cache.set(cacheKey, tokens);
  }
  return tokens;
};
Writer.prototype.render = function render(template, view, partials, config) {
  var tags = this.getConfigTags(config);
  var tokens = this.parse(template, tags);
  var context = view instanceof Context ? view : new Context(view, void 0);
  return this.renderTokens(tokens, context, partials, template, config);
};
Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate, config) {
  var buffer = "";
  var token, symbol, value;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    value = void 0;
    token = tokens[i];
    symbol = token[0];
    if (symbol === "#") value = this.renderSection(token, context, partials, originalTemplate, config);
    else if (symbol === "^") value = this.renderInverted(token, context, partials, originalTemplate, config);
    else if (symbol === ">") value = this.renderPartial(token, context, partials, config);
    else if (symbol === "&") value = this.unescapedValue(token, context);
    else if (symbol === "name") value = this.escapedValue(token, context, config);
    else if (symbol === "text") value = this.rawValue(token);
    if (value !== void 0)
      buffer += value;
  }
  return buffer;
};
Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate, config) {
  var self = this;
  var buffer = "";
  var value = context.lookup(token[1]);
  function subRender(template) {
    return self.render(template, context, partials, config);
  }
  if (!value) return;
  if (isArray(value)) {
    for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
      buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
    }
  } else if (typeof value === "object" || typeof value === "string" || typeof value === "number") {
    buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
  } else if (isFunction(value)) {
    if (typeof originalTemplate !== "string")
      throw new Error("Cannot use higher-order sections without the original template");
    value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);
    if (value != null)
      buffer += value;
  } else {
    buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
  }
  return buffer;
};
Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate, config) {
  var value = context.lookup(token[1]);
  if (!value || isArray(value) && value.length === 0)
    return this.renderTokens(token[4], context, partials, originalTemplate, config);
};
Writer.prototype.indentPartial = function indentPartial(partial, indentation, lineHasNonSpace) {
  var filteredIndentation = indentation.replace(/[^ \t]/g, "");
  var partialByNl = partial.split("\n");
  for (var i = 0; i < partialByNl.length; i++) {
    if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
      partialByNl[i] = filteredIndentation + partialByNl[i];
    }
  }
  return partialByNl.join("\n");
};
Writer.prototype.renderPartial = function renderPartial(token, context, partials, config) {
  if (!partials) return;
  var tags = this.getConfigTags(config);
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
    return this.renderTokens(tokens, context, partials, indentedValue, config);
  }
};
Writer.prototype.unescapedValue = function unescapedValue(token, context) {
  var value = context.lookup(token[1]);
  if (value != null)
    return value;
};
Writer.prototype.escapedValue = function escapedValue(token, context, config) {
  var escape = this.getConfigEscape(config) || mustache.escape;
  var value = context.lookup(token[1]);
  if (value != null)
    return typeof value === "number" && escape === mustache.escape ? String(value) : escape(value);
};
Writer.prototype.rawValue = function rawValue(token) {
  return token[1];
};
Writer.prototype.getConfigTags = function getConfigTags(config) {
  if (isArray(config)) {
    return config;
  } else if (config && typeof config === "object") {
    return config.tags;
  } else {
    return void 0;
  }
};
Writer.prototype.getConfigEscape = function getConfigEscape(config) {
  if (config && typeof config === "object" && !isArray(config)) {
    return config.escape;
  } else {
    return void 0;
  }
};
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
mustache.clearCache = function clearCache2() {
  return defaultWriter.clearCache();
};
mustache.parse = function parse2(template, tags) {
  return defaultWriter.parse(template, tags);
};
mustache.render = function render2(template, view, partials, config) {
  if (typeof template !== "string") {
    throw new TypeError('Invalid template! Template should be a "string" but "' + typeStr(template) + '" was given as the first argument for mustache#render(template, view, partials)');
  }
  return defaultWriter.render(template, view, partials, config);
};
mustache.escape = escapeHtml;
mustache.Scanner = Scanner;
mustache.Context = Context;
mustache.Writer = Writer;
var mustache_default = mustache;

// src/index.js
import crypto from "crypto";
import path from "path";

// templates/form.html
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
      rel="stylesheet"
      href="https://unpkg.com/easymde/dist/easymde.min.css"
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
        max-width: 65%; /* Slightly wider form */
        width: 100%;
        display: flex; /* Enable flexbox for columns */
        align-items: flex-start; /* Align items to the start of the cross axis */
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
        color: #f9fafb; /* Light gray text */
        font-weight: bold;
        padding: 0.75rem 1.5rem;
        border-radius: 0.375rem;
        border: none;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.15s ease-in-out;
      }
    </style>
  </head>

  <body class="bg-gray-100 flex justify-center items-center min-h-screen">
    <div
      id="particles-js"
      style="position: fixed; width: 100%; height: 100%; z-index: -1"
    ></div>
    <div
      class="bg-white rounded-lg shadow-md p-8 flex flx-col md:flex-row form-container"
    >
      <div class="w-full md:w-1/2 md:pr-6 flex flex-col">
        <div class="flex flex-col items-center">
          <img
            src="https://assets.knightgil.com/logo.jpg"
            alt="logo"
            class="w-48 h-auto mb-4"
          />
          <h2
            class="form-title text-xl font-semibold text-gray-800 text-center"
          >
            Rescue Card Generator
          </h2>
        </div>
        <div class="form-group mb-4">
          <label
            for="name"
            class="form-label tooltip block text-gray-700 text-sm font-bold mb-2"
          >
            Name:
            <span
              class="tooltiptext absolute left-0 -mt-8 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 opacity-0 transition-opacity duration-300"
              >The name that will appear on the card.</span
            >
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            class="form-input rounded-md shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-describedby="name-error"
          />
          <p
            id="name-error"
            class="form-error text-red-500 text-xs italic hidden"
          >
            Please enter a name.
          </p>
        </div>
        <div class="form-group mb-4">
          <label
            for="photo"
            class="form-label tooltip block text-gray-700 text-sm font-bold mb-2"
          >
            Profile Photo (Max 1MB):
            <span
              class="tooltiptext absolute left-0 -mt-12 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 opacity-0 transition-opacity duration-300"
              >A photo to display on the card. Maximum size is 1MB.</span
            >
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            class="hidden"
            onchange="validateFileSize()"
          />
          <div
            id="photoSelectionArea"
            class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
          >
            <p id="photoInstructionText" class="text-gray-500">
              Click here to upload a photo (desktop)
            </p>
            <img
              id="photoPreview"
              src=""
              alt="Photo Preview"
              class="mt-4 mx-auto max-w-full h-auto hidden rounded-md border border-gray-200"
            />
          </div>

          <button
            type="button"
            id="cameraButton"
            class="hidden mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Take a Photo
          </button>
          <p
            id="fileSizeError"
            class="form-error text-red-500 text-xs italic hidden"
          >
            File size exceeds 1MB.
          </p>
        </div>
        <div class="form-group mb-4">
          <label
            for="pin"
            class="form-label tooltip block text-gray-700 text-sm font-bold mb-2"
          >
            PIN:
            <span
              class="tooltiptext absolute left-0 -mt-8 w-32 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 opacity-0 transition-opacity duration-300"
              >A 4-digit PIN for security.</span
            >
          </label>
          <input
            type="password"
            id="pin"
            name="pin"
            minlength="4"
            maxlength="4"
            required
            class="form-input rounded-md shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-describedby="pin-error"
          />
          <p
            id="pin-error"
            class="form-error text-red-500 text-xs italic hidden"
          >
            Please enter a 4-digit PIN.
          </p>
        </div>
        <div class="mb-4 text-sm text-gray-600 text-center">
          <p>
            For enhanced security, the generated HTML file will be encrypted
            using the PIN you provide. This PIN will be required to decrypt and
            view the card, not even the website admin can access the saved
            information.
          </p>
        </div>
      </div>

      <div class="w-full md:w-1/2 md:pl-4">
        <h2 class="form-title text-xl font-semibold text-gray-800 mb-4">
          Emergency Contact Details
        </h2>
        <div class="form-group mb-4">
          <label
            for="emergencyContactName"
            class="form-label tooltip block text-gray-700 text-sm font-bold mb-2"
          >
            Emergency Contact Name:
            <span
              class="tooltiptext absolute left-0 -mt-10 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 opacity-0 transition-opacity duration-300"
              >Name of the emergency contact.</span
            >
          </label>
          <input
            type="text"
            id="emergencyContactName"
            name="emergencyContactName"
            class="form-input rounded-md shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="form-group mb-4">
          <label
            for="emergencyContactPhone"
            class="form-label tooltip block text-gray-700 text-sm font-bold mb-2"
          >
            Emergency Contact Phone:
            <span
              class="tooltiptext absolute left-0 -mt-10 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 opacity-0 transition-opacity duration-300"
              >Phone number of the emergency contact.</span
            >
          </label>
          <input
            type="text"
            id="emergencyContactPhone"
            name="emergencyContactPhone"
            class="form-input rounded-md shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="form-group mb-6">
          <label
            for="emergencyContactRelationship"
            class="form-label tooltip block text-gray-700 text-sm font-bold mb-2"
          >
            Emergency Contact Relationship:
            <span
              class="tooltiptext absolute left-0 -mt-12 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 opacity-0 transition-opacity duration-300"
              >Relationship to the emergency contact.</span
            >
          </label>
          <input
            type="text"
            id="emergencyContactRelationship"
            name="emergencyContactRelationship"
            class="form-input rounded-md shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="form-group mb-4">
          <label
            for="extraInformation"
            class="form-label tooltip block text-gray-700 text-sm font-bold mb-2"
          >
            Extra Information:
            <span
              class="tooltiptext absolute left-0 -mt-12 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 opacity-0 transition-opacity duration-300"
              >Any additional information (Markdown accepted). Try to add social
              media links or an address</span
            >
          </label>
          <textarea
            id="extraInformation"
            name="markdownContent"
            rows="2"
            class="form-textarea rounded-md shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        <button
          type="submit"
          class="submit-button bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Generate Rescue Card
        </button>
      </div>
    </div>
  </body>
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
  <script src="https://unpkg.com/easymde/dist/easymde.min.js"></script>
  <script>
    // --- Photo Input & Camera Logic ---
    const photoInput = document.getElementById("photo");
    const photoSelectionArea = document.getElementById("photoSelectionArea");
    const photoInstructionText = document.getElementById(
      "photoInstructionText",
    );
    const photoPreview = document.getElementById("photoPreview");
    const photoError = document.getElementById("photoError");
    const cameraButton = document.getElementById("cameraButton");

    const MAX_IMAGE_SIZE_KB = 1024; // 1MB for original file check (before resizing)
    const MAX_IMAGE_WIDTH = 400; // Desired max width for the resized image
    const MAX_IMAGE_HEIGHT = 400; // Desired max height, will maintain aspect ratio
    const JPEG_QUALITY = 0.8; // Adjust for balance of quality vs file size (0.0 to 1.0)

    let processedImageBase64 = ""; // Global variable to store the Base64 image data

    // --- Event Listeners ---

    // 1. Check if on a mobile device to show camera option
    window.addEventListener("DOMContentLoaded", () => {
      // Simple check for mobile device. More robust checks exist, but this is usually sufficient for 'capture' attribute.
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      if (isMobile) {
        photoInstructionText.textContent = "Click here to select a photo";
        cameraButton.classList.remove("hidden");
        // Set capture attribute for selfie on mobile input
        photoInput.setAttribute("capture", "user");
      } else {
        // For desktop, enable drag & drop
        photoSelectionArea.addEventListener("dragover", (e) => {
          e.preventDefault();
          photoSelectionArea.classList.add("border-blue-500", "bg-blue-50");
        });
        photoSelectionArea.addEventListener("dragleave", () => {
          photoSelectionArea.classList.remove("border-blue-500", "bg-blue-50");
        });
        photoSelectionArea.addEventListener("drop", (e) => {
          e.preventDefault();
          photoSelectionArea.classList.remove("border-blue-500", "bg-blue-50");
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            processImageFile(files[0]);
          }
        });
      }
    });

    // 2. Click handler for the custom photo selection area (for file upload)
    photoSelectionArea.addEventListener("click", () => {
      photoInput.click(); // Trigger the hidden file input
    });

    // 3. Click handler for the camera button (for mobile selfie)
    cameraButton.addEventListener("click", () => {
      // This essentially triggers the file input again, but with 'capture="user"' set
      photoInput.click();
    });

    // 4. Handle file selection (from upload or camera capture)
    function handleFileSelect(event) {
      const files = event.target.files;
      if (files.length > 0) {
        processImageFile(files[0]);
      }
      // Clear the input so selecting the same file again triggers change event
      event.target.value = "";
    }

    // --- Image Processing Logic ---
    function processImageFile(file) {
      photoError.classList.add("hidden"); // Hide any previous errors
      processedImageBase64 = ""; // Clear previous image data
      photoPreview.classList.add("hidden"); // Hide preview until new image loads

      // 1. Basic file type and size check (before full processing)
      if (!file.type.startsWith("image/")) {
        photoError.textContent = "Please select an image file.";
        photoError.classList.remove("hidden");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_KB * 1024) {
        // Convert KB to bytes
        photoError.textContent = \`File size exceeds \${MAX_IMAGE_SIZE_KB}KB. Please choose a smaller image.\`;
        photoError.classList.remove("hidden");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          // Only resize if the image is larger than our max dimensions
          if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
            if (width / MAX_IMAGE_WIDTH > height / MAX_IMAGE_HEIGHT) {
              height *= MAX_IMAGE_WIDTH / width;
              width = MAX_IMAGE_WIDTH;
            } else {
              width *= MAX_IMAGE_HEIGHT / height;
              height = MAX_IMAGE_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas content to Base64 (JPEG for better compression and transparency is not usually needed for profile photos)
          processedImageBase64 = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

          // Update preview
          photoPreview.src = processedImageBase64;
          photoPreview.classList.remove("hidden");
        };
        img.onerror = function () {
          photoError.textContent = "Could not load image. Please try another.";
          photoError.classList.remove("hidden");
          photoPreview.classList.add("hidden");
        };
        img.src = e.target.result; // Set src to the original Base64 to load into Image object
      };
      reader.onerror = function () {
        photoError.textContent = "Error reading file. Please try again.";
        photoError.classList.remove("hidden");
        photoPreview.classList.add("hidden");
      };
      reader.readAsDataURL(file); // Start reading the file as Base64 Data URL
    }
  </script>
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
  </script>
  <script>
    // --- EasyMDE Initialization ---
    // Initialize EasyMDE on the textarea
    const easyMDE = new EasyMDE({
      element: document.getElementById("extraInformation"),
      spellChecker: false, // You might want to enable this, depends on preference
      // You can customize the toolbar here if you want specific buttons
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "link",
        "|",
        "unordered-list",
        "ordered-list",
        "|",
        "quote",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        "guide",
      ],
      status: false, // Hides the status bar (line, word, char count)
      minHeight: "100px",
    });
  </script>
</html>
`;

// templates/card.html
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

    <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
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
    </script>
</body>
</html>
`;

// templates/update_card.html
var update_card_default = '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Update Rescue Card</title>\n    <link\n      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"\n      rel="stylesheet"\n    />\n  </head>\n  <body class="bg-gray-100 flex justify-center items-center min-h-screen">\n    <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full">\n      <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">\n        Update Rescue Card\n      </h1>\n      <p>\n        Update form for profile ID: ${profileId} (Functionality to be\n        implemented)\n      </p>\n      <a\n        href="/"\n        class="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"\n        >Back to Generator</a\n      >\n    </div>\n  </body>\n</html>\n';

// templates/card_pin.html
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

// templates/incorrect_pin.html
var incorrect_pin_default = '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>PIN Incorrect</title>\n    <link\n      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"\n      rel="stylesheet"\n    />\n    <link rel="icon" href="/favicon.png" type="image/png" />\n    <style>\n      .error-container {\n        background-color: #fff;\n        border-radius: 0.5rem;\n        box-shadow:\n          0 4px 6px -1px rgba(0, 0, 0, 0.1),\n          0 2px 4px -1px rgba(0, 0, 0, 0.06);\n        padding: 3rem;\n        text-align: center;\n        max-width: 500px;\n        width: 100%;\n      }\n\n      .error-heading {\n        color: #dc2626; /* Red color for error */\n        font-size: 2.5rem;\n        font-weight: bold;\n        margin-bottom: 1rem;\n      }\n\n      .error-message {\n        color: #4a5568;\n        font-size: 1.125rem;\n        margin-bottom: 2rem;\n      }\n\n      .back-button {\n        background-color: #6b7280; /* Gray button */\n        color: #fff;\n        font-weight: bold;\n        padding: 0.75rem 1.5rem;\n        border-radius: 0.375rem;\n        text-decoration: none;\n        transition: background-color 0.15s ease-in-out;\n      }\n\n      .back-button:hover {\n        background-color: #4b5563; /* Darker gray on hover */\n      }\n    </style>\n  </head>\n  <body class="bg-gray-100 flex justify-center items-center min-h-screen">\n    <div class="error-container">\n      <h1 class="error-heading">PIN Incorrect</h1>\n      <p class="error-message">\n        The PIN you entered is incorrect. Please try again.\n      </p>\n      <button\n        type="button"\n        class="back-button"\n        onclick="window.history.back();"\n      >\n        Go Back\n      </button>\n    </div>\n  </body>\n</html>\n';

// templates/card_error_filesize.html
var card_error_filesize_default = '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>File Too Large</title>\n    <link\n      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"\n      rel="stylesheet"\n    />\n    <link rel="icon" href="/favicon.png" type="image/png" />\n    <style>\n      .error-container {\n        background-color: #fff;\n        border-radius: 0.5rem;\n        box-shadow:\n          0 4px 6px -1px rgba(0, 0, 0, 0.1),\n          0 2px 4px -1px rgba(0, 0, 0, 0.06);\n        padding: 3rem;\n        text-align: center;\n        max-width: 500px;\n        width: 100%;\n      }\n\n      .error-heading {\n        color: #dc2626; /* Red color for error */\n        font-size: 2rem;\n        font-weight: bold;\n        margin-bottom: 1rem;\n      }\n\n      .error-message {\n        color: #4a5568;\n        font-size: 1.125rem;\n        margin-bottom: 2rem;\n      }\n\n      .back-button {\n        background-color: #6b7280; /* Gray button */\n        color: #fff;\n        font-weight: bold;\n        padding: 0.75rem 1.5rem;\n        border-radius: 0.375rem;\n        text-decoration: none;\n        transition: background-color 0.15s ease-in-out;\n        cursor: pointer;\n      }\n\n      .back-button:hover {\n        background-color: #4b5563; /* Darker gray on hover */\n      }\n    </style>\n  </head>\n  <body class="bg-gray-100 flex justify-center items-center min-h-screen">\n    <div class="error-container">\n      <h1 class="error-heading">File Too Large</h1>\n      <p class="error-message">\n        The uploaded image file is too large. The maximum allowed size is 1MB.\n      </p>\n      <button\n        type="button"\n        class="back-button"\n        onclick="window.history.back();"\n      >\n        Go Back\n      </button>\n    </div>\n  </body>\n</html>\n';

// src/index.js
var MAX_FILE_SIZE = 1 * 1024 * 1024;
var PUBLIC_PATH = path.join(process.cwd(), "public");
async function getBase64(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  return base64;
}
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (process.env.NODE_ENV === "development") {
      await seedLocalR2(env);
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
          profileId: crypto.createHash("sha256").update(JSON.stringify(formData)).digest("hex")
        };
        console.log("pre mustache");
        const html = mustache_default.render(card_default, profileData);
        const filename = `${profileData.profileId}-${pin}.html`;
        console.log("post mustache worked");
        try {
          const r2Result = await env.R2.put(filename, html, {
            contentType: "text/html"
          });
          console.log("R2 Put Result (Success):", JSON.stringify(r2Result));
          return Response.redirect(
            `${url.origin}/card/${profileData.profileId}?pin=${pin}`,
            303
          );
        } catch (error) {
          console.error("Error saving to R2:", error);
          return new Response("Error saving Rescue Card", { status: 500 });
        }
      }
    } else if (url.pathname.startsWith("/card/")) {
      const parts = url.pathname.split("/");
      const contentHash = parts[2];
      const pin = url.searchParams.get("pin");
      const filename = `${contentHash}-${pin}.html`;
      const r2Object = await env.R2.get(filename);
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
export {
  index_default as default
};
/*! Bundled license information:

mustache/mustache.mjs:
  (*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   *)
*/
