const chalk = require("chalk");
const moment = require("moment");

exports.log = (content, type = "okay") => {
	const timestamp = `[${moment ? moment().format("DD/MM/YYYY - HH:mm:ss") : ""}]`;
	switch (type) {
	case "okay": {
		return console.log(`${chalk ? chalk.black.bgBlue(` ${timestamp} `) : ` ${timestamp} `} ${chalk ? chalk.black.bgGreen(` ${type.toUpperCase()} `) : ` ${type.toUpperCase()} `} ${content} `);
	}
	case "warn": {
		return console.log(`${chalk ? chalk.black.bgBlue(` ${timestamp} `) : ` ${timestamp} `} ${chalk ? chalk.black.bgYellow(` ${type.toUpperCase()} `) : ` ${type.toUpperCase()} `} ${content} `);
	}
	case "err!": {
		return console.log(`${chalk ? chalk.black.bgBlue(` ${timestamp} `) : ` ${timestamp} `} ${chalk ? chalk.bgRed(` ${type.toUpperCase()} `) : ` ${type.toUpperCase()} `} ${content} `);
	}
	case "exec": {
		return console.log(`${chalk ? chalk.black.bgBlue(` ${timestamp} `) : ` ${timestamp} `} ${chalk ? chalk.black.bgGreen(` ${type.toUpperCase()} `) : ` ${type.toUpperCase()} `} ${content} `);
	}
	default: throw new TypeError("Logger type must be either 'exec', default = 'okay', 'warn', or 'err!'.");
	}
};
