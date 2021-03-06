/* eslint-disable no-restricted-syntax */

const PermLevels = require("../classes/PermissionLevels");

const defaultPermStructure = new PermLevels()
  .add(0, false, () => true)
  .add(2, false, (client, msg) => {
    if (!msg.guild || !msg.guild.settings.modRole) return false;
    const modRole = msg.guild.roles.get(msg.guild.settings.modRole);
    return modRole && msg.member.roles.has(modRole.id);
  })
  .add(3, false, (client, msg) => {
    if (!msg.guild || !msg.guild.settings.adminRole) return false;
    const adminRole = msg.guild.roles.get(msg.guild.settings.adminRole);
    return adminRole && msg.member.roles.has(adminRole.id);
  })
  .add(4, false, (client, msg) => msg.guild && msg.author.id === msg.guild.owner.id)
  .add(9, true, (client, msg) => msg.author.id === client.config.ownerID)
  .add(10, false, (client, msg) => msg.author.id === client.config.ownerID);


module.exports = (options) => {
  for (const key in this.DEFAULT_OPTIONS) {
    if (!(key in options)) options[key] = this.DEFAULT_OPTIONS[key];
    if (["provider", "disabled", "console"].includes(key)) {
      for (const property in this.DEFAULT_OPTIONS[key]) {
        if (!(property in options[key])) options[key][property] = this.DEFAULT_OPTIONS[key][property];
      }
    }
  }
  this.validate(options);
  return options;
};

exports.DEFAULT_OPTIONS = {
  prefix: "?",
  ownerID: null,
  disabled: {
    commands: [],
    events: [],
    functions: [],
    inhibitors: [],
    finalizers: [],
    monitors: [],
    providers: [],
    extendables: [],
  },
  permStructure: defaultPermStructure,
  selfbot: false,
  readyMessage: client => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`,
  commandMessageLifetime: 1800,
  commandMessageSweep: 900,
  cmdEditing: false,
  cmdPrompt: false,
  provider: {
    engine: "json",
    cache: "js",
  },
  console: {
    useColors: true,
    colors: {},
    timestamps: true,
    stdout: process.stdout,
    stderr: process.stderr,
  },
};

exports.validate = (options) => {
  const pieces = Object.keys(this.DEFAULT_OPTIONS.disabled);
  if ("prefix" in options && typeof options.prefix !== "string") throw new TypeError("Prefix must be a string value.");
  if ("ownerID" in options && typeof options.ownerID !== "string" && options.ownerID !== null) throw new TypeError("OwnerID must be a string (user id) if provided.");
  if ("disabled" in options) {
    if (typeof options.disabled !== "object" || Array.isArray(options.disabled)) throw new TypeError("Disabled must be a valid object");
    for (const key of Object.keys(options.disabled)) { // eslint-disable-line
      if (!pieces.includes(key)) throw new Error("Invalid piece name in the disabled array");
      if (!Array.isArray(options.disabled[key])) throw new TypeError(`${key} must be an array.`);
    }
  }
  if ("permStructure" in options) {
    if (options.permStructure.constructor.name !== "PermissionLevels" && !Array.isArray(options.permStructure)) throw new TypeError("PermStructure must be a valid array with 11 entries, or a instance of Komada.PermLevels");
  }
  if ("selfbot" in options && typeof options.selfbot !== "boolean") throw new TypeError("Selfbot must be true or false.");
  if ("readyMessage" in options && typeof options.readyMessage !== "function") throw new TypeError("ReadyMessage must be a function.");
  if ("commandMessageLifetime" in options && typeof options.commandMessageLifetime !== "number") throw new TypeError("CommandMessageLifetime must be a number.");
  if ("commandMessageSweep" in options && typeof options.commandMessageSweep !== "number") throw new TypeError("CommandMessageSweep must be a number.");
  if ("cmdEditing" in options && typeof options.cmdEditing !== "boolean") throw new TypeError("CmdEditing must be true or false.");
  if ("cmdPrompt" in options && typeof options.cmdPrompt !== "boolean") throw new TypeError("CmdPrompt must be true or false.");
  if ("provider" in options) {
    if ("engine" in options.provider && typeof options.provider.engine !== "string") throw new TypeError("Engine must be a string.");
    if ("cache" in options.provider && typeof options.provider.cache !== "string") throw new TypeError("Cache must be a string.");
  }
  if ("console" in options) {
    if ("timestamps" in options.console && !(typeof options.console.timestamps === "boolean" || typeof options.console.timestamps === "string")) throw new TypeError("Timestamps must be true or false");
    if ("colors" in options.console && typeof options.console.colors !== "object") throw new TypeError("Colors must be an object with message and time objects");
    if ("useColors" in options.console && typeof options.console.useColors !== "boolean") throw new TypeError("Colors must be true or false.");
  }
};
