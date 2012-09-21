var pageMod = require("page-mod");
var self = require("self");
pageMod.PageMod({
  include: [
	"http://grsinfo.zju.edu.cn/cultivate/menu/cultivate_menu_student.jsp",
	"http://g.zju.edu.cn/cultivate/menu/cultivate_menu_student.jsp"],
  contentScriptWhen: 'end',
  contentScriptFile: self.data.url("loader.js")
});
