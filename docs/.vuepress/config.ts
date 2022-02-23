const sidebar = require("./sidebar.js");
const navbar = require("./navbar.js");
const { path } = require("@vuepress/utils");

module.exports = {
	lang: "zh-CN",
	title: "Poppy Framework",
	base: "/doc/",
	themeConfig: {
		logo: "/images/logo.png",
		sidebar,
		navbar,
		repo: "https://github.com/imvkmark/poppy-doc",
		displayAllHeaders: true,
		smoothScroll: true,
		docsBranch: "master",
		docsDir: "docs",
	},
	markdown: {
		code: {
			// lineNumbers: false,
		},
	},
	plugins: [],
};
