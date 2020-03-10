module.exports = {
    "extends": "airbnb-base",
	"rules": {
		"comma-dangle": [2, "never"],
		"arrow-parens": [2, "as-needed"],
		"linebreak-style": 0,
		"padded-blocks": 0,
		"indent": [1, "tab", { "SwitchCase": 1 }],
		"no-underscore-dangle": [2, { "allow": ["_id", "__v"] } ],
		"no-param-reassign": [2, { "props": false }],
		"new-cap": [2, { "capIsNewExceptions": ["Router", "ObjectId"] }],
		"no-tabs": 0,
		"prefer-destructuring": 1,
		"prefer-object-spread": 0,
		"max-len": [1, 120], // extended
		"no-plusplus": 0, // disabled,
		"no-eval": 0,
		"import/prefer-default-export": 0
	},
	"env": {
		"node": true,
		"mocha": true
	}
};
