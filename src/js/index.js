class DrawingBoard {
  MODE = "NONE";
  IsMouseDown = false;

  constructor() {
    this.assignElement();
    this.initContext();
    this.addEvent();
  }

  assignElement() {
    this.containerEl = document.getElementById("container");
    this.canvasEl = this.containerEl.querySelector("#canvas");
    this.toolbarEl = this.containerEl.querySelector("#toolbar");
    this.brushEl = this.containerEl.querySelector("#brush");
    this.colorPickerEl = this.toolbarEl.querySelector("#colorPicker");
  }
  initContext() {
    this.context = this.canvasEl.getContext("2d");
  }
  addEvent() {
    this.brushEl.addEventListener("click", this.onClickBrush.bind(this));
    this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvasEl.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvasEl.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onClickBrush(e) {
    // brush tag 에만 적용시키기 위해서 (brush 아래 i tag 가 눌리면 작동하지 않도록)
    const isActive = e.currentTarget.classList.contains("active");
    this.MODE = isActive ? "NONE" : "BRUSH";
    this.canvasEl.style.cursor = isActive ? "default" : "crosshair";
    this.brushEl.classList.toggle("active");
  }

  onMouseMove(e) {
    if (this.IsMouseDown === false) return;
    const currentPosition = this.getMousePosition(e);
    this.context.lineTo(currentPosition.x, currentPosition.y);
    this.context.stroke();
  }

  onMouseUp() {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = false;
  }

  onMouseDown(e) {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = true;
    const currentPosition = this.getMousePosition(e);
    this.context.beginPath();
    this.context.moveTo(currentPosition.x, currentPosition.y);
    this.context.lineCap = "round";
    this.context.strokeStyle = this.colorPickerEl.value;
    this.context.lineWidth = 10;
    // this.context.lineTo(400, 400);
    // this.context.stroke();
  }

  getMousePosition(e) {
    // (0,0) 기준으로 계산되는 clientX,Y 값을 canvas 기준으로 만들어 주기 위해서
    const boundaries = this.canvasEl.getBoundingClientRect();
    return {
      x: e.clientX - boundaries.left,
      y: e.clientY - boundaries.top,
    };
  }
}

new DrawingBoard();
