import {SvgPlus, Vector, SvgPath, DPath} from "../4.js"
const LOGO_PATH = "M63.6,16.5L63.6,16.5c0.8-3.8,3.1-7.9,14.1-7.9V2.1H35.6v6.4c10.4,0,15.6,0.6,14.9,8C30,19.1,11.7,33.1,8.1,50C4.6,66.8,16.8,80.8,36,83.5l0.1,0.1c-0.8,3.1-2.9,7.8-13.7,7.8l0,6.6l38.2,0l0-6.6c-5.5,0-13.3-0.2-11.7-7.3l0.1-0.5l0,0c20.7-2.4,39.4-16.5,43-33.6C95.7,33.1,83.3,19,63.6,16.5z M37.4,77.8L37.4,77.8c-11.9-3.1-18.9-14.3-16-27.8c2.9-13.5,14.7-24.8,28-27.8l0,0l-0.6,2.7l-6.3,29.9L37.4,77.8z M78.8,50.1c-2.9,13.7-15,25.2-28.5,28l0,0l0.5-2.3L57,46.6l3.4-15.5l1-4.7c0,0,0.5-1.7,1-4.2C74.5,25.1,81.6,36.5,78.8,50.1z";


let waveR = (x) => {
  if (x < 0) return 0;
  else if (x > 1) return 1
  else {
    return (1 - Math.cos(Math.PI*x)) / 2;
  }
}

class Logo extends SvgPlus{
  constructor(id){
    super(id);
    this.innerHTML = "";
    let rel = this.createChild("div");
    rel.innerHTML = "<video muted loop playsinline autoplay></video>"
    this.video = new SvgPlus(rel.children[0]);

    this.placeholder = rel.createChild("svg", {
        class: "logo-mask placeholder",
        viewBox: "0 0 100 100",
        content: `
          <g class = "dummy">
            <path d = "M86.6,50c-3.1,14.9-19.4,27.2-37.5,29.3l-0.1,0.4c-1.4,6.2,5.4,6.4,10.2,6.4v5.8H25.9v-5.8
          		c9.4,0,11.2-4.1,11.9-6.8l-0.1-0.1C21.1,76.9,10.4,64.7,13.5,50c3.1-14.7,19.1-26.9,37-29.2c0.6-6.5-3.9-7-13-7V8.2h36.7v5.7
          		c-9.6,0-11.6,3.6-12.3,6.9C79,23,89.9,35.3,86.6,50z"/>
          </g>
          <g class = "mask">
          	<path d="M60.8,25.8c-0.4,2.2-0.9,3.7-0.9,3.7l-0.9,4.1l-3,13.5l-5.4,25.5l-0.4,2C62,72.1,72.6,62,75.1,50.1
          		C77.6,38.2,71.4,28.3,60.8,25.8z"/>
          	<path d="M25.1,50c-2.5,11.8,3.6,21.5,14,24.2l4.4-20.1L49,28.1l0.5-2.4C37.9,28.4,27.6,38.2,25.1,50z"/>
          	<path d="M0,0v100h100V0H0z M86.6,50c-3.1,14.9-19.4,27.2-37.5,29.3l-0.1,0.4c-1.4,6.2,5.4,6.4,10.2,6.4v5.8H25.9v-5.8
          		c9.4,0,11.2-4.1,11.9-6.8l-0.1-0.1C21.1,76.9,10.4,64.7,13.5,50c3.1-14.7,19.1-26.9,37-29.2c0.6-6.5-3.9-7-13-7V8.2h36.7v5.7
          		c-9.6,0-11.6,3.6-12.3,6.9C79,23,89.9,35.3,86.6,50z"/>
          </g>
        `
    });
  }

  async loadVideo(){
    this.video.onplay = null;
    this.video.onpause = null;
    this.video.innerHTML = "";
    this.playing = false;

    return new Promise((resolve, reject) => {
      this.video.createChild("source", {
        src: "Assets/Lava_9.mp4"
      });

      let can_play = false;
      this.video.oncanplay = () => {
        can_play = true;

        this.video.onplay = () => {
          this.playing = true;
        }
        this.video.onpause = () => {
          this.playing = false;
        }
        if (!this.playing) {
          this.video.play();
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });
  }

  async animateScroll(page){
    page = new SvgPlus(page);

    await this.loadVideo();
    this.placeholder.class =  "logo-mask"
    page.styles = {opacity: 1};

    page.ontouchmove = () => {
      if (!this.playing) {
        this.video.play();
      }
    }
    page.onclick = () => {
      if (!this.playing) {
        this.video.play();
      }
    }

    let ewa = 1;
    let l = 0.3
    let next = () => {
      let goal = 1 - page.scrollTop/page.clientHeight;
      ewa = ewa * (1 - l) + l * goal;
      this.scale_c = waveR(ewa);
      window.requestAnimationFrame(next);
    }
    window.requestAnimationFrame(next);
  }

  set scale_c(value){
    this._scale_c = value;
    this.styles = {"--scale-c": value};
  }
  get scale_c(){
    return this._scale_c;
  }
}
class ScrollLogo extends Logo {

}


SvgPlus.defineHTMLElement(ScrollLogo)
export {Logo};
