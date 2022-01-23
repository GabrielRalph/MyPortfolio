import {SvgPlus} from "../4.js"

class VList extends SvgPlus {
  constructor(el){
    super(el);
    this.template = this.innerHTML;
    this.innerHTML = "";
  }

  renderList(data){
    let template = this.template;
    for (let item of data) {
      let item_temp = template;
      if (typeof item === "string") {
        item_temp = item_temp.replace(`{{value}}`, item);
      }else {
        for (let key in item) {
          item_temp = item_temp.replace(`{{${key}}}`, item[key]);
        }
      }
      this.innerHTML += item_temp;
    }
  }
}

SvgPlus.defineHTMLElement(VList);
