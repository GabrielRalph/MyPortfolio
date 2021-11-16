import {SvgPlus, Vector, SvgPath, DPath} from "https://www.svg.plus/3.5.js"
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
    let rel = this.createChild("div");
    rel.innerHTML = "<video muted loop playsinline autoplay></video>"
    this.video = new SvgPlus(rel.children[0]);
    this.placeholder = rel.createChild("img", {
        class: "placeholder",
        src: "Assets/logo2.svg",
        styles: {
          background: "red",
        }
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
    this.placeholder.styles = {background: "transparent"};
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


export {Logo};
